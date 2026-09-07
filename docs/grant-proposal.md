# AegisFleet — Grant Proposal

## Project Title

**AegisFleet: A Governed AI Phone-Operations Control Plane for Logistics Incident Recovery**

## Applicant

**Andrzej Mikulski**  
Email: mojealterego21@gmail.com

## Executive Summary

AegisFleet is an enterprise-oriented control plane for phone-based logistics operations. It addresses a narrow but consequential problem: when a transport disruption occurs, operational teams must turn a digital incident into a telephone interaction with a human driver, collect facts, negotiate a bounded operational change, and return a machine-readable decision to the system of record.

CALL-E provides the critical execution primitive: a goal-driven AI agent that can conduct real phone work and return structured outcomes. AegisFleet builds the governance layer around that primitive. It validates whether a call is permitted, creates a stable operation identity, executes through a provider adapter, validates evidence, represents uncertainty explicitly, and escalates rather than guessing.

The project is intentionally designed as more than a voice-agent demonstration. Its core contribution is a **decision boundary for autonomous phone work**: the system determines when it may call, what information may cross the boundary, what evidence is sufficient to resolve an incident, and when a human must take over.

## The Problem

Logistics networks depend on rapid coordination during exceptions: road closures, missed loading windows, receiving-site changes, traffic disruption, and vehicle delays. These events create work that is difficult to automate with scripted IVR trees because the objective is not a fixed sequence of key presses; it is an outcome such as "find a workable diversion and obtain the revised ETA."

The cost of this friction is operational latency. A dispatcher spends scarce attention making and repeating calls while the disruption propagates through downstream planning.

The project therefore targets a specific phone-work gap:

> **How can an enterprise agent safely convert a logistics incident into a bounded phone interaction and a trustworthy operational decision?**

## Solution

AegisFleet represents the workflow as a controlled lifecycle:

`detected → validated → approved → calling → resolved | escalated`

The architecture separates five concerns:

1. **Intent** — what the business needs from the phone task.
2. **Policy** — whether the proposed call is allowed.
3. **Execution** — CALL-E performs the phone work.
4. **Evidence** — the result is accepted only when the required facts and confidence are present.
5. **Disposition** — the system either emits an ERP-ready decision or creates a human escalation.

This separation makes the project portable across agent hosts and protects the enterprise boundary from direct, unconstrained model behavior.

## Why CALL-E

The current public CALL-E integration documentation describes goal-driven phone tasks, structured results, IVR navigation, SDK/API/MCP integration, and a Streamable HTTP MCP workflow. The documented MCP lifecycle is `plan_call → run_call → get_call_run`, with a recommendation to persist the `run_id` and avoid creating a second call after a local timeout. AegisFleet uses these primitives as a provider boundary rather than reimplementing telephony.

## Technical Innovation

### 1. Policy-gated autonomy

AegisFleet does not equate an AI-generated plan with permission to execute it. A call passes an explicit validation layer before provider I/O.

### 2. Deterministic structured outcomes

Business decisions are represented by allowlisted fields and enums:

- `yes | no | unknown` for route acceptance;
- `urgent | normal | none | unknown` for escalation;
- `high | medium | low | unknown` for confidence.

The `unknown` state is deliberately preserved. Missing evidence is not silently converted into a negative or positive decision.

### 3. Evidence-backed resolution

Automatic resolution requires affirmative route acceptance, a non-empty revised ETA, no escalation requirement, non-empty evidence, and high confidence. Otherwise the system escalates.

### 4. Idempotent execution identity

A stable application-level operation key is reserved before CALL-E execution. This prevents a transient network timeout or process restart from accidentally becoming a second logical business operation.

### 5. Reproducible dry-run mode

The default demonstration executes no network request and places no phone call. This is a critical engineering feature for judges, CI, onboarding and safety review. Live calling is an explicit mode.

### 6. Auditability

State transitions are represented as structured records with a SHA-256 audit digest. The prototype does not claim immutable enterprise storage; it establishes the domain model required for such a ledger.

## Prototype

The repository contains a working TypeScript prototype with:

- strict compiler settings;
- local policy engine;
- idempotency and audit ledger;
- deterministic dry-run simulator;
- CALL-E server SDK adapter;
- result schema;
- end-to-end orchestration;
- automated regression tests;
- judge-ready demo instructions;
- security and production-gap documentation.

The project can be evaluated without a CALL-E credential:

```bash
npm install
npm run demo
npm test
npm run typecheck
```

A live environment is deliberately separate and requires an explicit API key and live mode.

## Expected Impact

AegisFleet is designed for logistics providers, fleets, 3PL operators, warehouses, dispatch centers and enterprises whose operational systems already contain the digital side of an exception but still rely on people to complete the voice side.

The proposed value is not simply fewer calls. It is shorter exception-to-decision latency with a more reliable machine-readable handoff into the operational system.

We will measure the system using:

- percentage of incidents completed without human intervention;
- percentage escalated correctly when evidence is insufficient;
- duplicate-call prevention rate under simulated retries;
- structured-result validity rate;
- time from incident creation to disposition;
- operator minutes displaced from repetitive phone work;
- false-resolution rate, with a target of zero in the governed prototype.

These metrics are intentionally operational rather than vanity metrics.

## Market and Sustainability

The project can evolve from a hackathon prototype into a B2B operations product because the architecture isolates provider execution from enterprise policy. A customer could connect AegisFleet to a transport-management system, fleet platform, warehouse system or incident bus while retaining a stable policy and audit layer.

Potential commercial models include per-active-fleet pricing, usage-based pricing for phone work, and enterprise governance tiers. The provider remains replaceable behind an adapter boundary, reducing platform lock-in at the business-logic layer.

## Risk Management

The highest risk is not that an AI sounds unnatural. It is that an AI makes an incorrect real-world decision.

AegisFleet addresses this risk by design:

- no live fallback from missing configuration;
- explicit dry-run mode;
- fixture-number protection;
- purpose-bounded calls;
- allowlisted output fields;
- explicit uncertainty states;
- evidence requirements;
- human escalation;
- idempotent operation identity;
- audit records;
- privacy minimization.

The prototype also documents what it does **not** establish. A telephone interaction is not treated as biometric identity proof, and the project does not claim provider-signed webhook verification unless such a mechanism is actually available and configured.

## Development Plan

### Phase 1 — Hackathon prototype

Complete the deterministic orchestration layer, live CALL-E adapter, structured outcome contract, automated tests and three-minute demonstration.

### Phase 2 — Pilot hardening

Add persistent PostgreSQL storage, transactional idempotency reservations, authenticated webhook ingestion, replay-safe reconciliation, role-based access control, encrypted secrets, retention controls and an operator console.

### Phase 3 — Enterprise integration

Integrate with transportation-management and ERP systems; support batch incidents, multilingual call policies, configurable escalation ladders and organization-level governance.

### Phase 4 — Evaluation at scale

Run controlled pilots and publish measurable results around latency, human workload, completion reliability and false-resolution prevention.

## Use of Funding

A grant would be used to move AegisFleet from a competition-grade prototype to a measurable enterprise pilot:

- **35% Engineering:** persistence, integration, reliability, testing and deployment.
- **25% Security and governance:** access control, secret handling, privacy, audit and operational controls.
- **20% Pilot development:** fleet/TMS integrations, workflow configuration and operator tooling.
- **10% Evaluation:** controlled test scenarios, metrics, reliability experiments and documentation.
- **10% Demonstration and community contribution:** public examples, reusable CALL-E contribution assets and technical communication.

## Community Contribution

AegisFleet is structured to become a reusable CALL-E community contribution rather than a closed demo. The intended contribution area is a TypeScript application pattern for incident escalation and logistics/service dispatch, accompanied by explicit dry-run behavior, setup instructions, safety boundaries and tests.

## Why This Project Is Distinctive

Many phone-agent projects optimize for conversation quality. AegisFleet optimizes for **operational trust**.

The central product idea is simple:

> **A phone call becomes useful to an enterprise only when the result can be bounded, verified, replayed, audited and safely connected to the next business action.**

That is the layer AegisFleet contributes.

## Current Evidence and Limitations

The attached source material established the original AegisFleet concept around logistics incidents, CALL-E, MCP, structured outcomes, idempotency, evidence and auditability. The prototype in this repository has deliberately expanded those ideas into a testable control plane.

The current public CALL-E rules also establish that a submission must be functional, must use CALL-E API/SDK/MCP/CLI/Skill, must include a public sub-three-minute demonstration video, and must open a pull request to `CALLE-AI/awesome-phone-call-agents`. The current hackathon prize pool is $10,000, not the $50,000/$180,000 figure in the earlier draft. Therefore this proposal does not claim an unsupported prize amount or an already-completed contribution PR.

## Requested Support

We seek support to harden AegisFleet into a deployable, measurable reference implementation for governed autonomous phone operations in logistics and adjacent operational domains.

The long-term opportunity is larger than logistics: the same control-plane model can govern service dispatch, appointment coordination, supplier follow-up, facility operations and incident escalation wherever a business process crosses from digital systems into the telephone network.

## Closing Statement

AegisFleet is built around a practical premise: autonomous agents should not merely generate answers; they should complete real-world work without losing enterprise control.

CALL-E supplies the ability to perform the phone work. AegisFleet supplies the operational boundary that decides when to call, what may be concluded, what evidence is sufficient, and when a human must remain in the loop.

That combination turns a phone conversation into an auditable business event.
