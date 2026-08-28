"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Input } from "@/components/motion/input";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate password reset request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none">
              <rect x="2" y="2" width="96" height="96" rx="20" fill="#111" stroke="#333" strokeWidth="2" />
              <text x="50" y="68" fontFamily="system-ui" fontSize="56" fontWeight="800" fill="#00FF66" textAnchor="middle">V</text>
            </svg>
          </div>
          <h1 className="font-[var(--font-heading)] text-xl font-bold text-white">
            {submitted ? "Check your email" : "Forgot password?"}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {submitted
              ? "If an account exists, a reset link has been sent."
              : "Enter your email and we'll send you a reset link."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@company.com"
                required
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
                state={loading ? "loading" : "idle"}
                loadingText="Sending..."
                className="w-full bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-200 transition-colors"
              >
                Send Reset Link
              </StatefulButton>
            </form>
          ) : (
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-16 h-16 rounded-full bg-aegis-green/10 border border-aegis-green/20 flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-8 h-8 text-aegis-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <p className="text-zinc-400 text-sm mb-4">
                We sent a password reset link to<br />
                <span className="text-zinc-300 font-[var(--font-heading)]">{email}</span>
              </p>
              <p className="text-[11px] text-zinc-600 mb-6">
                The link expires in 10 minutes. Check your spam folder if you don't see it.
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="text-zinc-500 hover:text-zinc-300"
              >
                Try a different email
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full text-zinc-500 hover:text-zinc-300"
            onClick={() => router.push("/login")}
          >
            ← Back to sign in
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
