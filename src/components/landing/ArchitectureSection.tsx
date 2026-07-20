"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const layers = [
  {
    name: "ORCHESTRATION LAYER",
    color: "aegis-green",
    items: [
      "CrewAI Multi-Agent Framework",
      "LangGraph Workflow Engine",
      "Cross-Examination Voting Loops",
      "Agent Failure Recovery",
      "Task Decomposition Pipeline",
    ],
  },
  {
    name: "AI INFERENCE LAYER",
    color: "aegis-blue",
    items: [
      "Multi-Agent Consensus Network",
      "Cross-Examination Voting",
      "Long-Document Context Processing",
      "Semantic Vector Search",
      "Granular Traceability Mapping",
    ],
  },
  {
    name: "COMPLIANCE ENGINE LAYER",
    color: "aegis-amber",
    items: [
      "CBN Regulatory Alignment",
      "AML/KYT Behavioral Tracking",
      "Capital Flight Detection",
      "Risk Scoring & Fraud Analytics",
      "Report Auto-Generation (.pdf/.docx)",
    ],
  },
  {
    name: "DATA & INFRASTRUCTURE LAYER",
    color: "aegis-red",
    items: [
      "FastAPI Async Gateway",
      "Event-Driven Transaction Buffer",
      "Cryptographic State Logging",
      "Dockerized Microservices",
      "Webhook Alert System (Slack/Email/SMS)",
    ],
  },
];

export default function ArchitectureSection() {
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

    const rows = sectionRef.current?.querySelectorAll("[data-layer]");
    if (!rows) return;

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

    tl.fromTo(
      rows,
      { opacity: 0, x: -30, scaleX: 0.97 },
      {
        opacity: 1,
        x: 0,
        scaleX: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.3"
    );
  }, []);

  return (
    <section id="architecture" ref={sectionRef} className="relative py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div ref={headerRef} className="text-center mb-20">
          <span className="font-[var(--font-heading)] text-[10px] uppercase tracking-[0.25em] text-black/30">
            // SYSTEM ARCHITECTURE
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold mt-4 mb-4 text-black">
            Four-Layer Agentic Stack
          </h2>
          <p className="text-black/40 max-w-xl mx-auto text-sm leading-relaxed">
            Every layer independently functional and cryptographically isolated.
            Data flows upward through agent consensus verification.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-[140px] top-0 bottom-0 w-px bg-black/[0.06]" />

          <div className="space-y-3">
            {layers.map((layer, index) => (
              <div
                key={layer.name}
                data-layer
                className="border border-black/[0.06] p-5 md:p-6 hover:border-black/15 transition-all duration-300 bg-white"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-0">
                  <div className="md:w-[160px] shrink-0 flex items-center gap-3 md:block">
                    <div
                      className="w-2 h-2 rounded-full shrink-0 md:mb-2"
                      style={{ backgroundColor: `var(--color-${layer.color})` }}
                    />
                    <div
                      className="font-[var(--font-heading)] text-xs font-bold tracking-wider uppercase"
                      style={{ color: `var(--color-${layer.color})` }}
                    >
                      {layer.name}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="font-[var(--font-heading)] text-[10px] tracking-wide text-black/50 border border-black/[0.06] px-2.5 py-1.5 hover:border-black/20 hover:text-black/80 transition-colors duration-200 bg-black/[0.02]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <div className="font-[var(--font-heading)] text-[9px] tracking-[0.2em] text-black/25 text-center uppercase">
            Data flows upward through cross-examination verification gates
            <br />
            All layers operate independently — zero cross-contamination
          </div>
        </div>
      </div>
    </section>
  );
}
