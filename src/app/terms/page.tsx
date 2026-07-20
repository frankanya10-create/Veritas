import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Veritas",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <span className="font-[var(--font-heading)] text-[10px] tracking-[0.25em] uppercase text-zinc-500">// LEGAL</span>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold mt-4 mb-8">Terms of Service</h1>
        <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
          <p><strong className="text-zinc-200">1. Acceptance of Terms</strong><br />By accessing or using the Veritas platform (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          <p><strong className="text-zinc-200">2. Description of Service</strong><br />Veritas provides multi-agent AI compliance intelligence, including real-time transaction monitoring, AML/KYT detection, regulatory alignment against frameworks such as CBN AML, FATF 40, ISO 27001, PCI-DSS, BOFIA 2020, MLPPA 2022, and NYDFS, tamper-evident audit trails, and automated regulatory reporting.</p>
          <p><strong className="text-zinc-200">3. User Responsibilities</strong><br />You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree not to use the Service for any unlawful purpose or in violation of any applicable financial regulations.</p>
          <p><strong className="text-zinc-200">4. Data Privacy & Security</strong><br />All data processed through the Service is encrypted in transit and at rest. Veritas implements row-level security to ensure user data isolation. We do not share your data with third parties except as required by law. See our Privacy Policy for details.</p>
          <p><strong className="text-zinc-200">5. Service Level Agreement</strong><br />Veritas targets 99.9% uptime for the compliance engine. Scheduled maintenance is communicated at least 24 hours in advance. Emergency patches are applied with minimal disruption.</p>
          <p><strong className="text-zinc-200">6. Limitation of Liability</strong><br />Veritas shall not be liable for indirect, incidental, or consequential damages arising from the use of the Service, including but not limited to regulatory penalties, compliance failures, or financial losses resulting from delayed detection.</p>
          <p><strong className="text-zinc-200">7. Termination</strong><br />We reserve the right to suspend or terminate access to the Service for violation of these terms, extended inactivity, or at your request. Data will be retained for 90 days post-termination unless deletion is requested.</p>
          <p><strong className="text-zinc-200">8. Modifications</strong><br />These terms may be updated at any time. Continued use of the Service after changes constitutes acceptance of the revised terms.</p>
          <p className="text-zinc-600 text-xs pt-4">Last updated: July 2026</p>
        </div>
      </div>
    </main>
  );
}
