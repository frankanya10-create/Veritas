"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  GitPullRequestArrow,
  BookLock,
  Brain,
  FileSearch,
  Link2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { label: "Consensus Room", href: "/dashboard/consensus", icon: Brain },
  { label: "Transactions", href: "/dashboard/transactions", icon: FileSearch },
  { label: "RAG Oracle", href: "/dashboard/rag-oracle", icon: Link2 },
  { label: "Ledger", href: "/dashboard/ledger", icon: Shield },
  { label: "PR Guardrail", href: "/dashboard/pr-scanner", icon: GitPullRequestArrow },
  { label: "Chaos Auditor", href: "/dashboard/chaos", icon: Zap },
  { label: "Evidence Vault", href: "/dashboard/evidence", icon: BookLock },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen border-r border-white/[0.06] bg-[#0A0A0A] flex flex-col transition-all duration-300 sticky top-0 z-40",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-white/[0.06]">
        <svg viewBox="0 0 100 100" className="w-5 h-5 flex-shrink-0" fill="none">
          <rect x="2" y="2" width="96" height="96" rx="20" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
          <text x="50" y="68" fontFamily="system-ui" fontSize="56" fontWeight="800" fill="#00FF66" textAnchor="middle">V</text>
        </svg>
        {!collapsed && (
          <span className="font-mono text-xs tracking-widest text-white/80">
            VERITAS
          </span>
        )}
      </div>

      {/* Tenant Badge */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-white/[0.03] border border-white/[0.06]">
            <div className="w-5 h-5 bg-aegis-green/10 flex items-center justify-center">
              <span className="text-aegis-green font-mono text-[9px] font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10px] text-white/80 truncate">AcmeFin Corp</div>
              <div className="font-mono text-[8px] text-white/30">acme.veritas.com</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-all duration-200",
                isActive
                  ? "text-aegis-green bg-aegis-green/[0.05] border-l-2 border-aegis-green"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.02] border-l-2 border-transparent"
              )}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Ollama Status */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-[9px] font-mono text-white/30">
            <div className="w-1.5 h-1.5 rounded-full bg-aegis-green animate-pulse" />
            <span>Llama 3.2:3B</span>
            <span className="text-aegis-green">48t/s</span>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-white/[0.06]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 text-white/20 hover:text-white/50 transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
}
