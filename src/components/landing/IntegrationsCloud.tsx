"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const integrations = [
  { name: "FastAPI", desc: "Async API gateway" },
  { name: "Docker", desc: "Container runtime" },
  { name: "RabbitMQ", desc: "Message broker" },
  { name: "Redis", desc: "In-memory cache" },
  { name: "MongoDB", desc: "Document store" },
  { name: "Slack", desc: "Team alerts" },
  { name: "SendGrid", desc: "Email notifications" },
  { name: "Twilio", desc: "SMS gateway" },
  { name: "Pinecone", desc: "Vector database" },
];

export default function IntegrationsCloud() {
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

    const cards = sectionRef.current?.querySelectorAll("[data-card]");
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section id="integrations" ref={sectionRef} className="py-28 px-6 bg-white border-b border-black/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-[var(--font-heading)] text-[10px] tracking-[0.25em] uppercase text-black/30">
            // INTEGRATIONS
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold mt-4 mb-4 text-black">
            Works with your stack
          </h2>
          <p className="text-black/40 max-w-xl mx-auto text-sm leading-relaxed">
            Plugs into your existing infrastructure. No rip-and-replace.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {integrations.map((i) => (
            <div
              key={i.name}
              data-card
              className="border border-black/[0.06] px-4 py-5 text-center hover:border-black/20 hover:shadow-sm transition-all duration-300 cursor-default bg-white"
            >
              <div className="font-[var(--font-heading)] font-bold text-sm text-black mb-1">
                {i.name}
              </div>
              <div className="text-[10px] font-[var(--font-heading)] tracking-wider text-black/30 uppercase">
                {i.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
