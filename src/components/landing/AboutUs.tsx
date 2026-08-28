"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "2024", label: "Founded" },
  { value: "40+", label: "Engineers & Compliance Experts" },
  { value: "3", label: "Continental Offices" },
  { value: "99.97%", label: "Audit Accuracy" },
];

const pillars = [
  {
    title: "Mission",
    desc: "To eliminate financial crime through autonomous multi-agent intelligence. We believe every transaction deserves cryptographic scrutiny — not after the fact, but in real time.",
  },
  {
    title: "Vision",
    desc: "A global financial infrastructure where compliance is ambient, fraud is preempted, and regulatory alignment is automatic. No blind spots. No latency. No compromise.",
  },
  {
    title: "Approach",
    desc: "We don't sell dashboards. We deploy agent swarms that think, cross-examine, and converge on truth. Every finding is cryptographically sealed. Every decision is explainable.",
  },
];

export default function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const pills = sectionRef.current?.querySelectorAll("[data-pillar]");
    if (!pills) return;

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
      pills,
      { opacity: 0, y: 30, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      },
      "-=0.3"
    );
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="text-center mb-20">
          <span className="font-[var(--font-heading)] text-[10px] uppercase tracking-[0.25em] text-black/30">
            // WHO WE ARE
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold mt-4 mb-4 text-black">
            Built by auditors. Engineered for auditors.
          </h2>
          <p className="text-black/40 max-w-xl mx-auto text-sm leading-relaxed">
            Veritas was born from a simple frustration: compliance teams spend
            more time proving they checked than actually checking. We changed that.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {pillars.map((p) => (
            <div
              key={p.title}
              data-pillar
              className="border border-black/[0.06] p-8 bg-white hover:border-black/15 transition-all duration-300"
            >
              <h3 className="font-[var(--font-heading)] text-xs font-bold uppercase tracking-wider text-black mb-4">
                {p.title}
              </h3>
              <p className="text-black/50 text-sm leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-black/[0.06] pt-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-[var(--font-heading)] font-bold text-black tracking-tight mb-2">
                {s.value}
              </div>
              <div className="text-[11px] font-[var(--font-heading)] font-medium tracking-wider uppercase text-black/40">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
