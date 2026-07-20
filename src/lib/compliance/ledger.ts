/**
 * Tamper-Evident Ledger
 *
 * Cryptographically hashes records to establish a clear chain-of-custody
 * for all compliance evidence and audit trail entries.
 */

import { hashData, generateUUID, formatTimestamp, truncateHash } from "@/lib/utils";

interface LedgerEntry {
  id: string;
  entryNumber: number;
  data: Record<string, unknown>;
  hash: string;
  previousHash: string;
  timestamp: string;
  verified: boolean;
  entryType: "evidence" | "control" | "audit" | "system" | "guardrail" | "chaos";
}

interface LedgerIntegrity {
  valid: boolean;
  totalEntries: number;
  brokenLinks: number;
  firstBrokenEntry?: number;
  lastVerifiedEntry: number;
}

class TamperEvidentLedger {
  private entries: LedgerEntry[];
  private tableName: string;

  constructor(tableName: string = "tamper_ledger") {
    this.tableName = tableName;
    this.entries = [];
  }

  /**
   * Append a new entry to the ledger with cryptographic hash
   */
  async append(
    data: Record<string, unknown>,
    entryType: LedgerEntry["entryType"] = "system"
  ): Promise<LedgerEntry> {
    const previousHash =
      this.entries.length > 0
        ? this.entries[this.entries.length - 1].hash
        : "0000000000000000000000000000000000000000000000000000000000000000";

    // Compute hash: SHA-256(data + previousHash + timestamp)
    const timestamp = formatTimestamp();
    const hashInput = JSON.stringify(data, Object.keys(data).sort()) + previousHash + timestamp;
    const hash = await hashData(hashInput);

    const entry: LedgerEntry = {
      id: generateUUID(),
      entryNumber: this.entries.length + 1,
      data,
      hash,
      previousHash,
      timestamp,
      verified: true,
      entryType,
    };

    this.entries.push(entry);
    return entry;
  }

  /**
   * Verify the integrity of the entire ledger chain
   */
  async verifyIntegrity(): Promise<LedgerIntegrity> {
    let brokenLinks = 0;
    let firstBroken: number | undefined;
    let lastVerified = 0;

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];

      // Check chain link
      if (i > 0) {
        const expectedPrevHash = this.entries[i - 1].hash;
        if (entry.previousHash !== expectedPrevHash) {
          brokenLinks++;
          if (firstBroken === undefined) firstBroken = entry.entryNumber;
          entry.verified = false;
          continue;
        }
      }

      // Recompute hash
      const hashInput =
        JSON.stringify(entry.data, Object.keys(entry.data).sort()) +
        entry.previousHash +
        entry.timestamp;
      const expectedHash = await hashData(hashInput);

      if (entry.hash !== expectedHash) {
        brokenLinks++;
        if (firstBroken === undefined) firstBroken = entry.entryNumber;
        entry.verified = false;
        continue;
      }

      entry.verified = true;
      lastVerified = entry.entryNumber;
    }

    return {
      valid: brokenLinks === 0,
      totalEntries: this.entries.length,
      brokenLinks,
      firstBrokenEntry: firstBroken,
      lastVerifiedEntry: lastVerified,
    };
  }

  /**
   * Get a specific entry by number
   */
  getEntry(entryNumber: number): LedgerEntry | undefined {
    return this.entries.find((e) => e.entryNumber === entryNumber);
  }

  /**
   * Get a range of entries
   */
  getRange(start: number, end: number): LedgerEntry[] {
    return this.entries.filter(
      (e) => e.entryNumber >= start && e.entryNumber <= end
    );
  }

  /**
   * Get the latest entry
   */
  getLatest(): LedgerEntry | undefined {
    return this.entries[this.entries.length - 1];
  }

  /**
   * Get chain summary
   */
  getSummary() {
    const verified = this.entries.filter((e) => e.verified).length;
    return {
      totalEntries: this.entries.length,
      verifiedEntries: verified,
      brokenEntries: this.entries.length - verified,
      firstEntry: this.entries[0]?.timestamp || null,
      lastEntry: this.entries[this.entries.length - 1]?.timestamp || null,
      latestHash: truncateHash(this.entries[this.entries.length - 1]?.hash || "none"),
      tableName: this.tableName,
    };
  }

  /**
   * Export the full ledger as JSON
   */
  export(): LedgerEntry[] {
    return [...this.entries];
  }
}

// Factory for creating named ledger instances
export function createLedger(name: string): TamperEvidentLedger {
  return new TamperEvidentLedger(name);
}

// Default singleton for the main audit ledger
export const auditLedger = new TamperEvidentLedger("audit_trail");

export type { LedgerEntry, LedgerIntegrity };
