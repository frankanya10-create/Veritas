"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { completeOnboarding } from "@/app/actions";

const questions = [
  {
    key: "role",
    label: "What is your role?",
    options: [
      { value: "compliance_officer", label: "Compliance Officer" },
      { value: "ciso", label: "CISO / Security Lead" },
      { value: "developer", label: "Software Developer" },
      { value: "finops", label: "Financial Operations" },
      { value: "executive", label: "Executive / Leadership" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "frameworks",
    label: "Which regulatory frameworks matter to you?",
    options: [
      { value: "cbn", label: "CBN Guidelines (Nigeria)" },
      { value: "aml_kyt", label: "AML / KYT Compliance" },
      { value: "soc2", label: "SOC 2" },
      { value: "iso27001", label: "ISO 27001" },
      { value: "gdpr", label: "GDPR" },
      { value: "pci_dss", label: "PCI-DSS" },
    ],
  },
  {
    key: "useCase",
    label: "What is your primary use case?",
    options: [
      { value: "transaction_monitoring", label: "Real-Time Transaction Monitoring" },
      { value: "audit_automation", label: "Audit Automation & Reporting" },
      { value: "risk_scoring", label: "Risk Scoring & Fraud Detection" },
      { value: "reconciliation", label: "Ledger Reconciliation" },
      { value: "policy_mapping", label: "Regulatory Policy Mapping" },
    ],
  },
  {
    key: "volume",
    label: "Monthly transaction volume?",
    options: [
      { value: "<10k", label: "Less than 10,000" },
      { value: "10k-100k", label: "10,000 - 100,000" },
      { value: "100k-1m", label: "100,000 - 1,000,000" },
      { value: "1m+", label: "1,000,000+" },
    ],
  },
];

export default function OnboardingClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-card]");
    gsap.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
  }, [step]);

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [questions[step].key]: value }));
    setDirection("next");
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection("prev");
      setStep((s) => s - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");
    const form = new FormData();
    Object.entries(answers).forEach(([k, v]) => form.set(k, v));
    const result = await completeOnboarding(form);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else {
      router.push("/dashboard");
    }
  };

  const q = questions[step];
  const isLast = step === questions.length - 1;
  const isFirst = step === 0;

  return (
    <div ref={containerRef} className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div data-card className="text-center mb-10">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none">
              <rect x="2" y="2" width="96" height="96" rx="20" fill="#111" stroke="#333" strokeWidth="2" />
              <text x="50" y="68" fontFamily="system-ui" fontSize="56" fontWeight="800" fill="#00FF66" textAnchor="middle">V</text>
            </svg>
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= step ? "w-5 bg-zinc-300" : "w-1.5 bg-zinc-800"}`} />
            ))}
          </div>
          <h1 className="font-[var(--font-heading)] text-lg font-bold text-white">{q.label}</h1>
          <p className="text-zinc-500 text-xs mt-1">Step {step + 1} of {questions.length}</p>
        </div>

        <div className="space-y-2">
          {q.options.map((opt) => (
            <button
              key={opt.value}
              data-card
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-4 py-3 rounded border text-sm font-[var(--font-heading)] transition-all duration-300 cursor-pointer ${
                answers[q.key] === opt.value
                  ? "border-zinc-500 bg-zinc-900 text-white"
                  : "border-zinc-800 bg-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {error && <p data-card className="text-red-400 text-xs font-[var(--font-heading)] mt-3">{error}</p>}

        <div data-card className="flex items-center justify-between mt-8">
          {!isFirst ? (
            <button onClick={handleBack} className="text-[11px] font-[var(--font-heading)] tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
              Back
            </button>
          ) : (
            <div />
          )}
          {isLast && (
            <button
              onClick={handleFinish}
              disabled={loading || !answers[q.key]}
              className="px-5 py-2 bg-white text-black text-[10px] font-[var(--font-heading)] font-bold tracking-wider uppercase rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Setting up..." : "Go to Dashboard"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
