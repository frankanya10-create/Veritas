/**
 * Local RAG Regulation Oracle
 *
 * Retrieves relevant regulatory context chunks and uses Llama 3.2:3B
 * to answer natural language compliance queries.
 */

import { ollama } from "./client";
import type { ChatMessage } from "./client";

interface RegulationChunk {
  framework: string;
  controlId: string;
  title: string;
  text: string;
  source: string;
}

interface OracleResponse {
  query: string;
  framework: string;
  relevant_controls: Array<{
    id: string;
    title: string;
    relevance: number;
    summary: string;
  }>;
  recommendations: string[];
  confidence: number;
  model: string;
  latency_ms: number;
}

/**
 * Mock regulatory knowledge base — in production this would be a vector store
 * populated with actual regulation text.
 */
const REGULATION_CHUNKS: RegulationChunk[] = [
  {
    framework: "SOC2",
    controlId: "CC6.1",
    title: "Logical Access Controls",
    text: "The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from unauthorized access.",
    source: "SOC2 Trust Services Criteria 2017",
  },
  {
    framework: "SOC2",
    controlId: "CC6.3",
    title: "Role-Based Access",
    text: "The entity authorizes, modifies, or removes access to data, software, functions, and other protected information assets based on roles, responsibilities, or the system design and changes.",
    source: "SOC2 Trust Services Criteria 2017",
  },
  {
    framework: "SOC2",
    controlId: "CC7.2",
    title: "System Monitoring",
    text: "The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts, natural disasters, and errors affecting the entity's ability to meet its objectives.",
    source: "SOC2 Trust Services Criteria 2017",
  },
  {
    framework: "ISO27001",
    controlId: "A.9.2.1",
    title: "User Registration and Authorization",
    text: "A user access registration process shall be implemented to authorize user access to information systems and services. Access provisioning shall follow the principle of least privilege.",
    source: "ISO/IEC 27001:2022 Annex A",
  },
  {
    framework: "ISO27001",
    controlId: "A.12.4.1",
    title: "Event Logging",
    text: "Event logs recording user activities, exceptions, faults, and information security events shall be produced, kept, and regularly reviewed. Logs shall include timestamps, event types, and affected assets.",
    source: "ISO/IEC 27001:2022 Annex A",
  },
  {
    framework: "GDPR",
    controlId: "Art.17",
    title: "Right to Erasure",
    text: "The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay where one of the grounds applies.",
    source: "GDPR Article 17",
  },
  {
    framework: "GDPR",
    controlId: "Art.32",
    title: "Security of Processing",
    text: "The controller and processor shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including encryption, confidentiality, integrity, and availability of processing systems.",
    source: "GDPR Article 32",
  },
  {
    framework: "HIPAA",
    controlId: "§164.312(a)(1)",
    title: "Access Control",
    text: "Implement technical policies and procedures for electronic information systems that maintain ePHI to allow access only to those persons or software programs that have been granted access rights.",
    source: "HIPAA Security Rule §164.312",
  },
  {
    framework: "PCI-DSS",
    controlId: "Req.3.4",
    title: "Data Protection",
    text: "Render PAN unreadable anywhere it is stored using strong cryptography, truncation, tokenization, or one-way hashing. Cryptographic keys must be managed securely.",
    source: "PCI-DSS v4.0 Requirement 3",
  },
];

/**
 * Simple keyword-based relevance scoring (in production: vector similarity)
 */
function scoreRelevance(query: string, chunk: RegulationChunk): number {
  const queryLower = query.toLowerCase();
  const textLower = chunk.text.toLowerCase();
  const titleLower = chunk.title.toLowerCase();

  let score = 0;
  const words = queryLower.split(/\s+/).filter((w) => w.length > 3);

  for (const word of words) {
    if (textLower.includes(word)) score += 0.15;
    if (titleLower.includes(word)) score += 0.25;
    if (chunk.controlId.toLowerCase().includes(word)) score += 0.4;
    if (chunk.framework.toLowerCase().includes(word)) score += 0.3;
  }

  return Math.min(score, 1);
}

/**
 * Query the RAG Oracle with a natural language compliance question
 */
export async function queryOracle(
  question: string,
  options?: { framework?: string; maxChunks?: number }
): Promise<OracleResponse> {
  const start = Date.now();

  // Retrieve relevant chunks
  let chunks = REGULATION_CHUNKS.map((chunk) => ({
    chunk,
    score: scoreRelevance(question, chunk),
  }))
    .filter((item) => item.score > 0.1)
    .sort((a, b) => b.score - a.score)
    .slice(0, options?.maxChunks || 5);

  // Filter by framework if specified
  if (options?.framework) {
    chunks = chunks.filter(
      (c) => c.chunk.framework.toLowerCase() === options.framework!.toLowerCase()
    );
  }

  // Build context from retrieved chunks
  const context = chunks
    .map(
      (c) =>
        `[${c.chunk.framework} - ${c.chunk.controlId}] ${c.chunk.title}\n${c.chunk.text}\nSource: ${c.chunk.source}`
    )
    .join("\n\n");

  // Generate answer with Llama 3.2:3B
  const systemPrompt = `You are a compliance regulation oracle. Answer the user's question using ONLY the provided regulatory context. Be specific and reference control IDs. Output valid JSON.`;

  const prompt = `Regulatory Context:\n${context}\n\nQuestion: ${question}\n\nRespond with a JSON object containing:
- query: the original question
- framework: the primary framework referenced
- relevant_controls: array of {id, title, relevance (0-1), summary}
- recommendations: array of actionable strings
- confidence: number between 0 and 1`;

  try {
    const result = await ollama.generate(prompt, {
      system: systemPrompt,
      format: "json",
      temperature: 0.2,
    });

    const parsed = JSON.parse(result.text);
    const latency = Date.now() - start;

    return {
      query: question,
      framework: parsed.framework || "General",
      relevant_controls: parsed.relevant_controls || chunks.map((c) => ({
        id: c.chunk.controlId,
        title: c.chunk.title,
        relevance: c.score,
        summary: c.chunk.text.slice(0, 200),
      })),
      recommendations: parsed.recommendations || [],
      confidence: parsed.confidence || chunks[0]?.score || 0.5,
      model: "llama3.2:3b",
      latency_ms: latency,
    };
  } catch {
    // Fallback if Ollama is not running
    const latency = Date.now() - start;
    return {
      query: question,
      framework: chunks[0]?.chunk.framework || "General",
      relevant_controls: chunks.map((c) => ({
        id: c.chunk.controlId,
        title: c.chunk.title,
        relevance: c.score,
        summary: c.chunk.text.slice(0, 200),
      })),
      recommendations: [
        "Review applicable controls for the queried framework",
        "Cross-reference with mapped controls in the compliance matrix",
      ],
      confidence: chunks[0]?.score || 0.5,
      model: "llama3.2:3b (offline-fallback)",
      latency_ms: latency,
    };
  }
}
