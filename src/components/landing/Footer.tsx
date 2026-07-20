"use client";

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.08] py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 100 100" className="w-6 h-6" fill="none">
                <rect x="2" y="2" width="96" height="96" rx="20" fill="#111" stroke="#333" strokeWidth="2" />
                <text x="50" y="68" fontFamily="system-ui" fontSize="56" fontWeight="800" fill="#00FF66" textAnchor="middle">V</text>
              </svg>
              <span className="text-xs font-bold tracking-[0.15em] text-black font-[var(--font-heading)]">VERITAS</span>
            </div>
            <p className="text-[11px] text-black/40 leading-relaxed max-w-xs">
              Multi-agent compliance intelligence for financial institutions. Real-time AML/KYT, regulatory alignment, and tamper-evident audit trails.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[10px] font-[var(--font-heading)] font-bold tracking-[0.2em] uppercase text-black/30 mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#platform" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Platform</a></li>
              <li><a href="#features" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Features</a></li>
              <li><a href="#integrations" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Integrations</a></li>
              <li><a href="/docs" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Documentation</a></li>
              <li><a href="#architecture" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Architecture</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-[var(--font-heading)] font-bold tracking-[0.2em] uppercase text-black/30 mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><a href="/docs" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">API Reference</a></li>
              <li><a href="/docs" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Webhooks</a></li>
              <li><a href="/docs" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Audit Reports</a></li>
              <li><a href="#solutions" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Solutions</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-[var(--font-heading)] font-bold tracking-[0.2em] uppercase text-black/30 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="/terms" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Terms of Service</a></li>
              <li><a href="/privacy" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Privacy Policy</a></li>
              <li><a href="/privacy#cookies" className="text-[11px] text-black/50 hover:text-black transition-colors font-[var(--font-heading)]">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-[var(--font-heading)] text-black/25">
            &copy; {new Date().getFullYear()} Veritas. All rights reserved.
          </p>
          <p className="text-[10px] font-[var(--font-heading)] text-black/20">
            Multi-Agent Compliance Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}
