-- Veritas Dashboard — Multi-Tenant Schema Extension
-- Migration: veritas-dashboard-schema
-- Adds tenant isolation, onboarding persistence, and all dashboard modules

-- ============================================================
-- 1. Tenants (Organization Workspaces)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  domain          TEXT,
  subdomain       TEXT,
  logo_url        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants (slug);

-- ============================================================
-- 2. Tenant Members (RBAC)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tenant_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL,
  email           TEXT NOT NULL,
  name            TEXT,
  role            TEXT NOT NULL DEFAULT 'read_only',
  avatar_url      TEXT,
  mfa_enabled     BOOLEAN NOT NULL DEFAULT false,
  last_active_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_members_tenant ON public.tenant_members (tenant_id);
CREATE INDEX IF NOT EXISTS idx_members_user ON public.tenant_members (user_id);
CREATE INDEX IF NOT EXISTS idx_members_role ON public.tenant_members (role);

-- ============================================================
-- 3. Onboarding State (Persisted from sessionStorage)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.onboarding_state (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  -- Stage 1: Identity
  tenant_name           TEXT,
  tenant_slug           TEXT,
  domain                TEXT,
  subdomain             TEXT,
  genesis_block_hash    TEXT,
  recovery_seed         TEXT,
  webauthn_registered   BOOLEAN DEFAULT false,
  totp_setup            BOOLEAN DEFAULT false,
  -- Stage 2: AI Node
  ollama_connected      BOOLEAN DEFAULT false,
  ollama_models         JSONB DEFAULT '[]'::jsonb,
  vram_usage            DOUBLE PRECISION DEFAULT 0,
  tokens_per_sec        DOUBLE PRECISION DEFAULT 0,
  air_gap_enabled       BOOLEAN DEFAULT false,
  preferred_model       TEXT,
  -- Stage 3: Frameworks
  frameworks            JSONB DEFAULT '[]'::jsonb,
  rag_documents_uploaded INTEGER DEFAULT 0,
  rag_test_passed       BOOLEAN DEFAULT false,
  -- Stage 4: Agent Config
  prosecutor_tolerance  TEXT DEFAULT 'balanced',
  defense_baseline      TEXT DEFAULT 'standard',
  judge_consensus       TEXT DEFAULT 'majority',
  confidence_threshold  DOUBLE PRECISION DEFAULT 0.7,
  human_tiebreaker      BOOLEAN DEFAULT true,
  -- Stage 5: Pipelines
  api_key               TEXT,
  webhook_secret        TEXT,
  log_parsers           JSONB DEFAULT '[]'::jsonb,
  ci_snippet            TEXT,
  -- Stage 6: Team
  sso_provider          TEXT,
  sso_configured        BOOLEAN DEFAULT false,
  team_invites          JSONB DEFAULT '[]'::jsonb,
  -- Stage 7: Chaos
  chaos_enabled         BOOLEAN DEFAULT false,
  chaos_vectors         JSONB DEFAULT '[]'::jsonb,
  slack_webhook         TEXT,
  pagerduty_key         TEXT,
  escalation_email      TEXT,
  -- Stage 8: Activation
  activated             BOOLEAN DEFAULT false,
  completed_stages      JSONB DEFAULT '[]'::jsonb,
  activated_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_tenant ON public.onboarding_state (tenant_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_onboarding_tenant_unique ON public.onboarding_state (tenant_id);

-- ============================================================
-- 4. Transactions (Real-time financial events)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  transaction_hash    TEXT NOT NULL,
  sender_account      TEXT NOT NULL,
  recipient_account   TEXT NOT NULL,
  amount              DOUBLE PRECISION NOT NULL,
  asset_type          TEXT NOT NULL DEFAULT 'USD',
  risk_score          INTEGER NOT NULL DEFAULT 0,
  status              TEXT NOT NULL DEFAULT 'pending',
  aml_flags           JSONB DEFAULT '[]'::jsonb,
  agent_consensus     TEXT,
  source_ip           TEXT,
  geolocation         TEXT,
  metadata            JSONB DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_txn_tenant ON public.transactions (tenant_id);
CREATE INDEX IF NOT EXISTS idx_txn_hash ON public.transactions (transaction_hash);
CREATE INDEX IF NOT EXISTS idx_txn_status ON public.transactions (status);
CREATE INDEX IF NOT EXISTS idx_txn_risk ON public.transactions (risk_score);
CREATE INDEX IF NOT EXISTS idx_txn_created ON public.transactions (created_at);

-- ============================================================
-- 5. Consensus Votes (Multi-agent debate records)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.consensus_votes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  transaction_id      UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  event_type          TEXT NOT NULL DEFAULT 'transaction',
  event_reference     TEXT NOT NULL,
  amount              DOUBLE PRECISION,
  status              TEXT NOT NULL DEFAULT 'pending',
  -- Prosecutor Agent
  prosecutor_vote     TEXT,
  prosecutor_confidence DOUBLE PRECISION,
  prosecutor_reasoning JSONB DEFAULT '[]'::jsonb,
  prosecutor_model    TEXT,
  -- Defense Agent
  defense_vote        TEXT,
  defense_confidence  DOUBLE PRECISION,
  defense_reasoning   JSONB DEFAULT '[]'::jsonb,
  defense_model       TEXT,
  -- Judge Agent
  judge_vote          TEXT,
  judge_confidence    DOUBLE PRECISION,
  judge_reasoning     JSONB DEFAULT '[]'::jsonb,
  judge_model         TEXT,
  -- Final
  final_verdict       TEXT,
  final_confidence    DOUBLE PRECISION,
  human_overridden    BOOLEAN DEFAULT false,
  override_by         UUID,
  override_reason     TEXT,
  override_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consensus_tenant ON public.consensus_votes (tenant_id);
CREATE INDEX IF NOT EXISTS idx_consensus_status ON public.consensus_votes (status);
CREATE INDEX IF NOT EXISTS idx_consensus_verdict ON public.consensus_votes (final_verdict);
CREATE INDEX IF NOT EXISTS idx_consensus_created ON public.consensus_votes (created_at);

-- ============================================================
-- 6. RAG Documents (Knowledge base)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rag_documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  framework_tag       TEXT,
  file_type           TEXT NOT NULL,
  file_size           INTEGER,
  chunk_count         INTEGER DEFAULT 0,
  status              TEXT NOT NULL DEFAULT 'processing',
  version             TEXT DEFAULT '1.0',
  storage_key         TEXT,
  metadata            JSONB DEFAULT '{}'::jsonb,
  ingested_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rag_tenant ON public.rag_documents (tenant_id);
CREATE INDEX IF NOT EXISTS idx_rag_framework ON public.rag_documents (framework_tag);
CREATE INDEX IF NOT EXISTS idx_rag_status ON public.rag_documents (status);

-- ============================================================
-- 7. RAG Queries (Oracle interaction log)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rag_queries (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  question            TEXT NOT NULL,
  answer              TEXT,
  model_used          TEXT,
  citations           JSONB DEFAULT '[]'::jsonb,
  latency_ms          INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rag_queries_tenant ON public.rag_queries (tenant_id);

-- ============================================================
-- 8. Ledger Blocks (SHA-256 chain)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ledger_blocks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  block_number        INTEGER NOT NULL,
  block_hash          TEXT NOT NULL,
  previous_hash       TEXT NOT NULL,
  merkle_root         TEXT,
  data                JSONB NOT NULL,
  entry_type          TEXT NOT NULL DEFAULT 'transaction',
  tx_count            INTEGER DEFAULT 0,
  officer_signature   TEXT,
  verified            BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, block_number)
);

CREATE INDEX IF NOT EXISTS idx_ledger_tenant ON public.ledger_blocks (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ledger_block_number ON public.ledger_blocks (block_number);
CREATE INDEX IF NOT EXISTS idx_ledger_verified ON public.ledger_blocks (verified);

-- ============================================================
-- 9. PR Scan Results (Guardrail)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pr_scans (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  pr_id               TEXT NOT NULL,
  pr_title            TEXT,
  repository          TEXT,
  branch              TEXT,
  author              TEXT,
  flags               JSONB DEFAULT '[]'::jsonb,
  severity            TEXT,
  risk_score          INTEGER DEFAULT 0,
  framework_refs      JSONB DEFAULT '[]'::jsonb,
  remediation_patches JSONB DEFAULT '[]'::jsonb,
  status              TEXT NOT NULL DEFAULT 'scanned',
  scanned_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prscan_tenant ON public.pr_scans (tenant_id);
CREATE INDEX IF NOT EXISTS idx_prscan_severity ON public.pr_scans (severity);
CREATE INDEX IF NOT EXISTS idx_prscan_status ON public.pr_scans (status);

-- ============================================================
-- 10. Chaos Reports (Adversarial audit results)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chaos_results (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  report_type         TEXT NOT NULL,
  tests_run           INTEGER NOT NULL DEFAULT 0,
  tests_passed        INTEGER NOT NULL DEFAULT 0,
  tests_failed        INTEGER NOT NULL DEFAULT 0,
  tests_warned        INTEGER DEFAULT 0,
  attack_vectors      JSONB DEFAULT '[]'::jsonb,
  vulnerabilities     JSONB DEFAULT '[]'::jsonb,
  recommendations     JSONB DEFAULT '[]'::jsonb,
  generated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  period_start        TIMESTAMPTZ,
  period_end          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_chaos_tenant ON public.chaos_results (tenant_id);
CREATE INDEX IF NOT EXISTS idx_chaos_type ON public.chaos_results (report_type);

-- ============================================================
-- 11. Tenant Settings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tenant_settings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  setting_key         TEXT NOT NULL,
  setting_value       JSONB NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, setting_key)
);

CREATE INDEX IF NOT EXISTS idx_settings_tenant ON public.tenant_settings (tenant_id);

-- ============================================================
-- 12. API Keys
-- ============================================================
CREATE TABLE IF NOT EXISTS public.api_keys (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  key_prefix          TEXT NOT NULL,
  key_hash            TEXT NOT NULL,
  scopes              JSONB DEFAULT '["ingest"]'::jsonb,
  last_used_at        TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ,
  revoked             BOOLEAN DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_apikeys_tenant ON public.api_keys (tenant_id);

-- ============================================================
-- 13. Webhooks
-- ============================================================
CREATE TABLE IF NOT EXISTS public.webhooks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  url                 TEXT NOT NULL,
  events              JSONB DEFAULT '[]'::jsonb,
  secret              TEXT,
  active              BOOLEAN DEFAULT true,
  last_triggered_at   TIMESTAMPTZ,
  failure_count       INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_tenant ON public.webhooks (tenant_id);

-- ============================================================
-- 14. Activity Feed (Real-time events for dashboard)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type          TEXT NOT NULL,
  severity            TEXT NOT NULL DEFAULT 'info',
  title               TEXT NOT NULL,
  description         TEXT,
  source              TEXT,
  metadata            JSONB DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_tenant ON public.activity_feed (tenant_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON public.activity_feed (event_type);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.activity_feed (created_at);

-- ============================================================
-- 15. Notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id             UUID,
  type                TEXT NOT NULL,
  title               TEXT NOT NULL,
  message             TEXT,
  read                BOOLEAN DEFAULT false,
  action_url          TEXT,
  metadata            JSONB DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_tenant ON public.notifications (tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications (read);
