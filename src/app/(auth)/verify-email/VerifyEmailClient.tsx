"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { OTPInput } from "@/components/motion/otp-input";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";
import { verifyEmail } from "@/app/actions";

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(900); // 15 minutes
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-polling verification status
  useEffect(() => {
    if (status !== "success") return;

    const interval = setInterval(async () => {
      try {
        const form = new FormData();
        form.set("email", email);
        form.set("otp", otp);
        const result = await verifyEmail(form);
        if (result.redirect) {
          router.push(result.redirect);
        }
      } catch {
        // Continue polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status, email, otp, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = useCallback(async (code: string) => {
    if (code.length !== 6 || !email) return;

    setStatus("loading");
    setError("");

    try {
      const form = new FormData();
      form.set("email", email);
      form.set("otp", code);
      const result = await verifyEmail(form);

      if (result.error) {
        setStatus("error");
        setError(result.error.message);
        setTimeout(() => setStatus("idle"), 1000);
      } else {
        setStatus("success");
        if (result.redirect) {
          setTimeout(() => router.push(result.redirect), 1500);
        }
      }
    } catch {
      setStatus("error");
      setError("Verification failed");
      setTimeout(() => setStatus("idle"), 1000);
    }
  }, [email, router]);

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(900);
    setError("");
    // In production, this would call a resend endpoint
    setError("Verification code resent to your email");
    setTimeout(() => setError(""), 3000);
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
            Check your email
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            We sent a 6-digit code to
          </p>
          <p className="text-zinc-300 text-sm font-[var(--font-heading)]">
            {email || "your email address"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 flex flex-col items-center"
        >
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleVerify}
            status={status === "loading" ? "idle" : status}
            hint={`Code expires in ${formatTime(countdown)}`}
            successMessage="Verified! Redirecting..."
            errorMessage={error || "Invalid code"}
            autoFocus
          />

          <div className="text-center">
            {canResend ? (
              <Button
                variant="ghost"
                onClick={handleResend}
                className="text-aegis-green hover:text-aegis-green/80"
              >
                Resend code
              </Button>
            ) : (
              <p className="text-[11px] font-[var(--font-heading)] text-zinc-600">
                Resend code in {formatTime(countdown)}
              </p>
            )}
          </div>

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
