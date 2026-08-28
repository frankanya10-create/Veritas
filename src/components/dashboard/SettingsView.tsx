"use client";

import { useState } from "react";
import { Settings, Users, Key, Globe, Cpu, Bell, CreditCard, Shield, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const teamMembers = [
  { name: "Root Admin", email: "admin@acme.com", role: "root_admin", mfa: true, lastActive: "2 min ago" },
  { name: "Sarah Chen", email: "sarah@acme.com", role: "compliance_officer", mfa: true, lastActive: "15 min ago" },
  { name: "James Okafor", email: "james@acme.com", role: "technical_auditor", mfa: false, lastActive: "1 hour ago" },
  { name: "Dev Team", email: "dev@acme.com", role: "engineer", mfa: true, lastActive: "30 min ago" },
];

const roleHierarchy = [
  { role: "root_admin", label: "Root Admin", permissions: ["Manage Billing", "Override Agents", "Ingest Policies", "Run Verification", "Trigger Chaos", "Manage Team"] },
  { role: "compliance_officer", label: "Compliance Officer", permissions: ["Override Agents", "Ingest Policies", "Run Verification"] },
  { role: "technical_auditor", label: "Technical Auditor", permissions: ["Ingest Policies", "Run Verification"] },
  { role: "engineer", label: "Engineer", permissions: ["Run Verification", "Trigger Chaos"] },
  { role: "read_only", label: "Read-Only", permissions: ["Run Verification"] },
];

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<"workspace" | "team" | "api" | "ai" | "billing">("workspace");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-mono font-bold text-white tracking-tight">Tenant Settings & RBAC</h1>
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Administrative control suite for workspace, security, and integrations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto">
        {[
          { id: "workspace" as const, label: "Workspace", icon: Globe },
          { id: "team" as const, label: "Team & RBAC", icon: Users },
          { id: "api" as const, label: "API Keys", icon: Key },
          { id: "ai" as const, label: "AI Node", icon: Cpu },
          { id: "billing" as const, label: "Billing", icon: CreditCard },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "text-aegis-green border-aegis-green"
                : "text-white/25 border-transparent hover:text-white/50"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "workspace" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4 space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Workspace Metadata</h3>
            {[
              { label: "Company Name", value: "AcmeFin Corp" },
              { label: "Legal Entity", value: "AcmeFin Holdings Ltd." },
              { label: "Tax Region", value: "NG (Lagos)" },
              { label: "Domain", value: "acme.veritas.com" },
            ].map((f) => (
              <div key={f.label}>
                <label className="font-mono text-[9px] uppercase tracking-wider text-white/25 block mb-1">{f.label}</label>
                <input
                  defaultValue={f.value}
                  className="w-full h-8 px-3 bg-black/40 border border-white/[0.06] font-mono text-[10px] text-white/60 outline-none focus:border-white/10 transition-colors"
                />
              </div>
            ))}
            <button className="px-4 py-2 bg-aegis-green/10 border border-aegis-green/20 text-aegis-green font-mono text-[10px] uppercase tracking-wider hover:bg-aegis-green/20 transition-colors cursor-pointer">
              Save Changes
            </button>
          </div>
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4 space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Custom Domain</h3>
            <div>
              <label className="font-mono text-[9px] uppercase tracking-wider text-white/25 block mb-1">CNAME Target</label>
              <input
                defaultValue="compliance.acme.com"
                className="w-full h-8 px-3 bg-black/40 border border-white/[0.06] font-mono text-[10px] text-white/60 outline-none focus:border-white/10 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="green" className="text-[8px]">SSL Active</Badge>
              <span className="font-mono text-[9px] text-white/25">Certificate expires in 89 days</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Team Members</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-aegis-green/10 border border-aegis-green/20 text-aegis-green font-mono text-[10px] uppercase tracking-wider hover:bg-aegis-green/20 transition-colors cursor-pointer">
              <Plus className="w-3 h-3" />
              Invite Member
            </button>
          </div>
          <div className="bg-[#0A0A0A] border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Member", "Role", "MFA", "Last Active", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-mono text-[9px] uppercase tracking-wider text-white/20 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((m) => (
                  <tr key={m.email} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5">
                      <div className="font-mono text-[10px] text-white/70">{m.name}</div>
                      <div className="font-mono text-[9px] text-white/30">{m.email}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant="blue" className="text-[8px]">{m.role.replace(/_/g, " ")}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      {m.mfa ? <Shield className="w-3.5 h-3.5 text-aegis-green" /> : <span className="font-mono text-[9px] text-white/20">—</span>}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[9px] text-white/30">{m.lastActive}</td>
                    <td className="px-4 py-2.5">
                      <button className="text-aegis-red/50 hover:text-aegis-red transition-colors cursor-pointer">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RBAC Matrix */}
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">RBAC Permission Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-3 py-2 text-left font-mono text-[8px] uppercase text-white/20 font-normal">Permission</th>
                    {roleHierarchy.map((r) => (
                      <th key={r.role} className="px-3 py-2 text-center font-mono text-[8px] uppercase text-white/20 font-normal">{r.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["Manage Billing", "Override Agents", "Ingest Policies", "Run Verification", "Trigger Chaos", "Manage Team"].map((perm) => (
                    <tr key={perm} className="border-b border-white/[0.03]">
                      <td className="px-3 py-2 font-mono text-[9px] text-white/40">{perm}</td>
                      {roleHierarchy.map((r) => (
                        <td key={r.role} className="px-3 py-2 text-center">
                          {r.permissions.includes(perm) ? (
                            <span className="text-aegis-green text-[10px]">✓</span>
                          ) : (
                            <span className="text-white/10 text-[10px]">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "api" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">API Keys</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-aegis-green/10 border border-aegis-green/20 text-aegis-green font-mono text-[10px] uppercase tracking-wider hover:bg-aegis-green/20 transition-colors cursor-pointer">
              <Plus className="w-3 h-3" />
              Generate Key
            </button>
          </div>
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/40 border border-white/[0.04]">
              <div>
                <div className="font-mono text-[10px] text-white/70">Production Ingestion Key</div>
                <div className="font-mono text-[9px] text-white/30 mt-0.5">veritas_live_sec_••••••••••••k8f2</div>
              </div>
              <Badge variant="green" className="text-[8px]">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/40 border border-white/[0.04]">
              <div>
                <div className="font-mono text-[10px] text-white/70">Staging Test Key</div>
                <div className="font-mono text-[9px] text-white/30 mt-0.5">veritas_test_sec_••••••••••••m3p1</div>
              </div>
              <Badge variant="amber" className="text-[8px]">Test</Badge>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4 space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Ollama Node Configuration</h3>
            <div>
              <label className="font-mono text-[9px] uppercase tracking-wider text-white/25 block mb-1">RPC Endpoint</label>
              <input
                defaultValue="http://localhost:11434"
                className="w-full h-8 px-3 bg-black/40 border border-white/[0.06] font-mono text-[10px] text-white/60 outline-none focus:border-white/10 transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[9px] uppercase tracking-wider text-white/25 block mb-1">Active Model</label>
              <select className="w-full h-8 px-3 bg-black/40 border border-white/[0.06] font-mono text-[10px] text-white/60 outline-none focus:border-white/10 transition-colors appearance-none cursor-pointer">
                <option>Llama 3.2:3B</option>
                <option>Gemma4:12B</option>
                <option>Qwen2.5:3B</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[9px] uppercase tracking-wider text-white/25 block mb-1">Temperature: 0.3</label>
              <input type="range" min="0" max="100" defaultValue="30" className="w-full accent-aegis-green" />
            </div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4 space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Node Health</h3>
            <div className="space-y-3">
              {[
                { label: "Status", value: "Connected", color: "text-aegis-green" },
                { label: "VRAM Usage", value: "3.8 / 8.0 GB", color: "text-white/60" },
                { label: "Throughput", value: "48.2 tokens/sec", color: "text-aegis-green" },
                { label: "Uptime", value: "14d 7h 32m", color: "text-white/60" },
                { label: "Inference Queue", value: "0 pending", color: "text-white/60" },
              ].map((f) => (
                <div key={f.label} className="flex justify-between text-[10px] font-mono">
                  <span className="text-white/30">{f.label}</span>
                  <span className={f.color}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4 space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Current Plan</h3>
            <div className="p-4 bg-aegis-green/5 border border-aegis-green/20">
              <div className="font-mono text-lg font-bold text-aegis-green">Enterprise</div>
              <div className="font-mono text-[10px] text-white/40 mt-1">$499/month • Unlimited transactions</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white/40">Transactions this month</span>
                <span className="text-white/60">142,847 / Unlimited</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white/40">Vector storage</span>
                <span className="text-white/60">2.4 GB / 10 GB</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white/40">Team members</span>
                <span className="text-white/60">4 / Unlimited</span>
              </div>
            </div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4 space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Payment Method</h3>
            <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/[0.04]">
              <CreditCard className="w-6 h-6 text-white/30" />
              <div>
                <div className="font-mono text-[10px] text-white/70">•••• •••• •••• 4242</div>
                <div className="font-mono text-[9px] text-white/30">Visa • Expires 12/2028</div>
              </div>
            </div>
            <button className="w-full py-2 bg-white/[0.03] border border-white/[0.06] text-white/50 font-mono text-[10px] uppercase tracking-wider hover:bg-white/[0.05] transition-colors cursor-pointer">
              Update Payment Method
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
