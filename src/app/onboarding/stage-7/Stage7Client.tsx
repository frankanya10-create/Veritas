"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";
import { Switch } from "@/components/motion/switch";
import { Checkbox } from "@/components/motion/checkbox";
import { Input } from "@/components/motion/input";
import { cn } from "@/lib/utils";

const CHAOS_VECTORS = [
  { id: "stolen_api_key", label: "Stolen API Key Escalation", desc: "Simulate credential compromise" },
  { id: "gdpr_exfiltration", label: "GDPR Data Exfiltration", desc: "Detect unauthorized data access" },
  { id: "log_tampering", label: "Log Tampering", desc: "Detect audit trail modification" },
  { id: "aml_stress", label: "AML High-Velocity Stress", desc: "Volume attack simulation" },
];

export default function Stage7Client() {
  const router = useRouter();
  const { state, updateField, completeAndNext, goBack } = useOnboardingState();
  const [chaosEnabled, setChaosEnabled] = useState(state.chaosEnabled);
  const [selectedVectors, setSelectedVectors] = useState<string[]>(state.chaosVectors);
  const [slackWebhook, setSlackWebhook] = useState(state.slackWebhook);
  const [pagerdutyKey, setPagerdutyKey] = useState(state.pagerdutyKey);
  const [escalationEmail, setEscalationEmail] = useState(state.escalationEmail);

  const toggleVector = (id: string) => {
    setSelectedVectors((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    updateField("chaosEnabled", chaosEnabled);
    updateField("chaosVectors", selectedVectors);
    updateField("slackWebhook", slackWebhook);
    updateField("pagerdutyKey", pagerdutyKey);
    updateField("escalationEmail", escalationEmail);
    toast.success("Chaos testing configured");
    completeAndNext(router);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-white mb-2">
          Chaos Monkey & Hardship Test Suite
        </h1>
        <p className="text-zinc-500 text-sm">
          Configure adversarial audit simulations and escalation targets.
        </p>
      </div>

      {/* Chaos Toggle */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Adversarial Audit Scheduler</h3>
            <p className="text-[11px] text-zinc-500">Run automated attack simulations</p>
          </div>
          <Switch checked={chaosEnabled} onCheckedChange={setChaosEnabled} />
        </div>
      </div>

      {/* Simulation Vectors */}
      {chaosEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3"
        >
          <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-2">Simulation Vectors</h3>
          {CHAOS_VECTORS.map((vector) => (
            <div
              key={vector.id}
              onClick={() => toggleVector(vector.id)}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all",
                selectedVectors.includes(vector.id)
                  ? "border-aegis-red/50 bg-aegis-red/5"
                  : "border-zinc-800 hover:border-zinc-600"
              )}
            >
              <Checkbox
                checked={selectedVectors.includes(vector.id)}
                onCheckedChange={() => toggleVector(vector.id)}
                label={
                  <div>
                    <span className="text-sm">{vector.label}</span>
                    <p className="text-[10px] text-zinc-600">{vector.desc}</p>
                  </div>
                }
              />
            </div>
          ))}
        </motion.div>
      )}

      {/* Escalation Targets */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Escalation Targets</h3>
        <Input
          label="Slack Webhook URL"
          value={slackWebhook}
          onChange={setSlackWebhook}
          placeholder="https://hooks.slack.com/services/..."
        />
        <Input
          label="PagerDuty Integration Key"
          value={pagerdutyKey}
          onChange={setPagerdutyKey}
          placeholder="PagerDuty key"
        />
        <Input
          label="Escalation Email"
          type="email"
          value={escalationEmail}
          onChange={setEscalationEmail}
          placeholder="ops@company.com"
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
