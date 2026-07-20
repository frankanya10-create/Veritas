/**
 * PR/GitHub Guardrail Agent
 *
 * Parses incoming code descriptions or task cards and flags
 * compliance vulnerabilities before they reach production.
 */

import { ollama } from "./client";

interface GuardrailFlag {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  description: string;
  affectedFramework: string;
  recommendation: string;
}

interface GuardrailResult {
  prId: string;
  title: string;
  flags: GuardrailFlag[];
  riskScore: number;
  clearance: "pass" | "conditional" | "fail";
  model: string;
  latency_ms: number;
}

const GUARDRAIL_JSON_SCHEMA = {
  type: "object",
  required: ["flags", "risk_score", "clearance"],
  properties: {
    flags: {
      type: "array",
      items: {
        type: "object",
        required: ["severity", "category", "description", "affected_framework", "recommendation"],
        properties: {
          severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
          category: { type: "string" },
          description: { type: "string" },
          affected_framework: { type: "string" },
          recommendation: { type: "string" },
        },
      },
    },
    risk_score: { type: "number" },
    clearance: { type: "string", enum: ["pass", "conditional", "fail"] },
  },
};

const SYSTEM_PROMPT = `You are a compliance guardrail agent for code changes and task cards.
Analyze the given PR description or code change summary for potential compliance vulnerabilities.

Check for:
1. GDPR violations (data handling, PII, right to erasure, consent)
2. SOC2 control violations (access controls, logging, change management)
3. HIPAA violations (PHI handling, encryption, access controls)
4. PCI-DSS violations (card data handling, encryption requirements)
5. Security anti-patterns (hardcoded secrets, missing encryption, exposed endpoints)
6. Data retention/deletion concerns
7. Missing audit logging
8. Inadequate access controls

Output flags with severity levels:
- critical: Immediate compliance violation, must be addressed
- high: Likely violation, needs review before merge
- medium: Potential concern, should be addressed
- low: Minor observation or best practice recommendation

Always output valid JSON.`;

/**
 * Scan a PR description or code change for compliance violations
 */
export async function scanPR(
  prDescription: string,
  options?: { prId?: string; prTitle?: string }
): Promise<GuardrailResult> {
  const start = Date.now();
  const prId = options?.prId || `PR-${Date.now().toString(36)}`;
  const prTitle = options?.prTitle || "Untitled PR";

  try {
    const { data, duration } = await ollama.structuredOutput<{
      flags: Array<{
        severity: string;
        category: string;
        description: string;
        affected_framework: string;
        recommendation: string;
      }>;
      risk_score: number;
      clearance: string;
    }>(
      `Analyze this PR for compliance vulnerabilities:\n\nTitle: ${prTitle}\n\nDescription:\n${prDescription}`,
      GUARDRAIL_JSON_SCHEMA,
      { system: SYSTEM_PROMPT, temperature: 0.1 }
    );

    const flags: GuardrailFlag[] = data.flags.map((f, i) => ({
      id: `flag-${Date.now()}-${i}`,
      severity: f.severity as GuardrailFlag["severity"],
      category: f.category,
      description: f.description,
      affectedFramework: f.affected_framework,
      recommendation: f.recommendation,
    }));

    return {
      prId,
      title: prTitle,
      flags,
      riskScore: data.risk_score,
      clearance: data.clearance as GuardrailResult["clearance"],
      model: "llama3.2:3b",
      latency_ms: Date.now() - start,
    };
  } catch {
    return fallbackScan(prDescription, prId, prTitle, start);
  }
}

function fallbackScan(
  description: string,
  prId: string,
  prTitle: string,
  start: number
): GuardrailResult {
  const text = description.toLowerCase();
  const flags: GuardrailFlag[] = [];

  const checks = [
    {
      keywords: ["password", "secret", "api_key", "token", "credential"],
      flag: {
        id: `flag-fallback-${Date.now()}`,
        severity: "critical" as const,
        category: "Hardcoded Secrets",
        description: "PR description references passwords, secrets, or credentials",
        affectedFramework: "SOC2-CC6.1, PCI-DSS-Req.8",
        recommendation: "Ensure no secrets are committed. Use environment variables or vault services.",
      },
    },
    {
      keywords: ["delete", "remove", "erasure", "purge"],
      flag: {
        id: `flag-fallback-${Date.now()}-1`,
        severity: "high" as const,
        category: "Data Deletion",
        description: "PR involves data deletion — verify GDPR Art.17 compliance",
        affectedFramework: "GDPR-Art.17",
        recommendation: "Verify right-to-erasure flow is implemented correctly with audit trail.",
      },
    },
    {
      keywords: ["log", "logging", "audit", "monitor"],
      flag: null, // Good practice, no flag
    },
    {
      keywords: ["encrypt", "hash", "ssl", "tls"],
      flag: null, // Good practice
    },
    {
      keywords: ["email", "phone", "name", "address", "ssn", "pii"],
      flag: {
        id: `flag-fallback-${Date.now()}-2`,
        severity: "high" as const,
        category: "PII Handling",
        description: "PR references personally identifiable information — verify data protection controls",
        affectedFramework: "GDPR-Art.32, HIPAA-§164.312",
        recommendation: "Ensure PII is encrypted at rest and in transit. Verify access controls.",
      },
    },
    {
      keywords: ["admin", "root", "sudo", "superuser", "elevated"],
      flag: {
        id: `flag-fallback-${Date.now()}-3`,
        severity: "medium" as const,
        category: "Privilege Escalation",
        description: "PR references elevated privileges — verify RBAC policies",
        affectedFramework: "SOC2-CC6.3, ISO27001-A.9.2.1",
        recommendation: "Ensure least-privilege principle is followed. Document access grants.",
      },
    },
  ];

  for (const check of checks) {
    if (check.flag && check.keywords.some((kw) => text.includes(kw))) {
      flags.push(check.flag);
    }
  }

  const riskScore = flags.length > 0
    ? flags.reduce((acc, f) => {
        const sev = { critical: 0.4, high: 0.25, medium: 0.15, low: 0.05 };
        return acc + sev[f.severity];
      }, 0)
    : 0;

  return {
    prId,
    title: prTitle,
    flags,
    riskScore: Math.min(riskScore, 1),
    clearance: flags.some((f) => f.severity === "critical")
      ? "fail"
      : flags.some((f) => f.severity === "high")
        ? "conditional"
        : "pass",
    model: "llama3.2:3b (offline-fallback)",
    latency_ms: Date.now() - start,
  };
}

/**
 * Batch scan multiple PRs
 */
export async function scanBatch(
  prs: Array<{ id: string; title: string; description: string }>
): Promise<GuardrailResult[]> {
  return Promise.all(prs.map((pr) => scanPR(pr.description, { prId: pr.id, prTitle: pr.title })));
}
