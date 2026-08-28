"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Bell, Cpu, HardDrive, Activity, User, Command } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function TopBar() {
  const [ollamaStatus, setOllamaStatus] = useState<"connected" | "high_latency" | "disconnected">("connected");
  const [vram, setVram] = useState({ used: 3.8, total: 8.0 });
  const [tokensPerSec, setTokensPerSec] = useState(48.2);
  const [ledgerBlock, setLedgerBlock] = useState({ number: 48192, hash: "9f8a...31c" });
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifCount, setNotifCount] = useState(3);

  // Simulate real-time Ollama metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setTokensPerSec(prev => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.max(30, Math.min(65, prev + delta));
      });
      setVram(prev => {
        const delta = (Math.random() - 0.5) * 0.2;
        return {
          used: Math.max(2.5, Math.min(7.5, prev.used + delta)),
          total: prev.total,
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const statusColors = {
    connected: "bg-aegis-green",
    high_latency: "bg-aegis-amber",
    disconnected: "bg-aegis-red",
  };

  const statusLabels = {
    connected: "Connected",
    high_latency: "High Latency",
    disconnected: "Disconnected",
  };

  return (
    <>
      <header className="h-12 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-30">
        {/* Left: Tenant + Node Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
            <span className="text-white/60">Node:</span>
            <span>Local VPC 10.0.4.12</span>
          </div>
          <div className="w-px h-4 bg-white/[0.06]" />
          {/* Ollama Status */}
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${statusColors[ollamaStatus]} animate-pulse`} />
            <span className="text-[10px] font-mono text-white/50">
              Ollama: {statusLabels[ollamaStatus]}
            </span>
          </div>
          <div className="w-px h-4 bg-white/[0.06]" />
          {/* VRAM */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
            <HardDrive className="w-3 h-3" />
            <span>{vram.used.toFixed(1)} / {vram.total} GB</span>
          </div>
          <div className="w-px h-4 bg-white/[0.06]" />
          {/* Throughput */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
            <Activity className="w-3 h-3" />
            <span className="text-aegis-green">{tokensPerSec.toFixed(1)} t/s</span>
          </div>
        </div>

        {/* Center: Search / Cmd+K */}
        <button
          onClick={() => setCmdOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors cursor-pointer min-w-[240px]"
        >
          <Search className="w-3 h-3 text-white/30" />
          <span className="text-[10px] font-mono text-white/30">Search anything...</span>
          <div className="ml-auto flex items-center gap-0.5 text-white/20">
            <Command className="w-2.5 h-2.5" />
            <span className="text-[9px]">K</span>
          </div>
        </button>

        {/* Right: Ledger + Notifications + Profile */}
        <div className="flex items-center gap-4">
          {/* Ledger Status */}
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <Shield className="w-3 h-3 text-aegis-green" />
            <span className="text-white/40">Block #{ledgerBlock.number}</span>
            <span className="text-white/20">{ledgerBlock.hash}</span>
            <Badge variant="green" className="text-[8px] px-1.5 py-0">
              VALID
            </Badge>
          </div>

          <div className="w-px h-4 bg-white/[0.06]" />

          {/* Notifications */}
          <button className="relative text-white/30 hover:text-white/60 transition-colors cursor-pointer">
            <Bell className="w-4 h-4" />
            {notifCount > 0 && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-aegis-red rounded-full flex items-center justify-center">
                <span className="text-[7px] font-mono text-white font-bold">{notifCount}</span>
              </div>
            )}
          </button>

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/[0.06] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white/40" />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-white/60">Root Admin</div>
              <div className="text-[8px] font-mono text-white/25">Full Access</div>
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      {cmdOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCmdOpen(false)} />
          <div className="relative bg-[#111] border border-white/[0.08] w-full max-w-lg shadow-2xl">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <Search className="w-4 h-4 text-white/30" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, blocks, policies, settings..."
                className="flex-1 bg-transparent text-sm font-mono text-white outline-none placeholder:text-white/20"
              />
              <kbd className="text-[9px] font-mono text-white/20 border border-white/10 px-1.5 py-0.5">ESC</kbd>
            </div>
            <div className="max-h-[300px] overflow-y-auto py-2">
              {[
                { section: "Views", items: ["Command Center", "Consensus Room", "Transactions", "RAG Oracle", "Ledger", "PR Guardrail", "Settings"] },
                { section: "Actions", items: ["Run Ledger Verification", "Trigger Chaos Audit", "Export Audit Report", "Add Team Member"] },
              ].map((group) => (
                <div key={group.section}>
                  <div className="px-4 py-1.5 text-[9px] font-mono uppercase tracking-widest text-white/20">{group.section}</div>
                  {group.items.map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 text-[11px] font-mono text-white/50 hover:bg-white/[0.03] hover:text-white/80 transition-colors cursor-pointer"
                      onClick={() => setCmdOpen(false)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Shield(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
