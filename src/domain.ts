export type IncidentState =
  | "detected"
  | "validated"
  | "approved"
  | "calling"
  | "resolved"
  | "escalated";

export type RouteAcceptance = "yes" | "no" | "unknown";
export type EscalationLevel = "urgent" | "normal" | "none" | "unknown";
export type ConfidenceLabel = "high" | "medium" | "low" | "unknown";

export interface Incident {
  id: string;
  vehicleId: string;
  phone: string;
  closure: string;
  requestedBy: string;
  goal: string;
}

export interface CallOutcome {
  route_acceptance: RouteAcceptance;
  eta_update_time: string;
  escalation_needed: EscalationLevel;
  evidence_summary: string;
  confidence: ConfidenceLabel;
}

export interface CallRecord {
  operationKey: string;
  callId?: string;
  state: IncidentState;
  createdAt: string;
  updatedAt: string;
  outcome?: CallOutcome;
  auditDigest?: string;
}

export const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "route_acceptance",
    "eta_update_time",
    "escalation_needed",
    "evidence_summary",
    "confidence"
  ],
  properties: {
    route_acceptance: {
      type: "string",
      enum: ["yes", "no", "unknown"]
    },
    eta_update_time: { type: "string" },
    escalation_needed: {
      type: "string",
      enum: ["urgent", "normal", "none", "unknown"]
    },
    evidence_summary: { type: "string", minLength: 1 },
    confidence: {
      type: "string",
      enum: ["high", "medium", "low", "unknown"]
    }
  }
} as const;
