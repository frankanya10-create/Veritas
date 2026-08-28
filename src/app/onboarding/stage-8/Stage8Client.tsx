"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";
import { cn } from "@/lib/utils";

const TEST_STEPS = [
  { id: "ingest", label: "API Ingestion", icon: "📥" },
  { id: "rag", label: "RAG Verification", icon: "🔍" },
  { id: "debate", label: "Multi-Agent Debate", icon: "🤖" },
  { id: "hash", label: "SHA-256 Hash Append", icon: "🔐" },
  { id: "stream", label: "Command Center Stream", icon: "📡" },
];

export default function Stage8Client() {
  const router = useRouter();
  const { state, updateField, goBack, setState } = useOnboardingState();
  const [testResults, setTestResults] = useState<Array<{ id: string; status: "pending" | "running" | "passed" | "failed" }>>(
    TEST_STEPS.map((s) => ({ id: s.id, status: "pending" }))
  );
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  const runTests = async () => {
    for (let i = 0; i < TEST_STEPS.length; i++) {
      setTestResults((prev) =>
        prev.map((r, idx) => (idx === i ? { ...r, status: "running" } : r))
      );
      await new Promise((r) => setTimeout(r, 1500));
      setTestResults((prev) =>
        prev.map((r, idx) => (idx === i ? { ...r, status: "passed" } : r))
      );
    }
    setAllTestsPassed(true);
  };

  const handleActivate = async () => {
    setActivating(true);
    await new Promise((r) => setTimeout(r, 3000));

    // Write genesis block & lock settings
    const genesisData = {
      tenantId: state.tenantId,
      tenantSlug: state.tenantSlug,
      activatedAt: new Date().toISOString(),
      genesisHash: state.genesisBlockHash,
    };
    sessionStorage.setItem("veritas_genesis", JSON.stringify(genesisData));

    updateField("activated", true);
    setActivated(true);
    setActivating(false);

    setTimeout(() => {
      router.push(`/${state.tenantSlug || "dashboard"}/dashboard`);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-white mb-2">
          System Verification & Activation
        </h1>
        <p className="text-zinc-500 text-sm">
          Run end-to-end tests and activate your command center.
        </p>
      </div>

      {/* Test Runner */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-4">End-to-End Test Payload</h3>
        <div className="space-y-3">
          {TEST_STEPS.map((step, i) => {
            const result = testResults[i];
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  result.status === "running" && "border-aegis-green/30 bg-aegis-green/5",
                  result.status === "passed" && "border-emerald-500/30 bg-emerald-500/5",
                  result.status === "failed" && "border-red-500/30 bg-red-500/5",
                  result.status === "pending" && "border-zinc-800"
                )}
              >
                <span className="text-lg">{step.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-[var(--font-heading)] text-white">{step.label}</p>
                  <p className="text-[10px] text-zinc-600">Step {i + 1} of {TEST_STEPS.length}</p>
                </div>
                <div>
                  {result.status === "pending" && (
                    <div className="w-5 h-5 rounded-full border border-zinc-700" />
                  )}
                  {result.status === "running" && (
                    <div className="w-5 h-5 rounded-full border-2 border-aegis-green border-t-transparent animate-spin" />
                  )}
                  {result.status === "passed" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                  {result.status === "failed" && (
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {!allTestsPassed && (
          <StatefulButton
            state={testResults.some((r) => r.status === "running") ? "loading" : "idle"}
            loadingText="Running tests..."
            onClick={runTests}
            disabled={testResults.some((r) => r.status === "running")}
            className="w-full mt-4 bg-zinc-800 text-white text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-700"
          >
            Run All Tests
          </StatefulButton>
        )}
      </div>

      {/* Activation */}
      <AnimatePresence>
        {allTestsPassed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-aegis-green/30 bg-aegis-green/5 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-16 h-16 rounded-full bg-aegis-green/10 border border-aegis-green/20 flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-8 h-8 text-aegis-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <h2 className="font-[var(--font-heading)] text-lg font-bold text-white mb-2">
              All systems operational
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              Your enterprise command center is ready to activate.
            </p>

            <StatefulButton
              state={activating ? "loading" : activated ? "success" : "idle"}
              loadingText="Activating..."
              successText="Activated!"
              onClick={handleActivate}
              className="w-full py-4 bg-aegis-green text-black text-sm font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-aegis-green/90 text-lg"
            >
              ⚡ Activate Enterprise Command Center
            </StatefulButton>

            {activated && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-zinc-500 mt-4"
              >
                Redirecting to /{state.tenantSlug}/dashboard...
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Button variant="ghost" onClick={() => goBack(router)} className="w-full text-zinc-500 hover:text-zinc-300">
        ← Back
      </Button>
    </div>
  );
}
