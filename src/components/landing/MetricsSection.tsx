"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: 3, suffix: "T+", label: "Illicit Funds Flowing Annually" },
  { value: 12, suffix: "", label: "CBN AML Baseline Standards" },
  { value: 100, suffix: "+", label: "Compliance Requirements" },
  { value: 57, suffix: "%", label: "Enterprises with Agents in Production" },
];

export default function MetricsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const els = sectionRef.current?.querySelectorAll("[data-count]");
    if (!els) return;

    els.forEach((el) => {
      const target = parseFloat(el.getAttribute("data-count") || "0");
      const suffix = el.getAttribute("data-suffix") || "";
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          const formatted = target % 1 === 0 ? Math.round(obj.val) : obj.val.toFixed(1);
          el.textContent = formatted + suffix;
        },
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6 bg-black border-b border-white/[0.08]"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <div className="text-4xl md:text-5xl font-[var(--font-heading)] font-bold text-white tracking-tight mb-2">
              <span data-count={m.value} data-suffix={m.suffix}>
                0{m.suffix}
              </span>
            </div>
            <div className="text-[11px] font-[var(--font-heading)] font-medium tracking-wider uppercase text-white/40">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
