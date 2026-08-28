"use client";

import { useState, useCallback, useEffect } from "react";

export interface OnboardingState {
  currentStage: number;
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  domain: string;
  subdomain: string;
  genesisBlockHash: string;
  recoverySeed: string[];
  webAuthnRegistered: boolean;
  totpSecret: string;
  totpSetup: boolean;
  mfaVerified: boolean;
  ollamaConnected: boolean;
  ollamaModels: string[];
  vramUsage: number;
  tokensPerSec: number;
  airGapEnabled: boolean;
  frameworks: string[];
  ragDocumentsUploaded: number;
  ragTestPassed: boolean;
  prosecutorTolerance: string;
  defenseBaseline: string;
  judgeConsensus: string;
  confidenceThreshold: number;
  humanTiebreaker: boolean;
  apiKey: string;
  webhookSecret: string;
  logParsers: string[];
  ciSnippet: string;
  ssoProvider: string;
  ssoConfigured: boolean;
  teamInvites: Array<{ email: string; role: string }>;
  chaosEnabled: boolean;
  chaosVectors: string[];
  slackWebhook: string;
  pagerdutyKey: string;
  escalationEmail: string;
  activated: boolean;
  completedStages: number[];
}

const STORAGE_KEY = "veritas_onboarding_state";
const TOTAL_STAGES = 8;

const generateId = () => crypto.randomUUID().slice(0, 8);

function generateApiKey() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return "veritas_live_" + Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function generateWebhookSecret() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return "whsec_" + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function getDefaultState(): OnboardingState {
  return {
    currentStage: 1,
    tenantId: generateId(),
    tenantSlug: "",
    tenantName: "",
    domain: "",
    subdomain: "",
    genesisBlockHash: "",
    recoverySeed: [],
    webAuthnRegistered: false,
    totpSecret: "",
    totpSetup: false,
    mfaVerified: false,
    ollamaConnected: false,
    ollamaModels: [],
    vramUsage: 0,
    tokensPerSec: 0,
    airGapEnabled: false,
    frameworks: [],
    ragDocumentsUploaded: 0,
    ragTestPassed: false,
    prosecutorTolerance: "balanced",
    defenseBaseline: "standard",
    judgeConsensus: "majority",
    confidenceThreshold: 0.7,
    humanTiebreaker: true,
    apiKey: generateApiKey(),
    webhookSecret: generateWebhookSecret(),
    logParsers: [],
    ciSnippet: "",
    ssoProvider: "",
    ssoConfigured: false,
    teamInvites: [],
    chaosEnabled: false,
    chaosVectors: [],
    slackWebhook: "",
    pagerdutyKey: "",
    escalationEmail: "",
    activated: false,
    completedStages: [],
  };
}

export function useOnboardingState() {
  const [state, setState] = useState<OnboardingState>(() => {
    if (typeof window === "undefined") return getDefaultState();
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const clamped = Math.min(Math.max(parsed.currentStage || 1, 1), TOTAL_STAGES);
        return { ...getDefaultState(), ...parsed, currentStage: clamped };
      }
    } catch {}
    return getDefaultState();
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const updateField = useCallback(<K extends keyof OnboardingState>(
    key: K,
    value: OnboardingState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const goToStage = useCallback((stage: number) => {
    const clamped = Math.min(Math.max(stage, 1), TOTAL_STAGES);
    setState((prev) => ({ ...prev, currentStage: clamped }));
  }, []);

  const completeAndNext = useCallback((router?: { push: (url: string) => void }) => {
    setState((prev) => {
      const next = Math.min(prev.currentStage + 1, TOTAL_STAGES);
      const completed = [...new Set([...prev.completedStages, prev.currentStage])];
      if (router) {
        setTimeout(() => router.push(`/onboarding/stage-${next}`), 0);
      }
      return { ...prev, currentStage: next, completedStages: completed };
    });
  }, []);

  const goBack = useCallback((router?: { push: (url: string) => void }) => {
    setState((prev) => {
      const prevStage = Math.max(prev.currentStage - 1, 1);
      if (router) {
        setTimeout(() => router.push(`/onboarding/stage-${prevStage}`), 0);
      }
      return { ...prev, currentStage: prevStage };
    });
  }, []);

  const saveStageToDb = useCallback(async (stageNumber: number, data: Record<string, unknown>) => {
    try {
      await fetch("/api/tenant/save-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: state.tenantId,
          currentStage: stageNumber,
          stageData: data,
        }),
      });
    } catch {}
  }, [state.tenantId]);

  const reset = useCallback(() => {
    setState(getDefaultState());
  }, []);

  return { state, updateField, goToStage, completeAndNext, goBack, saveStageToDb, reset, setState };
}
