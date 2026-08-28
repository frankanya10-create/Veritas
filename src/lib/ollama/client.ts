/**
 * Ollama Local AI Client
 *
 * Communicates with the local Ollama instance.
 * Default: gemma4:12b (11.9B params, 262K context, tools + thinking + vision)
 * Fallback chain: gemma4:12b → gemma4:e4b → llama3.2:3b → qwen2.5:3b → qwen2.5-coder:3b
 * All processing stays on-machine — zero data leaves the infrastructure.
 */

const OLLAMA_BASE_URL = "http://localhost:11434";

const MODEL_PREFERENCE = [
  "gemma4:12b",
  "gemma4:e4b",
  "llama3.2:3b",
  "qwen2.5:3b",
  "qwen2.5-coder:3b",
  "llama3.2:1b",
];

interface OllamaOptions {
  baseUrl?: string;
  model?: string;
  temperature?: number;
  numCtx?: number;
}

interface GenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  format?: "json" | object;
  options?: {
    temperature?: number;
    num_ctx?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
  };
}

interface GenerateResponse {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  format?: "json" | object;
  options?: {
    temperature?: number;
    num_ctx?: number;
  };
}

interface ChatResponse {
  model: string;
  message: ChatMessage;
  done: boolean;
  total_duration?: number;
}

export interface BenchmarkResult {
  model: string;
  tokensPerSec: number;
  totalTokens: number;
  loadDuration: number;
  promptEvalDuration: number;
  evalDuration: number;
  totalDuration: number;
  contextLength: number;
  vramEstimate: number;
  sizes: { total: number; quantLevel: string; parameterSize: string };
}

export interface OllamaModel {
  name: string;
  size: number;
  parameterSize: string;
  quantLevel: string;
  contextLength: number;
  family: string;
  capabilities: string[];
}

class OllamaClient {
  private baseUrl: string;
  private model: string;
  private defaultOptions: {
    temperature: number;
    numCtx: number;
  };
  private discoveredModels: OllamaModel[] = [];
  private activeModel: string;

  constructor(config?: OllamaOptions) {
    this.baseUrl = config?.baseUrl || OLLAMA_BASE_URL;
    this.model = config?.model || MODEL_PREFERENCE[0];
    this.activeModel = this.model;
    this.defaultOptions = {
      temperature: config?.temperature ?? 0.3,
      numCtx: config?.numCtx ?? 8192,
    };
  }

  /**
   * Discover available models and auto-select the best one
   */
  async discoverModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return [];

      const data = await response.json();
      const models: OllamaModel[] = (data.models || []).map((m: Record<string, unknown>) => {
        const details = (m.details || {}) as Record<string, unknown>;
        return {
          name: m.name as string,
          size: (m.size as number) || 0,
          parameterSize: (details.parameter_size as string) || "unknown",
          quantLevel: (details.quantization_level as string) || "unknown",
          contextLength: (details.context_length as number) || 8192,
          family: (details.family as string) || "unknown",
          capabilities: (m.capabilities as string[]) || ["completion"],
        };
      });

      this.discoveredModels = models;
      return models;
    } catch {
      return [];
    }
  }

  /**
   * Auto-select the best available model based on preference + capabilities
   */
  async selectBestModel(): Promise<string> {
    if (this.discoveredModels.length === 0) {
      await this.discoverModels();
    }

    const availableNames = new Set(this.discoveredModels.map((m) => m.name));

    for (const preferred of MODEL_PREFERENCE) {
      if (availableNames.has(preferred)) {
        this.activeModel = preferred;
        this.model = preferred;
        return preferred;
      }
      // Check partial match (e.g. "gemma4:12b-instruct" matches "gemma4:12b")
      const match = this.discoveredModels.find(
        (m) => m.name.startsWith(preferred.split(":")[0]) && m.name.includes(preferred.split(":")[1] || "")
      );
      if (match) {
        this.activeModel = match.name;
        this.model = match.name;
        return match.name;
      }
    }

    // Fallback: pick the largest model by parameter count
    if (this.discoveredModels.length > 0) {
      const sorted = [...this.discoveredModels].sort((a, b) => b.size - a.size);
      this.activeModel = sorted[0].name;
      this.model = sorted[0].name;
      return sorted[0].name;
    }

    this.activeModel = MODEL_PREFERENCE[0];
    this.model = MODEL_PREFERENCE[0];
    return this.model;
  }

  getActiveModel(): string {
    return this.activeModel;
  }

  getDiscoveredModels(): OllamaModel[] {
    return this.discoveredModels;
  }

  /**
   * Simple text generation with a prompt
   */
  async generate(
    prompt: string,
    options?: {
      system?: string;
      format?: "json" | object;
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<{ text: string; duration: number; tokenCount: number }> {
    const request: GenerateRequest & { stream: boolean; think: boolean } = {
      model: this.model,
      prompt,
      system: options?.system,
      format: options?.format,
      stream: false,
      think: false,
      options: {
        temperature: options?.temperature ?? this.defaultOptions.temperature,
        num_ctx: this.defaultOptions.numCtx,
        num_predict: options?.maxTokens ?? 1024,
      },
    };

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Ollama generate failed: ${response.statusText}`);
    }

    const data: GenerateResponse = await response.json();

    return {
      text: data.response,
      duration: data.total_duration ?? 0,
      tokenCount: data.eval_count ?? 0,
    };
  }

  /**
   * Chat completion with message history
   */
  async chat(
    messages: ChatMessage[],
    options?: {
      format?: "json" | object;
      temperature?: number;
    }
  ): Promise<{ message: string; duration: number }> {
    const request: ChatRequest & { stream: boolean; think: boolean } = {
      model: this.model,
      messages,
      format: options?.format,
      stream: false,
      think: false,
      options: {
        temperature: options?.temperature ?? this.defaultOptions.temperature,
        num_ctx: this.defaultOptions.numCtx,
      },
    };

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Ollama chat failed: ${response.statusText}`);
    }

    const data: ChatResponse = await response.json();

    return {
      message: data.message.content,
      duration: data.total_duration ?? 0,
    };
  }

  /**
   * Structured JSON output — forces model to produce valid JSON matching a schema
   */
  async structuredOutput<T>(
    prompt: string,
    jsonSchema: object,
    options?: {
      system?: string;
      temperature?: number;
    }
  ): Promise<{ data: T; duration: number }> {
    const result = await this.generate(prompt, {
      system: options?.system,
      format: jsonSchema,
      temperature: options?.temperature,
    });

    const data = JSON.parse(result.text) as T;

    return { data, duration: result.duration };
  }

  /**
   * Run a real benchmark against a specific model
   */
  async benchmark(
    modelName: string,
    prompt: string = "Analyze this compliance log for SOC2 violations: User admin accessed patient records at 3AM without MFA. Multiple failed login attempts precede the access."
  ): Promise<BenchmarkResult> {
    const start = Date.now();

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        prompt,
        system: "You are a compliance analyst. Analyze the input and output valid JSON.",
        format: "json",
        stream: false,
        think: false,
        options: {
          temperature: 0.1,
          num_ctx: 4096,
          num_predict: 256,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Benchmark failed: ${response.statusText}`);
    }

    const data: GenerateResponse & {
      load_duration?: number;
      prompt_eval_duration?: number;
      eval_duration?: number;
    } = await response.json();

    const totalDuration = (data.total_duration ?? Date.now() - start) / 1e9;
    const loadDuration = (data.load_duration ?? 0) / 1e9;
    const promptEvalDuration = (data.prompt_eval_duration ?? 0) / 1e9;
    const evalDuration = (data.eval_duration ?? 0) / 1e9;
    const totalTokens = data.eval_count ?? 0;
    const tokensPerSec = evalDuration > 0 ? totalTokens / evalDuration : 0;

    // Find model info from discovered models
    const modelInfo = this.discoveredModels.find((m) => m.name === modelName);

    return {
      model: modelName,
      tokensPerSec: Math.round(tokensPerSec * 10) / 10,
      totalTokens,
      loadDuration: Math.round(loadDuration * 1000),
      promptEvalDuration: Math.round(promptEvalDuration * 1000),
      evalDuration: Math.round(evalDuration * 1000),
      totalDuration: Math.round(totalDuration * 1000),
      contextLength: modelInfo?.contextLength ?? 8192,
      vramEstimate: modelInfo ? Math.round(modelInfo.size / (1024 * 1024 * 1024) * 10) / 10 : 0,
      sizes: {
        total: modelInfo?.size ?? 0,
        quantLevel: modelInfo?.quantLevel ?? "unknown",
        parameterSize: modelInfo?.parameterSize ?? "unknown",
      },
    };
  }

  /**
   * Health check — verify Ollama is running and model is available
   */
  async healthCheck(): Promise<{
    status: string;
    model: string;
    available: boolean;
    latency: number;
  }> {
    const start = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const latency = Date.now() - start;

      if (!response.ok) {
        return { status: "error", model: this.model, available: false, latency };
      }

      const data = await response.json();
      const models = data.models || [];
      const available = models.some(
        (m: { name: string }) => m.name === this.model || m.name.startsWith(this.model)
      );

      return {
        status: available ? "ready" : "model_missing",
        model: this.model,
        available,
        latency,
      };
    } catch {
      return {
        status: "offline",
        model: this.model,
        available: false,
        latency: Date.now() - start,
      };
    }
  }
}

export const ollama = new OllamaClient();
export type { OllamaOptions, ChatMessage, GenerateResponse };
