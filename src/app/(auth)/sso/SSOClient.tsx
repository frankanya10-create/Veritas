"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Input } from "@/components/motion/input";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";

const IDP_OPTIONS = [
  { id: "okta", name: "Okta", icon: "🔐" },
  { id: "azure", name: "Azure AD / Entra ID", icon: "☁️" },
  { id: "ping", name: "PingIdentity", icon: "🔄" },
  { id: "onelogin", name: "OneLogin", icon: "🔑" },
];

export default function SSOClient() {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectedIdP, setDetectedIdP] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleDomainChange = (value: string) => {
    setDomain(value);
    // Simulate IdP detection based on domain
    const d = value.toLowerCase();
    if (d.includes("okta") || d.includes("acme")) {
      setDetectedIdP("okta");
    } else if (d.includes("microsoft") || d.includes("azure") || d.includes("outlook")) {
      setDetectedIdP("azure");
    } else if (d.includes("ping")) {
      setDetectedIdP("ping");
    } else {
      setDetectedIdP(null);
    }
  };

  const handleSSOLogin = async (idp: string) => {
    setLoading(true);
    setError("");

    // Simulate SAML assertion parsing and JIT provisioning
    setTimeout(() => {
      setLoading(false);
      // In production, this would redirect to the IdP
      router.push("/dashboard");
    }, 2000);
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
            Enterprise SSO
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Sign in with your corporate identity provider
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <Input
            label="Corporate Domain"
            value={domain}
            onChange={handleDomainChange}
            placeholder="stanbic.com"
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            }
          />

          {detectedIdP && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <p className="text-[11px] font-[var(--font-heading)] text-aegis-green mb-2">
                Identity provider detected
              </p>
            </motion.div>
          )}

          <div className="space-y-2">
            {IDP_OPTIONS.map((idp, i) => (
              <motion.button
                key={idp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleSSOLogin(idp.id)}
                disabled={loading}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                  detectedIdP === idp.id
                    ? "border-aegis-green/50 bg-aegis-green/5"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900"
                } disabled:opacity-50`}
              >
                <span className="text-2xl">{idp.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-[var(--font-heading)] text-white font-medium">
                    {idp.name}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    SAML 2.0 · Just-in-Time provisioning
                  </p>
                </div>
                {detectedIdP === idp.id && (
                  <span className="text-[10px] font-[var(--font-heading)] text-aegis-green bg-aegis-green/10 px-2 py-1 rounded-full">
                    Detected
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs font-[var(--font-heading)] text-center"
            >
              {error}
            </motion.p>
          )}

          <div className="pt-4 border-t border-zinc-800">
            <p className="text-[11px] font-[var(--font-heading)] text-zinc-600 text-center mb-4">
              SAML Groups are automatically mapped to Veritas Roles via JIT provisioning
            </p>
            <Button
              variant="ghost"
              className="w-full text-zinc-500 hover:text-zinc-300"
              onClick={() => router.push("/login")}
            >
              ← Back to sign in
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
