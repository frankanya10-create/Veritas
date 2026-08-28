"use client";

import { motion } from "motion/react";
import { Button } from "@/components/motion/button/base";

export default function TenantSuspendedPage() {
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
          className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </motion.div>

        <h1 className="font-[var(--font-heading)] text-xl font-bold text-white mb-2">
          Workspace Suspended
        </h1>
        <p className="text-zinc-500 text-sm mb-2">
          This workspace has been suspended due to an expired subscription or policy violation.
        </p>
        <p className="text-zinc-500 text-sm mb-8">
          Contact your workspace administrator or{" "}
          <a href="mailto:support@veritas.ai" className="text-zinc-300 hover:text-white underline">
            support@veritas.ai
          </a>{" "}
          for assistance.
        </p>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 mb-8">
          <p className="text-[11px] font-[var(--font-heading)] text-zinc-500 mb-2">Terminal Status</p>
          <div className="font-mono text-xs text-zinc-400 space-y-1">
            <p>$ veritas status --workspace</p>
            <p className="text-red-400">ERROR: Workspace suspended</p>
            <p className="text-zinc-600">Reason: Subscription expired</p>
            <p className="text-zinc-600">Last active: 2026-08-15T10:30:00Z</p>
            <p className="text-zinc-500 mt-2">
              <span className="cursor-blink">_</span>
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full text-zinc-500 hover:text-zinc-300"
          onClick={() => window.location.href = "/login"}
        >
          ← Back to sign in
        </Button>
      </motion.div>
    </div>
  );
}
