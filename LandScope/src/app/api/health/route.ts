import { NextResponse } from "next/server";
import { apiCenterStore } from "@/lib/api/api-center-data";

export async function GET() {
  const services = apiCenterStore.getHealthServices();
  const connectors = apiCenterStore.getConnectors();

  const allOperational = services.every((s) => s.status === "Operational" || s.status === "Demo");

  return NextResponse.json({
    status: allOperational ? "HEALTHY" : "DEGRADED",
    timestamp: new Date().toISOString(),
    services,
    connectorsSummary: {
      total: connectors.length,
      demonstration: connectors.filter((c) => c.status === "Demonstration").length,
      planned: connectors.filter((c) => c.status === "Planned").length,
      live: connectors.filter((c) => c.status === "Live").length,
    },
    gatewayUptime: "99.98%",
    demonstrationLabel: "Demonstration System Health",
  });
}
