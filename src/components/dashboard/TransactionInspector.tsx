"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Filter, ArrowUpDown, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const transactions = Array.from({ length: 30 }, (_, i) => {
  const riskScore = Math.floor(Math.random() * 100);
  const statuses = ["CLEARED", "CLEARED", "CLEARED", "FLAGGED", "UNDER_REVIEW"] as const;
  return {
    id: `TX_${String(48000 + i).padStart(6, "0")}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    sender: `0x${Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    recipient: `0x${Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    amount: parseFloat((Math.random() * 100000).toFixed(2)),
    asset: "USD",
    riskScore,
    consensus: statuses[Math.floor(Math.random() * statuses.length)],
    jurisdiction: ["NG", "US", "GB", "DE", "SG"][Math.floor(Math.random() * 5)],
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export default function TransactionInspector() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<typeof transactions[0] | null>(null);

  const filtered = transactions.filter((t) => {
    const matchSearch = search === "" || t.id.includes(search) || t.sender.includes(search) || t.recipient.includes(search);
    const matchFilter = filter === "all" || t.consensus === filter;
    return matchSearch && matchFilter;
  });

  const riskColor = (r: number) => r < 30 ? "text-aegis-green" : r < 70 ? "text-aegis-amber" : "text-aegis-red";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono font-bold text-white tracking-tight">Transaction & AML Inspector</h1>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Forensic workspace for financial monitoring</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] text-white/50 font-mono text-[10px] hover:bg-white/[0.05] transition-colors cursor-pointer">
          <Download className="w-3 h-3" />
          Export Ledger
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by TX ID, wallet, amount..."
            className="w-full h-8 pl-9 pr-3 bg-[#0A0A0A] border border-white/[0.06] font-mono text-[10px] text-white/60 placeholder:text-white/20 outline-none focus:border-white/10 transition-colors"
          />
        </div>
        <div className="flex gap-1">
          {["all", "CLEARED", "FLAGGED", "UNDER_REVIEW"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider border transition-colors cursor-pointer ${
                filter === f
                  ? "bg-white/[0.06] border-white/10 text-white/80"
                  : "border-white/[0.04] text-white/25 hover:text-white/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-[#0A0A0A] border border-white/[0.06] overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#0A0A0A] z-10">
              <tr className="border-b border-white/[0.06]">
                {["Timestamp", "TX Hash", "Sender", "Recipient", "Amount", "Risk", "Status", "Action"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-wider text-white/20 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => setSelected(txn)}
                >
                  <td className="px-3 py-2 font-mono text-[10px] text-white/30">
                    {new Date(txn.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 font-mono text-[10px] text-aegis-blue">{txn.id}</td>
                  <td className="px-3 py-2 font-mono text-[9px] text-white/40 max-w-[100px] truncate">{txn.sender}</td>
                  <td className="px-3 py-2 font-mono text-[9px] text-white/40 max-w-[100px] truncate">{txn.recipient}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-white/80">${txn.amount.toLocaleString()}</td>
                  <td className={`px-3 py-2 font-mono text-[10px] font-bold ${riskColor(txn.riskScore)}`}>{txn.riskScore}</td>
                  <td className="px-3 py-2">
                    <Badge variant={txn.consensus === "CLEARED" ? "green" : txn.consensus === "FLAGGED" ? "red" : "amber"} className="text-[8px]">
                      {txn.consensus}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <button className="text-aegis-blue text-[9px] font-mono hover:underline cursor-pointer">Inspect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-0 right-0 w-[400px] h-[60vh] bg-[#0A0A0A] border-l border-t border-white/[0.08] z-50 overflow-y-auto"
        >
          <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-white">Transaction Deep-Dive</h3>
            <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/60 cursor-pointer font-mono text-xs">Close</button>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "TX Hash", value: selected.id },
                { label: "Amount", value: `$${selected.amount.toLocaleString()}` },
                { label: "Risk Score", value: selected.riskScore, color: riskColor(selected.riskScore) },
                { label: "Status", value: selected.consensus },
                { label: "Jurisdiction", value: selected.jurisdiction },
                { label: "Timestamp", value: new Date(selected.timestamp).toLocaleString() },
              ].map((f) => (
                <div key={f.label} className="bg-black/40 border border-white/[0.04] p-2">
                  <div className="font-mono text-[8px] uppercase text-white/25 mb-1">{f.label}</div>
                  <div className={`font-mono text-[10px] ${f.color || "text-white/70"}`}>{f.value}</div>
                </div>
              ))}
            </div>
            <div className="bg-black/40 border border-white/[0.04] p-3">
              <div className="font-mono text-[8px] uppercase text-white/25 mb-2">AML Flags</div>
              <div className="space-y-1">
                {selected.riskScore > 70 ? (
                  <>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-aegis-red">
                      <AlertTriangle className="w-3 h-3" /> Structuring pattern detected
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-aegis-amber">
                      <AlertTriangle className="w-3 h-3" /> Velocity threshold exceeded
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-[9px] font-mono text-aegis-green">
                    <CheckCircle className="w-3 h-3" /> No AML flags
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
