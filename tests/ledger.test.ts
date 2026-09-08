import { describe, expect, it } from "vitest";
import { AuditLedger } from "../src/ledger.js";

describe("audit ledger", () => {
  it("reuses an existing operation key instead of creating a second call identity", () => {
    const ledger = new AuditLedger();
    const a = ledger.reserve("incident:I-1:call:TRUCK-42");
    const b = ledger.reserve("incident:I-1:call:TRUCK-42");
    expect(b.createdAt).toBe(a.createdAt);
    expect(ledger.snapshot()).toHaveLength(1);
  });

  it("produces an audit digest on every transition", () => {
    const ledger = new AuditLedger();
    ledger.reserve("op-1");
    const record = ledger.transition("op-1", "validated");
    expect(record.auditDigest).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects invalid state transitions", () => {
    const ledger = new AuditLedger();
    ledger.reserve("op-1");
    expect(() => ledger.transition("op-1", "resolved")).toThrow(/Invalid incident transition/);
  });

  it("links successive audit records", () => {
    const ledger = new AuditLedger();
    ledger.reserve("op-1");
    const validated = ledger.transition("op-1", "validated");
    const approved = ledger.transition("op-1", "approved");
    expect(approved.previousAuditDigest).toBe(validated.auditDigest);
  });
});
