"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ControlMapping {
  id: string;
  controlId: string;
  description: string;
  soc2: string | null;
  iso27001: string | null;
  gdpr: string | null;
  hipaa: string | null;
  status: "mapped" | "partial" | "unmapped";
  confidence: number;
}

const mockMappings: ControlMapping[] = [
  {
    id: "1",
    controlId: "CC6.1",
    description: "Logical access controls for system resources",
    soc2: "CC6.1",
    iso27001: "A.9.2.1",
    gdpr: "Art. 32(1)(b)",
    hipaa: "§164.312(a)(1)",
    status: "mapped",
    confidence: 98,
  },
  {
    id: "2",
    controlId: "CC7.2",
    description: "Monitoring of system components for anomalies",
    soc2: "CC7.2",
    iso27001: "A.12.4.1",
    gdpr: "Art. 32(1)(d)",
    hipaa: "§164.312(b)",
    status: "mapped",
    confidence: 95,
  },
  {
    id: "3",
    controlId: "CC8.1",
    description: "Change management and deployment controls",
    soc2: "CC8.1",
    iso27001: "A.12.1.4",
    gdpr: "Art. 25",
    hipaa: null,
    status: "partial",
    confidence: 82,
  },
  {
    id: "4",
    controlId: "P6.1",
    description: "Data retention and disposal policies",
    soc2: null,
    iso27001: "A.8.3.2",
    gdpr: "Art. 17",
    hipaa: "§164.530(j)",
    status: "mapped",
    confidence: 91,
  },
  {
    id: "5",
    controlId: "A.14.2.1",
    description: "Secure development lifecycle controls",
    soc2: "CC6.3",
    iso27001: "A.14.2.1",
    gdpr: null,
    hipaa: null,
    status: "partial",
    confidence: 76,
  },
];

const statusVariant = {
  mapped: "green" as const,
  partial: "amber" as const,
  unmapped: "red" as const,
};

export default function ComplianceView() {
  const { t } = useTranslation();
  const [selectedFramework, setSelectedFramework] = useState<string>("all");

  const frameworks = ["all", "soc2", "iso27001", "gdpr", "hipaa"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-aegis-green">
            // COMPLIANCE ENGINE
          </span>
          <h1 className="font-mono text-2xl font-bold mt-1">
            {t.compliance.title}
          </h1>
        </div>
        <Button variant="default" size="sm">
          Run Cross-Mapping
        </Button>
      </div>

      {/* Framework Filter */}
      <div className="flex gap-2">
        {frameworks.map((fw) => (
          <button
            key={fw}
            onClick={() => setSelectedFramework(fw)}
            className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border transition-colors cursor-pointer ${
              selectedFramework === fw
                ? "border-aegis-green/40 text-aegis-green bg-aegis-green/[0.05]"
                : "border-white/10 text-aegis-muted hover:text-white hover:border-white/20"
            }`}
          >
            {fw === "all" ? "All Frameworks" : fw.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Control Mapping Table */}
      <Card>
        <CardHeader>
          <CardTitle>Control Cross-Reference Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    {t.compliance.controls}
                  </th>
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    Description
                  </th>
                  <th className="text-center font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    SOC 2
                  </th>
                  <th className="text-center font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    ISO 27001
                  </th>
                  <th className="text-center font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    GDPR
                  </th>
                  <th className="text-center font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    HIPAA
                  </th>
                  <th className="text-center font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    Status
                  </th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-wider text-aegis-muted py-3 px-2">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockMappings.map((mapping) => (
                  <tr
                    key={mapping.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="font-mono text-xs text-aegis-green py-3 px-2">
                      {mapping.controlId}
                    </td>
                    <td className="text-xs text-white/60 py-3 px-2 max-w-xs">
                      {mapping.description}
                    </td>
                    <td className="text-center font-mono text-xs py-3 px-2">
                      {mapping.soc2 ? (
                        <span className="text-aegis-green">{mapping.soc2}</span>
                      ) : (
                        <span className="text-aegis-muted/30">—</span>
                      )}
                    </td>
                    <td className="text-center font-mono text-xs py-3 px-2">
                      {mapping.iso27001 ? (
                        <span className="text-aegis-blue">{mapping.iso27001}</span>
                      ) : (
                        <span className="text-aegis-muted/30">—</span>
                      )}
                    </td>
                    <td className="text-center font-mono text-xs py-3 px-2">
                      {mapping.gdpr ? (
                        <span className="text-aegis-amber">{mapping.gdpr}</span>
                      ) : (
                        <span className="text-aegis-muted/30">—</span>
                      )}
                    </td>
                    <td className="text-center font-mono text-xs py-3 px-2">
                      {mapping.hipaa ? (
                        <span className="text-aegis-red">{mapping.hipaa}</span>
                      ) : (
                        <span className="text-aegis-muted/30">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-2">
                      <Badge variant={statusVariant[mapping.status]}>
                        {mapping.status}
                      </Badge>
                    </td>
                    <td className="text-right font-mono text-xs text-white/50 py-3 px-2">
                      {mapping.confidence}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mapping Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Fully Mapped", count: "1,847", pct: "75.4%", color: "green" },
          { label: "Partially Mapped", count: "412", pct: "16.8%", color: "amber" },
          { label: "Unmapped", count: "188", pct: "7.7%", color: "red" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <div className="text-center py-2">
                <div className={`font-mono text-3xl font-bold text-${stat.color === "green" ? "aegis-green" : stat.color === "amber" ? "aegis-amber" : "aegis-red"}`}>
                  {stat.count}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-aegis-muted mt-1">
                  {stat.label}
                </div>
                <div className="font-mono text-xs text-white/40 mt-1">{stat.pct} of total</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
