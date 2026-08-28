"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, ShieldAlert, ShieldCheck, Scale, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const mockCases = [
  {
    id: "TX_994821",
    amount: "$14,500.00",
    status: "SPLIT",
    prosecutor: { vote: "REJECT", confidence: 0.87, reasoning: ["Cites CBN AML Sec 4.2: Velocity threshold exceeded", "Transaction 340% above 90-day average", "Cross-border routing through high-risk jurisdiction"] },
    defense: { vote: "APPROVE", confidence: 0.72, reasoning: ["Historical volume consistent with quarterly cycle", "Whitelisted counterparty since 2024", "Previous 47 transactions all cleared"] },
    judge: { vote: "ESCALATE", confidence: 0.62, reasoning: ["Split vote detected — confidence below threshold", "Routed to human auditor for final determination"] },
  },
  {
    id: "TX_994822",
    amount: "$2,340.00",
    status: "PASS",
    prosecutor: { vote: "PASS", confidence: 0.94, reasoning: ["No regulatory violations detected", "Amount within normal parameters"] },
    defense: { vote: "PASS", confidence: 0.96, reasoning: ["Consistent with sender 30-day baseline", "Known domestic transfer pattern"] },
    judge: { vote: "PASS", confidence: 0.95, reasoning: ["Unanimous PASS — all agents agree", "Auto-approved: confidence above 0.7 threshold"] },
  },
  {
    id: "TX_994823",
    amount: "$89,200.00",
    status: "FAIL",
    prosecutor: { vote: "REJECT", confidence: 0.91, reasoning: ["Structuring detected: 4 transactions just below $25K reporting threshold", "Pattern matches known smurfing technique", "Cites FATF Recommendation 20"] },
    defense: { vote: "APPROVE", confidence: 0.45, reasoning: ["Legitimate business expense pattern", "However: cannot explain sub-threshold clustering"] },
    judge: { vote: "FAIL", confidence: 0.88, reasoning: ["Majority REJECT — structuring pattern confirmed", "Auto-flagged for SAR filing"] },
  },
  {
    id: "TX_994824",
    amount: "$5,000.00",
    status: "SPLIT",
    prosecutor: { vote: "REJECT", confidence: 0.68, reasoning: ["Sender IP flagged in previous incident", "Geolocation inconsistent with known patterns"] },
    defense: { vote: "APPROVE", confidence: 0.81, reasoning: ["IP was whitelisted after investigation 2025-01-15", "Amount well within normal range", "Recipient is verified business account"] },
    judge: { vote: "ESCALATE", confidence: 0.58, reasoning: ["Low confidence on both sides", "Human review recommended for IP context"] },
  },
];

export default function ConsensusRoom() {
  const [selectedCase, setSelectedCase] = useState(mockCases[0]);
  const [overrideNote, setOverrideNote] = useState("");

  const verdictColor = (v: string) => {
    switch (v) {
      case "PASS": return "green";
      case "FAIL": return "red";
      case "ESCALATE": return "amber";
      case "REJECT": return "red";
      case "APPROVE": return "green";
      case "SPLIT": return "amber";
      default: return "muted";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-mono font-bold text-white tracking-tight">Multi-Agent Consensus Room</h1>
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Monitor, evaluate, and override agent decision loops</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Case Queue */}
        <div className="bg-[#0A0A0A] border border-white/[0.06]">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Escalation Queue</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {mockCases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`w-full text-left px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer ${selectedCase.id === c.id ? "bg-white/[0.03] border-l-2 border-aegis-green" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] text-white/80">{c.id}</span>
                  <Badge variant={verdictColor(c.status) as any} className="text-[8px]">{c.status}</Badge>
                </div>
                <div className="font-mono text-[10px] text-white/40">{c.amount}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Agent Debate */}
        <div className="lg:col-span-2 space-y-4">
          {/* Event Header */}
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-sm font-bold text-white">{selectedCase.id}</div>
                <div className="font-mono text-[10px] text-white/30">Amount: {selectedCase.amount}</div>
              </div>
              <Badge variant={verdictColor(selectedCase.status) as any}>{selectedCase.status}</Badge>
            </div>
          </div>

          {/* Agent Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Prosecutor */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A] border border-aegis-red/20 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-aegis-red" />
                <span className="font-mono text-[10px] font-bold text-aegis-red uppercase">Prosecutor</span>
              </div>
              <Badge variant={verdictColor(selectedCase.prosecutor.vote) as any} className="text-[9px] mb-3">
                {selectedCase.prosecutor.vote}
              </Badge>
              <div className="font-mono text-[9px] text-white/30 mb-2">
                Confidence: <span className="text-white/60">{(selectedCase.prosecutor.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="space-y-1.5">
                {selectedCase.prosecutor.reasoning.map((r, i) => (
                  <div key={i} className="font-mono text-[9px] text-white/40 leading-relaxed">• {r}</div>
                ))}
              </div>
            </motion.div>

            {/* Defense */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0A0A0A] border border-aegis-green/20 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-aegis-green" />
                <span className="font-mono text-[10px] font-bold text-aegis-green uppercase">Defense</span>
              </div>
              <Badge variant={verdictColor(selectedCase.defense.vote) as any} className="text-[9px] mb-3">
                {selectedCase.defense.vote}
              </Badge>
              <div className="font-mono text-[9px] text-white/30 mb-2">
                Confidence: <span className="text-white/60">{(selectedCase.defense.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="space-y-1.5">
                {selectedCase.defense.reasoning.map((r, i) => (
                  <div key={i} className="font-mono text-[9px] text-white/40 leading-relaxed">• {r}</div>
                ))}
              </div>
            </motion.div>

            {/* Judge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0A0A0A] border border-aegis-blue/20 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-4 h-4 text-aegis-blue" />
                <span className="font-mono text-[10px] font-bold text-aegis-blue uppercase">Judge</span>
              </div>
              <Badge variant={verdictColor(selectedCase.judge.vote) as any} className="text-[9px] mb-3">
                {selectedCase.judge.vote}
              </Badge>
              <div className="font-mono text-[9px] text-white/30 mb-2">
                Confidence: <span className="text-white/60">{(selectedCase.judge.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="space-y-1.5">
                {selectedCase.judge.reasoning.map((r, i) => (
                  <div key={i} className="font-mono text-[9px] text-white/40 leading-relaxed">• {r}</div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Human Override */}
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">Human-in-the-Loop Override</h4>
            <textarea
              value={overrideNote}
              onChange={(e) => setOverrideNote(e.target.value)}
              placeholder="Enter justification for override (mandatory)..."
              className="w-full h-20 bg-black/40 border border-white/[0.06] p-3 font-mono text-[10px] text-white/60 placeholder:text-white/20 resize-none outline-none focus:border-white/10 transition-colors"
            />
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2.5 bg-aegis-green/10 border border-aegis-green/20 text-aegis-green font-mono text-[10px] uppercase tracking-wider hover:bg-aegis-green/20 transition-colors cursor-pointer">
                Force Approve
              </button>
              <button className="flex-1 py-2.5 bg-aegis-red/10 border border-aegis-red/20 text-aegis-red font-mono text-[10px] uppercase tracking-wider hover:bg-aegis-red/20 transition-colors cursor-pointer">
                Force Reject
              </button>
            </div>
            <p className="font-mono text-[8px] text-white/20 mt-2 text-center">
              Override will be cryptographically signed via WebAuthn and written to the audit ledger
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
