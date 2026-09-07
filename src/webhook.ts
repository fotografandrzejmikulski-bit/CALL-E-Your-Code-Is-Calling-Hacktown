export interface CalleTerminalEvent {
  id: string;
  call_id: string;
  status: string;
}

export class WebhookDeduper {
  private readonly seen = new Set<string>();

  accept(eventId: string): boolean {
    if (!eventId || this.seen.has(eventId)) return false;
    this.seen.add(eventId);
    return true;
  }
}

export function validateTerminalEvent(event: unknown): CalleTerminalEvent {
  if (!event || typeof event !== "object") throw new Error("Invalid webhook body");
  const value = event as Record<string, unknown>;
  if (typeof value.id !== "string" || typeof value.call_id !== "string" || typeof value.status !== "string") {
    throw new Error("Webhook body does not match the terminal event contract");
  }
  return { id: value.id, call_id: value.call_id, status: value.status };
}
