"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Play, CheckCircle, XCircle, AlertTriangle, Shield, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const attackVectors = [
  { id: "stolen_api_key", name: "Stolen API Key Exfiltration", description: "Simulate unauthorized data extraction using compromised API credentials", status: "passed", detectionTime: "1.2s", severity: "critical" },
  { id: "gdpr_exfiltration", name: "GDPR Data Exfiltration", description: "Attempt to extract PII data through unmonitored API endpoints", status: "passed", detectionTime: "0.8s", severity: "critical" },
  { id: "log_tampering", name: "Log Tampering & Hash Manipulation", description: "Modify audit log entries and attempt to re-seal the ledger", status: "failed", detectionTime: "3.4s", severity: "high" },
  { id: "aml_stress", name: "High-Velocity AML Bypass", description: "Flood system with sub-threshold transactions to evade detection", status: "passed", detectionTime: "0.3s", severity: "critical" },
  { id: "privilege_escalation", name: "Privilege Escalation Attempt", description: "Attempt to elevate from read-only to admin via RBAC bypass", status: "passed", detectionTime: "0.5s", severity: "high" },
  { id: "ai_poisoning", name: "AI Model Poisoning", description: "Inject adversarial prompts to manipulate agent consensus decisions", status: "warned", detectionTime: "2.1s", severity: "medium" },
];

export default function ChaosAuditor() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(attackVectors);
  const [lastRun, setLastRun] = useState("2026-08-28 14:32 UTC");

  const handleRunAudit = () => {
    setRunning(true);
    setResults(attackVectors.map(v => ({ ...v, status: "pending" })));
    setTimeout(() => {
      setResults(attackVectors);
      setRunning(false);
      setLastRun(new Date().toISOString());
    }, 3000);
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case "passed": return <CheckCircle className="w-4 h-4 text-aegis-green" />;
      case "failed": return <XCircle className="w-4 h-4 text-aegis-red" />;
      case "warned": return <AlertTriangle className="w-4 h-4 text-aegis-amber" />;
      default: return <Clock className="w-4 h-4 text-white/20 animate-spin" />;
    }
  };

  const passed = results.filter(r => r.status === "passed").length;
  const failed = results.filter(r => r.status === "failed").length;
  const warned = results.filter(r => r.status === "warned").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono font-bold text-white tracking-tight">Chaos Auditor</h1>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Adversarial compliance hardship testing</p>
        </div>
        <button
          onClick={handleRunAudit}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-aegis-amber/10 border border-aegis-amber/20 text-aegis-amber font-mono text-[10px] uppercase tracking-wider hover:bg-aegis-amber/20 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Zap className={`w-3.5 h-3.5 ${running ? "animate-pulse" : ""}`} />
          {running ? "Running Audit..." : "Launch Chaos Audit"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#0A0A0A] border border-white/[0.06] p-3 text-center">
          <div className="font-mono text-2xl font-bold text-white">{results.length}</div>
          <div className="font-mono text-[9px] text-white/30 uppercase">Tests Run</div>
        </div>
        <div className="bg-[#0A0A0A] border border-aegis-green/20 p-3 text-center">
          <div className="font-mono text-2xl font-bold text-aegis-green">{passed}</div>
          <div className="font-mono text-[9px] text-white/30 uppercase">Passed</div>
        </div>
        <div className="bg-[#0A0A0A] border border-aegis-red/20 p-3 text-center">
          <div className="font-mono text-2xl font-bold text-aegis-red">{failed}</div>
          <div className="font-mono text-[9px] text-white/30 uppercase">Failed</div>
        </div>
        <div className="bg-[#0A0A0A] border border-aegis-amber/20 p-3 text-center">
          <div className="font-mono text-2xl font-bold text-aegis-amber">{warned}</div>
          <div className="font-mono text-[9px] text-white/30 uppercase">Warnings</div>
        </div>
      </div>

      <p className="font-mono text-[9px] text-white/20">Last run: {lastRun}</p>

      {/* Attack Vector Results */}
      <div className="space-y-3">
        {results.map((vec, i) => (
          <motion.div
            key={vec.id}
            initial={running ? { opacity: 0.5 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: running ? i * 0.3 : 0 }}
            className={`bg-[#0A0A0A] border p-4 ${
              vec.status === "passed" ? "border-aegis-green/15" :
              vec.status === "failed" ? "border-aegis-red/15" :
              vec.status === "warned" ? "border-aegis-amber/15" :
              "border-white/[0.06]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {statusIcon(vec.status)}
                <div>
                  <h4 className="font-mono text-[11px] font-bold text-white/80">{vec.name}</h4>
                  <p className="font-mono text-[9px] text-white/35 mt-1">{vec.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={vec.severity === "critical" ? "red" : vec.severity === "high" ? "amber" : "blue"} className="text-[7px]">
                  {vec.severity}
                </Badge>
                {vec.status !== "pending" && (
                  <span className="font-mono text-[9px] text-white/25">{vec.detectionTime}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hardship Report */}
      {!running && passed + failed + warned === results.length && (
        <div className="bg-[#0A0A0A] border border-white/[0.06] p-4">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">Hardship Report Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-mono text-[9px] text-white/30 mb-2">System Resilience</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/40">Detection Rate</span>
                  <span className="text-aegis-green">{((passed + warned) / results.length * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/40">Mean Detection Time</span>
                  <span className="text-white/60">1.38s</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/40">Control Gaps</span>
                  <span className="text-aegis-red">{failed}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-mono text-[9px] text-white/30 mb-2">Recommendations</h4>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 text-[9px] font-mono text-white/40">
                  <span className="text-aegis-red">•</span>
                  Implement real-time hash verification on log writes
                </div>
                <div className="flex items-start gap-2 text-[9px] font-mono text-white/40">
                  <span className="text-aegis-amber">•</span>
                  Add adversarial prompt filtering to AI ingestion pipeline
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
