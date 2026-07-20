"use client";

import { useState } from "react";
import { Search, Bell, Globe } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useTranslation, localeLabels, type Locale } from "@/lib/i18n/useTranslation";

export default function TopBar() {
  const { t, locale, setLocale, availableLocales } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="h-14 border-b border-white/[0.06] bg-aegis-surface/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-aegis-muted" />
          <Input
            placeholder="Search controls, frameworks, evidence..."
            className="pl-9 h-8 text-[11px] bg-black/50"
          />
        </div>
      </div>

      {/* Right: Status + Lang + Notifications */}
      <div className="flex items-center gap-4">
        <Badge variant="green">
          <div className="w-1.5 h-1.5 rounded-full bg-aegis-green animate-pulse mr-1.5" />
          All Systems Nominal
        </Badge>

        {/* Language */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 text-aegis-muted hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              {locale}
            </span>
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 bg-aegis-surface border border-white/10 py-1 min-w-[120px] z-50">
              {availableLocales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider hover:bg-white/5 transition-colors cursor-pointer ${
                    locale === loc ? "text-aegis-green" : "text-aegis-muted"
                  }`}
                >
                  {localeLabels[loc]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative text-aegis-muted hover:text-white transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-aegis-red rounded-full" />
        </button>
      </div>
    </header>
  );
}
