# Hackathon Submission Package

## Submission name

AegisFleet — Governed AI Phone-Operations Control Plane for Logistics Incident Recovery

## One-line pitch

AegisFleet turns a logistics incident into a bounded phone task, validates the evidence returned by CALL-E, and refuses to resolve the incident when certainty is insufficient.

## The problem

When a route, loading window or receiving condition changes, logistics teams often still need a human to call a driver, explain the incident, negotiate a bounded change and bring the answer back into a digital system.

## The solution

AegisFleet adds an enterprise governance layer around CALL-E:

`incident → policy gate → call execution → structured result → evidence gate → resolved/escalated`

## What the judges should notice

1. **Real phone-work problem:** this is operational exception handling, not a generic chatbot.
2. **Non-trivial CALL-E use:** the application is organized around the CALL-E server SDK and preserves a provider adapter boundary.
3. **Safety by construction:** dry-run is default; live mode is explicit; fixture numbers are blocked; ambiguous results escalate.
4. **Structured operational outcome:** route acceptance, ETA, escalation level, evidence and confidence are machine-readable.
5. **Resilience:** stable operation keys prevent duplicate logical execution in the application layer; audit digests preserve decision traceability.
6. **Reusable contribution:** the project can be packaged as a TypeScript app contribution for `awesome-phone-call-agents`.

## Demo

Recommended recording: under 3 minutes. Use `docs/demo-script.md` as the shot list.

The repository's default demo does not place a real call and is safe to reproduce. A live recording must use a provisioned and authorized test recipient and an explicitly configured CALL-E account.

## Important submission requirement

The current hackathon rules require a pull request to:

`CALLE-AI/awesome-phone-call-agents`

This project repository is the source-development repository and is separate from that required community contribution. The contribution PR must be opened deliberately against the correct contribution area; this file does not claim that such a PR already exists.

## Devpost text

AegisFleet is a governed AI phone-operations control plane for logistics incidents. When a road closure or transport exception occurs, AegisFleet converts the incident into a purpose-bounded phone task, executes it through CALL-E, validates the structured result and evidence, and either resolves the incident or escalates it to a human.

The key innovation is the decision boundary around the call. The system can refuse a call, preserve `unknown` rather than guessing, prevent duplicate logical execution, and keep raw phone work from being treated as an automatic ERP decision. The default path is a deterministic dry-run with zero provider calls, while the live adapter is available for explicit testing.

Built with TypeScript, `@call-e/calle`, strict JSON Schema result contracts, a policy engine, an idempotency/audit ledger, webhook validation, and automated tests.
