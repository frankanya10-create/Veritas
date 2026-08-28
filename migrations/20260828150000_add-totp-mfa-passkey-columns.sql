-- Add TOTP, MFA verification, and passkey columns to onboarding_state

ALTER TABLE public.onboarding_state
  ADD COLUMN IF NOT EXISTS totp_secret TEXT,
  ADD COLUMN IF NOT EXISTS mfa_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS passkey_credentials JSONB DEFAULT '[]'::jsonb;

-- Index for subdomain uniqueness check
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_subdomain_unique ON public.tenants (subdomain) WHERE subdomain IS NOT NULL;
