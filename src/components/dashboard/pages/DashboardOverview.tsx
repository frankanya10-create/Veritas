"use client";

import {
  Shield,
  FileCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import ActivityLog from "@/components/dashboard/ActivityLog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n/useTranslation";

const frameworks = [
  { name: "SOC 2 Type II", score: 94, status: "active" as const },
  { name: "ISO 27001:2022", score: 87, status: "active" as const },
  { name: "GDPR", score: 91, status: "active" as const },
  { name: "HIPAA", score: 78, status: "review" as const },
  { name: "PCI-DSS v4.0", score: 82, status: "active" as const },
];

export default function DashboardOverview() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-aegis-green">
          // SYSTEM OVERVIEW
        </span>
        <h1 className="font-mono text-2xl font-bold mt-1">
          {t.dashboard.complianceScore}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
        <StatsCard
          title={t.dashboard.totalFrameworks}
          value="12"
          change="+2 this quarter"
          changeType="positive"
          icon={Shield}
          accentColor="green"
        />
        <StatsCard
          title={t.dashboard.activeControls}
          value="2,447"
          change="+156 this week"
          changeType="positive"
          icon={FileCheck}
          accentColor="blue"
        />
        <StatsCard
          title={t.dashboard.openFindings}
          value="23"
          change="-8 from last audit"
          changeType="positive"
          icon={AlertTriangle}
          accentColor="amber"
        />
        <StatsCard
          title={t.dashboard.lastAudit}
          value="2h ago"
          change="Chaos Auditor"
          changeType="neutral"
          icon={Clock}
          accentColor="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Scores */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Framework Compliance Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {frameworks.map((fw) => (
                  <div key={fw.name} className="flex items-center gap-4">
                    <span className="font-mono text-xs text-white/70 w-36 flex-shrink-0">
                      {fw.name}
                    </span>
                    <div className="flex-1 h-2 bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full bg-aegis-green transition-all duration-1000"
                        style={{ width: `${fw.score}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-aegis-green w-10 text-right">
                      {fw.score}%
                    </span>
                    <Badge variant={fw.status === "active" ? "green" : "amber"}>
                      {fw.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Ollama Endpoint", status: "Online", color: "green" as const },
                { label: "InsForge Backend", status: "Connected", color: "green" as const },
                { label: "Ledger Integrity", status: "Verified", color: "green" as const },
                { label: "Evidence Pipeline", status: "Active", color: "green" as const },
                { label: "Chaos Auditor", status: "Running", color: "blue" as const },
                { label: "Last Hardship Report", status: "2d ago", color: "amber" as const },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                  <span className="font-mono text-[11px] text-aegis-muted">
                    {item.label}
                  </span>
                  <Badge variant={item.color}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <ActivityLog />
    </div>
  );
}
