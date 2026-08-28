"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Brain, Shield, AlertTriangle, Terminal } from "lucide-react";

type ActiveTab = "oracle" | "guardrail" | "chaos";

export default function AIView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>("oracle");
  const [query, setQuery] = useState("");
  const [oracleResponse, setOracleResponse] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleQuery = () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setOracleResponse(null);

    setTimeout(() => {
      setOracleResponse(
        JSON.stringify(
          {
            query: query,
            framework: "SOC 2 Type II",
            relevant_controls: [
              {
                id: "CC6.1",
                title: "Logical Access Controls",
                relevance: 0.95,
                summary:
                  "The entity implements logical access security measures over protected information assets to protect them from unauthorized access.",
              },
              {
                id: "CC6.3",
                title: "Role-Based Access Controls",
                relevance: 0.87,
                summary:
                  "The entity authorizes, modifies, or removes access to data, software, functions, and other protected information assets based on roles.",
              },
            ],
            recommendations: [
              "Review current RBAC policies against SOC2 CC6.1 requirements",
              "Implement multi-factor authentication for privileged access",
              "Document access provisioning and de-provisioning procedures",
            ],
            confidence: 0.92,
            model: "gemma4:12b",
            latency_ms: 347,
          },
          null,
          2
        )
      );
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-aegis-green">
          // AI INTELLIGENCE SUITE
        </span>
        <h1 className="font-mono text-2xl font-bold mt-1">{t.ai.title}</h1>
        <p className="font-mono text-[11px] text-aegis-muted mt-1">
          Powered by Gemma 4 12B via Ollama — all queries processed locally
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-px bg-white/[0.04] w-fit">
        {[
          { key: "oracle" as const, label: t.ai.oracle, icon: Brain },
          { key: "guardrail" as const, label: t.ai.guardrail, icon: Shield },
          { key: "chaos" as const, label: t.ai.chaosAudit, icon: AlertTriangle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === key
                ? "bg-aegis-surface text-aegis-green border-b-2 border-aegis-green"
                : "text-aegis-muted hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Oracle Tab */}
      {activeTab === "oracle" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regulation Oracle Query</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.ai.queryPlaceholder}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                />
                <Button
                  onClick={handleQuery}
                  variant="default"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? t.ai.analyzing : "Query Oracle"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {oracleResponse && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Oracle Response</CardTitle>
                  <Badge variant="green">347ms · gemma4:12b</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-black border border-white/[0.06] p-4 font-mono text-[11px] text-aegis-green/80 overflow-x-auto max-h-96 overflow-y-auto">
                  {oracleResponse}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Guardrail Tab */}
      {activeTab === "guardrail" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>PR Guardrail Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-[10px] text-aegis-muted mb-4">
                Paste a PR description or code change summary. The guardrail agent
                will scan for compliance vulnerabilities before merge.
              </p>
              <textarea
                placeholder="Paste PR description, commit message, or code change summary..."
                className="w-full h-32 bg-black border border-white/10 p-3 font-mono text-xs text-white/70 placeholder:text-aegis-muted/50 focus:outline-none focus:border-aegis-green/50 resize-none"
              />
              <Button variant="default" size="sm" className="mt-3">
                Run Guardrail Scan
              </Button>
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Guardrail Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    pr: "#847 — Add user data export endpoint",
                    flags: 2,
                    severity: "high",
                    detail: "GDPR Art.17 potential violation: data deletion not enforced",
                  },
                  {
                    pr: "#845 — Update auth middleware",
                    flags: 0,
                    severity: "pass",
                    detail: "No compliance issues detected",
                  },
                  {
                    pr: "#843 — Add logging to payment service",
                    flags: 1,
                    severity: "medium",
                    detail: "PCI-DSS: potential PII in payment logs",
                  },
                ].map((scan) => (
                  <div
                    key={scan.pr}
                    className="border border-white/[0.06] p-4 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-white/70">{scan.pr}</span>
                      <Badge
                        variant={
                          scan.severity === "pass"
                            ? "green"
                            : scan.severity === "high"
                              ? "red"
                              : "amber"
                        }
                      >
                        {scan.flags} flags
                      </Badge>
                    </div>
                    <p className="font-mono text-[10px] text-aegis-muted">
                      {scan.detail}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chaos Auditor Tab */}
      {activeTab === "chaos" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chaos Monkey Auditor</CardTitle>
                <Button variant="danger" size="sm">
                  <AlertTriangle className="w-3 h-3 mr-2" />
                  Run Adversarial Audit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-[10px] text-aegis-muted mb-4">
                Runs randomized adversarial tests against mockup activity records.
                Generates weekly Hardship Reports of discovered vulnerabilities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    test: "Evidence Tampering Injection",
                    result: "PASS",
                    detail: "All hash chains remained intact",
                  },
                  {
                    test: "Control Mapping Corruption",
                    result: "PASS",
                    detail: "Cross-references validated post-injection",
                  },
                  {
                    test: "Ledger Replay Attack",
                    result: "FAIL",
                    detail: "Timestamp gap detected in entry #4,247",
                  },
                  {
                    test: "Privilege Escalation Simulation",
                    result: "PASS",
                    detail: "RBAC policies enforced correctly",
                  },
                  {
                    test: "Data Exfiltration Simulation",
                    result: "WARN",
                    detail: "Unusual query pattern detected, review recommended",
                  },
                  {
                    test: "Schema Validation Bypass",
                    result: "PASS",
                    detail: "All malformed inputs rejected by parser",
                  },
                ].map((test) => (
                  <div
                    key={test.test}
                    className="border border-white/[0.06] p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-white/70">
                        {test.test}
                      </span>
                      <Badge
                        variant={
                          test.result === "PASS"
                            ? "green"
                            : test.result === "FAIL"
                              ? "red"
                              : "amber"
                        }
                      >
                        {test.result}
                      </Badge>
                    </div>
                    <p className="font-mono text-[9px] text-aegis-muted">
                      {test.detail}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
