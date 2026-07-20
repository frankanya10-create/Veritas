"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Link2, CheckCircle, XCircle } from "lucide-react";

interface LedgerEntry {
  id: number;
  timestamp: string;
  data: string;
  hash: string;
  previousHash: string;
  verified: boolean;
  type: "evidence" | "control" | "audit" | "system";
}

function generateMockLedger(): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  const types: LedgerEntry["type"][] = ["evidence", "control", "audit", "system"];

  for (let i = 1; i <= 12; i++) {
    const hashChars = "0123456789abcdef";
    const genHash = () =>
      Array.from({ length: 16 }, () => hashChars[Math.floor(Math.random() * 16)]).join("");

    entries.push({
      id: i,
      timestamp: new Date(Date.now() - i * 300000).toISOString(),
      data: [
        "Evidence artifact ingested from server-prod-01",
        "SOC2 CC6.1 control status updated to passing",
        "Chaos auditor weekly scan completed",
        "Ledger integrity verification passed",
        "PR #847 guardrail flag recorded",
        "GDPR evidence mapping updated",
        "Cross-mapper: ISO27001 delta detected",
        "Access control audit trail appended",
        "Evidence parser batch completed (142 records)",
        "Chaos test: ledger replay attack blocked",
        "System health check recorded",
        "New framework control baseline established",
      ][i - 1],
      hash: genHash(),
      previousHash: i === 1 ? "0000000000000000" : entries[i - 2]?.hash || "0000000000000000",
      verified: i !== 7, // entry 7 is "tampered" for demo
      type: types[i % 4],
    });
  }
  return entries;
}

const typeVariant: Record<LedgerEntry["type"], "green" | "blue" | "amber" | "muted"> = {
  evidence: "green",
  control: "blue",
  audit: "amber",
  system: "muted",
};

export default function LedgerView() {
  const { t } = useTranslation();
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    setLedger(generateMockLedger());
  }, []);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-aegis-green">
            // TAMPER-EVIDENT LEDGER
          </span>
          <h1 className="font-mono text-2xl font-bold mt-1">{t.ledger.title}</h1>
        </div>
        <Button
          onClick={handleVerify}
          variant="default"
          size="sm"
          disabled={verifying}
        >
          <Link2 className="w-3 h-3 mr-2" />
          {verifying ? "Verifying..." : "Verify Chain"}
        </Button>
      </div>

      {/* Chain Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.04]">
        {[
          { label: "Total Entries", value: "12", color: "text-white" },
          { label: "Verified", value: "11", color: "text-aegis-green" },
          { label: "Tampered", value: "1", color: "text-aegis-red" },
          { label: "Chain Integrity", value: "92%", color: "text-aegis-amber" },
        ].map((stat) => (
          <div key={stat.label} className="bg-black p-4 text-center">
            <div className={`font-mono text-xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-aegis-muted mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Ledger Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Chain of Custody</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-px">
            {ledger.map((entry, index) => (
              <div
                key={entry.id}
                className={`border-l-2 ${
                  entry.verified
                    ? "border-aegis-green/30 hover:border-aegis-green/60"
                    : "border-aegis-red/60 hover:border-aegis-red"
                } bg-white/[0.01] hover:bg-white/[0.02] p-4 transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-aegis-muted/50 w-8">
                      #{entry.id}
                    </span>
                    <Badge variant={typeVariant[entry.type]}>
                      {entry.type}
                    </Badge>
                    {entry.verified ? (
                      <CheckCircle className="w-3.5 h-3.5 text-aegis-green" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-aegis-red" />
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-aegis-muted">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="font-mono text-xs text-white/60 mb-2 ml-11">
                  {entry.data}
                </p>
                <div className="flex gap-6 ml-11 font-mono text-[9px]">
                  <span className="text-aegis-muted/50">
                    Hash: <span className={entry.verified ? "text-aegis-green/60" : "text-aegis-red/60"}>{entry.hash}</span>
                  </span>
                  <span className="text-aegis-muted/30">
                    Prev: {entry.previousHash}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
