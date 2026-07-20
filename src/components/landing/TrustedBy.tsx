"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const standards = [
  "CBN AML Baseline Standards",
  "FATF 40 Recommendations",
  "ISO 27001",
  "PCI-DSS",
  "GDPR",
  "BOFIA 2020",
  "MLPPA 2022",
  "NYDFS Part 504",
];

export default function TrustedBy() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

    if (!trackRef.current) return;
    gsap.set(trackRef.current, { x: 0 });
    const loop = gsap.to(trackRef.current, {
      x: () => -(trackRef.current!.scrollWidth / 2),
      duration: 30,
      ease: "none",
      repeat: -1,
    });
    return () => loop.kill();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-6 bg-white border-b border-black/[0.04]">
      <div className="max-w-7xl mx-auto">
        <p className="text-center font-[var(--font-heading)] text-[11px] tracking-widest uppercase text-black/30 mb-8">
          Aligned with global regulatory standards
        </p>
        <div className="overflow-hidden mask-edges">
          <div ref={trackRef} className="flex gap-16 items-center w-max">
            {[...standards, ...standards].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-[var(--font-heading)] text-sm tracking-widest text-black/20 uppercase whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
