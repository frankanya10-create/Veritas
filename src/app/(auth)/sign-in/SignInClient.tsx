"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { signIn, initiateOAuth } from "@/app/actions";

gsap.registerPlugin(ScrollTrigger);

const taglines = [
  "Real-time AML/KYT transaction monitoring",
  "Multi-agent orchestration against 12 CBN standards",
  "Tamper-evident audit trails with cryptographic chaining",
  "Cross-examination consensus voting across agent swarms",
];

export default function SignInClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    gsap.fromTo(el.querySelectorAll("[data-anim]"), { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" });
    gsap.fromTo(el.querySelectorAll("[data-form]"), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, scrub: 1, scrollTrigger: { trigger: el, start: "top 85%", end: "top 30%" } });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.target as HTMLFormElement);
    const result = await signIn(form);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else if (result.user) {
      router.push("/onboarding");
    }
  };

  const handleOAuth = async (provider: string) => {
    setLoading(true);
    try {
      const url = await initiateOAuth(provider);
      window.location.href = url;
    } catch {
      setError("OAuth failed");
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="hidden md:block space-y-8">
          <div data-anim className="flex items-center gap-2 text-[11px] font-[var(--font-heading)] uppercase tracking-widest text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Compliance Intelligence
          </div>
          <h2 data-anim className="font-[var(--font-heading)] text-4xl font-bold text-white leading-tight">
            Your compliance co-pilot is waiting
          </h2>
          <p data-anim ref={taglineRef} data-tagline className="text-zinc-400 text-sm font-[var(--font-heading)] leading-relaxed max-w-md">
            {taglines[taglineIndex]}
          </p>
          <div data-anim className="flex items-center gap-4 text-[11px] font-[var(--font-heading)] text-zinc-500">
            <span className="text-zinc-300 font-semibold">12 CBN Standards</span>
            <span className="w-px h-4 bg-zinc-700" />
            <span className="text-zinc-300 font-semibold">57% Enterprise Adoption</span>
            <span className="w-px h-4 bg-zinc-700" />
            <span className="text-zinc-300 font-semibold">$3T+ Illicit Funds Tracked</span>
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
            <h1 className="font-[var(--font-heading)] text-xl font-bold text-white">Welcome back</h1>
            <p className="text-zinc-500 text-sm mt-1">Sign in to your Veritas account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div data-fade>
              <label className="text-[10px] font-[var(--font-heading)] uppercase tracking-wider text-zinc-500 block mb-1.5">Email</label>
              <input name="email" type="email" required className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-sm rounded focus:outline-none focus:border-zinc-600 transition-colors font-[var(--font-heading)]" placeholder="you@company.com" />
            </div>
            <div data-fade>
              <label className="text-[10px] font-[var(--font-heading)] uppercase tracking-wider text-zinc-500 block mb-1.5">Password</label>
              <input name="password" type="password" required className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-sm rounded focus:outline-none focus:border-zinc-600 transition-colors font-[var(--font-heading)]" placeholder="••••••••" />
            </div>
            {error && <p data-fade className="text-red-400 text-xs font-[var(--font-heading)]">{error}</p>}
            <button data-fade type="submit" disabled={loading} className="w-full py-2.5 bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div data-fade className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
            <div className="relative flex justify-center"><span className="bg-black px-3 text-[10px] font-[var(--font-heading)] tracking-wider text-zinc-600">OR</span></div>
          </div>

          <div data-fade className="space-y-2">
            <button onClick={() => handleOAuth("google")} disabled={loading} className="w-full py-2.5 border border-zinc-800 text-zinc-300 text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded hover:bg-zinc-900 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button onClick={() => handleOAuth("github")} disabled={loading} className="w-full py-2.5 border border-zinc-800 text-zinc-300 text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded hover:bg-zinc-900 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
              GitHub
            </button>
          </div>

          <p data-fade className="text-center mt-8 text-[11px] font-[var(--font-heading)] text-zinc-600">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-zinc-300 hover:text-white transition-colors">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
