"use client";

import { useState } from "react";
import { BookLock, Upload, Search, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const evidenceRecords = [
  { id: "EVD-001", timestamp: "2026-08-28T14:32:00Z", source: "Transaction Monitor", type: "aml_flag", framework: "CBN", status: "verified", hash: "a3f2...8c1d" },
  { id: "EVD-002", timestamp: "2026-08-28T14:28:00Z", source: "Agent Consensus", type: "consensus_vote", framework: "SOC2", status: "verified", hash: "b7e1...4f2a" },
  { id: "EVD-003", timestamp: "2026-08-28T14:15:00Z", source: "PR Scanner", type: "compliance_violation", framework: "GDPR", status: "pending", hash: "c9d4...7e3b" },
  { id: "EVD-004", timestamp: "2026-08-28T13:55:00Z", source: "Chaos Auditor", type: "hardship_report", framework: "ISO", status: "verified", hash: "d2a8...1c5f" },
  { id: "EVD-005", timestamp: "2026-08-28T13:42:00Z", source: "Ledger", type: "block_append", framework: "SYS", status: "verified", hash: "e5f3...9a7d" },
  { id: "EVD-006", timestamp: "2026-08-28T13:30:00Z", source: "Ingestion Pipeline", type: "data_import", framework: "PCI", status: "verified", hash: "f8c2...3b6e" },
];

export default function EvidenceVault() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(evidenceRecords[0]);
  const [rawInput, setRawInput] = useState("");
  const [parsedOutput, setParsedOutput] = useState<string | null>(null);

  const handleParse = () => {
    if (!rawInput.trim()) return;
    setParsedOutput(JSON.stringify({
      event_type: "api_call",
      timestamp: new Date().toISOString(),
      source_ip: "10.0.4.12",
      action: "POST /api/v1/transactions",
      result: "cleared",
      risk_score: 12,
      framework_refs: ["CBN AML §4.1"],
      evidence_hash: "a3f2e8d1b4c7...",
    }, null, 2));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-mono font-bold text-white tracking-tight">Evidence Vault</h1>
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Cryptographically sealed audit evidence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Evidence List */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/[0.06]">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Evidence Records</h3>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-7 pl-7 pr-3 bg-black/40 border border-white/[0.06] font-mono text-[9px] text-white/50 placeholder:text-white/20 outline-none focus:border-white/10 transition-colors"
              />
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["ID", "Timestamp", "Source", "Type", "Framework", "Status"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-mono text-[8px] uppercase tracking-wider text-white/20 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {evidenceRecords.map((ev) => (
                  <tr
                    key={ev.id}
                    onClick={() => setSelected(ev)}
                    className={`border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors ${
                      selected.id === ev.id ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <td className="px-3 py-2 font-mono text-[10px] text-aegis-blue">{ev.id}</td>
                    <td className="px-3 py-2 font-mono text-[9px] text-white/30">{new Date(ev.timestamp).toLocaleString()}</td>
                    <td className="px-3 py-2 font-mono text-[9px] text-white/50">{ev.source}</td>
                    <td className="px-3 py-2">
                      <Badge variant="blue" className="text-[7px]">{ev.type}</Badge>
                    </td>
                    <td className="px-3 py-2 font-mono text-[9px] text-white/40">{ev.framework}</td>
                    <td className="px-3 py-2">
                      <Badge variant={ev.status === "verified" ? "green" : "amber"} className="text-[7px]">{ev.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Smart Parser */}
        <div className="bg-[#0A0A0A] border border-white/[0.06] p-4 space-y-4">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Smart Evidence Parser</h3>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste raw log, transaction data, or audit event..."
            className="w-full h-28 bg-black/40 border border-white/[0.06] p-3 font-mono text-[10px] text-white/50 placeholder:text-white/20 resize-none outline-none focus:border-white/10 transition-colors"
          />
          <button
            onClick={handleParse}
            className="w-full py-2 bg-aegis-green/10 border border-aegis-green/20 text-aegis-green font-mono text-[10px] uppercase tracking-wider hover:bg-aegis-green/20 transition-colors cursor-pointer"
          >
            Parse Evidence
          </button>
          {parsedOutput && (
            <div className="bg-black/40 border border-white/[0.04] p-3">
              <h4 className="font-mono text-[8px] uppercase text-white/25 mb-2">Parsed Output</h4>
              <pre className="font-mono text-[9px] text-aegis-green/70 overflow-x-auto whitespace-pre-wrap">{parsedOutput}</pre>
            </div>
          )}

          {/* Selected Evidence Detail */}
          <div className="pt-3 border-t border-white/[0.06]">
            <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/25 mb-2">Selected: {selected.id}</h4>
            <div className="space-y-2">
              {Object.entries(selected).filter(([k]) => k !== "id").map(([k, v]) => (
                <div key={k} className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/25">{k}</span>
                  <span className="text-white/50">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
