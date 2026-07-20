/**
 * Multi-Framework Cross-Mapping Engine
 *
 * Deduplicates incoming control evidence and maps it simultaneously
 * across multiple compliance standards.
 */

import { generateUUID } from "@/lib/utils";

interface Framework {
  id: string;
  name: string;
  version: string;
  controls: Control[];
}

interface Control {
  id: string;
  frameworkId: string;
  controlId: string;
  title: string;
  description: string;
  category: string;
}

interface Mapping {
  sourceControl: string;
  sourceFramework: string;
  targetControl: string;
  targetFramework: string;
  confidence: number;
  overlapScore: number;
  sharedKeywords: string[];
}

interface CrossMapResult {
  id: string;
  timestamp: string;
  frameworksAnalyzed: number;
  totalControls: number;
  mappingsFound: number;
  deduplicatedControls: number;
  mappings: Mapping[];
  coverageMatrix: Record<string, Record<string, number>>;
}

// Pre-built mapping rules between common frameworks
const MAPPING_RULES: Array<{
  sourceFramework: string;
  sourcePattern: string;
  targetFramework: string;
  targetPattern: string;
  confidence: number;
}> = [
  // SOC2 → ISO27001
  { sourceFramework: "SOC2", sourcePattern: "CC6", targetFramework: "ISO27001", targetPattern: "A.9", confidence: 0.85 },
  { sourceFramework: "SOC2", sourcePattern: "CC7", targetFramework: "ISO27001", targetPattern: "A.12.4", confidence: 0.90 },
  { sourceFramework: "SOC2", sourcePattern: "CC8", targetFramework: "ISO27001", targetPattern: "A.12.1", confidence: 0.80 },
  { sourceFramework: "SOC2", sourcePattern: "CC6.1", targetFramework: "ISO27001", targetPattern: "A.9.2.1", confidence: 0.92 },
  // SOC2 → GDPR
  { sourceFramework: "SOC2", sourcePattern: "CC6.3", targetFramework: "GDPR", targetPattern: "Art.32", confidence: 0.75 },
  { sourceFramework: "SOC2", sourcePattern: "CC7.2", targetFramework: "GDPR", targetPattern: "Art.32(1)(d)", confidence: 0.80 },
  // SOC2 → HIPAA
  { sourceFramework: "SOC2", sourcePattern: "CC6.1", targetFramework: "HIPAA", targetPattern: "§164.312(a)(1)", confidence: 0.88 },
  { sourceFramework: "SOC2", sourcePattern: "CC6.3", targetFramework: "HIPAA", targetPattern: "§164.312(a)(3)", confidence: 0.82 },
  { sourceFramework: "SOC2", sourcePattern: "CC7.2", targetFramework: "HIPAA", targetPattern: "§164.312(b)", confidence: 0.85 },
  // ISO27001 → GDPR
  { sourceFramework: "ISO27001", sourcePattern: "A.9", targetFramework: "GDPR", targetPattern: "Art.32", confidence: 0.78 },
  { sourceFramework: "ISO27001", sourcePattern: "A.18.1", targetFramework: "GDPR", targetPattern: "Art.30", confidence: 0.85 },
  // ISO27001 → HIPAA
  { sourceFramework: "ISO27001", sourcePattern: "A.9.2", targetFramework: "HIPAA", targetPattern: "§164.312(a)", confidence: 0.80 },
  // PCI-DSS → SOC2
  { sourceFramework: "PCI-DSS", sourcePattern: "Req.3", targetFramework: "SOC2", targetPattern: "CC6.1", confidence: 0.82 },
  { sourceFramework: "PCI-DSS", sourcePattern: "Req.8", targetFramework: "SOC2", targetPattern: "CC6.1", confidence: 0.88 },
  { sourceFramework: "PCI-DSS", sourcePattern: "Req.10", targetFramework: "SOC2", targetPattern: "CC7.2", confidence: 0.85 },
  // HIPAA → GDPR
  { sourceFramework: "HIPAA", sourcePattern: "§164.312", targetFramework: "GDPR", targetPattern: "Art.32", confidence: 0.90 },
  { sourceFramework: "HIPAA", sourcePattern: "§164.530", targetFramework: "GDPR", targetPattern: "Art.17", confidence: 0.72 },
];

/**
 * Build a cross-map between multiple frameworks
 */
export function crossMapFrameworks(frameworks: Framework[]): CrossMapResult {
  const allMappings: Mapping[] = [];
  const controlCount = frameworks.reduce((sum, fw) => sum + fw.controls.length, 0);
  const seenMappings = new Set<string>();
  let deduplicatedCount = 0;

  // Compare every pair of frameworks
  for (let i = 0; i < frameworks.length; i++) {
    for (let j = i + 1; j < frameworks.length; j++) {
      const fwA = frameworks[i];
      const fwB = frameworks[j];

      for (const controlA of fwA.controls) {
        for (const controlB of fwB.controls) {
          // Check against mapping rules
          const rule = MAPPING_RULES.find(
            (r) =>
              (r.sourceFramework === fwA.name &&
                r.targetFramework === fwB.name &&
                controlA.controlId.startsWith(r.sourcePattern) &&
                controlB.controlId.startsWith(r.targetPattern)) ||
              (r.sourceFramework === fwB.name &&
                r.targetFramework === fwA.name &&
                controlB.controlId.startsWith(r.sourcePattern) &&
                controlA.controlId.startsWith(r.targetPattern))
          );

          if (rule) {
            const key = [
              controlA.controlId,
              fwA.name,
              controlB.controlId,
              fwB.name,
            ].sort().join("|");

            if (!seenMappings.has(key)) {
              seenMappings.add(key);

              // Check for semantic overlap
              const sharedKeywords = findSharedKeywords(
                controlA.description,
                controlB.description
              );
              const overlapScore = sharedKeywords.length / 10;

              allMappings.push({
                sourceControl: controlA.controlId,
                sourceFramework: fwA.name,
                targetControl: controlB.controlId,
                targetFramework: fwB.name,
                confidence: rule.confidence,
                overlapScore: Math.min(overlapScore, 1),
                sharedKeywords,
              });
            } else {
              deduplicatedCount++;
            }
          }
        }
      }
    }
  }

  // Build coverage matrix
  const coverageMatrix: Record<string, Record<string, number>> = {};
  for (const fw of frameworks) {
    coverageMatrix[fw.name] = {};
    for (const other of frameworks) {
      if (fw.name === other.name) continue;
      const mapped = allMappings.filter(
        (m) =>
          (m.sourceFramework === fw.name && m.targetFramework === other.name) ||
          (m.targetFramework === fw.name && m.sourceFramework === other.name)
      );
      coverageMatrix[fw.name][other.name] =
        fw.controls.length > 0 ? mapped.length / fw.controls.length : 0;
    }
  }

  return {
    id: generateUUID(),
    timestamp: new Date().toISOString(),
    frameworksAnalyzed: frameworks.length,
    totalControls: controlCount,
    mappingsFound: allMappings.length,
    deduplicatedControls: deduplicatedCount,
    mappings: allMappings.sort((a, b) => b.confidence - a.confidence),
    coverageMatrix,
  };
}

/**
 * Find shared meaningful keywords between two descriptions
 */
function findSharedKeywords(a: string, b: string): string[] {
  const stopwords = new Set([
    "the", "and", "or", "of", "to", "in", "for", "is", "on", "that", "by",
    "with", "as", "at", "an", "be", "this", "are", "from", "was", "were",
    "has", "have", "been", "not", "but", "its", "can", "may", "shall",
  ]);

  const wordsA = new Set(
    a.toLowerCase().split(/\W+/).filter((w) => w.length > 3 && !stopwords.has(w))
  );
  const wordsB = new Set(
    b.toLowerCase().split(/\W+/).filter((w) => w.length > 3 && !stopwords.has(w))
  );

  return [...wordsA].filter((w) => wordsB.has(w));
}

/**
 * Deduplicate controls across frameworks based on semantic similarity
 */
export function deduplicateControls(
  controls: Control[]
): Array<{ canonical: Control; duplicates: string[] }> {
  const groups: Array<{ canonical: Control; duplicates: string[] }> = [];
  const assigned = new Set<string>();

  for (const control of controls) {
    if (assigned.has(control.id)) continue;

    const group: Control[] = [control];
    assigned.add(control.id);

    for (const other of controls) {
      if (assigned.has(other.id)) continue;
      if (control.frameworkId === other.frameworkId) continue;

      const shared = findSharedKeywords(control.description, other.description);
      if (shared.length >= 3) {
        group.push(other);
        assigned.add(other.id);
      }
    }

    if (group.length > 1) {
      groups.push({
        canonical: group[0],
        duplicates: group.slice(1).map((c) => c.id),
      });
    } else {
      groups.push({ canonical: control, duplicates: [] });
    }
  }

  return groups;
}
