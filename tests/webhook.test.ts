import { describe, expect, it } from "vitest";
import { WebhookDeduper, validateTerminalEvent } from "../src/webhook.js";

describe("webhook safety boundary", () => {
  it("accepts supported terminal status values", () => {
    expect(validateTerminalEvent({ id: "evt-1", call_id: "call-1", status: "completed" })).toEqual({
      id: "evt-1", call_id: "call-1", status: "completed"
    });
    expect(validateTerminalEvent({ id: "evt-2", call_id: "call-2", status: "failed" }).status).toBe("failed");
  });

  it("rejects malformed or unsupported events", () => {
    expect(() => validateTerminalEvent({ id: "evt-1" })).toThrow();
    expect(() => validateTerminalEvent({ id: "evt-1", call_id: "call-1", status: "weird" })).toThrow();
  });

  it("deduplicates repeated and blank provider event ids", () => {
    const deduper = new WebhookDeduper();
    expect(deduper.accept("evt-1")).toBe(true);
    expect(deduper.accept("evt-1")).toBe(false);
    expect(deduper.accept("   ")).toBe(false);
  });
});
