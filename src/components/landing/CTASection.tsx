"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = sectionRef.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll("[data-anim]"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-black">
      <div className="max-w-3xl mx-auto text-center">
        <span
          data-anim
          className="font-[var(--font-heading)] text-[10px] tracking-[0.25em] uppercase text-white/30"
        >
          // GET STARTED
        </span>
        <h2
          data-anim
          className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold mt-6 mb-6 text-white leading-[1.1]"
        >
          Deploy compliance intelligence across your financial infrastructure
        </h2>
        <p
          data-anim
          className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed mb-10"
        >
          Multi-agent AI orchestration running locally. No cloud dependency.
          No data leaves your perimeter. Full CBN and global regulatory alignment.
        </p>
        <div data-anim className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/signup"
            className="px-8 py-3.5 bg-white text-black font-[var(--font-heading)] text-xs font-bold tracking-[0.1em] uppercase rounded hover:bg-zinc-200 transition-colors"
          >
            Start Free Trial
          </a>
          <a
            href="/docs"
            className="px-8 py-3.5 border border-white/15 text-white font-[var(--font-heading)] text-xs font-bold tracking-[0.1em] uppercase rounded hover:bg-white/[0.05] transition-colors"
          >
            Read the Docs
          </a>
        </div>
      </div>
    </section>
  );
}
