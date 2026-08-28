"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { Input } from "@/components/motion/input";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "root_admin", label: "Root Tenant Admin", desc: "Full workspace control" },
  { id: "compliance_officer", label: "Compliance Officer", desc: "Framework management" },
  { id: "technical_auditor", label: "Technical Auditor", desc: "Log & evidence review" },
  { id: "devops_engineer", label: "DevOps / Security Engineer", desc: "Pipeline & infrastructure" },
  { id: "read_only", label: "Read-Only Regulator", desc: "View-only access" },
];

const SSO_PROVIDERS = [
  { id: "okta", label: "Okta" },
  { id: "azure", label: "Azure AD / Entra ID" },
  { id: "ping", label: "PingIdentity" },
  { id: "onelogin", label: "OneLogin" },
];

export default function Stage6Client() {
  const router = useRouter();
  const { state, updateField, completeAndNext, goBack } = useOnboardingState();
  const [ssoProvider, setSsoProvider] = useState(state.ssoProvider);
  const [ssoDomain, setSsoDomain] = useState("");
  const [ssoClientId, setSsoClientId] = useState("");
  const [ssoConfigured, setSsoConfigured] = useState(state.ssoConfigured);
  const [invites, setInvites] = useState<Array<{ email: string; role: string }>>(state.teamInvites);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("compliance_officer");

  const addInvite = () => {
    if (!newEmail) return;
    setInvites((prev) => [...prev, { email: newEmail, role: newRole }]);
    setNewEmail("");
  };

  const removeInvite = (index: number) => {
    setInvites((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSSOConfigure = () => {
    if (ssoProvider && ssoDomain) {
      setSsoConfigured(true);
    }
  };

  const handleContinue = () => {
    updateField("ssoProvider", ssoProvider);
    updateField("ssoConfigured", ssoConfigured);
    updateField("teamInvites", invites);
    toast.success("Team configuration saved");
    completeAndNext(router);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-white mb-2">
          Team Hierarchy & RBAC
        </h1>
        <p className="text-zinc-500 text-sm">
          Configure SSO and invite your compliance team.
        </p>
      </div>

      {/* SSO Configuration */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Enterprise SSO Mapping</h3>
        <div className="grid grid-cols-2 gap-2">
          {SSO_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSsoProvider(provider.id)}
              className={cn(
                "p-3 rounded-lg border text-sm font-[var(--font-heading)] transition-all",
                ssoProvider === provider.id
                  ? "border-aegis-green/50 bg-aegis-green/5 text-white"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
              )}
            >
              {provider.label}
            </button>
          ))}
        </div>
        {ssoProvider && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
            <Input label="Corporate Domain" value={ssoDomain} onChange={setSsoDomain} placeholder="stanbic.com" />
            <Input label="Client ID" value={ssoClientId} onChange={setSsoClientId} placeholder="SAML Client ID" />
            <Button
              onClick={handleSSOConfigure}
              disabled={!ssoDomain}
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300"
            >
              {ssoConfigured ? "✓ SSO Configured" : "Configure SAML 2.0"}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Team Invitations */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white">Team Invitations</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={newEmail}
              onChange={setNewEmail}
              placeholder="colleague@company.com"
              type="email"
            />
          </div>
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="h-11 px-3 rounded-full border border-zinc-800 bg-zinc-900 text-xs text-zinc-300 font-[var(--font-heading)]"
          >
            {ROLES.map((role) => (
              <option key={role.id} value={role.id}>{role.label}</option>
            ))}
          </select>
          <Button onClick={addInvite} disabled={!newEmail} variant="outline" className="h-11 border-zinc-700">
            + Add
          </Button>
        </div>

        {invites.length > 0 && (
          <div className="space-y-2">
            {invites.map((invite, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-300">
                  {invite.email[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-zinc-300">{invite.email}</p>
                  <p className="text-[10px] text-zinc-600">{ROLES.find((r) => r.id === invite.role)?.label}</p>
                </div>
                <button onClick={() => removeInvite(i)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => goBack(router)} className="flex-1 text-zinc-500 hover:text-zinc-300">
          ← Back
        </Button>
        <StatefulButton
          onClick={handleContinue}
          className="flex-1 bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full"
        >
          Continue →
        </StatefulButton>
      </div>
    </div>
  );
}
