"use client";

import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Español", native: "Español" },
  { code: "fr", label: "Français", native: "Français" },
  { code: "de", label: "Deutsch", native: "Deutsch" },
  { code: "ja", label: "日本語", native: "日本語" },
  { code: "zh-CN", label: "中文", native: "简体中文" },
  { code: "ar", label: "العربية", native: "العربية" },
  { code: "pt", label: "Português", native: "Português" },
];

const googleLangMap: Record<string, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  ja: "ja",
  "zh-CN": "zh-CN",
  ar: "ar",
  pt: "pt",
};

export default function NavigationBar() {
  const [langOpen, setLangOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Load Google Translate
  useEffect(() => {
    if ((window as any).google?.translate) return;
    const existing = document.getElementById("google_translate_script");
    if (existing) return;

    const script = document.createElement("script");
    script.id = "google_translate_script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateInit";
    script.async = true;
    document.body.appendChild(script);

    (window as any).googleTranslateInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es,fr,de,ja,zh-CN,ar,pt",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  const switchLanguage = (code: string) => {
    const gtCode = googleLangMap[code];
    if (!gtCode) return;

    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = gtCode;
      select.dispatchEvent(new Event("change"));
    }
    setLangOpen(false);
  };

  useGSAP(() => {
    if (dropdownOpen && dropdownMenuRef.current) {
      gsap.fromTo(
        dropdownMenuRef.current,
        { opacity: 0, y: -4, scaleY: 0.95 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [dropdownOpen]);

  useGSAP(() => {
    if (langOpen && langMenuRef.current) {
      gsap.fromTo(
        langMenuRef.current,
        { opacity: 0, y: -4, scaleY: 0.95 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [langOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-b border-zinc-800" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-3 shrink-0">
          <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none">
            <rect x="2" y="2" width="96" height="96" rx="20" fill="#111" stroke="#333" strokeWidth="2" />
            <text x="50" y="68" fontFamily="system-ui" fontSize="56" fontWeight="800" fill="#00FF66" textAnchor="middle">V</text>
          </svg>
          <span className="text-sm font-bold tracking-[0.15em] text-white font-[var(--font-heading)]">
            VERITAS
          </span>
        </a>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <a
            href="#platform"
            className="text-[11px] font-[var(--font-heading)] font-medium tracking-wider text-zinc-400 hover:text-white duration-0 uppercase"
          >
            Platform
          </a>
          <a
            href="#features"
            className="text-[11px] font-[var(--font-heading)] font-medium tracking-wider text-zinc-400 hover:text-white duration-0 uppercase"
          >
            Features
          </a>
          <a
            href="#solutions"
            className="text-[11px] font-[var(--font-heading)] font-medium tracking-wider text-zinc-400 hover:text-white duration-0 uppercase"
          >
            Solutions
          </a>
          <a
            href="#integrations"
            className="text-[11px] font-[var(--font-heading)] font-medium tracking-wider text-zinc-400 hover:text-white duration-0 uppercase"
          >
            Integrations
          </a>
          <a
            href="/docs"
            className="text-[11px] font-[var(--font-heading)] font-medium tracking-wider text-zinc-400 hover:text-white duration-0 uppercase"
          >
            Docs
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Google Translate hidden host */}
          <div id="google_translate_element" className="hidden" />

          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => {
                setLangOpen(!langOpen);
                setDropdownOpen(false);
              }}
              className="text-[10px] font-[var(--font-heading)] font-medium tracking-wider text-zinc-400 hover:text-white duration-0 border border-zinc-800 px-2.5 py-1.5 rounded cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
            {langOpen && (
              <div
                ref={langMenuRef}
                className="absolute right-0 top-full mt-1.5 bg-zinc-900 border border-zinc-800 py-1 min-w-[140px] z-50 rounded-lg overflow-hidden"
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => switchLanguage(l.code)}
                    className="w-full text-left px-3.5 py-2 text-[10px] font-[var(--font-heading)] tracking-wider hover:bg-zinc-800 duration-0 cursor-pointer text-zinc-400"
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Get Started dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setLangOpen(false);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-black text-[10px] font-[var(--font-heading)] font-bold tracking-wider uppercase rounded hover:bg-zinc-200 duration-0 cursor-pointer"
            >
              Get Started
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div
                ref={dropdownMenuRef}
                className="absolute right-0 top-full mt-1.5 bg-zinc-900 border border-zinc-800 py-1 min-w-[150px] z-50 rounded-lg overflow-hidden"
              >
                <a
                  href="/sign-in"
                  className="block px-3.5 py-2 text-[10px] font-[var(--font-heading)] tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-800 duration-0 uppercase"
                >
                  Sign In
                </a>
                <a
                  href="/sign-up"
                  className="block px-3.5 py-2 text-[10px] font-[var(--font-heading)] tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-800 duration-0 uppercase"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
