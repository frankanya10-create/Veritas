"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { generateTotpSecret, createOtpauthUrl } from "@/lib/totp";
import { generateSeedWords, hashSeed, downloadSeed } from "@/lib/seed";
import { Input } from "@/components/motion/input";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";
import { Switch } from "@/components/motion/switch";
import { cn } from "@/lib/utils";

export default function Stage1Client() {
  const router = useRouter();
  const { state, updateField, completeAndNext, goBack, saveStageToDb } = useOnboardingState();

  const [companyName, setCompanyName] = useState(state.tenantName);
  const [subdomain, setSubdomain] = useState(state.subdomain);
  const [customCname, setCustomCname] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [genesisHash, setGenesisHash] = useState("");
  const [seedRevealed, setSeedRevealed] = useState(false);
  const [seedConfirmed, setSeedConfirmed] = useState(false);
  const [seedWords] = useState(() => generateSeedWords(24));
  const [webauthnDone, setWebauthnDone] = useState(state.webAuthnRegistered);
  const [totpSecret] = useState(() => state.totpSecret || generateTotpSecret());
  const [totpQrDataUrl, setTotpQrDataUrl] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpVerified, setTotpVerified] = useState(state.mfaVerified);
  const [totpError, setTotpError] = useState("");
  const [verifyingTotp, setVerifyingTotp] = useState(false);
  const [step, setStep] = useState<"domain" | "genesis" | "seed" | "passkey" | "mfa">(
    state.mfaVerified ? "mfa" : state.totpSetup ? "mfa" : state.webAuthnRegistered ? "passkey" : "domain"
  );

  const otpauthUrl = useMemo(
    () => createOtpauthUrl(totpSecret, companyName || "admin@veritas"),
    [totpSecret, companyName]
  );

  useEffect(() => {
    updateField("totpSecret", totpSecret);
  }, [totpSecret, updateField]);

  useEffect(() => {
    if (step === "mfa" && !totpQrDataUrl) {
      QRCode.toDataURL(otpauthUrl, {
        width: 200,
        margin: 2,
        color: { dark: "#00FF66", light: "#000000" },
      }).then(setTotpQrDataUrl);
    }
  }, [step, otpauthUrl, totpQrDataUrl]);

  useEffect(() => {
    if (step === "genesis" && !genesisHash) {
      const data = JSON.stringify({ tenantId: state.tenantId, timestamp: Date.now(), version: "1.0.0" });
      crypto.subtle.digest("SHA-256", new TextEncoder().encode(data)).then((hash) => {
        setGenesisHash(Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join(""));
      });
    }
  }, [step, genesisHash, state.tenantId]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (subdomain.length >= 3) {
      setCheckingSubdomain(true);
      setSubdomainAvailable(null);
      timer = setTimeout(async () => {
        try {
          const res = await fetch("/api/tenant/check-subdomain", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subdomain }),
          });
          const data = await res.json();
          setSubdomainAvailable(data.available);
        } catch {
          setSubdomainAvailable(true);
        } finally {
          setCheckingSubdomain(false);
        }
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [subdomain]);

  const handleDomainSubmit = () => {
    if (!companyName || !subdomain || subdomainAvailable === false) return;
    updateField("tenantName", companyName);
    updateField("tenantSlug", subdomain);
    updateField("subdomain", subdomain);
    updateField("domain", `${subdomain}.veritas.com`);
    saveStageToDb(1, { tenant_name: companyName, tenant_slug: subdomain, subdomain, domain: `${subdomain}.veritas.com` });
    setStep("genesis");
  };

  const handleGenesisComplete = () => {
    updateField("genesisBlockHash", genesisHash);
    setStep("seed");
  };

  const handleSeedConfirm = () => {
    updateField("recoverySeed", seedWords);
    setSeedConfirmed(true);
    toast.success("Recovery seed confirmed");
    setStep("passkey");
  };

  const handlePasskeyRegister = async () => {
    try {
      if (!window.navigator?.credentials) {
        toast.error("WebAuthn not supported in this browser");
        return;
      }
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "Veritas", id: window.location.hostname },
          user: {
            id: new TextEncoder().encode(state.tenantId),
            name: companyName || "admin",
            displayName: companyName || "Veritas Admin",
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          timeout: 60000,
          attestation: "none",
        },
      });

      if (credential) {
        updateField("webAuthnRegistered", true);
        setWebauthnDone(true);
        toast.success("Passkey registered successfully");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Passkey registration failed";
      if (msg.includes("NotAllowedError")) {
        toast.error("Passkey registration was cancelled");
      } else {
        toast.error(msg);
      }
    }
  };

  const handleTotpVerify = useCallback(async () => {
    if (totpCode.length !== 6) return;
    setVerifyingTotp(true);
    setTotpError("");

    try {
      const res = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: totpCode, secret: totpSecret }),
      });
      const data = await res.json();

      if (data.verified) {
        updateField("totpSetup", true);
        updateField("mfaVerified", true);
        setTotpVerified(true);
        toast.success("MFA verified successfully");
        completeAndNext(router);
      } else {
        setTotpError(data.error || "Invalid code. Try again.");
        toast.error("Invalid verification code");
      }
    } catch {
      setTotpError("Verification failed. Try again.");
      toast.error("Verification failed");
    } finally {
      setVerifyingTotp(false);
    }
  }, [totpCode, totpSecret, updateField, completeAndNext, router]);

  const copySeed = useCallback(async () => {
    await navigator.clipboard.writeText(seedWords.join(" "));
    toast.success("Seed copied to clipboard");
  }, [seedWords]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-white mb-2">
          Identity, Domain & Cryptographic Anchor
        </h1>
        <p className="text-zinc-500 text-sm">
          Configure your workspace identity and secure your genesis block.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "domain" && (
          <motion.div key="domain" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
              <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Workspace Identity</h3>
              <Input label="Company / Workspace Name" value={companyName} onChange={setCompanyName} placeholder="Acme Banking Corp" />
              <div>
                <Input label="Subdomain" value={subdomain} onChange={(v) => setSubdomain(v.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="acme" />
                <div className="flex items-center gap-2 mt-1.5 px-1">
                  <p className="text-[10px] font-[var(--font-heading)] text-zinc-600">
                    Preview: <span className="text-aegis-green">{subdomain || "___"}.veritas.com</span>
                  </p>
                  {checkingSubdomain && <div className="w-3 h-3 rounded-full border border-zinc-600 border-t-aegis-green animate-spin" />}
                  {!checkingSubdomain && subdomainAvailable === true && <span className="text-[10px] text-emerald-400">Available</span>}
                  {!checkingSubdomain && subdomainAvailable === false && <span className="text-[10px] text-red-400">Taken</span>}
                </div>
              </div>
              <Switch checked={customCname} onCheckedChange={setCustomCname} label="Enable custom CNAME" />
              {customCname && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <Input label="Custom Domain" placeholder="compliance.acmebank.com" value="" onChange={() => {}} />
                </motion.div>
              )}
            </div>
            <Button onClick={handleDomainSubmit} disabled={!companyName || !subdomain || subdomainAvailable === false} className="w-full bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full">
              Continue →
            </Button>
          </motion.div>
        )}

        {step === "genesis" && (
          <motion.div key="genesis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-4">Cryptographic Genesis Block #0</h3>
              <p className="text-zinc-500 text-xs mb-4">A SHA-256 hash anchoring your workspace identity, timestamp, and tenant ID.</p>
              <div className="p-4 rounded-lg bg-black border border-zinc-800 font-mono text-xs text-aegis-green break-all">
                {genesisHash || (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-aegis-green border-t-transparent animate-spin" />
                    Computing hash...
                  </span>
                )}
              </div>
              <div className="mt-4 space-y-2 text-[11px] font-[var(--font-heading)] text-zinc-500">
                <p>Tenant ID: <span className="text-zinc-300">{state.tenantId}</span></p>
                <p>Workspace: <span className="text-zinc-300">{companyName}</span></p>
                <p>Domain: <span className="text-zinc-300">{subdomain}.veritas.com</span></p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep("domain")} variant="ghost" className="flex-1 text-zinc-500 hover:text-zinc-300">← Back</Button>
              <StatefulButton state={genesisHash ? "idle" : "loading"} loadingText="Computing..." onClick={handleGenesisComplete} disabled={!genesisHash} className="flex-1 bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full">
                Lock Genesis Block →
              </StatefulButton>
            </div>
          </motion.div>
        )}

        {step === "seed" && (
          <motion.div key="seed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <h3 className="font-[var(--font-heading)] text-sm font-bold text-amber-400 mb-2">Recovery Seed</h3>
              <p className="text-zinc-400 text-xs mb-4">
                Write down these 24 words. They are the ONLY way to recover your workspace if your credentials are lost.
              </p>
              {!seedRevealed ? (
                <Button onClick={() => setSeedRevealed(true)} variant="outline" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                  Reveal Recovery Seed
                </Button>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {seedWords.map((word, i) => (
                      <div key={i} className="p-2 rounded bg-black border border-zinc-800 text-center">
                        <span className="text-[10px] text-zinc-600">{i + 1}</span>
                        <p className="text-xs font-mono text-zinc-300">{word}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={copySeed} variant="outline" className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs">
                      Copy to Clipboard
                    </Button>
                    <Button onClick={() => downloadSeed(seedWords, "txt")} variant="outline" className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs">
                      Export .txt
                    </Button>
                    <Button onClick={() => downloadSeed(seedWords, "json")} variant="outline" className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs">
                      Export .json
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep("genesis")} variant="ghost" className="flex-1 text-zinc-500 hover:text-zinc-300">← Back</Button>
              <StatefulButton state={seedConfirmed ? "success" : "idle"} successText="Confirmed" onClick={handleSeedConfirm} disabled={!seedRevealed} className="flex-1 bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full">
                I've saved my seed phrase →
              </StatefulButton>
            </div>
          </motion.div>
        )}

        {step === "passkey" && (
          <motion.div key="passkey" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-aegis-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-2">Hardware Passkey Enrollment</h3>
              <p className="text-zinc-500 text-xs mb-4">Register a biometric or security key for root admin authentication.</p>
              {webauthnDone ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-[var(--font-heading)]">Passkey registered</span>
                </div>
              ) : (
                <StatefulButton onClick={handlePasskeyRegister} className="bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full">
                  Register Passkey
                </StatefulButton>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep("seed")} variant="ghost" className="flex-1 text-zinc-500 hover:text-zinc-300">← Back</Button>
              <Button onClick={() => setStep("mfa")} variant="ghost" className="flex-1 text-zinc-500 hover:text-zinc-300">
                {webauthnDone ? "Continue →" : "Skip for now →"}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "mfa" && (
          <motion.div key="mfa" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-4">TOTP MFA Setup</h3>
              <p className="text-zinc-500 text-xs mb-4">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>

              <div className="flex flex-col items-center gap-4 mb-6">
                {totpQrDataUrl ? (
                  <div className="p-3 rounded-xl bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={totpQrDataUrl} alt="TOTP QR Code" className="w-[200px] h-[200px]" />
                  </div>
                ) : (
                  <div className="w-[200px] h-[200px] rounded-xl bg-zinc-800 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-aegis-green border-t-transparent animate-spin" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-[10px] text-zinc-600 mb-1">Or enter this secret manually:</p>
                  <p className="font-mono text-xs text-aegis-green bg-black px-3 py-1.5 rounded border border-zinc-800 select-all">{totpSecret}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <label className="text-[10px] font-[var(--font-heading)] text-zinc-500 uppercase tracking-wider">
                  Enter 6-digit verification code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setTotpCode(val);
                    setTotpError("");
                  }}
                  placeholder="000000"
                  className="w-48 text-center font-mono text-2xl tracking-[0.5em] bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-aegis-green transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && totpCode.length === 6) {
                      handleTotpVerify();
                    }
                  }}
                />
                {totpError && (
                  <p className="text-xs text-red-400">{totpError}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep("passkey")} variant="ghost" className="flex-1 text-zinc-500 hover:text-zinc-300">← Back</Button>
              <StatefulButton
                state={verifyingTotp ? "loading" : totpVerified ? "success" : "idle"}
                loadingText="Verifying..."
                successText="Verified"
                onClick={handleTotpVerify}
                disabled={totpCode.length !== 6 || totpVerified}
                className="flex-1 bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full"
              >
                Verify & Continue →
              </StatefulButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
