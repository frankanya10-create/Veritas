/**
 * Runtime Control Plane Framework
 *
 * Intercepts outgoing data signals to simulate real-time
 * transaction blocks or policy evaluations.
 */

import { generateUUID, formatTimestamp } from "@/lib/utils";

interface PolicyRule {
  id: string;
  name: string;
  description: string;
  condition: (signal: DataSignal) => boolean;
  action: "allow" | "block" | "flag" | "log";
  severity: "critical" | "high" | "medium" | "low";
  frameworkRef: string;
}

interface DataSignal {
  id: string;
  timestamp: string;
  type: "transaction" | "data_access" | "data_transfer" | "api_call" | "auth_event";
  source: string;
  destination: string;
  payload: Record<string, unknown>;
  dataSize?: number;
  containsPII?: boolean;
  containsPHI?: boolean;
  containsCardData?: boolean;
  userId?: string;
  classification: "public" | "internal" | "confidential" | "restricted";
}

interface PolicyEvaluation {
  id: string;
  signalId: string;
  timestamp: string;
  decision: "allow" | "block" | "flag" | "log";
  triggeredRules: Array<{
    ruleId: string;
    ruleName: string;
    severity: string;
    action: string;
  }>;
  riskScore: number;
  evaluationTimeMs: number;
}

// Default policy rules for common compliance requirements
const DEFAULT_RULES: PolicyRule[] = [
  {
    id: "rule-001",
    name: "PII Transfer Encryption",
    description: "Block unencrypted PII data transfers",
    condition: (s) => !!s.containsPII && s.type === "data_transfer" && s.classification !== "restricted",
    action: "block",
    severity: "critical",
    frameworkRef: "GDPR-Art.32, SOC2-CC6.1",
  },
  {
    id: "rule-002",
    name: "PHI Access Control",
    description: "Flag all PHI data access for audit review",
    condition: (s) => !!s.containsPHI,
    action: "flag",
    severity: "high",
    frameworkRef: "HIPAA-§164.312(a)(1)",
  },
  {
    id: "rule-003",
    name: "Card Data Exposure",
    description: "Block any transmission of card data outside approved channels",
    condition: (s) => !!s.containsCardData && s.destination !== "payment-processor",
    action: "block",
    severity: "critical",
    frameworkRef: "PCI-DSS-Req.3.4",
  },
  {
    id: "rule-004",
    name: "Large Data Export",
    description: "Flag exports exceeding 1MB for review",
    condition: (s) => (s.dataSize || 0) > 1_000_000 && s.type === "data_transfer",
    action: "flag",
    severity: "medium",
    frameworkRef: "SOC2-CC7.2, ISO27001-A.12.4.1",
  },
  {
    id: "rule-005",
    name: "After-Hours Access",
    description: "Log access events outside business hours",
    condition: () => {
      const hour = new Date().getHours();
      return hour < 6 || hour > 22;
    },
    action: "log",
    severity: "low",
    frameworkRef: "SOC2-CC6.1",
  },
  {
    id: "rule-006",
    name: "Restricted Data Classification",
    description: "Block any restricted data from leaving the trust boundary",
    condition: (s) => s.classification === "restricted" && s.type === "data_transfer",
    action: "block",
    severity: "critical",
    frameworkRef: "ISO27001-A.9.2.1, SOC2-CC6.3",
  },
  {
    id: "rule-007",
    name: "API Rate Limit",
    description: "Flag excessive API calls from a single source",
    condition: (s) => s.type === "api_call" && s.source === "automated",
    action: "flag",
    severity: "medium",
    frameworkRef: "SOC2-CC7.2",
  },
];

class RuntimeControlPlane {
  private rules: PolicyRule[];
  private evaluationLog: PolicyEvaluation[];
  private blockedCount: number;
  private flaggedCount: number;

  constructor(rules?: PolicyRule[]) {
    this.rules = rules || DEFAULT_RULES;
    this.evaluationLog = [];
    this.blockedCount = 0;
    this.flaggedCount = 0;
  }

  /**
   * Evaluate a data signal against all policy rules
   */
  evaluate(signal: DataSignal): PolicyEvaluation {
    const start = Date.now();
    const triggered: PolicyEvaluation["triggeredRules"] = [];
    let maxSeverity = 0;
    const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };

    for (const rule of this.rules) {
      try {
        if (rule.condition(signal)) {
          triggered.push({
            ruleId: rule.id,
            ruleName: rule.name,
            severity: rule.severity,
            action: rule.action,
          });
          maxSeverity = Math.max(maxSeverity, severityWeight[rule.severity]);
        }
      } catch {
        // Rule evaluation error — skip
      }
    }

    // Determine final decision: most restrictive wins
    const actions = triggered.map((t) => t.action);
    let decision: PolicyEvaluation["decision"] = "allow";
    if (actions.includes("block")) decision = "block";
    else if (actions.includes("flag")) decision = "flag";
    else if (actions.includes("log")) decision = "log";

    const evaluation: PolicyEvaluation = {
      id: generateUUID(),
      signalId: signal.id,
      timestamp: formatTimestamp(),
      decision,
      triggeredRules: triggered,
      riskScore: maxSeverity / 4,
      evaluationTimeMs: Date.now() - start,
    };

    this.evaluationLog.push(evaluation);
    if (decision === "block") this.blockedCount++;
    if (decision === "flag") this.flaggedCount++;

    return evaluation;
  }

  /**
   * Process a batch of signals
   */
  evaluateBatch(signals: DataSignal[]): PolicyEvaluation[] {
    return signals.map((s) => this.evaluate(s));
  }

  /**
   * Get statistics about control plane activity
   */
  getStats() {
    return {
      totalEvaluations: this.evaluationLog.length,
      blocked: this.blockedCount,
      flagged: this.flaggedCount,
      allowed:
        this.evaluationLog.length - this.blockedCount - this.flaggedCount,
      avgEvaluationTimeMs:
        this.evaluationLog.length > 0
          ? this.evaluationLog.reduce((sum, e) => sum + e.evaluationTimeMs, 0) /
            this.evaluationLog.length
          : 0,
    };
  }

  /**
   * Get recent evaluation log
   */
  getRecentEvaluations(limit: number = 20): PolicyEvaluation[] {
    return this.evaluationLog.slice(-limit);
  }

  /**
   * Add a custom policy rule
   */
  addRule(rule: PolicyRule): void {
    this.rules.push(rule);
  }

  /**
   * Remove a policy rule by ID
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter((r) => r.id !== ruleId);
  }

  /**
   * List all active rules
   */
  listRules(): PolicyRule[] {
    return [...this.rules];
  }
}

// Singleton instance
export const controlPlane = new RuntimeControlPlane();

export type { DataSignal, PolicyEvaluation, PolicyRule };
