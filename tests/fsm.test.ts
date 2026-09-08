import { describe, expect, it } from "vitest";
import { assertTransition } from "../src/fsm.js";

describe("incident state machine", () => {
  it("accepts the governed lifecycle", () => {
    expect(() => assertTransition("detected", "validated")).not.toThrow();
    expect(() => assertTransition("validated", "approved")).not.toThrow();
    expect(() => assertTransition("approved", "calling")).not.toThrow();
    expect(() => assertTransition("calling", "resolved")).not.toThrow();
  });

  it("rejects terminal-state regression", () => {
    expect(() => assertTransition("resolved", "calling")).toThrow(/Invalid incident transition/);
    expect(() => assertTransition("escalated", "validated")).toThrow(/Invalid incident transition/);
  });
});
