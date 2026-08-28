"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitPullRequest, Shield, AlertTriangle, CheckCircle, XCircle, FileCode, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const prs = [
  { id: "PR #482", title: "Add PII encryption to user migration", author: "sarah.chen", repo: "veritas-backend", branch: "feat/pii-encryption", status: "BLOCKED", riskScore: 87, flags: ["Unencrypted PII in migration", "Missing auth check on /api/users/export"], frameworks: ["GDPR Art. 32", "PCI-DSS Req. 3.4"] },
  { id: "PR #481", title: "Update KYC verification flow", author: "james.okafor", repo: "veritas-compliance", branch: "feat/kyc-v2", status: "PASSED", riskScore: 12, flags: [], frameworks: [] },
  { id: "PR #480", title: "Add webhook retry mechanism", author: "dev.team", repo: "veritas-infra", branch: "feat/webhook-retry", status: "PASSED", riskScore: 8, flags: [], frameworks: [] },
  { id: "PR #479", title: "Implement bulk transaction import", author: "mike.ade", repo: "veritas-backend", branch: "feat/bulk-import", status: "BLOCKED", riskScore: 72, flags: ["No rate limiting on batch endpoint", "Missing input sanitization for CSV"], frameworks: ["CBN AML §4.1", "SOC 2 CC6.1"] },
  { id: "PR #478", title: "Fix ledger hash concatenation", author: "sarah.chen", repo: "veritas-core", branch: "fix/ledger-hash", status: "PASSED", riskScore: 5, flags: [], frameworks: [] },
];

export default function PRGuardrail() {
  const [selectedPR, setSelectedPR] = useState(prs[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-mono font-bold text-white tracking-tight">PR Guardrail & Compliance Scanner</h1>
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Bridge software development with regulatory enforcement</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0A0A0A] border border-white/[0.06] p-3">
          <div className="font-mono text-xl font-bold text-aegis-green">3</div>
          <div className="font-mono text-[9px] text-white/30 uppercase">Passed</div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/[0.06] p-3">
          <div className="font-mono text-xl font-bold text-aegis-red">2</div>
          <div className="font-mono text-[9px] text-white/30 uppercase">Blocked</div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/[0.06] p-3">
          <div className="font-mono text-xl font-bold text-aegis-blue">5</div>
          <div className="font-mono text-[9px] text-white/30 uppercase">Scanned Today</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* PR List */}
        <div className="bg-[#0A0A0A] border border-white/[0.06]">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Recent Scans</h3>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {prs.map((pr) => (
              <button
                key={pr.id}
                onClick={() => setSelectedPR(pr)}
                className={`w-full text-left px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                  selectedPR.id === pr.id ? "bg-white/[0.03] border-l-2 border-aegis-green" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-white/70">{pr.id}</span>
                  <Badge variant={pr.status === "PASSED" ? "green" : "red"} className="text-[7px]">{pr.status}</Badge>
                </div>
                <div className="font-mono text-[9px] text-white/40 truncate">{pr.title}</div>
                <div className="font-mono text-[8px] text-white/20 mt-1">{pr.author} • {pr.repo}</div>
              </button>
            ))}
          </div>
        </div>

        {/* PR Detail */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/[0.06] p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-mono text-xs font-bold text-white">{selectedPR.id}: {selectedPR.title}</h3>
              <p className="font-mono text-[9px] text-white/30">{selectedPR.author} → {selectedPR.branch}</p>
            </div>
            <Badge variant={selectedPR.status === "PASSED" ? "green" : "red"}>
              Risk: {selectedPR.riskScore}/100
            </Badge>
          </div>

          {selectedPR.flags.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/25">Detected Violations</h4>
              {selectedPR.flags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-aegis-red/5 border border-aegis-red/10">
                  <AlertTriangle className="w-3.5 h-3.5 text-aegis-red mt-0.5 flex-shrink-0" />
                  <span className="font-mono text-[10px] text-white/60">{flag}</span>
                </div>
              ))}

              <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/25 mt-4">Framework Impact</h4>
              <div className="flex gap-1.5">
                {selectedPR.frameworks.map((fw) => (
                  <Badge key={fw} variant="amber" className="text-[8px]">{fw}</Badge>
                ))}
              </div>

              <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/25 mt-4">Suggested Remediation</h4>
              <div className="bg-black/40 border border-white/[0.04] p-3">
                <pre className="font-mono text-[9px] text-aegis-green/70 leading-relaxed">
{`- Add encryption layer before persisting PII fields
- Implement row-level security check in controller
- Add rate limiting middleware to batch endpoints
- Sanitize CSV input with whitelist validation`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-8 h-8 text-aegis-green mb-3" />
              <p className="font-mono text-[11px] text-white/50">No compliance violations detected</p>
              <p className="font-mono text-[9px] text-white/25">This PR is safe to merge</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
