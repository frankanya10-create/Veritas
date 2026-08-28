"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { step: "01", title: "Ingest & Connect", desc: "Deploy the ingestion agent across your financial infrastructure. Transaction streams, ledgers, and API endpoints connect in real-time." },
  { step: "02", title: "Orchestrate & Analyze", desc: "CrewAI orchestrates specialized agents — each independently analyzing every transaction against active regulatory frameworks." },
  { step: "03", title: "Cross-Validate & Flag", desc: "Multi-agent consensus voting cross-validates findings. Discrepancies are flagged, evidence is cryptographically logged." },
  { step: "04", title: "Report & Reconcile", desc: "Auto-generate regulatory reports (.pdf/.docx), reconcile ledgers against bank APIs, and trigger alerts via Slack, Email, or SMS." },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll("[data-step]");
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.25,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section id="platform" ref={sectionRef} className="py-28 px-6 bg-white border-b border-black/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-[var(--font-heading)] text-[10px] tracking-[0.25em] uppercase text-black/30">
            // HOW IT WORKS
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold mt-4 mb-4 text-black">
            From raw data to regulatory compliance
          </h2>
          <p className="text-black/40 max-w-xl mx-auto text-sm leading-relaxed">
            Four steps. Multi-agent orchestration. Zero cloud dependencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((s) => (
            <div
              key={s.step}
              data-step
              className="relative"
            >
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold font-[var(--font-heading)] mb-6 mx-auto md:mx-0">
                {s.step}
              </div>
              <h3 className="font-[var(--font-heading)] font-bold text-sm tracking-wide text-black mb-3 text-center md:text-left">
                {s.title}
              </h3>
              <p className="text-black/40 text-xs leading-relaxed text-center md:text-left">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
