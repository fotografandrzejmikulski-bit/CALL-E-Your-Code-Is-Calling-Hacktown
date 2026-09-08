import type { Incident } from "./domain.js";
import { validateIncident, canResolve } from "./policy.js";
import { AuditLedger } from "./ledger.js";
import { simulateCall } from "./simulator.js";
import { executeWithCalle } from "./calle.js";

function failureOutcome(message: string) {
  return {
    route_acceptance: "unknown" as const,
    eta_update_time: "",
    escalation_needed: "urgent" as const,
    evidence_summary: message,
    confidence: "unknown" as const,
  };
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

  // The ledger reservation is created before any provider I/O.
  // In production this reservation must be backed by a transactional store.
  ledger.transition(operationKey, "calling");

  try {
    const result = options.live
      ? await executeWithCalle(incident, operationKey)
      : { outcome: simulateCall(incident) };

    const record = ledger.transition(
      operationKey,
      canResolve(result.outcome) ? "resolved" : "escalated",
      {
        ...(result.callId ? { callId: result.callId } : {}),
        outcome: result.outcome,
      },
    );
    return { record, reused: false, outcome: result.outcome };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown CALL-E execution failure";
    const record = ledger.transition(operationKey, "escalated", {
      outcome: failureOutcome(message),
    });
    return { record, reused: false, outcome: record.outcome };
  }
}
