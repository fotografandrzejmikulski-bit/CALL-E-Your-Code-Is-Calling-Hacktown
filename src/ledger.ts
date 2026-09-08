import { createHash } from "node:crypto";
import type { CallRecord, IncidentState } from "./domain.js";
import { assertTransition } from "./fsm.js";

export class AuditLedger {
  private readonly records: CallRecord[] = [];
  private readonly keys = new Map<string, CallRecord>();

  reserve(operationKey: string): CallRecord {
    const existing = this.keys.get(operationKey);
    if (existing) return { ...existing };
    const now = new Date().toISOString();
    const record: CallRecord = {
      operationKey,
      state: "detected",
      createdAt: now,
      updatedAt: now,
    };
    record.auditDigest = this.digest(record);
    this.records.push(record);
    this.keys.set(operationKey, record);
    return { ...record };
  }

  transition(operationKey: string, state: IncidentState, patch: Partial<CallRecord> = {}): CallRecord {
    const record = this.keys.get(operationKey);
    if (!record) throw new Error(`Unknown operation key: ${operationKey}`);
    assertTransition(record.state, state);
    record.state = state;
    record.updatedAt = new Date().toISOString();
    Object.assign(record, patch);
    record.auditDigest = this.digest(record);
    return { ...record };
  }

  has(operationKey: string): boolean {
    return this.keys.has(operationKey);
  }

  snapshot(): CallRecord[] {
    return this.records.map((record) => ({ ...record }));
  }

  private digest(record: CallRecord): string {
    return createHash("sha256")
      .update(JSON.stringify({ ...record, auditDigest: undefined }))
      .digest("hex");
  }
}
