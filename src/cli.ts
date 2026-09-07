import "dotenv/config";
import { runIncident } from "./orchestrator.js";
import { AuditLedger } from "./ledger.js";
import type { Incident } from "./domain.js";

const demoIncident: Incident = {
  id: "AF-DEMO-0001",
  vehicleId: "TRUCK-42",
  phone: "+15550123456",
  closure: "A4 highway closure affecting the planned route.",
  requestedBy: "dispatch-demo",
  goal: "Inform the driver about the A4 closure, negotiate a safe diversion route, and confirm the revised ETA.",
};

async function main() {
  const command = process.argv[2] ?? "demo";
  const live = command === "live";
  const ledger = new AuditLedger();
  const incident = live ? { ...demoIncident, phone: process.env.AEGIS_LIVE_PHONE ?? "" } : demoIncident;

  console.log(`AegisFleet | mode=${live ? "LIVE" : "DRY-RUN"}`);
  console.log(`Incident=${incident.id} vehicle=${incident.vehicleId}`);

  const result = await runIncident(incident, { live, ledger });

  console.log(JSON.stringify({
    state: result.record.state,
    reused: result.reused,
    operationKey: result.record.operationKey,
    outcome: result.outcome,
    auditDigest: result.record.auditDigest,
    callsPlaced: live ? (result.record.callId ? 1 : 0) : 0,
  }, null, 2));

  if (!live) console.log("DRY-RUN GUARANTEE: no network request and no phone call were made.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
