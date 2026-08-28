"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Zap,
  Server,
  Database,
  Lock,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const frameworks = [
  { name: "CBN AML / KYT", score: 96, status: "active", lastAudit: "2 min ago", rules: 47 },
  { name: "SOC 2 Type II", score: 94, status: "active", lastAudit: "5 min ago", rules: 114 },
  { name: "ISO 27001", score: 87, status: "active", lastAudit: "12 min ago", rules: 93 },
  { name: "GDPR", score: 91, status: "active", lastAudit: "8 min ago", rules: 99 },
  { name: "PCI-DSS v4.0", score: 82, status: "warning", lastAudit: "15 min ago", rules: 300 },
  { name: "HIPAA", score: 78, status: "warning", lastAudit: "20 min ago", rules: 45 },
];

const services = [
  { name: "Auth Server", risk: "low", status: "healthy" },
  { name: "Payment Gateway", risk: "medium", status: "degraded" },
  { name: "Database Cluster", risk: "low", status: "healthy" },
  { name: "API Gateway", risk: "low", status: "healthy" },
  { name: "Ollama Inference", risk: "low", status: "healthy" },
  { name: "Webhook Dispatcher", risk: "high", status: "failing" },
];

const generateTxn = (id: number) => {
  const statuses = ["CLEARED", "CLEARED", "CLEARED", "FLAGGED", "DEBATING"] as const;
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const amount = (Math.random() * 50000 + 100).toFixed(2);
  const hash = `TX_${String(id).padStart(6, "0")}`;
  const now = new Date();
  return {
    id: hash,
    amount: `$${Number(amount).toLocaleString()}`,
    status,
    sender: `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    receiver: `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`,
    riskScore: Math.floor(Math.random() * 100),
  };
};

export default function CommandCenter() {
  const [transactions, setTransactions] = useState(() =>
    Array.from({ length: 12 }, (_, i) => generateTxn(48192 + i))
  );
  const [metrics, setMetrics] = useState({
    complianceScore: 91,
    ingestionRate: 1420,
    flaggedAnomalies: 23,
    passed: 94,
    flagged: 4.2,
    escalated: 1.8,
  });
  const [selectedTxn, setSelectedTxn] = useState<typeof transactions[0] | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Simulate live transaction feed
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => {
        const newTxn = generateTxn(Date.now() % 1000000);
        return [newTxn, ...prev.slice(0, 19)];
      });
      setMetrics(prev => ({
        ...prev,
        ingestionRate: Math.max(800, Math.min(2200, prev.ingestionRate + Math.floor((Math.random() - 0.5) * 100))),
        flaggedAnomalies: Math.max(15, Math.min(40, prev.flaggedAnomalies + Math.floor((Math.random() - 0.5) * 3))),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = (s: string) => {
    switch (s) {
      case "CLEARED": return "green";
      case "FLAGGED": return "red";
      case "DEBATING": return "amber";
      default: return "muted";
    }
  };

  const riskColor = (r: number) => {
    if (r < 30) return "text-aegis-green";
    if (r < 70) return "text-aegis-amber";
    return "text-aegis-red";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Real-time compliance posture & telemetry</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-aegis-green animate-pulse" />
          <span className="text-[10px] font-mono text-white/30">Live Feed Active</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Compliance Score", value: `${metrics.complianceScore}%`, icon: Shield, color: "green", change: "+2.1%" },
          { label: "Ingestion Rate", value: `${metrics.ingestionRate.toLocaleString()}/s`, icon: Activity, color: "blue", change: "Live" },
          { label: "Flagged Anomalies", value: metrics.flaggedAnomalies, icon: AlertTriangle, color: "amber", change: "-3" },
          { label: "Agent Verdicts", value: `${metrics.passed}% Pass`, icon: CheckCircle, color: "green", change: `${metrics.flagged}% Flag` },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-[#0A0A0A] border border-white/[0.06] p-4 hover:border-${m.color === "green" ? "aegis-green" : m.color === "blue" ? "aegis-blue" : m.color === "amber" ? "aegis-amber" : "aegis-red"}/20 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <m.icon className={`w-4 h-4 ${m.color === "green" ? "text-aegis-green" : m.color === "blue" ? "text-aegis-blue" : m.color === "amber" ? "text-aegis-amber" : "text-aegis-red"}`} />
              <span className="text-[9px] font-mono text-white/20">{m.change}</span>
            </div>
            <div className="font-mono text-xl font-bold text-white mb-1">{m.value}</div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-white/30">{m.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Framework Health */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/[0.06] p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Framework Health</h3>
            <Badge variant="green" className="text-[8px]">All Active</Badge>
          </div>
          <div className="space-y-2">
            {frameworks.map((fw) => (
              <div key={fw.name} className="flex items-center gap-4 p-2 hover:bg-white/[0.02] transition-colors">
                <div className="w-32 font-mono text-[10px] text-white/60">{fw.name}</div>
                <div className="flex-1 h-1.5 bg-white/[0.04] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fw.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${fw.score >= 90 ? "bg-aegis-green" : fw.score >= 80 ? "bg-aegis-amber" : "bg-aegis-red"}`}
                  />
                </div>
                <div className={`font-mono text-[11px] font-bold ${fw.score >= 90 ? "text-aegis-green" : fw.score >= 80 ? "text-aegis-amber" : "text-aegis-red"}`}>
                  {fw.score}%
                </div>
                <div className="font-mono text-[9px] text-white/20 w-16 text-right">{fw.lastAudit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Topology */}
        <div className="bg-[#0A0A0A] border border-white/[0.06] p-4">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-4">Service Risk Map</h3>
          <div className="space-y-2">
            {services.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between p-2 border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${svc.risk === "low" ? "bg-aegis-green" : svc.risk === "medium" ? "bg-aegis-amber" : "bg-aegis-red"}`} />
                  <span className="font-mono text-[10px] text-white/60">{svc.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] uppercase ${svc.risk === "low" ? "text-aegis-green" : svc.risk === "medium" ? "text-aegis-amber" : "text-aegis-red"}`}>
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Transaction Feed */}
      <div className="bg-[#0A0A0A] border border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-aegis-green" />
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Live Transaction Interception</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-aegis-green animate-pulse" />
            <span className="font-mono text-[9px] text-white/20">{transactions.length} events</span>
          </div>
        </div>
        <div ref={feedRef} className="max-h-[320px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Time", "Event ID", "Amount", "Risk", "Status", "Sender", "Action"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-mono text-[9px] uppercase tracking-wider text-white/20 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, i) => (
                <motion.tr
                  key={txn.id}
                  initial={i === 0 ? { opacity: 0, x: -10 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => setSelectedTxn(txn)}
                >
                  <td className="px-4 py-2 font-mono text-[10px] text-white/30">{txn.time}</td>
                  <td className="px-4 py-2 font-mono text-[10px] text-white/60">{txn.id}</td>
                  <td className="px-4 py-2 font-mono text-[10px] text-white/80">{txn.amount}</td>
                  <td className={`px-4 py-2 font-mono text-[10px] font-bold ${riskColor(txn.riskScore)}`}>{txn.riskScore}</td>
                  <td className="px-4 py-2">
                    <Badge variant={statusColor(txn.status) as any} className="text-[8px]">{txn.status}</Badge>
                  </td>
                  <td className="px-4 py-2 font-mono text-[9px] text-white/30">{txn.sender}</td>
                  <td className="px-4 py-2">
                    <button className="text-[9px] font-mono text-aegis-blue hover:text-aegis-blue/80 transition-colors cursor-pointer">
                      Inspect
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Drawer */}
      {selectedTxn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 right-0 w-[420px] h-[70vh] bg-[#0A0A0A] border-l border-t border-white/[0.08] z-50 overflow-y-auto"
        >
          <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
            <div>
              <h3 className="font-mono text-xs font-bold text-white">Forensic Inspection</h3>
              <p className="font-mono text-[9px] text-white/30">{selectedTxn.id}</p>
            </div>
            <button onClick={() => setSelectedTxn(null)} className="text-white/30 hover:text-white/60 cursor-pointer font-mono text-xs">
              Close
            </button>
          </div>
          <div className="p-4 space-y-4">
            {/* Raw Payload */}
            <div className="bg-black/40 border border-white/[0.06] p-3">
              <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-2">Raw Payload</h4>
              <pre className="font-mono text-[10px] text-aegis-green/70 overflow-x-auto">
{JSON.stringify({
  transaction_id: selectedTxn.id,
  amount: selectedTxn.amount,
  sender: selectedTxn.sender,
  receiver: selectedTxn.receiver,
  risk_score: selectedTxn.riskScore,
  status: selectedTxn.status,
  timestamp: new Date().toISOString(),
}, null, 2)}
              </pre>
            </div>

            {/* Agent Reasoning */}
            <div className="bg-black/40 border border-white/[0.06] p-3">
              <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-2">Agent Reasoning</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="red" className="text-[8px]">Prosecutor</Badge>
                  <span className="font-mono text-[10px] text-white/50">
                    {selectedTxn.riskScore > 50 ? "Flagged: elevated risk score exceeds threshold" : "No violations detected"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="green" className="text-[8px]">Defense</Badge>
                  <span className="font-mono text-[10px] text-white/50">
                    {selectedTxn.riskScore > 50 ? "Mitigated: historical pattern consistent" : "Cleared: normal activity baseline"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="blue" className="text-[8px]">Judge</Badge>
                  <span className="font-mono text-[10px] text-white/50">
                    Consensus: {selectedTxn.riskScore > 70 ? "ESCALATE" : selectedTxn.riskScore > 40 ? "SPLIT" : "PASS"} (confidence: {(0.6 + Math.random() * 0.35).toFixed(2)})
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-aegis-red/10 border border-aegis-red/20 text-aegis-red font-mono text-[10px] uppercase tracking-wider hover:bg-aegis-red/20 transition-colors cursor-pointer">
                Freeze Transaction
              </button>
              <button className="flex-1 py-2 bg-white/[0.03] border border-white/[0.06] text-white/50 font-mono text-[10px] uppercase tracking-wider hover:bg-white/[0.05] transition-colors cursor-pointer">
                Add to Blacklist
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
