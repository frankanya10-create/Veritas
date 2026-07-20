-- AegisNode Compliance Engine — InsForge Database Schema
-- Migration: aegisnode-schema

-- ============================================================
-- 1. Compliance Frameworks
-- ============================================================
CREATE TABLE IF NOT EXISTS public.compliance_frameworks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  version       TEXT,
  status        TEXT NOT NULL DEFAULT 'active',
  control_count INTEGER NOT NULL DEFAULT 0,
  mapped_count  INTEGER NOT NULL DEFAULT 0,
  compliance_score DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frameworks_name ON public.compliance_frameworks (name);
CREATE INDEX IF NOT EXISTS idx_frameworks_status ON public.compliance_frameworks (status);

-- ============================================================
-- 2. Controls
-- ============================================================
CREATE TABLE IF NOT EXISTS public.controls (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id    UUID NOT NULL REFERENCES public.compliance_frameworks(id) ON DELETE CASCADE,
  control_id      TEXT NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'unmapped',
  confidence      DOUBLE PRECISION NOT NULL DEFAULT 0,
  mapped_frameworks JSONB DEFAULT '[]'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_controls_framework ON public.controls (framework_id);
CREATE INDEX IF NOT EXISTS idx_controls_control_id ON public.controls (control_id);
CREATE INDEX IF NOT EXISTS idx_controls_status ON public.controls (status);

-- ============================================================
-- 3. Evidence Records
-- ============================================================
CREATE TABLE IF NOT EXISTS public.evidence_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source          TEXT NOT NULL,
  type            TEXT NOT NULL,
  raw_data        TEXT,
  parsed_data     JSONB DEFAULT '{}'::jsonb,
  status          TEXT NOT NULL DEFAULT 'pending',
  hash            TEXT,
  framework_refs  JSONB DEFAULT '[]'::jsonb,
  ingested_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_source ON public.evidence_records (source);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON public.evidence_records (type);
CREATE INDEX IF NOT EXISTS idx_evidence_status ON public.evidence_records (status);

-- ============================================================
-- 4. Audit Log
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    TEXT NOT NULL,
  source        TEXT NOT NULL,
  severity      TEXT NOT NULL DEFAULT 'info',
  message       TEXT,
  metadata      JSONB DEFAULT '{}'::jsonb,
  timestamp     TIMESTAMPTZ NOT NULL DEFAULT now(),
  ledger_hash   TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_event_type ON public.audit_log (event_type);
CREATE INDEX IF NOT EXISTS idx_audit_severity ON public.audit_log (severity);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_log (timestamp);

-- ============================================================
-- 5. Tamper-Evident Ledger
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tamper_ledger (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number    INTEGER NOT NULL,
  data            JSONB NOT NULL,
  hash            TEXT NOT NULL,
  previous_hash   TEXT NOT NULL,
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified        BOOLEAN NOT NULL DEFAULT true,
  entry_type      TEXT
);

CREATE INDEX IF NOT EXISTS idx_ledger_entry_number ON public.tamper_ledger (entry_number);
CREATE INDEX IF NOT EXISTS idx_ledger_verified ON public.tamper_ledger (verified);
CREATE INDEX IF NOT EXISTS idx_ledger_type ON public.tamper_ledger (entry_type);

-- ============================================================
-- 6. Guardrail Flags
-- ============================================================
CREATE TABLE IF NOT EXISTS public.guardrail_flags (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pr_id           TEXT NOT NULL,
  pr_title        TEXT,
  flags           JSONB DEFAULT '[]'::jsonb,
  severity        TEXT,
  framework_refs  JSONB DEFAULT '[]'::jsonb,
  scanned_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  status          TEXT NOT NULL DEFAULT 'open'
);

CREATE INDEX IF NOT EXISTS idx_guardrail_pr_id ON public.guardrail_flags (pr_id);
CREATE INDEX IF NOT EXISTS idx_guardrail_severity ON public.guardrail_flags (severity);
CREATE INDEX IF NOT EXISTS idx_guardrail_status ON public.guardrail_flags (status);

-- ============================================================
-- 7. Chaos Reports
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chaos_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type     TEXT NOT NULL,
  tests_run       INTEGER NOT NULL DEFAULT 0,
  tests_passed    INTEGER NOT NULL DEFAULT 0,
  tests_failed    INTEGER NOT NULL DEFAULT 0,
  vulnerabilities JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  period_start    TIMESTAMPTZ,
  period_end      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_chaos_report_type ON public.chaos_reports (report_type);
CREATE INDEX IF NOT EXISTS idx_chaos_generated_at ON public.chaos_reports (generated_at);

-- ============================================================
-- Seed initial compliance frameworks
-- ============================================================
INSERT INTO public.compliance_frameworks (name, version, status, control_count, compliance_score)
VALUES
  ('SOC 2 Type II', '2017', 'active', 114, 94.0),
  ('ISO 27001:2022', '2022', 'active', 93, 87.0),
  ('GDPR', '2016/679', 'active', 99, 91.0),
  ('HIPAA', '2013', 'active', 45, 78.0),
  ('PCI-DSS v4.0', '4.0', 'active', 300, 82.0),
  ('NIST CSF', '2.0', 'active', 106, 89.0),
  ('NIST 800-53', 'Rev 5', 'active', 1000, 85.0),
  ('FedRAMP', 'Moderate', 'active', 325, 80.0),
  ('CCPA', '2020', 'active', 28, 92.0),
  ('SOX', '2002', 'active', 52, 88.0),
  ('CSA CCM', '4.0', 'active', 197, 86.0),
  ('CIS Controls', 'v8', 'active', 153, 90.0)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed initial ledger genesis entry
-- ============================================================
INSERT INTO public.tamper_ledger (entry_number, data, hash, previous_hash, verified, entry_type)
VALUES (
  1,
  '{"event": "genesis", "message": "AegisNode tamper-evident ledger initialized", "version": "4.2.1"}'::jsonb,
  'a0c3f2e8d1b4c7a9e5f6d3b2a8c1e4f7d9b0a3c6e2f5d8b1a4c7e0f3d6b9a2c5',
  '0000000000000000000000000000000000000000000000000000000000000000',
  true,
  'system'
) ON CONFLICT DO NOTHING;
