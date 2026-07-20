import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Veritas",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <span className="font-[var(--font-heading)] text-[10px] tracking-[0.25em] uppercase text-zinc-500">// LEGAL</span>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold mt-4 mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
          <p><strong className="text-zinc-200">1. Information We Collect</strong><br />We collect information you provide directly to us, including account details, payment information, identification documents for KYC/KYB verification, and transaction data submitted through the compliance platform. We also collect technical data such as IP addresses, browser fingerprints, and usage logs to maintain platform security and integrity.</p>

          <p><strong className="text-zinc-200">2. How We Use Your Data</strong><br />Your data is used exclusively to provide compliance intelligence services: real-time AML/KYT screening, transaction monitoring, regulatory reporting, audit trail generation, and platform improvement. We do not sell personal data to third parties.</p>

          <p><strong className="text-zinc-200">3. Data Sharing</strong><br />We may share data with regulatory authorities as required by applicable law, with financial institutions involved in flagged transactions, and with trusted sub-processors who provide infrastructure services (cloud hosting, encryption, auditing) under strict data processing agreements.</p>

          <p><strong className="text-zinc-200">4. Data Retention</strong><br />Transaction records and audit logs are retained for a minimum of 7 years to comply with AML and financial regulatory requirements. Account data is retained for the duration of your account plus 90 days post-termination. You may request earlier deletion subject to legal hold obligations.</p>

          <p><strong className="text-zinc-200">5. Security</strong><br />All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We employ row-level security (RLS) for multi-tenant data isolation, tamper-evident logging, and quarterly third-party security audits. Access controls follow the principle of least privilege.</p>

          <p><strong className="text-zinc-200">6. Your Rights (GDPR & CCPA)</strong><br />If you are in the EEA, you have the right to access, rectify, port, and delete your personal data, as well as the right to restrict or object to processing. California residents may request disclosure of data collection and sales practices. To exercise these rights, contact privacy@veritas.com.</p>

          <p><strong className="text-zinc-200">7. International Transfers</strong><br />Data may be processed in data centers located in the United States, European Union, or Nigeria, depending on institutional requirements. We ensure adequate safeguards through Standard Contractual Clauses and adherence to applicable cross-border data transfer regulations.</p>

          <section id="cookies" className="pt-8 border-t border-zinc-800">
            <h2 className="font-[var(--font-heading)] text-lg font-bold text-zinc-200 mb-4">Cookie Policy</h2>
            <p><strong className="text-zinc-200">8. What Are Cookies</strong><br />Cookies are small text files stored on your device that help us authenticate users, maintain session state, analyze platform usage, and remember your preferences.</p>
            <p className="mt-4"><strong className="text-zinc-200">9. Cookies We Use</strong><br /><strong>Essential cookies</strong> (session tokens, CSRF tokens) are required for platform operation and cannot be disabled. <strong>Analytics cookies</strong> help us understand feature usage and improve the platform. <strong>Preference cookies</strong> remember your settings across sessions.</p>
            <p className="mt-4"><strong className="text-zinc-200">10. Managing Cookies</strong><br />You can control cookies through your browser settings or our cookie consent banner. Disabling essential cookies may prevent the platform from functioning correctly. Analytics and preference cookies can be declined without affecting core functionality.</p>
            <p className="mt-4"><strong className="text-zinc-200">11. Third-Party Cookies</strong><br />We do not use third-party advertising or tracking cookies. Any third-party cookies (e.g., from our infrastructure providers) are strictly limited to service delivery and are governed by our data processing agreements.</p>
            <p className="text-zinc-600 text-xs pt-4">Last updated: July 2026</p>
          </section>
        </div>
      </div>
    </main>
  );
}
