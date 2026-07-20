"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const sections = [
  {
    id: "quickstart",
    title: "Quick Start",
    content: "Deploy the multi-agent compliance stack in under 10 minutes. Initialize your project, connect your first data source (transaction stream, REST API, or ledger), and run your first audit.",
    code: "npx veritas init my-project\ncd my-project\nveritas deploy\nveritas audit run --source postgresql",
  },
  {
    id: "agents",
    title: "Multi-Agent Orchestration",
    content: "Veritas uses CrewAI and LangGraph to orchestrate specialized compliance agents. Agents collaborate through cross-examination voting loops, cross-validate findings, and converge on audit decisions with full cryptographic traceability.",
    code: `# Define an audit crew\nfrom veritas.agents import AuditCrew\n\ncrew = AuditCrew(\n  agents=["ingestor", "analyzer", "validator", "reporter"],\n  model="deepseek-r1:8b",\n  framework="crewai"\n)\ncrew.run(source="transaction_stream")`,
  },
  {
    id: "compliance",
    title: "Regulatory Compliance Engine",
    content: "Map transactions against CBN guidelines, global AML/KYT standards, and custom regulatory policies. The engine supports real-time policy evaluation, historical backtesting, and automatic report generation.",
    code: `veritas compliance map --framework cbn\nveritas compliance check --tx <transaction_id>\nveritas compliance backtest --policy ./new_policy.yaml`,
  },
  {
    id: "api",
    title: "REST API Gateway",
    content: "FastAPI-based asynchronous gateway for transaction ingestion, audit triggers, and report exports. All endpoints support bearer token authentication with RBAC scopes.",
    code: `curl -X POST https://your-node:8443/api/v1/ingest \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{"source":"ledger","transactions":[]}'`,
  },
  {
    id: "alerts",
    title: "Webhook Alert System",
    content: "Real-time compliance breach notifications via Slack, Email (SendGrid), and SMS (Twilio). Configure threshold-based triggers for anomaly detection, AML flags, and reconciliation failures.",
    code: `veritas alerts add --channel slack --webhook $SLACK_URL\nveritas alerts add --channel email --to compliance@company.com\nveritas alerts add --channel sms --to +234800000000`,
  },
  {
    id: "reports",
    title: "Audit Reports & Reconciliation",
    content: "Auto-generate regulatory reports in .pdf and .docx format. The reconciliation matrix balances internal ledgers against external bank APIs with cryptographic audit trail logging.",
    code: `veritas report generate --format pdf --output ./reports/\nveritas reconcile --bank-api https://api.bank.com/v1\nveritas ledger verify --hash <tx_hash>`,
  },
];

export default function DocsClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = containerRef.current?.querySelectorAll("[data-doc-card]");
    if (!items) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-b border-black/[0.06]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 shrink-0">
            <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none">
              <rect x="2" y="2" width="96" height="96" rx="20" fill="#f5f5f5" stroke="#d4d4d4" strokeWidth="2" />
              <text x="50" y="68" fontFamily="system-ui" fontSize="56" fontWeight="800" fill="#00FF66" textAnchor="middle">V</text>
            </svg>
            <span className="text-sm font-bold tracking-[0.15em] text-black font-[var(--font-heading)]">
              VERITAS
            </span>
            <span className="font-[var(--font-heading)] text-[9px] tracking-wider text-black/30 hidden sm:inline-block">
              / DOCS
            </span>
          </a>
          <a
            href="/"
            className="text-[11px] font-[var(--font-heading)] font-medium tracking-wider text-black/40 hover:text-black duration-0 uppercase"
          >
            Back to Home
          </a>
        </div>
      </nav>

      <div ref={containerRef} className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <span className="font-[var(--font-heading)] text-[10px] tracking-[0.25em] uppercase text-black/30">
            // DOCUMENTATION
          </span>
          <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold mt-4 mb-4 text-black">
            Build with Veritas
          </h1>
          <p className="text-black/40 max-w-xl mx-auto text-sm leading-relaxed">
            Multi-agent AI orchestration for financial compliance. Everything you need
            to deploy, configure, and automate across your infrastructure.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <div
              key={s.id}
              data-doc-card
              id={s.id}
              className="border border-black/[0.06] p-6 md:p-8 hover:border-black/15 transition-all duration-300 bg-white"
            >
              <h2 className="font-[var(--font-heading)] text-lg font-bold text-black mb-3">
                {s.title}
              </h2>
              <p className="text-black/50 text-sm leading-relaxed mb-4">
                {s.content}
              </p>
              <pre className="bg-black/[0.03] border border-black/[0.06] p-4 overflow-x-auto">
                <code className="text-[11px] text-black/60 font-mono leading-relaxed whitespace-pre">
                  {s.code}
                </code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-black/[0.06] py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-[var(--font-heading)] text-[10px] tracking-wider text-black/30">
            &copy; {new Date().getFullYear()} Veritas · Multi-Agent · Zero Cloud Dependencies
          </div>
        </div>
      </footer>
    </main>
  );
}
