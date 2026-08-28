"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Upload, Search, MessageSquare, FileText, ExternalLink, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const documents = [
  { title: "CBN AML Guidelines 2024", framework: "CBN", version: "3.2", chunks: 142, status: "active", date: "2024-11-15" },
  { title: "SOC 2 Type II Controls", framework: "SOC2", version: "2.1", chunks: 89, status: "active", date: "2024-10-20" },
  { title: "GDPR Data Processing", framework: "GDPR", version: "1.4", chunks: 67, status: "active", date: "2024-09-08" },
  { title: "Internal KYC Procedure", framework: "Custom", version: "1.0", chunks: 34, status: "active", date: "2024-12-01" },
  { title: "ISO 27001 Annex A", framework: "ISO", version: "2.0", chunks: 203, status: "active", date: "2024-08-22" },
  { title: "PCI-DSS v4.0 Requirements", framework: "PCI", version: "4.0", chunks: 300, status: "processing", date: "2024-12-10" },
];

const oracleHistory = [
  { q: "What is the maximum retention period for authorization logs under PCI-DSS?", a: "PCI-DSS v4.0 Requirement 10.7 mandates that audit trail history be retained for a minimum of 12 months, with at least 3 months immediately available for analysis. Historical data beyond 12 months should be archived per organizational policy.", citations: ["PCI-DSS v4.0 §10.7.1", "PCI-DSS v4.0 §10.7.2"] },
  { q: "What are the CBN requirements for suspicious transaction reporting?", a: "The Central Bank of Nigeria requires all financial institutions to file Suspicious Transaction Reports (STRs) within 24 hours of detection. Reports must be submitted to the Nigerian Financial Intelligence Unit (NFIU) via the goAML platform. Failure to report carries penalties under the Money Laundering (Prevention and Prohibition) Act 2022.", citations: ["CBN AML Framework §4.2", "MLPPA 2022 §6(2)"] },
];

export default function RAGOracle() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"oracle" | "documents">("oracle");
  const [chatHistory, setChatHistory] = useState(oracleHistory);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleQuery = () => {
    if (!query.trim()) return;
    setIsQuerying(true);
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        q: query,
        a: "Based on the ingested regulatory documents, this topic falls under multiple compliance frameworks. The local Llama 3.2:3B model has analyzed the relevant document chunks and synthesized this response. In a production environment with actual RAG data, this would contain precise citations from your uploaded documents.",
        citations: ["CBN AML Framework §3.1", "SOC 2 CC6.1"],
      }]);
      setQuery("");
      setIsQuerying(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-mono font-bold text-white tracking-tight">RAG Oracle & Knowledge Hub</h1>
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Query regulatory knowledge and manage document ingestion</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06]">
        {[
          { id: "oracle" as const, label: "Regulatory Oracle", icon: MessageSquare },
          { id: "documents" as const, label: "Knowledge Base", icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === tab.id
                ? "text-aegis-green border-aegis-green"
                : "text-white/25 border-transparent hover:text-white/50"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "oracle" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/[0.06] flex flex-col">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40">Conversational Oracle</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
              {chatHistory.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-aegis-green/10 border border-aegis-green/20 px-3 py-2 max-w-[80%]">
                      <div className="font-mono text-[10px] text-aegis-green/80">{item.q}</div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white/[0.03] border border-white/[0.06] px-3 py-2 max-w-[80%]">
                      <div className="font-mono text-[10px] text-white/50 leading-relaxed">{item.a}</div>
                      <div className="flex gap-1.5 mt-2">
                        {item.citations.map((c) => (
                          <Badge key={c} variant="blue" className="text-[7px] cursor-pointer hover:bg-aegis-blue/20">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isQuerying && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-aegis-green animate-pulse" />
                      <span className="font-mono text-[9px] text-white/30">Querying local vector store...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                  placeholder="Ask about compliance policies, regulations..."
                  className="flex-1 h-8 px-3 bg-black/40 border border-white/[0.06] font-mono text-[10px] text-white/60 placeholder:text-white/20 outline-none focus:border-white/10 transition-colors"
                />
                <button
                  onClick={handleQuery}
                  disabled={isQuerying}
                  className="px-4 h-8 bg-aegis-green/10 border border-aegis-green/20 text-aegis-green font-mono text-[10px] uppercase tracking-wider hover:bg-aegis-green/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Query
                </button>
              </div>
              <p className="font-mono text-[8px] text-white/15 mt-1.5">Powered by Llama 3.2:3B running locally on your infrastructure</p>
            </div>
          </div>

          {/* Document Summary */}
          <div className="bg-[#0A0A0A] border border-white/[0.06] p-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">Knowledge Base Stats</h3>
            <div className="space-y-3">
              <div className="bg-black/40 border border-white/[0.04] p-3">
                <div className="font-mono text-2xl font-bold text-aegis-green">835</div>
                <div className="font-mono text-[9px] text-white/30">Total Chunks Embedded</div>
              </div>
              <div className="bg-black/40 border border-white/[0.04] p-3">
                <div className="font-mono text-2xl font-bold text-aegis-blue">6</div>
                <div className="font-mono text-[9px] text-white/30">Active Documents</div>
              </div>
              <div className="bg-black/40 border border-white/[0.04] p-3">
                <div className="font-mono text-2xl font-bold text-aegis-amber">5</div>
                <div className="font-mono text-[9px] text-white/30">Frameworks Covered</div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/25 mb-2">Recent Queries</h4>
              <div className="space-y-1.5">
                {["Retention periods", "STR reporting", "KYC requirements", "Data processing"].map((q) => (
                  <div key={q} className="flex items-center gap-2 text-[9px] font-mono text-white/30">
                    <Clock className="w-2.5 h-2.5" />
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Documents Tab */
        <div className="space-y-4">
          {/* Upload Zone */}
          <div className="border-2 border-dashed border-white/[0.08] p-8 text-center hover:border-white/[0.15] transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-white/15 mx-auto mb-3" />
            <p className="font-mono text-[11px] text-white/40">Drag & drop policy documents here</p>
            <p className="font-mono text-[9px] text-white/20 mt-1">Accepts PDF, DOCX, Markdown, JSON</p>
          </div>

          {/* Document Table */}
          <div className="bg-[#0A0A0A] border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Document", "Framework", "Version", "Chunks", "Status", "Ingested"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-mono text-[9px] uppercase tracking-wider text-white/20 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.title} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-white/20" />
                        <span className="font-mono text-[10px] text-white/70">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant="blue" className="text-[8px]">{doc.framework}</Badge>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-white/40">{doc.version}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-white/40">{doc.chunks}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={doc.status === "active" ? "green" : "amber"} className="text-[8px]">{doc.status}</Badge>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-white/30">{doc.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
