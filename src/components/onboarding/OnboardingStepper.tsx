"use client";

import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const STAGES = [
  { num: 1, label: "Identity", short: "ID" },
  { num: 2, label: "AI Node", short: "AI" },
  { num: 3, label: "Frameworks", short: "FR" },
  { num: 4, label: "Agents", short: "AG" },
  { num: 5, label: "Pipelines", short: "PL" },
  { num: 6, label: "Team", short: "TM" },
  { num: 7, label: "Chaos", short: "CH" },
  { num: 8, label: "Activate", short: "AC" },
];

export default function OnboardingStepper() {
  const { state } = useOnboardingState();
  const { currentStage, completedStages } = state;

  return (
    <div className="w-full px-4 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {STAGES.map((stage, i) => {
          const isCompleted = completedStages.includes(stage.num);
          const isCurrent = currentStage === stage.num;
          const isPast = stage.num < currentStage;

          return (
            <div key={stage.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted || isPast ? "#00FF66" : isCurrent ? "#1a1a1a" : "#111",
                    borderColor: isCompleted || isPast ? "#00FF66" : isCurrent ? "#00FF66" : "#333",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-[var(--font-heading)] font-bold",
                    isCompleted || isPast ? "text-black" : isCurrent ? "text-aegis-green" : "text-zinc-600"
                  )}
                >
                  {isCompleted || isPast ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stage.short
                  )}
                </motion.div>
                <span className={cn(
                  "text-[9px] font-[var(--font-heading)] tracking-wider uppercase hidden sm:block",
                  isCurrent ? "text-aegis-green" : isPast || isCompleted ? "text-zinc-400" : "text-zinc-600"
                )}>
                  {stage.label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div className="flex-1 mx-2 h-px relative">
                  <div className="absolute inset-0 bg-zinc-800" />
                  <motion.div
                    initial={false}
                    animate={{ scaleX: isPast || isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-aegis-green origin-left"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
