import type { CallOutcome, Incident } from "./domain.js";

export function simulateCall(incident: Incident): CallOutcome {
  const eta = "16:40";
  return {
    route_acceptance: "yes",
    eta_update_time: eta,
    escalation_needed: "none",
    evidence_summary: `Driver confirmed the diversion for ${incident.vehicleId} and stated that the revised ETA is ${eta}.`,
    confidence: "high",
  };
}
