"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "\"A strong financial system is built on trust, and trust is earned through integrity and compliance. The CBN will continue to set high regulatory standards to protect Nigeria's financial ecosystem.\"",
    author: "Olayemi Cardoso",
    role: "Governor, Central Bank of Nigeria",
  },
  {
    quote: "\"Regulators expect financial institutions to maintain dynamic, risk-based AML/CFT programs that are responsive to the evolving financial environment. Proactive engagement with regulatory developments is essential.\"",
    author: "Shola Phillips",
    role: "Special Adviser to the CBN Governor on Compliance",
  },
  {
    quote: "\"Over $3 trillion in illicit funds flow through the global financial system annually. Financial institutions must strengthen due diligence measures and leverage technology-driven risk assessments.\"",
    author: "Stephanie Bailey",
    role: "Head of EMEA AML Risk Management, Citi",
  },
  {
    quote: "\"Know Your Customer (KYC), Know Your Business (KYB), and Know Your Transaction (KYT) protocols are essential in preventing illicit financial activities. These three pillars form a layered compliance framework.\"",
    author: "Siobhan Ni Ealaithe",
    role: "Managing Director, Citi Correspondent Banking Group",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

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

    const cards = sectionRef.current?.querySelectorAll("[data-testimonial]");
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section id="solutions" ref={sectionRef} className="py-28 px-6 bg-white border-b border-black/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-[var(--font-heading)] text-[10px] tracking-[0.25em] uppercase text-black/30">
            // INDUSTRY PERSPECTIVES
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold mt-4 mb-4 text-black">
            What regulatory leaders are saying
          </h2>
          <p className="text-black/40 max-w-xl mx-auto text-sm leading-relaxed">
            Verified statements from financial compliance authorities and industry experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              data-testimonial
              className="border border-black/[0.06] p-8 bg-white hover:border-black/15 hover:shadow-sm transition-all duration-300"
            >
              <svg className="w-6 h-6 text-black/10 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z" />
              </svg>
              <p className="text-sm text-black/60 leading-relaxed mb-6">
                {t.quote}
              </p>
              <div>
                <div className="font-[var(--font-heading)] font-bold text-xs text-black">
                  {t.author}
                </div>
                <div className="text-[10px] font-[var(--font-heading)] tracking-wider text-black/30 uppercase mt-0.5">
                  {t.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
