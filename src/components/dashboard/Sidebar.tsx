"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  FileCheck,
  Brain,
  BookLock,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";

const navItems = [
  { key: "dashboard" as const, href: "/dashboard", icon: LayoutDashboard },
  { key: "compliance" as const, href: "/dashboard/compliance", icon: FileCheck },
  { key: "evidence" as const, href: "/dashboard/evidence", icon: BookLock },
  { key: "aiTools" as const, href: "/dashboard/ai", icon: Brain },
  { key: "ledger" as const, href: "/dashboard/ledger", icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen border-r border-white/[0.06] bg-aegis-surface flex flex-col transition-all duration-300 sticky top-0",
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

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
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
                "flex items-center gap-3 px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-all duration-200",
                isActive
                  ? "text-aegis-green bg-aegis-green/[0.05] border-l-2 border-aegis-green"
                  : "text-aegis-muted hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{t.nav[item.key]}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-white/[0.06]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-aegis-muted hover:text-white transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
