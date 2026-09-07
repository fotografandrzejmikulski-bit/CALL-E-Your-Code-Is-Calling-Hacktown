import type { Incident } from "./domain.js";

export interface PolicyDecision {
  allowed: boolean;
  reasons: string[];
}

const E164 = /^\+[1-9]\d{7,14}$/;

export function validateIncident(incident: Incident, live: boolean): PolicyDecision {
  const reasons: string[] = [];
  if (!incident.id || !incident.vehicleId || !incident.requestedBy) reasons.push("missing required incident identity");
  if (!E164.test(incident.phone)) reasons.push("phone must be E.164 formatted");
  if (!incident.goal.toLowerCase().includes("route") || !incident.goal.toLowerCase().includes("eta")) {
    reasons.push("goal must be purpose-bounded to route coordination and ETA capture");
  }
  if (live && /example|555|fixture/i.test(incident.phone)) reasons.push("fixture/example phone numbers are forbidden in live mode");
  return { allowed: reasons.length === 0, reasons };
}

export function canResolve(outcome: {
  route_acceptance: string;
  eta_update_time: string;
  escalation_needed: string;
  evidence_summary: string;
  confidence: string;
}): boolean {
  return outcome.route_acceptance === "yes"
    && outcome.eta_update_time.trim().length > 0
    && outcome.escalation_needed === "none"
    && outcome.evidence_summary.trim().length > 0
    && outcome.confidence === "high";
}
