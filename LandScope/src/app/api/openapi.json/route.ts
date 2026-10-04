import { NextResponse } from "next/server";
import { LANDSCOPE_OPENAPI_SPEC } from "@/lib/api/openapi-spec";

export async function GET() {
  return NextResponse.json(LANDSCOPE_OPENAPI_SPEC, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
