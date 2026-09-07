import { describe, expect, it } from "vitest";
import { WebhookDeduper, validateTerminalEvent } from "../src/webhook.js";

describe("webhook boundary", () => {
  it("validates the minimum terminal event contract", () => {
    expect(validateTerminalEvent({ id: "evt-1", call_id: "call-1", status: "completed" })).toEqual({
      id: "evt-1", call_id: "call-1", status: "completed"
    });
  });

  it("rejects malformed bodies", () => {
    expect(() => validateTerminalEvent({ id: "evt-1" })).toThrow();
  });

  it("deduplicates repeated provider events", () => {
    const deduper = new WebhookDeduper();
    expect(deduper.accept("evt-1")).toBe(true);
    expect(deduper.accept("evt-1")).toBe(false);
  });
});
