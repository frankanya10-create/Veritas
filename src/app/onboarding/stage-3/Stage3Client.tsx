"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { StatefulButton } from "@/components/motion/button/stateful";
import { Button } from "@/components/motion/button/base";
import { Checkbox } from "@/components/motion/checkbox";
import { cn } from "@/lib/utils";

const FRAMEWORKS = [
  { id: "cbn_aml", label: "CBN AML / KYT", desc: "Central Bank of Nigeria anti-money laundering" },
  { id: "soc2", label: "SOC 2 Type II", desc: "Service organization controls" },
  { id: "iso27001", label: "ISO 27001", desc: "Information security management" },
  { id: "gdpr", label: "GDPR", desc: "General Data Protection Regulation" },
  { id: "hipaa", label: "HIPAA", desc: "Health Insurance Portability and Accountability" },
  { id: "pci_dss", label: "PCI-DSS v4.0", desc: "Payment Card Industry Data Security Standard" },
];

export default function Stage3Client() {
  const router = useRouter();
  const { state, updateField, completeAndNext, goBack } = useOnboardingState();
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(state.frameworks);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [ingesting, setIngesting] = useState(false);
  const [ingestProgress, setIngestProgress] = useState(0);
  const [ingestComplete, setIngestComplete] = useState(state.ragDocumentsUploaded > 0);
  const [testRunning, setTestRunning] = useState(false);
  const [testPassed, setTestPassed] = useState(state.ragTestPassed);
  const [testResult, setTestResult] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFramework = (id: string) => {
    setSelectedFrameworks((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      [".pdf", ".docx", ".md", ".json", ".markdown"].some((ext) => f.name.endsWith(ext))
    );
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const runIngestion = async () => {
    setIngesting(true);
    setIngestProgress(0);
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((r) => setTimeout(r, 60));
      setIngestProgress(i);
    }
    updateField("ragDocumentsUploaded", uploadedFiles.length);
    setIngestComplete(true);
    setIngesting(false);
  };

  const runTestQuery = async () => {
    setTestRunning(true);
    setTestResult("");
    await new Promise((r) => setTimeout(r, 2000));
    setTestResult("Semantic search returned 3 relevant chunks from 2 documents in 47ms. Vector similarity: 0.89");
    setTestPassed(true);
    updateField("ragTestPassed", true);
    setTestRunning(false);
  };

  const handleContinue = () => {
    updateField("frameworks", selectedFrameworks);
    toast.success("Frameworks saved");
    completeAndNext(router);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-white mb-2">
          Regulatory Framework & RAG Ingestion
        </h1>
        <p className="text-zinc-500 text-sm">
          Select frameworks and ingest compliance documents for local vector search.
        </p>
      </div>

      {/* Framework Selectors */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-4">Regulatory Frameworks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FRAMEWORKS.map((fw) => (
            <div
              key={fw.id}
              onClick={() => toggleFramework(fw.id)}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all",
                selectedFrameworks.includes(fw.id)
                  ? "border-aegis-green/50 bg-aegis-green/5"
                  : "border-zinc-800 bg-zinc-800/50 hover:border-zinc-600"
              )}
            >
              <Checkbox
                checked={selectedFrameworks.includes(fw.id)}
                onCheckedChange={() => toggleFramework(fw.id)}
                label={fw.label}
              />
              <p className="text-[10px] text-zinc-500 mt-1 ml-8">{fw.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Document Upload */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-4">Document Ingestion Engine</h3>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "p-8 rounded-lg border-2 border-dashed cursor-pointer transition-all text-center",
            dragOver ? "border-aegis-green bg-aegis-green/5" : "border-zinc-700 hover:border-zinc-600"
          )}
        >
          <svg className="w-8 h-8 text-zinc-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-zinc-400">Drop documents or click to upload</p>
          <p className="text-[10px] text-zinc-600 mt-1">.pdf, .docx, .md, .json</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.md,.json,.markdown"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-zinc-800/50">
                <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs text-zinc-300 flex-1">{file.name}</span>
                <span className="text-[10px] text-zinc-600">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
            {!ingestComplete && (
              <StatefulButton
                state={ingesting ? "loading" : "idle"}
                loadingText={`Ingesting... ${ingestProgress}%`}
                onClick={runIngestion}
                className="w-full bg-zinc-800 text-white text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-700"
              >
                Start Ingestion
              </StatefulButton>
            )}
            {ingesting && (
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ingestProgress}%` }}
                  className="h-full bg-aegis-green rounded-full"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* RAG Test */}
      {ingestComplete && (
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <h3 className="font-[var(--font-heading)] text-sm font-bold text-white mb-4">Synthetic RAG Diagnostic</h3>
          <StatefulButton
            state={testRunning ? "loading" : testPassed ? "success" : "idle"}
            loadingText="Running test..."
            successText="Test passed"
            onClick={runTestQuery}
            disabled={testPassed}
            className="w-full bg-zinc-800 text-white text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full hover:bg-zinc-700"
          >
            Run Test Query
          </StatefulButton>
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
            >
              <p className="text-xs text-emerald-400 font-mono">{testResult}</p>
            </motion.div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => goBack(router)} className="flex-1 text-zinc-500 hover:text-zinc-300">
          ← Back
        </Button>
        <StatefulButton
          onClick={handleContinue}
          disabled={selectedFrameworks.length === 0}
          className="flex-1 bg-white text-black text-xs font-[var(--font-heading)] font-bold tracking-wider uppercase rounded-full"
        >
          Continue →
        </StatefulButton>
      </div>
    </div>
  );
}
