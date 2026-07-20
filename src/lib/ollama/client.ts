/**
 * Ollama Local AI Client
 *
 * Communicates with the local Ollama instance running llama3.2:3B.
 * All processing stays on-machine — zero data leaves the infrastructure.
 */

const OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_MODEL = "llama3.2:3b";

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

class OllamaClient {
  private baseUrl: string;
  private model: string;
  private defaultOptions: {
    temperature: number;
    numCtx: number;
  };

  constructor(config?: OllamaOptions) {
    this.baseUrl = config?.baseUrl || OLLAMA_BASE_URL;
    this.model = config?.model || DEFAULT_MODEL;
    this.defaultOptions = {
      temperature: config?.temperature ?? 0.3,
      numCtx: config?.numCtx ?? 4096,
    };
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
    const request: GenerateRequest = {
      model: this.model,
      prompt,
      system: options?.system,
      format: options?.format,
      options: {
        temperature: options?.temperature ?? this.defaultOptions.temperature,
        num_ctx: this.defaultOptions.numCtx,
        num_predict: options?.maxTokens ?? 512,
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
    const request: ChatRequest = {
      model: this.model,
      messages,
      format: options?.format,
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
