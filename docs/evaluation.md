# Evaluation Plan

## Core hypothesis

Governed phone automation can reduce incident-to-decision latency without increasing false operational resolutions.

## Evaluation matrix

| Test | Input | Pass condition |
|---|---|---|
| Valid incident | Correctly formed route/ETA task | Reaches `resolved` in dry-run |
| Bad phone | Invalid/non-E.164 number | Reaches `escalated`; no provider I/O |
| Fixture phone in live | Example/555 number | Rejected before provider I/O |
| Ambiguous answer | `unknown` route acceptance | Escalates |
| Low confidence | confidence != `high` | Escalates |
| Duplicate submission | Same incident twice | One logical ledger record |
| Malformed webhook | Missing event fields | Rejected |
| Replayed webhook | Same event ID twice | First accepted, second ignored |
| Missing live credential | Live mode without key | Fails closed |

## Production pilot metrics

1. Incident-to-disposition latency.
2. Human minutes per incident.
3. Automatic resolution precision.
4. Escalation recall for ambiguous/failed calls.
5. Duplicate-call incidence under retry/failure injection.
6. Structured-result validity rate.
7. Operator override rate.

The strongest safety metric is **false-resolution rate**: incidents automatically marked resolved despite insufficient evidence. The target for governed automation is zero in the validation cohort.
