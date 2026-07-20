"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface EvidenceRecord {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  status: "processed" | "pending" | "failed";
  hash: string;
  framework: string;
}

const mockEvidence: EvidenceRecord[] = [
  {
    id: "ev-001",
    timestamp: "2026-07-20T14:23:07Z",
    source: "server-prod-01",
    type: "access-log",
    status: "processed",
    hash: "a3f8c92e...d1b4",
    framework: "SOC2",
  },
  {
    id: "ev-002",
    timestamp: "2026-07-20T14:22:41Z",
    source: "firewall-edge-03",
    type: "traffic-log",
    status: "processed",
    hash: "7c1e44b2...9f3a",
    framework: "ISO27001",
  },
  {
    id: "ev-003",
    timestamp: "2026-07-20T14:22:15Z",
    source: "db-cluster-02",
    type: "query-audit",
    status: "pending",
    hash: "pending...",
    framework: "GDPR",
  },
  {
    id: "ev-004",
    timestamp: "2026-07-20T14:21:56Z",
    source: "app-auth-service",
    type: "auth-event",
    status: "processed",
    hash: "e9d2f1c7...3b8e",
    framework: "SOC2",
  },
  {
    id: "ev-005",
    timestamp: "2026-07-20T14:21:33Z",
    source: "ci-pipeline-01",
    type: "deploy-record",
    status: "failed",
    hash: "ERROR: parse failure",
    framework: "HIPAA",
  },
  {
    id: "ev-006",
    timestamp: "2026-07-20T14:20:45Z",
    source: "encrypt-service",
    type: "crypto-audit",
    status: "processed",
    hash: "b4a7d9e3...1c6f",
    framework: "PCI-DSS",
  },
];

const statusVariant = {
  processed: "green" as const,
  pending: "amber" as const,
  failed: "red" as const,
};

export default function EvidenceView() {
  const { t } = useTranslation();
  const [rawInput, setRawInput] = useState("");
  const [parsedOutput, setParsedOutput] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  const handleParse = () => {
    if (!rawInput.trim()) return;
    setParsing(true);
    // Simulate AI parsing
    setTimeout(() => {
      setParsedOutput(JSON.stringify({
        event_type: "access_control",
        timestamp: new Date().toISOString(),
        source_ip: "192.168.1.42",
        action: "authentication_attempt",
        result: "success",
        user_agent: "Mozilla/5.0",
        risk_score: 0.12,
        framework_refs: ["SOC2-CC6.1", "ISO27001-A.9.2.1"],
        evidence_hash: "sha256:e3b0c44298fc1c14...",
      }, null, 2));
      setParsing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-aegis-green">
          // EVIDENCE ENGINE
        </span>
        <h1 className="font-mono text-2xl font-bold mt-1">{t.evidence.title}</h1>
      </div>

      {/* Evidence Ingestion Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Evidence Records</CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="green">6 Processed</Badge>
              <Badge variant="amber">1 Pending</Badge>
              <Badge variant="red">1 Failed</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    ID
                  </th>
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    Timestamp
                  </th>
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    Source
                  </th>
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    Type
                  </th>
                  <th className="text-center font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    Framework
                  </th>
                  <th className="text-center font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    Status
                  </th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    Hash
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockEvidence.map((ev) => (
                  <tr
                    key={ev.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="font-mono text-xs text-aegis-blue py-3 px-2">
                      {ev.id}
                    </td>
                    <td className="font-mono text-xs text-white/50 py-3 px-2">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="font-mono text-xs text-white/70 py-3 px-2">
                      {ev.source}
                    </td>
                    <td className="font-mono text-xs text-white/60 py-3 px-2">
                      {ev.type}
                    </td>
                    <td className="text-center py-3 px-2">
                      <Badge variant="muted">{ev.framework}</Badge>
                    </td>
                    <td className="text-center py-3 px-2">
                      <Badge variant={statusVariant[ev.status]}>
                        {ev.status}
                      </Badge>
                    </td>
                    <td className="text-right font-mono text-[10px] text-aegis-muted py-3 px-2">
                      {ev.hash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Smart Evidence Parser */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Smart Evidence Parser (Llama 3.2:3B)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-[10px] text-aegis-muted mb-3">
              Paste raw log output or system text. The local AI will extract structured
              compliance evidence matching database schemas.
            </p>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste raw log data, server output, or system text here..."
              className="w-full h-32 bg-black border border-white/10 p-3 font-mono text-xs text-white/70 placeholder:text-aegis-muted/50 focus:outline-none focus:border-aegis-green/50 resize-none"
            />
            <Button
              onClick={handleParse}
              variant="default"
              size="sm"
              className="mt-3"
              disabled={parsing}
            >
              {parsing ? "Parsing..." : "Parse Evidence"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parsed Output</CardTitle>
          </CardHeader>
          <CardContent>
            {parsedOutput ? (
              <pre className="bg-black border border-white/[0.06] p-4 font-mono text-[11px] text-aegis-green/80 overflow-x-auto max-h-48 overflow-y-auto">
                {parsedOutput}
              </pre>
            ) : (
              <div className="bg-black border border-white/[0.06] p-4 font-mono text-[11px] text-aegis-muted/30 h-48 flex items-center justify-center">
                Output will appear here after parsing...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
