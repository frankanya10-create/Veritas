/**
 * Smart Evidence Parser
 *
 * Takes raw text/log dumps and forces the active Ollama model to output clean
 * JSON schemas matching database parameters.
 */

import { ollama } from "./client";

interface ParsedEvidence {
  event_type: string;
  timestamp: string;
  source_ip: string | undefined;
  action: string;
  result: "success" | "failure" | "warning" | "unknown";
  user_agent?: string;
  risk_score: number;
  framework_refs: string[];
  evidence_hash: string;
  raw_excerpt: string;
}

const EVIDENCE_JSON_SCHEMA = {
  type: "object",
  required: ["event_type", "timestamp", "action", "result", "risk_score", "framework_refs", "evidence_hash"],
  properties: {
    event_type: { type: "string" },
    timestamp: { type: "string" },
    source_ip: { type: "string" },
    action: { type: "string" },
    result: { type: "string", enum: ["success", "failure", "warning", "unknown"] },
    user_agent: { type: "string" },
    risk_score: { type: "number" },
    framework_refs: { type: "array", items: { type: "string" } },
    evidence_hash: { type: "string" },
    raw_excerpt: { type: "string" },
  },
};

const SYSTEM_PROMPT = `You are a compliance evidence parser. Your job is to extract structured compliance evidence from raw text, logs, or system output.

Always output valid JSON matching this schema:
{
  "event_type": "string - category of event (access_control, data_transfer, authentication, deployment, crypto_operation, etc.)",
  "timestamp": "string - ISO 8601 timestamp or extracted from log",
  "source_ip": "string|null - IP address if present",
  "action": "string - what action was performed",
  "result": "success|failure|warning|unknown",
  "user_agent": "string|null - if present",
  "risk_score": "number 0.0-1.0 - assessed risk level",
  "framework_refs": ["array of applicable framework control IDs"],
  "evidence_hash": "string - sha256 hash placeholder",
  "raw_excerpt": "string - first 200 chars of original input"
}

Map events to relevant frameworks:
- authentication/access events → SOC2-CC6, ISO27001-A.9, HIPAA-§164.312
- data transfer/events with PII → GDPR-Art.32, GDPR-Art.17
- deployment/config changes → SOC2-CC8, ISO27001-A.12
- crypto operations → PCI-DSS-Req.3, SOC2-CC6.1
- monitoring/alerts → SOC2-CC7, ISO27001-A.12.4`;

/**
 * Parse raw text into structured compliance evidence
 */
export async function parseEvidence(
  rawText: string
): Promise<{ evidence: ParsedEvidence; latency: number }> {
  const start = Date.now();

  try {
    const { data, duration } = await ollama.structuredOutput<ParsedEvidence>(
      `Parse this raw text into structured compliance evidence:\n\n"${rawText.slice(0, 2000)}"`,
      EVIDENCE_JSON_SCHEMA,
      {
        system: SYSTEM_PROMPT,
        temperature: 0.1,
      }
    );

    return {
      evidence: {
        ...data,
        raw_excerpt: rawText.slice(0, 200),
      },
      latency: Date.now() - start,
    };
  } catch {
    // Fallback: rule-based parsing
    return {
      evidence: fallbackParse(rawText),
      latency: Date.now() - start,
    };
  }
}

/**
 * Rule-based fallback parser when Ollama is offline
 */
function fallbackParse(rawText: string): ParsedEvidence {
  const text = rawText.toLowerCase();

  let eventType = "unknown";
  if (text.includes("auth") || text.includes("login") || text.includes("session")) {
    eventType = "authentication";
  } else if (text.includes("access") || text.includes("permission") || text.includes("deny")) {
    eventType = "access_control";
  } else if (text.includes("deploy") || text.includes("commit") || text.includes("release")) {
    eventType = "deployment";
  } else if (text.includes("encrypt") || text.includes("hash") || text.includes("certificate")) {
    eventType = "crypto_operation";
  } else if (text.includes("transfer") || text.includes("upload") || text.includes("export")) {
    eventType = "data_transfer";
  }

  const hasFailure = text.includes("error") || text.includes("fail") || text.includes("denied") || text.includes("reject");
  const hasWarning = text.includes("warn") || text.includes("timeout") || text.includes("retry");

  const frameworkRefs: string[] = [];
  if (eventType === "authentication" || eventType === "access_control") {
    frameworkRefs.push("SOC2-CC6.1", "ISO27001-A.9.2.1", "HIPAA-§164.312(a)(1)");
  } else if (eventType === "data_transfer") {
    frameworkRefs.push("GDPR-Art.32", "PCI-DSS-Req.3.4");
  } else if (eventType === "deployment") {
    frameworkRefs.push("SOC2-CC8.1", "ISO27001-A.12.1.4");
  } else if (eventType === "crypto_operation") {
    frameworkRefs.push("PCI-DSS-Req.3.4", "SOC2-CC6.1");
  }

  const ipMatch = rawText.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);

  return {
    event_type: eventType,
    timestamp: new Date().toISOString(),
    source_ip: ipMatch?.[0] || undefined,
    action: rawText.slice(0, 100),
    result: hasFailure ? "failure" : hasWarning ? "warning" : "success",
    risk_score: hasFailure ? 0.8 : hasWarning ? 0.4 : 0.1,
    framework_refs: frameworkRefs,
    evidence_hash: `sha256:offline-${Date.now().toString(36)}`,
    raw_excerpt: rawText.slice(0, 200),
  };
}

/**
 * Batch parse multiple evidence items
 */
export async function parseBatch(
  items: string[]
): Promise<Array<{ evidence: ParsedEvidence; latency: number }>> {
  const results = [];
  for (const item of items) {
    results.push(await parseEvidence(item));
  }
  return results;
}
