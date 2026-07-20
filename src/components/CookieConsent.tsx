"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("veritas-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("veritas-cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("veritas-cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4">
      <div className="max-w-lg mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl">
        <p className="text-xs text-zinc-400 leading-relaxed mb-4 font-[var(--font-heading)]">
          We use cookies for authentication, analytics, and to improve your experience. 
          By continuing, you agree to our{" "}
          <a href="/privacy#cookies" className="text-zinc-200 underline hover:text-white transition-colors">Cookie Policy</a>.
        </p>
        <div className="flex gap-3">
          <button onClick={accept} className="flex-1 py-2 bg-white text-black text-[10px] font-[var(--font-heading)] font-bold tracking-wider uppercase rounded hover:bg-zinc-200 transition-colors cursor-pointer">
            Accept All
          </button>
          <button onClick={decline} className="flex-1 py-2 border border-zinc-700 text-zinc-400 text-[10px] font-[var(--font-heading)] font-bold tracking-wider uppercase rounded hover:bg-zinc-800 transition-colors cursor-pointer">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
