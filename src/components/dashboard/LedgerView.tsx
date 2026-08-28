"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, Link2, ExternalLink, RefreshCw, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const blocks = Array.from({ length: 20 }, (_, i) => {
  const num = 48175 + i;
  const hash = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const prevHash = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return {
    number: num,
    hash: `${hash.slice(0, 8)}...${hash.slice(-4)}`,
    fullHash: hash,
    previousHash: `${prevHash.slice(0, 8)}...${prevHash.slice(-4)}`,
    txCount: Math.floor(Math.random() * 200) + 50,
    type: ["transaction", "consensus", "system", "audit"][Math.floor(Math.random() * 4)],
    verified: Math.random() > 0.02,
    timestamp: new Date(Date.now() - (19 - i) * 3600000).toISOString(),
  };
}).reverse();

export default function LedgerView() {
  const [selectedBlock, setSelectedBlock] = useState(blocks[0]);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"idle" | "pass" | "fail">("idle");

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerificationResult("pass");
      setTimeout(() => setVerificationResult("idle"), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono font-bold text-white tracking-tight">Tamper-Evident SHA-256 Ledger</h1>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Cryptographic audit chain for data integrity verification</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center gap-2 px-3 py-1.5 bg-aegis-green/10 border border-aegis-green/20 text-aegis-green font-mono text-[10px] uppercase tracking-wider hover:bg-aegis-green/20 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${verifying ? "animate-spin" : ""}`} />
            {verifying ? "Verifying..." : "Verify Ledger"}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] text-white/50 font-mono text-[10px] uppercase tracking-wider hover:bg-white/[0.05] transition-colors cursor-pointer">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Verification Banner */}
      {verificationResult !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 border ${
            verificationResult === "pass"
              ? "bg-aegis-green/5 border-aegis-green/20"
              : "bg-aegis-red/5 border-aegis-red/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {verificationResult === "pass" ? (
              <CheckCircle className="w-4 h-4 text-aegis-green" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-aegis-red" />
            )}
            <span className={`font-mono text-[11px] ${verificationResult === "pass" ? "text-aegis-green" : "text-aegis-red"}`}>
              {verificationResult === "pass"
                ? "Ledger integrity verified — all 20 blocks pass SHA-256 chain validation"
                : "TAMPER DETECTED — Block hash mismatch at block #48,187"}
            </span>
          </div>
        </motion.div>
      )}

      {/* Chain Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Blocks", value: "20", color: "text-white" },
          { label: "Verified", value: "19", color: "text-aegis-green" },
          { label: "Tampered", value: "1", color: "text-aegis-red" },
          { label: "Integrity", value: "95%", color: "text-aegis-amber" },
        ].map((s) => (
          <div key={s.label} className="bg-[#0A0A0A] border border-white/[0.06] p-3 text-center">
            <div className={`font-mono text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-white/30">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Block Explorer */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/[0.06]">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Block Chain</h3>
          </div>
          <div className="max-h-[450px] overflow-y-auto">
            {blocks.map((block, i) => (
              <div
                key={block.number}
                onClick={() => setSelectedBlock(block)}
                className={`px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors ${
                  selectedBlock.number === block.number ? "bg-white/[0.03] border-l-2 border-aegis-green" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-white/80">Block #{block.number}</span>
                    <Badge variant={block.verified ? "green" : "red"} className="text-[7px]">
                      {block.verified ? "VERIFIED" : "TAMPERED"}
                    </Badge>
                  </div>
                  <span className="font-mono text-[9px] text-white/20">{block.txCount} txns</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-mono text-[9px] text-white/30">
                    Hash: <span className="text-aegis-green/60">{block.hash}</span>
                  </div>
                  {i < blocks.length - 1 && (
                    <Link2 className="w-3 h-3 text-white/15" />
                  )}
                </div>
                <div className="font-mono text-[8px] text-white/15 mt-1">
                  {new Date(block.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block Detail */}
        <div className="bg-[#0A0A0A] border border-white/[0.06] p-4">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-4">
            Block #{selectedBlock.number} Detail
          </h3>
          <div className="space-y-3">
            {[
              { label: "Block Number", value: selectedBlock.number },
              { label: "Timestamp", value: new Date(selectedBlock.timestamp).toLocaleString() },
              { label: "Block Hash", value: selectedBlock.fullHash, mono: true },
              { label: "Previous Hash", value: blocks.find(b => b.number === selectedBlock.number - 1)?.fullHash || "0000000000000000", mono: true },
              { label: "Merkle Root", value: Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(""), mono: true },
              { label: "Transaction Count", value: selectedBlock.txCount },
              { label: "Entry Type", value: selectedBlock.type },
              { label: "Verified", value: selectedBlock.verified ? "Yes" : "No", color: selectedBlock.verified ? "text-aegis-green" : "text-aegis-red" },
            ].map((f) => (
              <div key={f.label}>
                <div className="font-mono text-[8px] uppercase tracking-wider text-white/25 mb-0.5">{f.label}</div>
                <div className={`font-mono text-[10px] ${f.color || "text-white/60"} ${f.mono ? "break-all" : ""}`}>{f.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/25 mb-2">Officer Signatures</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[9px] font-mono text-white/40">
                <CheckCircle className="w-3 h-3 text-aegis-green" />
                Root Admin — signed
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono text-white/40">
                <CheckCircle className="w-3 h-3 text-aegis-green" />
                Compliance Officer — signed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
