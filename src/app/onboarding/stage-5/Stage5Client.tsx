"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";
import { Checkbox } from "@/components/motion/checkbox";
import { cn } from "@/lib/utils";

const LOG_PARSERS = [
  { id: "apache", label: "Apache / Nginx", icon: "🌐" },
  { id: "cloudtrail", label: "AWS CloudTrail", icon: "☁️" },
  { id: "datadog", label: "Datadog", icon: "📊" },
  { id: "postgres_wal", label: "Postgres WAL", icon: "🐘" },
  { id: "oauth", label: "OAuth Events", icon: "🔑" },
];

const CI_TEMPLATE = `name: Veritas Compliance Scan
on: [pull_request]
jobs:
  veritas-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Veritas Scanner
        uses: veritas-ai/scan-action@v1
        with:
          api_key: \${{ secrets.VERITAS_API_KEY }}
          fail_on: critical`;

export default function Stage5Client() {
  const router = useRouter();
  const { state, updateField, completeAndNext, goBack } = useOnboardingState();
  const [selectedParsers, setSelectedParsers] = useState<string[]>(state.logParsers);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [webhookCopied, setWebhookCopied] = useState(false);

  const toggleParser = (id: string) => {
    setSelectedParsers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleContinue = () => {
    updateField("logParsers", selectedParsers);
    updateField("ciSnippet", CI_TEMPLATE);
    toast.success("Pipeline configured");
    completeAndNext(router);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-white mb-2">
          Live Infrastructure Data Pipelines
        </h1>
        <p className="text-zinc-500 text-sm">
          Generate API keys and configure log ingestion.
        </p>
      </div>

      {/* API Key & Webhook */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Keys & Webhook Generator</h3>
        <div>
          <label className="text-[10px] font-[var(--font-heading)] text-zinc-500 block mb-1.5">API Key</label>
          <div className="flex gap-2">
            <div className="flex-1 p-3 rounded-lg bg-black border border-zinc-800 font-mono text-xs text-zinc-400 overflow-x-auto">
              {state.apiKey}
            </div>
            <button
              onClick={() => copyToClipboard(state.apiKey, setApiKeyCopied)}
              className="px-3 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors text-xs"
            >
              {apiKeyCopied ? "✓" : "Copy"}
            </button>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-[var(--font-heading)] text-zinc-500 block mb-1.5">Webhook Secret</label>
          <div className="flex gap-2">
            <div className="flex-1 p-3 rounded-lg bg-black border border-zinc-800 font-mono text-xs text-zinc-400 overflow-x-auto">
              {state.webhookSecret}
            </div>
            <button
              onClick={() => copyToClipboard(state.webhookSecret, setWebhookCopied)}
              className="px-3 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors text-xs"
            >
              {webhookCopied ? "✓" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Log Parser Selectors */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-4">Log Parser Presets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LOG_PARSERS.map((parser) => (
            <div
              key={parser.id}
              onClick={() => toggleParser(parser.id)}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3",
                selectedParsers.includes(parser.id)
                  ? "border-aegis-green/50 bg-aegis-green/5"
                  : "border-zinc-800 hover:border-zinc-600"
              )}
            >
              <span className="text-lg">{parser.icon}</span>
              <Checkbox
                checked={selectedParsers.includes(parser.id)}
                onCheckedChange={() => toggleParser(parser.id)}
                label={parser.label}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CI/CD Snippet */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-4">CI/CD Scanner Snippet</h3>
        <div className="relative">
          <pre className="p-4 rounded-lg bg-black border border-zinc-800 font-mono text-xs text-zinc-400 overflow-x-auto whitespace-pre-wrap">
            {CI_TEMPLATE}
          </pre>
          <button
            onClick={() => copyToClipboard(CI_TEMPLATE, () => {})}
            className="absolute top-2 right-2 px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-400 hover:text-white"
          >
            Copy
          </button>
        </div>
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
