"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "warning" | "success" | "error";
  source: string;
  message: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "14:23:07.891",
    type: "success",
    source: "CROSS-MAPPER",
    message: "SOC2 → ISO27001 control mapping completed (847 controls)",
  },
  {
    id: "2",
    timestamp: "14:23:05.432",
    type: "info",
    source: "EVIDENCE",
    message: "Ingested 23 new log entries from server-prod-01",
  },
  {
    id: "3",
    timestamp: "14:22:58.109",
    type: "warning",
    source: "GUARDRAIL",
    message: "PR #847: Potential GDPR Article 17 violation detected",
  },
  {
    id: "4",
    timestamp: "14:22:41.556",
    type: "success",
    source: "LEDGER",
    message: "Chain-of-custody hash verified: a3f8c9...e2d1",
  },
  {
    id: "5",
    timestamp: "14:22:33.201",
    type: "info",
    source: "ORACLE",
    message: "Regulation query resolved: 'SOX Section 404 requirements'",
  },
  {
    id: "6",
    timestamp: "14:22:15.778",
    type: "error",
    source: "CHAOS",
    message: "Vulnerability found: evidence tampering possible in module-3",
  },
  {
    id: "7",
    timestamp: "14:22:01.445",
    type: "success",
    source: "CONTROL-PLANE",
    message: "Transaction block verified: policy-enforcement-gate passed",
  },
  {
    id: "8",
    timestamp: "14:21:56.112",
    type: "info",
    source: "EVIDENCE",
    message: "Parser: extracted 142 structured records from raw syslogs",
  },
];

const typeStyles = {
  info: "text-aegis-blue",
  warning: "text-aegis-amber",
  success: "text-aegis-green",
  error: "text-aegis-red",
};

export default function ActivityLog() {
  const [logs, setLogs] = useState(mockLogs);

  // Simulate live log feed
  useEffect(() => {
    const interval = setInterval(() => {
      const sources = ["CROSS-MAPPER", "EVIDENCE", "GUARDRAIL", "LEDGER", "ORACLE", "CHAOS", "CONTROL-PLANE"];
      const types: LogEntry["type"][] = ["info", "warning", "success", "error"];
      const messages = [
        "Control mapping delta detected — updating cross-references",
        "New evidence artifact accepted and timestamped",
        "Guardrail scan cleared: no policy violations",
        "Ledger integrity check: all hashes verified",
        "Oracle response cached: 3 regulatory frameworks queried",
        "Chaos auditor: randomized injection test passed",
        "Control plane: data signal intercepted and evaluated",
      ];

      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString().split("T")[1].split(".")[0] + "." + String(Date.now() % 1000).padStart(3, "0"),
        type: types[Math.floor(Math.random() * types.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-aegis-surface border border-white/[0.06] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
          Live Activity Feed
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-aegis-green animate-pulse" />
          <span className="font-mono text-[9px] text-aegis-green/60">STREAMING</span>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {logs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={index === 0 ? { opacity: 0, x: -10 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors font-mono text-[11px] flex gap-3"
          >
            <span className="text-aegis-muted/50 w-20 flex-shrink-0">
              {log.timestamp}
            </span>
            <span className={cn("w-28 flex-shrink-0 uppercase", typeStyles[log.type])}>
              [{log.source}]
            </span>
            <span className="text-white/60 break-all">{log.message}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
