"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/motion/button/base";

export default function NodeErrorPage() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    // Check Ollama node status
    const checkNode = async () => {
      try {
        const response = await fetch("http://localhost:11434/api/tags", {
          method: "GET",
          signal: AbortSignal.timeout(5000),
        });
        setStatus(response.ok ? "online" : "offline");
      } catch {
        setStatus("offline");
      }
    };

    checkNode();
    const interval = setInterval(checkNode, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
            status === "online"
              ? "bg-emerald-500/10 border border-emerald-500/20"
              : status === "checking"
              ? "bg-amber-500/10 border border-amber-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}
        >
          {status === "checking" ? (
            <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          ) : status === "online" ? (
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </motion.div>

        <h1 className="font-[var(--font-heading)] text-xl font-bold text-white mb-2">
          {status === "online" ? "Node Connected" : "Local AI Node Unreachable"}
        </h1>
        <p className="text-zinc-500 text-sm mb-2">
          {status === "online"
            ? "Ollama is running at localhost:11434"
            : "Cannot connect to the local Ollama node."}
        </p>
        <p className="text-zinc-500 text-sm mb-8">
          {status === "offline" && (
            <>
              Start Ollama to enable local AI features:
            </>
          )}
        </p>

        {status === "offline" && (
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 mb-8 text-left">
            <p className="text-[11px] font-[var(--font-heading)] text-zinc-500 mb-2">Quick Start</p>
            <div className="font-mono text-xs text-zinc-400 space-y-1">
              <p>$ ollama serve</p>
              <p className="text-zinc-600"># Or run in background:</p>
              <p>$ ollama serve &amp;</p>
              <p className="text-zinc-600 mt-2"># Verify connection:</p>
              <p>$ curl http://localhost:11434/api/tags</p>
              <p className="text-zinc-500 mt-2">
                <span className="cursor-blink">_</span>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full text-zinc-500 hover:text-zinc-300"
            onClick={() => window.location.reload()}
          >
            {status === "checking" ? "Checking..." : "Retry Connection"}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-zinc-500 hover:text-zinc-300"
            onClick={() => window.location.href = "/dashboard"}
          >
            Continue without AI
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
