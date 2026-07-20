"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ParticleSphere from "./ParticleSphere";

const frameworks = [
  { id: "CBN", desc: "Central Bank of Nigeria" },
  { id: "AML", desc: "Anti-Money Laundering" },
  { id: "KYT", desc: "Know Your Transaction" },
  { id: "ISO 27001", desc: "Information Security Mgmt" },
  { id: "PCI-DSS", desc: "Payment Card Data Security" },
  { id: "GDPR", desc: "Data Protection & Privacy" },
  { id: "SOC 2", desc: "Service Organization Control" },
  { id: "NYDFS", desc: "New York Financial Services" },
];

const marqueeItems = [...frameworks, ...frameworks];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(statusRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 });

    tl.fromTo(
      titleRef.current?.children || [],
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.15 },
      "-=0.3"
    );

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.4"
    );

    tl.fromTo(
      ctaRef.current?.children || [],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
      "-=0.3"
    );

    tl.fromTo(
      marqueeRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      "-=0.1"
    );
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
    >
      <ParticleSphere />

      <div className="absolute inset-0 z-[1] cyber-grid pointer-events-none" />

      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto px-8 pt-24 pb-8 flex-1 flex items-center">
          <div className="max-w-4xl mx-auto text-center">
            <div
              ref={statusRef}
              className="inline-flex items-center gap-3 bg-white px-4 py-2 mb-8 mx-auto rounded-lg"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 animate-ping opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-[11px] font-[var(--font-heading)] font-semibold tracking-wider text-zinc-800">
                Financial Compliance Intelligence
              </span>
            </div>

            <div ref={titleRef}>
              {["Multi-Agent", "Compliance Intelligence", "That Never Sleeps"].map(
                (text) => (
                  <h1
                    key={text}
                    className="font-[var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[-0.02em] leading-[1.15] text-white"
                  >
                    {text}
                  </h1>
                )
              )}
            </div>

            <p
              ref={subtitleRef}
              className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10 mt-6"
            >
              CrewAI-powered agent orchestration with multi-agent consensus verification.
              Real-time transaction auditing, AML/KYT detection, and regulatory
              compliance — deployed at the edge with zero cloud dependencies.
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#features"
                className="inline-block px-8 py-3.5 bg-white text-black font-[var(--font-heading)] text-sm font-bold tracking-[0.1em] uppercase hover:bg-zinc-200 transition-colors duration-0 rounded-lg"
              >
                Explore Capabilities
              </a>
              <a
                href="#architecture"
                className="inline-block px-8 py-3.5 border border-zinc-700 text-zinc-300 font-[var(--font-heading)] text-sm font-bold tracking-[0.1em] uppercase hover:bg-white hover:text-black hover:border-white duration-0 rounded-lg"
              >
                View Architecture
              </a>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-zinc-800/60 overflow-hidden">
          <div className="max-w-full mx-auto py-4 overflow-hidden">
            <div ref={marqueeRef} className="flex marquee-track">
              {marqueeItems.map((fw, i) => (
                <div
                  key={`${fw.id}-${i}`}
                  className="flex items-center gap-3 px-4 py-2 mx-2 border border-zinc-800/40 bg-zinc-900/30 shrink-0"
                >
                  <svg
                    className="w-3 h-3 text-green-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-[var(--font-heading)] font-semibold text-zinc-200 whitespace-nowrap">
                      {fw.id}
                    </span>
                    <span className="text-[10px] text-zinc-600 hidden sm:inline whitespace-nowrap">
                      {fw.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
.marquee-track {
  animation: marquee 30s linear infinite;
  width: max-content;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`}</style>
    </section>
  );
}
