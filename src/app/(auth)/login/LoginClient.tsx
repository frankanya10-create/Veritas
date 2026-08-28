"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Input } from "@/components/motion/input";
import { PasswordInput } from "@/components/motion/password-input";
import { Checkbox } from "@/components/motion/checkbox";
import { OTPInput } from "@/components/motion/otp-input";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";
import { signIn, initiateOAuth } from "@/app/actions";
import { cn } from "@/lib/utils";

const ENTERPRISE_DOMAINS = [
  "stanbic.com", "apexbank.com", "gtbank.com", "accessbank.com",
  "zenithbank.com", "firstbank.com", "ubagroup.com", "ecobank.com",
];

const TAGLINES = [
  "Real-time AML/KYT transaction monitoring",
  "Multi-agent orchestration against 12 CBN standards",
  "Tamper-evident audit trails with cryptographic chaining",
  "Cross-examination consensus voting across agent swarms",
];

type AuthStep = "credentials" | "mfa" | "tenant-select" | "passkey";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  role: string;
  lastAccess: string;
}

const DEMO_TENANTS: Tenant[] = [
  { id: "1", name: "Apex Banking Corp", slug: "apexbank", role: "Root Admin", lastAccess: "2 min ago" },
  { id: "2", name: "Veritas Compliance", slug: "veritas", role: "Compliance Officer", lastAccess: "1 hour ago" },
  { id: "3", name: "Lagos FinTech Hub", slug: "lagosfin", role: "Developer", lastAccess: "3 days ago" },
];

export default function LoginClient() {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSSO, setShowSSO] = useState(false);
  const [isEnterpriseDomain, setIsEnterpriseDomain] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaStatus, setMfaStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Rotate taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Detect enterprise domain in real-time
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    const domain = value.split("@")[1]?.toLowerCase();
    if (domain) {
      const isEnterprise = ENTERPRISE_DOMAINS.some((d) => domain.endsWith(d)) || domain.includes(".");
      setIsEnterpriseDomain(isEnterprise);
      setShowSSO(isEnterprise);
    } else {
      setIsEnterpriseDomain(false);
      setShowSSO(false);
    }
  }, []);

  // Password entropy calculator
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

  // Handle credential login
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Rate limit check after 3 failures
    if (failedAttempts >= 3) {
      setStep("mfa");
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.set("email", email);
      form.set("password", password);
      const result = await signIn(form);

      if (result.error) {
        setFailedAttempts((prev) => prev + 1);
        setError(result.error.message);
      } else if (result.user) {
        // Check if user has multiple tenants
        if (DEMO_TENANTS.length > 1) {
          setStep("tenant-select");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth
  const handleOAuth = async (provider: string) => {
    setLoading(true);
    try {
      const url = await initiateOAuth(provider);
      window.location.href = url;
    } catch {
      setError("OAuth authentication failed");
      setLoading(false);
    }
  };

  // Handle WebAuthn passkey
  const handlePasskey = async () => {
    try {
      if (!navigator.credentials) {
        setError("WebAuthn is not supported in this browser");
        return;
      }
      // In production, this would call your server to get the challenge
      setError("Passkey authentication requires a registered device");
    } catch {
      setError("Passkey authentication failed");
    }
  };

  // Handle MFA verification
  const handleMfaVerify = async () => {
    if (mfaCode.length !== 6) return;
    setMfaStatus("loading");

    // Simulate MFA verification
    setTimeout(() => {
      if (mfaCode === "123456") {
        setMfaStatus("success");
        setTimeout(() => {
          if (DEMO_TENANTS.length > 1) {
            setStep("tenant-select");
          } else {
            router.push("/dashboard");
          }
        }, 500);
      } else {
        setMfaStatus("error");
        setTimeout(() => setMfaStatus("idle"), 1000);
      }
    }, 1500);
  };

  // Handle tenant selection
  const handleTenantSelect = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    router.push(`/${tenant.slug}/dashboard`);
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
            Compliance Intelligence
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-[var(--font-heading)] text-4xl font-bold text-white leading-tight"
          >
            Your compliance co-pilot is waiting
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
            <span className="text-zinc-300 font-semibold">12 CBN Standards</span>
            <span className="w-px h-4 bg-zinc-700" />
            <span className="text-zinc-300 font-semibold">57% Enterprise Adoption</span>
            <span className="w-px h-4 bg-zinc-700" />
            <span className="text-zinc-300 font-semibold">$3T+ Tracked</span>
          </motion.div>
        </div>

        {/* Right side - Auth form */}
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
              {step === "credentials" && "Welcome back"}
              {step === "mfa" && "Two-Factor Authentication"}
              {step === "tenant-select" && "Select Workspace"}
              {step === "passkey" && "Passkey Authentication"}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {step === "credentials" && "Sign in to your Veritas account"}
              {step === "mfa" && "Enter the 6-digit code from your authenticator"}
              {step === "tenant-select" && "Choose your workspace to continue"}
              {step === "passkey" && "Use your biometric or security key"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* Credentials Step */}
            {step === "credentials" && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div>
                    <Input
                      ref={emailInputRef}
                      label="Email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="you@company.com"
                      required
                      error={error && !showSSO ? error : undefined}
                    />
                    <AnimatePresence>
                      {showSSO && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => setStep("passkey")}
                            className="w-full mt-2 py-2 border border-aegis-green/30 bg-aegis-green/5 text-aegis-green text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded hover:bg-aegis-green/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Enterprise SAML / SSO
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <PasswordInput
                      label="Password"
                      value={password}
                      onChange={(v) => {
                        setPassword(v);
                        setShowPasswordStrength(v.length > 0);
                      }}
                      placeholder="••••••••"
                      required
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

                  <div className="flex items-center justify-between">
                    <Checkbox
                      checked={rememberDevice}
                      onCheckedChange={setRememberDevice}
                      label="Remember this device"
                    />
                    <a
                      href="/forgot-password"
                      className="text-[11px] font-[var(--font-heading)] text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <StatefulButton
                    type="submit"
                    state={loading ? "loading" : error ? "error" : "idle"}
                    loadingText="Signing in..."
                    errorText="Try again"
                    className="w-full bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    Sign In
                  </StatefulButton>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-black px-3 text-[10px] font-[var(--font-heading)] tracking-wider text-zinc-600">
                      OR
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full py-2.5 border-zinc-800 text-zinc-300 text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-900 transition-colors"
                    onClick={() => handleOAuth("google")}
                    disabled={loading}
                  >
                    <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google Workspace
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-2.5 border-zinc-800 text-zinc-300 text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-900 transition-colors"
                    onClick={() => handleOAuth("github")}
                    disabled={loading}
                  >
                    <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
                    </svg>
                    GitHub Enterprise
                  </Button>
                </div>

                <p className="text-center mt-8 text-[11px] font-[var(--font-heading)] text-zinc-600">
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="text-zinc-300 hover:text-white transition-colors">
                    Sign Up
                  </a>
                </p>
              </motion.div>
            )}

            {/* MFA Step */}
            {step === "mfa" && (
              <motion.div
                key="mfa"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <OTPInput
                  length={6}
                  value={mfaCode}
                  onChange={setMfaCode}
                  onComplete={handleMfaVerify}
                  status={mfaStatus === "loading" ? "idle" : mfaStatus}
                  label="Verification Code"
                  hint="Enter the code from your authenticator app"
                  successMessage="Verified! Redirecting..."
                  errorMessage="Invalid code. Please try again."
                  autoFocus
                />

                {failedAttempts >= 3 && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-[11px] font-[var(--font-heading)] text-amber-400">
                      Too many failed attempts. Please complete the security challenge.
                    </p>
                  </div>
                )}

                <Button
                  variant="ghost"
                  className="w-full text-zinc-500 hover:text-zinc-300"
                  onClick={() => {
                    setStep("credentials");
                    setFailedAttempts(0);
                    setError("");
                  }}
                >
                  ← Back to sign in
                </Button>
              </motion.div>
            )}

            {/* Tenant Selection Step */}
            {step === "tenant-select" && (
              <motion.div
                key="tenant-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                {DEMO_TENANTS.map((tenant, i) => (
                  <motion.button
                    key={tenant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => handleTenantSelect(tenant)}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                      "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900",
                      selectedTenant?.id === tenant.id && "border-aegis-green/50 bg-aegis-green/5"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-[var(--font-heading)] text-white font-medium">
                          {tenant.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {tenant.role} · {tenant.slug}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-600">{tenant.lastAccess}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}

                <Button
                  variant="outline"
                  className="w-full mt-4 py-2.5 border-zinc-800 text-zinc-400 text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-900 transition-colors"
                >
                  + Create New Workspace
                </Button>
              </motion.div>
            )}

            {/* Passkey Step */}
            {step === "passkey" && (
              <motion.div
                key="passkey"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-aegis-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-[var(--font-heading)] text-white">
                      Touch your security key
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Use Touch ID, Face ID, or YubiKey
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full text-zinc-500 hover:text-zinc-300"
                  onClick={() => setStep("credentials")}
                >
                  ← Back to sign in
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
