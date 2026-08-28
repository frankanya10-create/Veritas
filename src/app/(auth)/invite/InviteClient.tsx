"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Input } from "@/components/motion/input";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";

interface InviteData {
  tenantName: string;
  role: string;
  inviterEmail: string;
  isNewUser: boolean;
}

export default function InviteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tenantId = searchParams.get("tenant_id");
  const role = searchParams.get("role");
  const inviter = searchParams.get("inviter");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteData, setInviteData] = useState<InviteData | null>(null);

  // Validate token and fetch invite data
  useEffect(() => {
    if (!token) return;

    // Simulate token validation
    setTimeout(() => {
      setInviteData({
        tenantName: "Apex Banking Corp",
        role: role || "Compliance Officer",
        inviterEmail: inviter || "admin@stanbic.com",
        isNewUser: true,
      });
    }, 500);
  }, [token, role, inviter]);

  const handleAccept = async () => {
    setLoading(true);
    setError("");

    // Simulate invitation acceptance
    setTimeout(() => {
      setLoading(false);
      if (inviteData?.isNewUser) {
        router.push("/signup?invite=" + token);
      } else {
        router.push("/dashboard");
      }
    }, 1500);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="font-[var(--font-heading)] text-xl font-bold text-white mb-2">
            Invalid Invitation
          </h1>
          <p className="text-zinc-500 text-sm mb-6">
            This invitation link is invalid or has expired.
          </p>
          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="text-zinc-500 hover:text-zinc-300"
          >
            Go to sign in
          </Button>
        </div>
      </div>
    );
  }

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
            You&apos;re invited!
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Join a workspace on Veritas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {inviteData ? (
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-[var(--font-heading)] text-zinc-500">Workspace</span>
                <span className="text-sm font-[var(--font-heading)] text-white">{inviteData.tenantName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-[var(--font-heading)] text-zinc-500">Your Role</span>
                <span className="text-sm font-[var(--font-heading)] text-aegis-green">{inviteData.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-[var(--font-heading)] text-zinc-500">Invited by</span>
                <span className="text-sm font-[var(--font-heading)] text-zinc-300">{inviteData.inviterEmail}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 rounded-full border border-zinc-700 border-t-zinc-300 animate-spin" />
            </div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs font-[var(--font-heading)] text-center"
            >
              {error}
            </motion.p>
          )}

          <StatefulButton
            state={loading ? "loading" : "idle"}
            loadingText="Accepting..."
            onClick={handleAccept}
            disabled={!inviteData}
            className="w-full bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            Accept Invitation
          </StatefulButton>

          <Button
            variant="ghost"
            className="w-full text-zinc-500 hover:text-zinc-300"
            onClick={() => router.push("/login")}
          >
            Decline & go to sign in
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
