import { CalleClient } from "@call-e/calle";
import type { CallOutcome, Incident } from "./domain.js";
import { RESULT_SCHEMA } from "./domain.js";

function redactPhone(phone: string): string {
  return phone.length < 5 ? "***" : `${phone.slice(0, 2)}***${phone.slice(-2)}`;
}

export async function executeWithCalle(incident: Incident, idempotencyKey: string): Promise<{ callId?: string; outcome: CallOutcome }> {
  const apiKey = process.env.CALLE_API_KEY;
  if (!apiKey) throw new Error("CALLE_API_KEY is required for live mode");

  const client = new CalleClient({ apiKey });
  const task = `${incident.goal}\nRecipient: ${redactPhone(incident.phone)}\nVehicle: ${incident.vehicleId}\nIncident: ${incident.closure}\nReturn only the requested operational facts and never invent missing information.`;

  // The current public TypeScript SDK documents createAndWait. The stable idempotency
  // primitive is exposed at the API layer; this adapter keeps the operation key in the
  // AegisFleet ledger so retries reuse the same application-level execution identity.
  const call = await client.calls.createAndWait({
    task,
    resultSchema: RESULT_SCHEMA,
    metadata: { aegisfleet_operation_key: idempotencyKey },
  });

  const structured = call.structuredResult as Partial<CallOutcome> | undefined;
  if (!structured) throw new Error("CALL-E completed without a structured result");

  const outcome: CallOutcome = {
    route_acceptance: structured.route_acceptance === "yes" || structured.route_acceptance === "no" || structured.route_acceptance === "unknown" ? structured.route_acceptance : "unknown",
    eta_update_time: typeof structured.eta_update_time === "string" ? structured.eta_update_time : "",
    escalation_needed: structured.escalation_needed === "urgent" || structured.escalation_needed === "normal" || structured.escalation_needed === "none" || structured.escalation_needed === "unknown" ? structured.escalation_needed : "unknown",
    evidence_summary: typeof structured.evidence_summary === "string" ? structured.evidence_summary : "",
    confidence: structured.confidence === "high" || structured.confidence === "medium" || structured.confidence === "low" || structured.confidence === "unknown" ? structured.confidence : "unknown",
  };

  return { callId: typeof call.id === "string" ? call.id : undefined, outcome };
}
