/**
 * Continuous Evidence Ingestion Engine
 *
 * Processes incoming server logs, system health checks, and telemetry
 * into compliance-ready evidence artifacts.
 */

import { generateUUID, hashData, formatTimestamp } from "@/lib/utils";

interface EvidenceArtifact {
  id: string;
  source: string;
  type: string;
  rawPayload: string;
  parsedData: Record<string, unknown>;
  status: "ingested" | "parsed" | "validated" | "stored" | "failed";
  hash: string;
  timestamp: string;
  frameworkRefs: string[];
  metadata: Record<string, unknown>;
}

interface IngestionPipeline {
  id: string;
  name: string;
  source: string;
  processor: (raw: string) => Record<string, unknown>;
  validator: (data: Record<string, unknown>) => boolean;
  frameworkRefs: string[];
}

// Pre-built ingestion pipelines for common sources
const PIPELINES: IngestionPipeline[] = [
  {
    id: "apache-log",
    name: "Apache/Nginx Access Log",
    source: "web-server",
    processor: (raw) => {
      const match = raw.match(
        /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) \S+" (\d+) (\d+)/
      );
      if (!match) return { raw, parseError: true };
      return {
        ip: match[1],
        timestamp: match[2],
        method: match[3],
        path: match[4],
        statusCode: parseInt(match[5]),
        bytes: parseInt(match[6]),
        riskLevel: parseInt(match[5]) >= 400 ? "warning" : "normal",
      };
    },
    validator: (data) => "ip" in data && "statusCode" in data,
    frameworkRefs: ["SOC2-CC7.2", "ISO27001-A.12.4.1"],
  },
  {
    id: "auth-event",
    name: "Authentication Event",
    source: "auth-service",
    processor: (raw) => {
      const match = raw.match(
        /user=(\S+).*(?:success|fail|error|denied).*(?:from|source)=(\S+)/i
      );
      const success = /success|ok|granted/i.test(raw);
      const failure = /fail|error|denied|rejected/i.test(raw);
      return {
        userId: match?.[1] || "unknown",
        sourceIp: match?.[2] || "unknown",
        result: success ? "success" : failure ? "failure" : "unknown",
        mfaUsed: /mfa|2fa|totp|mfa_verified/i.test(raw),
        timestamp: new Date().toISOString(),
      };
    },
    validator: (data) => "userId" in data && "result" in data,
    frameworkRefs: ["SOC2-CC6.1", "ISO27001-A.9.2.1", "HIPAA-§164.312(a)(1)"],
  },
  {
    id: "deploy-record",
    name: "Deployment Record",
    source: "ci-cd",
    processor: (raw) => {
      const match = raw.match(/(?:deploy|release|push).*(?:v?[\d.]+)/i);
      return {
        action: "deployment",
        commitHash: raw.match(/[a-f0-9]{7,40}/)?.[0] || "unknown",
        version: raw.match(/v?(\d+\.\d+\.\d+)/)?.[1] || "unknown",
        approved: /approved|reviewed|passed/i.test(raw),
        timestamp: new Date().toISOString(),
      };
    },
    validator: (data) => "action" in data,
    frameworkRefs: ["SOC2-CC8.1", "ISO27001-A.12.1.4"],
  },
  {
    id: "system-health",
    name: "System Health Check",
    source: "monitoring",
    processor: (raw) => {
      const cpuMatch = raw.match(/cpu[:\s]*(\d+(?:\.\d+)?)/i);
      const memMatch = raw.match(/mem(?:ory)?[:\s]*(\d+(?:\.\d+)?)/i);
      return {
        cpuUsage: cpuMatch ? parseFloat(cpuMatch[1]) : null,
        memoryUsage: memMatch ? parseFloat(memMatch[1]) : null,
        status: /ok|healthy|pass/i.test(raw)
          ? "healthy"
          : /warn|degraded/i.test(raw)
            ? "degraded"
            : /crit|fail|down/i.test(raw)
              ? "critical"
              : "unknown",
        timestamp: new Date().toISOString(),
      };
    },
    validator: () => true,
    frameworkRefs: ["SOC2-CC7.1", "ISO27001-A.12.4.1"],
  },
];

/**
 * Ingest a raw log entry through the appropriate pipeline
 */
export async function ingestEvidence(
  rawPayload: string,
  sourceHint?: string
): Promise<EvidenceArtifact> {
  // Find matching pipeline
  const pipeline =
    PIPELINES.find((p) => p.source === sourceHint) ||
    detectPipeline(rawPayload);

  const parsedData = pipeline ? pipeline.processor(rawPayload) : { raw: rawPayload };
  const isValid = pipeline ? pipeline.validator(parsedData) : false;

  const hash = await hashData(rawPayload + JSON.stringify(parsedData));

  return {
    id: generateUUID(),
    source: pipeline?.source || "unknown",
    type: pipeline?.name || "raw-text",
    rawPayload,
    parsedData,
    status: isValid ? "parsed" : "failed",
    hash,
    timestamp: formatTimestamp(),
    frameworkRefs: pipeline?.frameworkRefs || [],
    metadata: {
      pipelineId: pipeline?.id || null,
      pipelineName: pipeline?.name || null,
      validated: isValid,
      inputLength: rawPayload.length,
    },
  };
}

/**
 * Auto-detect the appropriate pipeline from content
 */
function detectPipeline(raw: string): IngestionPipeline | null {
  if (/^\S+ \S+ \S+ \[.*\] ".*"/.test(raw)) return PIPELINES[0]; // Apache log
  if (/user=|auth|login|session|password/i.test(raw)) return PIPELINES[1]; // Auth
  if (/deploy|release|commit|push|ci|cd/i.test(raw)) return PIPELINES[2]; // Deploy
  if (/cpu|mem|disk|health|load/i.test(raw)) return PIPELINES[3]; // Health
  return null;
}

/**
 * Batch ingest multiple evidence items
 */
export async function ingestBatch(
  items: Array<{ raw: string; source?: string }>
): Promise<EvidenceArtifact[]> {
  const results = [];
  for (const item of items) {
    results.push(await ingestEvidence(item.raw, item.source));
  }
  return results;
}

/**
 * Get available pipeline configurations
 */
export function getPipelines(): Array<{
  id: string;
  name: string;
  source: string;
  frameworkRefs: string[];
}> {
  return PIPELINES.map((p) => ({
    id: p.id,
    name: p.name,
    source: p.source,
    frameworkRefs: p.frameworkRefs,
  }));
}
