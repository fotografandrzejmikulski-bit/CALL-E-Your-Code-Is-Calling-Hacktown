# CALL-E MCP Integration Notes

The current public CALL-E integration documentation describes a Streamable HTTP MCP endpoint with three tools:

- `plan_call(goal, phone)` — create or refine a plan without placing the call.
- `run_call(plan_id, confirm_token)` — execute the planned call and receive a `run_id`.
- `get_call_run(run_id)` — read progress, activity, summary and transcript.

AegisFleet should treat the exact `plan_id` and `confirm_token` as execution capabilities. They must not be guessed, transformed or reused across different incidents.

For long-running MCP calls, persist the `run_id`. A local timeout is not evidence that the provider did not start the call. Recovery should resume status retrieval rather than invoke `run_call` a second time.

This document intentionally does not encode a webhook URL in the MCP `run_call` flow. The current public integration notes state that MCP `run_call` does not accept `webhook_url`; API/server-SDK deployments may use asynchronous webhook completion where supported.

## Recommended enterprise envelope

```text
Agent host / operator
        |
        v
AegisFleet policy gate
        |
        v
CALL-E MCP / SDK adapter
        |
        v
Phone interaction
        |
        v
Structured result + evidence
        |
        v
AegisFleet decision gate
   |              |
resolved        escalated
   |              |
 ERP/event       human queue
```
