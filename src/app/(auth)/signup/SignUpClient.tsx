"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Input } from "@/components/motion/input";
import { PasswordInput } from "@/components/motion/password-input";
import { Checkbox } from "@/components/motion/checkbox";
import { StatefulButton } from "@/components/motion/button/stateful";
import { signUp } from "@/app/actions";
import { cn } from "@/lib/utils";

const TAGLINES = [
  "Real-time AML/KYT transaction monitoring",
  "Multi-agent orchestration against 12 CBN standards",
  "Tamper-evident audit trails with cryptographic chaining",
  "Cross-examination consensus voting across agent swarms",
];

export default function SignUpClient() {
  const router = useRouter();
  const [step, setStep] = useState<"signup" | "success">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [localAIOptIn, setLocalAIOptIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getPasswordStrength = (pw: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;

    if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score, label: "Fair", color: "bg-orange-500" };
    if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" };
    if (score <= 4) return { score, label: "Strong", color: "bg-green-500" };
    return { score, label: "Very Strong", color: "bg-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(password);
  const isFormValid = name && email && password && termsAccepted && privacyAccepted && localAIOptIn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.set("name", name);
      form.set("email", email);
      form.set("password", password);
      const result = await signUp(form);

      if (result.error) {
        setError(result.error.message);
      } else if (result.data?.requireEmailVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        router.push("/onboarding/stage-1");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:block space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 text-[11px] font-[var(--font-heading)] uppercase tracking-widest text-zinc-400"
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Onboarding
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-[var(--font-heading)] text-4xl font-bold text-white leading-tight"
          >
            Join the compliance intelligence network
          </motion.h2>

          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-zinc-400 text-sm font-[var(--font-heading)] leading-relaxed max-w-md"
            >
              {TAGLINES[taglineIndex]}
            </motion.p>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 text-[11px] font-[var(--font-heading)] text-zinc-500"
          >
            <span className="text-zinc-300 font-semibold">100+ Requirements</span>
            <span className="w-px h-4 bg-zinc-700" />
            <span className="text-zinc-300 font-semibold">40+ Countries</span>
            <span className="w-px h-4 bg-zinc-700" />
            <span className="text-zinc-300 font-semibold">Zero Cloud AI</span>
          </motion.div>
        </div>

        {/* Right side - Signup form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm mx-auto md:mx-0 md:ml-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none">
                <rect x="2" y="2" width="96" height="96" rx="20" fill="#111" stroke="#333" strokeWidth="2" />
                <text x="50" y="68" fontFamily="system-ui" fontSize="56" fontWeight="800" fill="#00FF66" textAnchor="middle">V</text>
              </svg>
            </div>
            <h1 className="font-[var(--font-heading)] text-xl font-bold text-white">
              {step === "signup" ? "Create your account" : "Check your email"}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {step === "signup"
                ? "Start with Veritas compliance intelligence"
                : `We sent a verification link to ${email}`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={setName}
                    placeholder="John Doe"
                    required
                  />

                  <Input
                    label="Work Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@company.com"
                    required
                  />

                  <div>
                    <PasswordInput
                      label="Password"
                      value={password}
                      onChange={(v) => {
                        setPassword(v);
                        setShowPasswordStrength(v.length > 0);
                      }}
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                    />
                    <AnimatePresence>
                      {showPasswordStrength && password.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 space-y-1">
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-1 flex-1 rounded-full transition-all duration-300",
                                    i < passwordStrength.score ? passwordStrength.color : "bg-zinc-800"
                                  )}
                                />
                              ))}
                            </div>
                            <p className="text-[10px] font-[var(--font-heading)] text-zinc-500">
                              {passwordStrength.label}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Checkbox
                      checked={termsAccepted}
                      onCheckedChange={setTermsAccepted}
                      label={
                        <span className="text-zinc-400">
                          I agree to the{" "}
                          <a href="/terms" className="text-zinc-300 hover:text-white underline">
                            Terms of Service
                          </a>
                        </span>
                      }
                    />
                    <Checkbox
                      checked={privacyAccepted}
                      onCheckedChange={setPrivacyAccepted}
                      label={
                        <span className="text-zinc-400">
                          I agree to the{" "}
                          <a href="/privacy" className="text-zinc-300 hover:text-white underline">
                            Privacy Policy
                          </a>
                        </span>
                      }
                    />
                    <Checkbox
                      checked={localAIOptIn}
                      onCheckedChange={setLocalAIOptIn}
                      label={
                        <span className="text-zinc-400">
                          I acknowledge local AI data processing via isolated Ollama node
                        </span>
                      }
                    />
                  </div>

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
                    loadingText="Creating account..."
                    errorText="Try again"
                    disabled={!isFormValid}
                    className="w-full bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    Create Account
                  </StatefulButton>
                </form>

                <p className="text-center mt-8 text-[11px] font-[var(--font-heading)] text-zinc-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-zinc-300 hover:text-white transition-colors">
                    Sign In
                  </a>
                </p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6"
                >
                  <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h2 className="font-[var(--font-heading)] text-lg font-bold text-white mb-2">
                  Account created!
                </h2>
                <p className="text-zinc-500 text-sm mb-6">
                  Check your email for a verification link.
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="text-zinc-400 hover:text-white text-sm font-[var(--font-heading)] transition-colors"
                >
                  ← Back to sign in
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
