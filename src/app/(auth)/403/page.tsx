"use client";

import { motion } from "motion/react";
import { Button } from "@/components/motion/button/base";

export default function UnauthorizedPage() {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a4 4 0 00-8 0v2" />
          </svg>
        </motion.div>

        <h1 className="font-[var(--font-heading)] text-xl font-bold text-white mb-2">
          Access Denied
        </h1>
        <p className="text-zinc-500 text-sm mb-2">
          You don&apos;t have permission to access this resource.
        </p>
        <p className="text-zinc-500 text-sm mb-8">
          Required role: <span className="text-zinc-300 font-[var(--font-heading)]">Administrator</span>
        </p>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 mb-8">
          <p className="text-[11px] font-[var(--font-heading)] text-zinc-500 mb-2">RBAC Gate</p>
          <div className="font-mono text-xs text-zinc-400 space-y-1">
            <p>$ veritas auth check --resource /dashboard/admin</p>
            <p className="text-red-400">DENIED: Insufficient permissions</p>
            <p className="text-zinc-600">Current role: compliance_officer</p>
            <p className="text-zinc-600">Required: administrator</p>
            <p className="text-zinc-500 mt-2">
              <span className="cursor-blink">_</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full text-zinc-500 hover:text-zinc-300"
            onClick={() => window.history.back()}
          >
            ← Go back
          </Button>
          <Button
            variant="ghost"
            className="w-full text-zinc-500 hover:text-zinc-300"
            onClick={() => window.location.href = "/dashboard"}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full text-zinc-500 hover:text-zinc-300"
            onClick={() => window.location.href = "/login"}
          >
            Sign in with different account
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
