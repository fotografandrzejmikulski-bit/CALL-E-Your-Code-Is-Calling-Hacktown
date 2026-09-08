import type { Incident } from "./domain.js";
import { validateIncident, canResolve } from "./policy.js";
import { AuditLedger } from "./ledger.js";
import { simulateCall } from "./simulator.js";
import { executeWithCalle } from "./calle.js";
import { validateOutcome } from "./validation.js";

function failureOutcome(message: string) {
  return validateOutcome({
    route_acceptance: "unknown",
    eta_update_time: "",
    escalation_needed: "urgent",
    evidence_summary: message,
    confidence: "unknown",
  });
}

export async function runIncident(
  incident: Incident,
  options: { live: boolean; ledger?: AuditLedger } = { live: false },
) {
  const ledger = options.ledger ?? new AuditLedger();
  const operationKey = `incident:${incident.id}:call:${incident.vehicleId}`;
  const reserved = ledger.reserve(operationKey);

  if (reserved.state !== "detected") {
    return { record: reserved, reused: true, outcome: reserved.outcome };
  }

  const policy = validateIncident(incident, options.live);
  if (!policy.allowed) {
    const record = ledger.transition(operationKey, "escalated", {
      outcome: failureOutcome(policy.reasons.join("; ")),
    });
    return { record, reused: false, outcome: record.outcome };
  }

  ledger.transition(operationKey, "validated");
  ledger.transition(operationKey, "approved");
  ledger.transition(operationKey, "calling");

  try {
    const raw = options.live
      ? await executeWithCalle(incident, operationKey)
      : { outcome: simulateCall(incident) };
    const outcome = validateOutcome(raw.outcome);
    const record = ledger.transition(
      operationKey,
      canResolve(outcome) ? "resolved" : "escalated",
      { ...(raw.callId ? { callId: raw.callId } : {}), outcome },
    );
    return { record, reused: false, outcome };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown CALL-E execution failure";
    const record = ledger.transition(operationKey, "escalated", {
      outcome: failureOutcome(message),
    });
    return { record, reused: false, outcome: record.outcome };
  }
}
