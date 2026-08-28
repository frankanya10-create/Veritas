"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";
import { Switch } from "@/components/motion/switch";
import { Input } from "@/components/motion/input";
import { cn } from "@/lib/utils";

interface OllamaModel {
  name: string;
  size: number;
  parameterSize: string;
  quantLevel: string;
  contextLength: number;
  family: string;
  capabilities: string[];
}

interface BenchmarkResult {
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

const MODEL_PREFERENCE = [
  "gemma4:12b",
  "gemma4:e4b",
  "llama3.2:3b",
  "qwen2.5:3b",
  "qwen2.5-coder:3b",
  "llama3.2:1b",
];

export default function Stage2Client() {
  const router = useRouter();
  const { state, updateField, completeAndNext, goBack } = useOnboardingState();
  const [ollamaStatus, setOllamaStatus] = useState<"checking" | "online" | "offline">("checking");
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(null);
  const [airGap, setAirGap] = useState(state.airGapEnabled);
  const [diskCache, setDiskCache] = useState(2);
  const [profiling, setProfiling] = useState(false);
  const [autoDetecting, setAutoDetecting] = useState(false);

  const checkOllama = useCallback(async () => {
    setOllamaStatus("checking");
    try {
      const res = await fetch("http://localhost:11434/api/tags", {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed: OllamaModel[] = (data.models || []).map((m: Record<string, unknown>) => {
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
        setModels(parsed);
        setOllamaStatus("online");

        // Auto-select best model
        if (!selectedModel) {
          autoSelectBest(parsed);
        }
      } else {
        setOllamaStatus("offline");
      }
    } catch {
      setOllamaStatus("offline");
    }
  }, [selectedModel]);

  const autoSelectBest = (availableModels: OllamaModel[]) => {
    setAutoDetecting(true);

    // Try preference order
    for (const preferred of MODEL_PREFERENCE) {
      const exact = availableModels.find((m) => m.name === preferred);
      if (exact) {
        setSelectedModel(exact.name);
        setAutoDetecting(false);
        return;
      }
      // Partial match
      const partial = availableModels.find(
        (m) => m.name.startsWith(preferred.split(":")[0]) && m.name.includes(preferred.split(":")[1] || "")
      );
      if (partial) {
        setSelectedModel(partial.name);
        setAutoDetecting(false);
        return;
      }
    }

    // Fallback: largest model
    if (availableModels.length > 0) {
      const sorted = [...availableModels].sort((a, b) => b.size - a.size);
      setSelectedModel(sorted[0].name);
    }
    setAutoDetecting(false);
  };

  useEffect(() => {
    checkOllama();
  }, [checkOllama]);

  const runBenchmark = async () => {
    if (!selectedModel) return;
    setProfiling(true);
    setBenchmark(null);

    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          prompt: "Analyze this compliance log for SOC2 violations: User admin accessed patient records at 3AM without MFA. Multiple failed login attempts precede the access. Output valid JSON with severity, framework_refs, and recommendation fields.",
          system: "You are a compliance analyst. Output valid JSON.",
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

      if (!res.ok) throw new Error("Benchmark failed");

      const data = await res.json();
      const modelInfo = models.find((m) => m.name === selectedModel);

      const evalDuration = (data.eval_duration ?? 0) / 1e9;
      const totalTokens = data.eval_count ?? 0;
      const tokensPerSec = evalDuration > 0 ? totalTokens / evalDuration : 0;

      setBenchmark({
        model: selectedModel,
        tokensPerSec: Math.round(tokensPerSec * 10) / 10,
        totalTokens,
        loadDuration: Math.round((data.load_duration ?? 0) / 1e6),
        promptEvalDuration: Math.round((data.prompt_eval_duration ?? 0) / 1e6),
        evalDuration: Math.round((data.eval_duration ?? 0) / 1e6),
        totalDuration: Math.round((data.total_duration ?? 0) / 1e6),
        contextLength: modelInfo?.contextLength ?? 8192,
        vramEstimate: modelInfo ? Math.round(modelInfo.size / (1024 * 1024 * 1024) * 10) / 10 : 0,
        sizes: {
          total: modelInfo?.size ?? 0,
          quantLevel: modelInfo?.quantLevel ?? "unknown",
          parameterSize: modelInfo?.parameterSize ?? "unknown",
        },
      });

      updateField("vramUsage", modelInfo ? Math.round(modelInfo.size / (1024 * 1024 * 1024) * 10) / 10 : 2);
      updateField("tokensPerSec", tokensPerSec);
    } catch {
      // Benchmark failed - show error state
      setBenchmark(null);
    } finally {
      setProfiling(false);
    }
  };

  const handleContinue = () => {
    updateField("ollamaConnected", ollamaStatus === "online");
    updateField("ollamaModels", models.map((m) => m.name));
    updateField("airGapEnabled", airGap);
    toast.success("AI Node configured");
    completeAndNext(router);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${Math.round(gb * 10) / 10} GB`;
    const mb = bytes / (1024 * 1024);
    return `${Math.round(mb)} MB`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-white mb-2">
          Air-Gapped Local AI Node
        </h1>
        <p className="text-zinc-500 text-sm">
          Connect to your local Ollama instance for zero-cloud AI processing.
        </p>
      </div>

      {/* Ollama Status */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Ollama Discovery</h3>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              ollamaStatus === "online" ? "bg-emerald-500" : ollamaStatus === "checking" ? "bg-amber-500 animate-pulse" : "bg-red-500"
            )} />
            <span className="text-[11px] font-[var(--font-heading)] text-zinc-400">
              {ollamaStatus === "online" ? "Connected" : ollamaStatus === "checking" ? "Scanning..." : "Offline"}
            </span>
          </div>
        </div>

        {ollamaStatus === "online" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {models
                .sort((a, b) => b.size - a.size)
                .map((model) => (
                  <button
                    key={model.name}
                    onClick={() => setSelectedModel(model.name)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      selectedModel === model.name
                        ? "border-aegis-green/50 bg-aegis-green/5"
                        : "border-zinc-800 bg-zinc-800/50 hover:border-zinc-600"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-[var(--font-heading)] text-white">{model.name}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {model.parameterSize} · {model.quantLevel} · {model.contextLength.toLocaleString()} ctx
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-600">{formatBytes(model.size)}</p>
                        <div className="flex gap-1 mt-1 justify-end">
                          {model.capabilities.includes("tools") && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20">tools</span>
                          )}
                          {model.capabilities.includes("thinking") && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20">think</span>
                          )}
                          {model.capabilities.includes("vision") && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20">vision</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>

            {selectedModel && (
              <div className="p-3 rounded-lg bg-black border border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-aegis-green animate-pulse" />
                  <p className="text-[11px] font-[var(--font-heading)] text-zinc-300">
                    Active: <span className="text-white">{selectedModel}</span>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {ollamaStatus === "offline" && (
          <div className="p-4 rounded-lg bg-black border border-zinc-800">
            <p className="text-[11px] font-[var(--font-heading)] text-zinc-500 mb-2">Quick Start</p>
            <div className="font-mono text-xs text-zinc-400 space-y-1">
              <p>$ ollama serve</p>
              <p className="text-zinc-600"># Verify: curl http://localhost:11434/api/tags</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={checkOllama}
          className="mt-4 text-zinc-500 hover:text-zinc-300 text-xs"
        >
          {ollamaStatus === "checking" ? "Checking..." : "Retry Connection"}
        </Button>
      </div>

      {/* Performance Profiling */}
      {ollamaStatus === "online" && selectedModel && (
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-4">Performance Profiling</h3>

          {benchmark ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-[var(--font-heading)] text-zinc-500 mb-1">VRAM Usage</p>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((benchmark.vramEstimate / 48) * 100, 100)}%` }}
                      className="h-full bg-aegis-green rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1">{benchmark.vramEstimate} GB / 48 GB</p>
                </div>
                <div>
                  <p className="text-[10px] font-[var(--font-heading)] text-zinc-500 mb-1">Tokens/Sec</p>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((benchmark.tokensPerSec / 60) * 100, 100)}%` }}
                      className="h-full bg-aegis-blue rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1">{benchmark.tokensPerSec} tok/s</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-black border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 font-[var(--font-heading)]">Total Tokens</p>
                  <p className="text-sm font-[var(--font-heading)] text-white">{benchmark.totalTokens}</p>
                </div>
                <div className="p-3 rounded-lg bg-black border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 font-[var(--font-heading)]">Context Length</p>
                  <p className="text-sm font-[var(--font-heading)] text-white">{benchmark.contextLength.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-black border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 font-[var(--font-heading)]">Total Time</p>
                  <p className="text-sm font-[var(--font-heading)] text-white">{benchmark.totalDuration}ms</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-[10px] text-emerald-400 font-[var(--font-heading)]">
                  {benchmark.model} · {benchmark.sizes.parameterSize} · {benchmark.sizes.quantLevel}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[11px] text-zinc-500 mb-4">
                Run a real inference benchmark on <span className="text-white font-[var(--font-heading)]">{selectedModel}</span>
              </p>
            </div>
          )}

          <StatefulButton
            state={profiling ? "loading" : "idle"}
            loadingText="Running inference..."
            onClick={runBenchmark}
            className="w-full mt-4 bg-zinc-800 text-white text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-700"
          >
            {benchmark ? "Re-run Benchmark" : "Run Benchmark"}
          </StatefulButton>
        </div>
      )}

      {/* Air-Gap Lock */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Air-Gap Lock</h3>
            <p className="text-[11px] text-zinc-500">Hard-lock outbound network requests</p>
          </div>
          <Switch checked={airGap} onCheckedChange={setAirGap} />
        </div>
        {airGap && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-[11px] text-amber-400">
                All AI processing will be confined to your local network. No data leaves your perimeter.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Disk Cache Slider */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-4">Local RAG Cache</h3>
        <p className="text-[11px] text-zinc-500 mb-3">Disk space for vector embeddings</p>
        <input
          type="range"
          min={1}
          max={20}
          value={diskCache}
          onChange={(e) => setDiskCache(Number(e.target.value))}
          className="w-full accent-aegis-green"
        />
        <p className="text-[10px] text-zinc-600 mt-1">{diskCache} GB allocated</p>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => goBack(router)} className="flex-1 text-zinc-500 hover:text-zinc-300">
          ← Back
        </Button>
        <StatefulButton
          onClick={handleContinue}
          className="flex-1 bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full"
        >
          Continue →
        </StatefulButton>
      </div>
    </div>
  );
}
