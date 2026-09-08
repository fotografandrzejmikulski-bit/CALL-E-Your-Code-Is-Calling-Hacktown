export interface CalleTerminalEvent {
  id: string;
  call_id: string;
  status: "completed" | "failed" | "cancelled" | "unknown";
}

export class WebhookDeduper {
  private readonly seen = new Set<string>();

  accept(eventId: string): boolean {
    const normalized = eventId.trim();
    if (!normalized || this.seen.has(normalized)) return false;
    this.seen.add(normalized);
    return true;
  }
}

export function validateTerminalEvent(value: unknown): CalleTerminalEvent {
  if (!value || typeof value !== "object") throw new Error("Invalid webhook body");
  const event = value as Record<string, unknown>;
  const status = event.status;
  if (typeof event.id !== "string" || typeof event.call_id !== "string" || typeof status !== "string") {
    throw new Error("Webhook body does not match the terminal event contract");
  }
  const allowed = new Set(["completed", "failed", "cancelled", "unknown"]);
  if (!allowed.has(status)) throw new Error(`Unsupported terminal status: ${status}`);
  return { id: event.id, call_id: event.call_id, status: status as CalleTerminalEvent["status"] };
}
