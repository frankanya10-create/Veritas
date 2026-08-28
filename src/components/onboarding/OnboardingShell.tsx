"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { motion } from "motion/react";

export default function OnboardingShell({ children }: { children: React.ReactNode }) {
  const { state } = useOnboardingState();
  const router = useRouter();

  useEffect(() => {
    if (state.activated) {
      router.push(`/${state.tenantSlug || "dashboard"}/dashboard`);
    }
  }, [state.activated, state.tenantSlug, router]);

  return (
    <div className="min-h-screen bg-black relative">
      <div className="fixed inset-0 cyber-grid opacity-20" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-aegis-green/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        <header className="border-b border-zinc-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-4 h-4" fill="none">
                  <rect x="2" y="2" width="96" height="96" rx="20" fill="#111" stroke="#333" strokeWidth="2" />
                  <text x="50" y="68" fontFamily="system-ui" fontSize="56" fontWeight="800" fill="#00FF66" textAnchor="middle">V</text>
                </svg>
              </div>
              <span className="text-[11px] font-[var(--font-heading)] tracking-wider text-zinc-500 uppercase">
                Enterprise Onboarding
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-[var(--font-heading)] text-zinc-600">
                Stage {state.currentStage} of 8
              </span>
            </div>
          </div>
          <OnboardingStepper />
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <motion.div
            key={state.currentStage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
