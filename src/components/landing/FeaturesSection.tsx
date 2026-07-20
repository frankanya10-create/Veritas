"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const coreFeatures = [
  {
    title: "Multi-Agent AI Orchestration",
    desc: "CrewAI & LangGraph framework orchestrating specialized compliance agents that collaborate, debate, and converge on audit decisions.",
  },
  {
    title: "Automated Audit Trail Generation",
    desc: "Cryptographically sealed chain-of-custody for every audit event. Immutable logging with granular traceability across all agent decisions.",
  },
  {
    title: "Private Offline Ingestion",
    desc: "Air-gapped pipeline for sensitive financial data. Process classified transaction records without network exposure.",
  },
  {
    title: "Regulatory Policy Engine",
    desc: "Central Bank of Nigeria & global standards alignment. Dynamic policy mapping across jurisdictions with automatic updates.",
  },
  {
    title: "Transaction Stream Auditing",
    desc: "Real-time ledger interception and analysis. Every transaction verified against active regulatory frameworks as it occurs.",
  },
  {
    title: "Anomaly Flagging Engine",
    desc: "Automated discrepancy detection across multi-agent consensus. Flags suspicious patterns before they escalate.",
  },
  {
    title: "Cross-Examination Loops",
    desc: "Multi-agent consensus voting where each agent cross-validates findings. Eliminates false positives through adversarial verification.",
  },
  {
    title: "Predictive Fraud Analytics",
    desc: "Dynamic risk scoring with machine learning. Detects capital flight, currency speculation, and AML/KYT violations in real time.",
  },
];

const allCapabilities = [
  "Multi-Agent AI Orchestration Architecture (CrewAI & LangGraph framework)",
  "Automated Audit Trail Generation & Cryptographic State Logging",
  "Private Offline Ingestion Pipeline for sensitive financial data",
  "Asynchronous REST API Gateway (FastAPI)",
  "Multi-Tenant Enterprise Access Control (RBAC & Service-level tokens)",
  "Real-Time Transaction Stream Auditing & Ledger Interception",
  "Automated Discrepancy & Anomaly Flagging Engine",
  "Regulatory Policy Compliance Engine (Central Bank of Nigeria & Global Standards alignment)",
  "Cross-Examination Agent Verification Loops (Multi-agent consensus voting)",
  "Long-Document Context Processing for massive regulatory updates",
  "Automated Audit Trail Generation & Cryptographic State Logging",
  "Pydantic Data Validation & Sanitization Layer",
  "Dynamic Risk Scoring & Predictive Fraud Vector Analytics",
  "Automated Regulatory Report Draft Generation (.pdf / .docx auto-exporter)",
  "Granular Traceability Node Mapping (Visual explanation of agent decision trees)",
  "Multi-Tenant Enterprise Access Control (RBAC & Service-level tokens)",
  "Self-Healing System Infrastructure & Agent Failure Recovery Loops",
  "Continuous Integration Data Pipelines via Dockerized Microservices",
  "Historical Backtesting Sandbox for new policy changes",
  "Live Webhook Alert System (Instant Slack, Email, and SMS compliance breach notifications)",
  "Semantic Vector Search Matrix (Vector DB integration for historical case matching)",
  "Anti-Money Laundering (AML) & Know Your Transaction (KYT) Behavioral Tracker",
  "Cross-Border Capital Flight & Currency Speculation Detector",
  "Automated Reconciliation Matrix (Balances internal ledgers against external bank APIs)",
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 30%",
          scrub: 1,
        },
      }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-feature-card]");
    const caps = sectionRef.current?.querySelectorAll("[data-cap]");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none none",
      },
    });

    if (headerRef.current) {
      tl.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
      );
    }

    if (cards) {
      tl.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
        },
        "-=0.3"
      );
    }

    if (caps) {
      tl.fromTo(
        caps,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-20">
          <span className="font-[var(--font-heading)] text-[10px] uppercase tracking-[0.25em] text-black/30">
            // CORE CAPABILITIES
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold mt-4 mb-4 text-black">
            25 engines. One unified platform.
          </h2>
          <p className="text-black/40 max-w-xl mx-auto text-sm leading-relaxed">
            Multi-agent AI orchestration for financial compliance, fraud detection,
            and regulatory automation — all running locally on your infrastructure.
          </p>
        </div>

        {/* Core 8 feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {coreFeatures.map((f, i) => (
            <div
              key={f.title}
              data-feature-card
              className="border border-black/[0.06] p-6 hover:border-black/20 hover:shadow-sm transition-all duration-300 bg-white"
            >
              <div className="w-8 h-8 border border-black/[0.08] bg-black/[0.02] flex items-center justify-center text-[11px] font-[var(--font-heading)] font-bold text-black/50 mb-4">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-[var(--font-heading)] text-xs font-bold uppercase tracking-wider text-black mb-3">
                {f.title}
              </h3>
              <p className="text-black/50 text-xs leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Full capability matrix */}
        <div className="border-t border-black/[0.06] pt-12">
          <span className="font-[var(--font-heading)] text-[10px] uppercase tracking-[0.25em] text-black/30 block text-center mb-8">
            // COMPLETE CAPABILITY MATRIX
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {allCapabilities.map((cap) => (
              <div
                key={cap}
                data-cap
                className="flex items-start gap-2.5 px-3 py-2.5 border border-transparent hover:border-black/[0.06] transition-colors duration-200"
              >
                <span className="w-1 h-1 rounded-full bg-black/20 mt-2 shrink-0" />
                <span className="text-[11px] text-black/60 leading-relaxed">
                  {cap}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
