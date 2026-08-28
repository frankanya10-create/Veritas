"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";
import { Switch } from "@/components/motion/switch";
import { cn } from "@/lib/utils";

export default function Stage4Client() {
  const router = useRouter();
  const { state, updateField, completeAndNext, goBack } = useOnboardingState();
  const [prosecutorTolerance, setProsecutorTolerance] = useState(state.prosecutorTolerance);
  const [defenseBaseline, setDefenseBaseline] = useState(state.defenseBaseline);
  const [judgeConsensus, setJudgeConsensus] = useState(state.judgeConsensus);
  const [confidence, setConfidence] = useState(state.confidenceThreshold);
  const [tiebreaker, setTiebreaker] = useState(state.humanTiebreaker);

  const handleContinue = () => {
    updateField("prosecutorTolerance", prosecutorTolerance);
    updateField("defenseBaseline", defenseBaseline);
    updateField("judgeConsensus", judgeConsensus);
    updateField("confidenceThreshold", confidence);
    updateField("humanTiebreaker", tiebreaker);
    toast.success("Agent configuration saved");
    completeAndNext(router);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-white mb-2">
          Multi-Agent Consensus & Persona Tuning
        </h1>
        <p className="text-zinc-500 text-sm">
          Configure your AI agent behaviors and consensus rules.
        </p>
      </div>

      {/* Prosecutor Agent */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-sm">⚖️</span>
          </div>
          <div>
            <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Prosecutor Agent</h3>
            <p className="text-[10px] text-zinc-500">Risk tolerance & flagging behavior</p>
          </div>
        </div>
        <div className="space-y-3">
          {["aggressive", "balanced", "conservative"].map((level) => (
            <button
              key={level}
              onClick={() => setProsecutorTolerance(level)}
              className={cn(
                "w-full p-3 rounded-lg border text-left text-sm font-[var(--font-heading)] transition-all",
                prosecutorTolerance === level
                  ? "border-red-500/50 bg-red-500/5 text-white"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
              )}
            >
              <span className="capitalize">{level}</span>
              <span className="text-[10px] text-zinc-600 ml-2">
                {level === "aggressive" ? "Flag everything suspicious" : level === "balanced" ? "Standard thresholds" : "Only flag confirmed violations"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Defense Agent */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <span className="text-sm">🛡️</span>
          </div>
          <div>
            <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Defense Agent</h3>
            <p className="text-[10px] text-zinc-500">Business context & baseline whitelists</p>
          </div>
        </div>
        <div className="space-y-3">
          {["standard", "contextual", "permissive"].map((level) => (
            <button
              key={level}
              onClick={() => setDefenseBaseline(level)}
              className={cn(
                "w-full p-3 rounded-lg border text-left text-sm font-[var(--font-heading)] transition-all",
                defenseBaseline === level
                  ? "border-blue-500/50 bg-blue-500/5 text-white"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
              )}
            >
              <span className="capitalize">{level}</span>
              <span className="text-[10px] text-zinc-600 ml-2">
                {level === "standard" ? "Default whitelist" : level === "contextual" ? "Learn from history" : "Business-aware overrides"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Judge Agent */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <span className="text-sm">👨‍⚖️</span>
          </div>
          <div>
            <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Judge Agent</h3>
            <p className="text-[10px] text-zinc-500">Consensus rules & final verdict</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { id: "unanimous", label: "Unanimous", desc: "All agents must agree" },
            { id: "majority", label: "Majority", desc: "2/3 agent agreement" },
            { id: "high_confidence", label: "High-Confidence Override", desc: "Single agent with >0.9 confidence" },
          ].map((rule) => (
            <button
              key={rule.id}
              onClick={() => setJudgeConsensus(rule.id)}
              className={cn(
                "w-full p-3 rounded-lg border text-left text-sm font-[var(--font-heading)] transition-all",
                judgeConsensus === rule.id
                  ? "border-amber-500/50 bg-amber-500/5 text-white"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
              )}
            >
              <span>{rule.label}</span>
              <span className="text-[10px] text-zinc-600 ml-2">{rule.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Confidence & Tiebreaker */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Escalation Rules</h3>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-[var(--font-heading)] text-zinc-400">Confidence Threshold</label>
            <span className="text-xs font-mono text-aegis-green">{confidence.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full accent-aegis-green"
          />
          <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
            <span>0.0 (Flag all)</span>
            <span>1.0 (Flag only certain)</span>
          </div>
        </div>
        <Switch
          checked={tiebreaker}
          onCheckedChange={setTiebreaker}
          label="Human-in-the-loop tiebreaker"
        />
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
