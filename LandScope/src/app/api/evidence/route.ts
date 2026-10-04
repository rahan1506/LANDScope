import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import {
  generateEvidenceDossier,
  getEvidenceDocuments,
  getCaseById,
  getCases,
} from "@/lib/land-governance/demo-data";
import { verifyHash, generateSha256Hex } from "@/lib/land-governance/hash-utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");
  const action = searchParams.get("action");

  // Public verification does not require auth
  if (action === "verify" && caseId) {
    const c = getCaseById(caseId);
    if (!c) {
      return NextResponse.json({ error: "Case not found for verification", isValid: false }, { status: 404 });
    }

    const dossier = await generateEvidenceDossier(c.caseId);
    return NextResponse.json({
      success: true,
      caseId: c.caseId,
      ulpin: c.ulpin,
      isValid: true,
      integrityHash: dossier.integrityHash,
      generatedAt: dossier.generatedAt,
      generatedBy: dossier.generatedBy,
      status: dossier.status,
      documentCount: dossier.documents.length,
      documents: dossier.documents.map((d) => ({
        id: d.id,
        fileName: d.fileName,
        sha256Hash: d.sha256Hash,
        valid: true,
      })),
    });
  }

  // Auth check for internal dossier viewing
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (caseId) {
    const dossier = await generateEvidenceDossier(caseId);
    return NextResponse.json({ success: true, dossier });
  }

  const cases = getCases();
  const docs = getEvidenceDocuments();

  return NextResponse.json({
    success: true,
    cases: cases.map((c) => ({
      caseId: c.caseId,
      ulpin: c.ulpin,
      surveyNumber: c.surveyNumber,
      status: c.status,
      riskLevel: c.riskLevel,
      documentCount: c.evidenceDocuments.length,
    })),
    recentDocuments: docs,
  });
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, caseId, inputHash, dataToVerify } = body;

    if (action === "verify_hash") {
      const match = await verifyHash(dataToVerify, inputHash);
      return NextResponse.json({ success: true, match });
    }

    if (action === "compute_hash") {
      const hash = await generateSha256Hex(dataToVerify);
      return NextResponse.json({ success: true, hash });
    }

    if (action === "generate_dossier" && caseId) {
      const dossier = await generateEvidenceDossier(caseId);
      return NextResponse.json({ success: true, dossier });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
