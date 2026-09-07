# Security and Safety Model

AegisFleet treats a phone call as a consequential external action.

## Pre-call controls

- E.164 phone validation.
- Purpose-bounded goal validation.
- Explicit live-mode opt-in.
- Fixture/example numbers rejected in live mode.
- No credential is stored in source control.
- A stable application-level idempotency key is reserved before provider execution.

## Result controls

The provider result is treated as untrusted data. Only an allowlisted schema can cross into the operational decision layer. Unknown values are first-class states. Automatic resolution requires high confidence, affirmative route acceptance, a non-empty ETA, no escalation and non-empty evidence.

## Human escalation

Any policy rejection, CALL-E execution error, ambiguous outcome, low confidence or operational escalation requirement terminates the automatic path. The system does not retry by inventing a new logical call identity.

## Webhook design for production deployment

A deployed version should treat each terminal webhook as untrusted input, validate the JSON body against the expected event contract, record the provider event identifier, and make event processing idempotent. The event identifier should be deduplicated independently from the logical incident operation key. The application should reconcile the event with the provider-side call state before writing irreversible business state.

The current repository does not claim provider-signature verification because a provider signing mechanism was not established in the source material or verified in the current public CALL-E integration documentation. Where CALL-E offers signed webhooks, signature verification should be mandatory.

## Privacy minimization

The prototype avoids persisting full phone numbers or raw transcripts in its operational record. A production deployment should define retention periods, encryption, role-based access, redaction policy, and lawful-basis/consent requirements appropriate to the jurisdiction and use case.

## Operational kill switch

A production control plane should support an immediate global disable flag and a per-recipient/per-campaign budget. These are deployment requirements, not simulated claims about the current prototype.
