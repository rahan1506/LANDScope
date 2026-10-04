import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { apiCenterStore } from "@/lib/api/api-center-data";

export async function GET() {
  const jobs = apiCenterStore.getIngestionJobs();
  return NextResponse.json({
    success: true,
    jobs,
    count: jobs.length,
    pipeline: [
      "Source Ingestion",
      "Format & CRS Validation",
      "Schema Mapping",
      "Quality & Topology Checks",
      "Attribute Normalization",
      "Spatial Store Ingestion",
    ],
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  // PUBLIC accounts cannot ingest datasets
  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Public accounts cannot ingest datasets" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    if (!body.datasetName || !body.format || body.content === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request: Missing required datasetName, format (CSV/JSON/GeoJSON), or content",
        },
        { status: 400 }
      );
    }

    const result = apiCenterStore.ingestDataset({
      datasetName: body.datasetName,
      format: body.format,
      source: body.source || `${auth.user.organization} (${auth.role.title})`,
      content: body.content,
      targetModule: body.targetModule || "GIS & Land Intelligence",
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Dataset ingestion rejected during quality checks: ${result.error}`,
          job: result.job,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Dataset successfully validated, normalized, and ingested into LANDScope module",
        job: result.job,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process ingestion",
      },
      { status: 500 }
    );
  }
}
