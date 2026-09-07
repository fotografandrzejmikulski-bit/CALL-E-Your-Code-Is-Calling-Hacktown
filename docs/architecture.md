# AegisFleet Architecture

## Design objective

Separate **intent**, **policy**, **provider execution**, **evidence validation**, and **operational writeback** so that a language model never directly controls a consequential enterprise side effect.

## Runtime stages

1. **Incident intake** — an operational event identifies the vehicle, affected route and required phone task.
2. **Policy gate** — validates purpose, phone format, execution mode, and live-call restrictions.
3. **Idempotency reservation** — assigns a stable operation key before provider I/O.
4. **Provider execution** — dry-run simulation or CALL-E server SDK.
5. **Structured extraction** — provider result is reduced to an allowlisted schema.
6. **Evidence gate** — the result needs explicit evidence and high confidence for automatic resolution.
7. **Disposition** — `resolved` returns an ERP-ready decision; otherwise `escalated` creates a human work item.
8. **Audit** — every state transition receives a SHA-256 digest for later reconciliation.

## Why this is stronger than a raw voice-agent demo

The differentiator is not merely outbound calling. The system controls the **decision boundary** around calling:

- it can refuse a call;
- it can refuse automatic resolution;
- it can represent uncertainty explicitly;
- it can survive retries without generating a second logical operation;
- it can run without provider credentials for reproducible evaluation;
- it keeps provider-specific execution behind an adapter.

## MCP / API relationship

CALL-E currently exposes a Streamable HTTP MCP endpoint with `plan_call`, `run_call`, and `get_call_run`. In the MCP flow, `run_call` starts a previously planned call and `get_call_run` is used for polling; the provider documentation explicitly advises persisting the `run_id` and avoiding a second `run_call` after a local timeout.

For a production deployment, AegisFleet can use either MCP for agent-host integration or the server SDK/API for backend-controlled orchestration. The current prototype keeps the domain layer independent from that choice.
