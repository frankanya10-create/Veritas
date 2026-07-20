"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { signUp, verifyEmail } from "@/app/actions";

gsap.registerPlugin(ScrollTrigger);

const taglines = [
  "Real-time AML/KYT transaction monitoring",
  "Multi-agent orchestration against 12 CBN standards",
  "Tamper-evident audit trails with cryptographic chaining",
  "Cross-examination consensus voting across agent swarms",
];

export default function SignUpClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [email, setEmail] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    if (!taglineRef.current) return;
    gsap.fromTo(taglineRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, [taglineIndex]);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;
    gsap.fromTo(el.querySelectorAll("[data-fade]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" });
    gsap.fromTo(el.querySelectorAll("[data-form]"), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" });
  }, [step]);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;
    gsap.fromTo(el.querySelectorAll("[data-anim]"), { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" });
    gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, scrub: 1, scrollTrigger: { trigger: el, start: "top 85%", end: "top 30%" } });
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.target as HTMLFormElement);
    setEmail(String(form.get("email")));
    const result = await signUp(form);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else if (result.data?.requireEmailVerification) {
      setStep("verify");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.target as HTMLFormElement);
    form.set("email", email);
    const result = await verifyEmail(form);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else if (result.redirect) {
      router.push(result.redirect);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="hidden md:block space-y-8">
          <div data-anim className="flex items-center gap-2 text-[11px] font-[var(--font-heading)] uppercase tracking-widest text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Onboarding
          </div>
          <h2 data-anim className="font-[var(--font-heading)] text-4xl font-bold text-white leading-tight">
            Join the compliance intelligence network
          </h2>
          <p data-anim ref={taglineRef} data-tagline className="text-zinc-400 text-sm font-[var(--font-heading)] leading-relaxed max-w-md">
            {taglines[taglineIndex]}
          </p>
          <div data-anim className="flex items-center gap-4 text-[11px] font-[var(--font-heading)] text-zinc-500">
            <span className="text-zinc-300 font-semibold">100+ Regulatory Requirements</span>
            <span className="w-px h-4 bg-zinc-700" />
            <span className="text-zinc-300 font-semibold">40+ Countries</span>
            <span className="w-px h-4 bg-zinc-700" />
            <span className="text-zinc-300 font-semibold">Zero Cloud Dependencies</span>
          </div>
        </div>

        <div data-form className="w-full max-w-sm mx-auto md:mx-0 md:ml-auto">
          <div data-fade className="text-center mb-10">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none">
                <rect x="2" y="2" width="96" height="96" rx="20" fill="#111" stroke="#333" strokeWidth="2" />
                <text x="50" y="68" fontFamily="system-ui" fontSize="56" fontWeight="800" fill="#00FF66" textAnchor="middle">V</text>
              </svg>
            </div>
            <h1 className="font-[var(--font-heading)] text-xl font-bold text-white">
              {step === "signup" ? "Create your account" : "Check your email"}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {step === "signup" ? "Start with Veritas compliance intelligence" : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {step === "signup" ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div data-fade>
                <label className="text-[10px] font-[var(--font-heading)] uppercase tracking-wider text-zinc-500 block mb-1.5">Name</label>
                <input name="name" required className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-sm rounded focus:outline-none focus:border-zinc-600 transition-colors font-[var(--font-heading)]" placeholder="John Doe" />
              </div>
              <div data-fade>
                <label className="text-[10px] font-[var(--font-heading)] uppercase tracking-wider text-zinc-500 block mb-1.5">Email</label>
                <input name="email" type="email" required className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-sm rounded focus:outline-none focus:border-zinc-600 transition-colors font-[var(--font-heading)]" placeholder="you@company.com" />
              </div>
              <div data-fade>
                <label className="text-[10px] font-[var(--font-heading)] uppercase tracking-wider text-zinc-500 block mb-1.5">Password (min 6 chars)</label>
                <input name="password" type="password" required minLength={6} className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-sm rounded focus:outline-none focus:border-zinc-600 transition-colors font-[var(--font-heading)]" placeholder="••••••••" />
              </div>
              {error && <p data-fade className="text-red-400 text-xs font-[var(--font-heading)]">{error}</p>}
              <button data-fade type="submit" disabled={loading} className="w-full py-2.5 bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer">
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div data-fade>
                <label className="text-[10px] font-[var(--font-heading)] uppercase tracking-wider text-zinc-500 block mb-1.5">Verification Code</label>
                <input name="otp" type="text" maxLength={6} required className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-sm rounded focus:outline-none focus:border-zinc-600 transition-colors font-[var(--font-heading)] text-center tracking-[0.3em] placeholder:text-zinc-700" placeholder="000000" />
              </div>
              {error && <p data-fade className="text-red-400 text-xs font-[var(--font-heading)]">{error}</p>}
              <button data-fade type="submit" disabled={loading} className="w-full py-2.5 bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer">
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>
          )}

          <p data-fade className="text-center mt-8 text-[11px] font-[var(--font-heading)] text-zinc-600">
            Already have an account?{" "}
            <a href="/sign-in" className="text-zinc-300 hover:text-white transition-colors">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}
