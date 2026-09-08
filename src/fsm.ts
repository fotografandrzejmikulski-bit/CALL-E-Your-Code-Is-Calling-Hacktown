import type { IncidentState } from "./domain.js";

const allowed: Record<IncidentState, IncidentState[]> = {
  detected: ["validated", "escalated"],
  validated: ["approved", "escalated"],
  approved: ["calling", "escalated"],
  calling: ["resolved", "escalated"],
  resolved: [],
  escalated: [],
};

export function assertTransition(from: IncidentState, to: IncidentState): void {
  if (!allowed[from].includes(to)) throw new Error(`Invalid incident transition: ${from} -> ${to}`);
}
