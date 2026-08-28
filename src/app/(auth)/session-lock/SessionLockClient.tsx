"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Input } from "@/components/motion/input";
import { StatefulButton } from "@/components/motion/button/stateful";

export default function SessionLockClient() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate re-authentication
    setTimeout(() => {
      if (password === "password") {
        router.push("/dashboard");
      } else {
        setError("Incorrect password");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
          <h1 className="font-[var(--font-heading)] text-xl font-bold text-white mb-2">
            Session Locked
          </h1>
          <p className="text-zinc-500 text-sm">
            Your session was locked due to inactivity.
          </p>
          <p className="text-zinc-500 text-sm">
            Re-enter your password to continue.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            required
            autoFocus
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs font-[var(--font-heading)]"
            >
              {error}
            </motion.p>
          )}

          <StatefulButton
            type="submit"
            state={loading ? "loading" : error ? "error" : "idle"}
            loadingText="Unlocking..."
            errorText="Try again"
            disabled={!password}
            className="w-full bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            Unlock Session
          </StatefulButton>
        </form>

        <p className="text-center mt-6 text-[11px] font-[var(--font-heading)] text-zinc-600">
          Or{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            sign in with a different account
          </button>
        </p>
      </motion.div>
    </div>
  );
}
