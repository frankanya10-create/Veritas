"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootLines = [
  { text: "> VERITAS COMPLIANCE ENGINE v4.2.1", delay: 0 },
  { text: "> Initializing cryptographic module...      [OK]", delay: 200 },
  { text: "> Loading tamper-evident ledger...           [OK]", delay: 400 },
  { text: "> Initializing multi-agent orchestrator...    [OK]", delay: 600 },
  { text: "> Loading compliance framework maps...        [OK]", delay: 900 },
  { text: "> Calibrating compliance cross-mapper...     [OK]", delay: 1100 },
  { text: "> Initializing evidence ingestion pipeline.. [OK]", delay: 1300 },
  { text: "> Loading SOC2 / ISO27001 / GDPR frameworks [OK]", delay: 1500 },
  { text: "> Running chaos monkey preflight checks...   [OK]", delay: 1700 },
  { text: "> System ready. Welcome, Operator.", delay: 2000 },
];

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    bootLines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
      timers.push(timer);
    });

    // Complete after all lines shown
    const completeTimer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(onComplete, 800);
    }, 2800);
    timers.push(completeTimer);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-2xl px-8">
            <div className="border border-white/[0.06] bg-aegis-surface p-8">
              <div className="font-mono text-xs leading-relaxed">
                {bootLines.slice(0, visibleLines).map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className={
                      line.text.includes("[OK]")
                        ? "text-aegis-green/80"
                        : line.text.includes("Welcome")
                          ? "text-white mt-4"
                          : "text-aegis-muted"
                    }
                  >
                    {line.text}
                    {index === visibleLines - 1 && !line.text.includes("Welcome") && (
                      <span className="cursor-blink text-aegis-green">_</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
