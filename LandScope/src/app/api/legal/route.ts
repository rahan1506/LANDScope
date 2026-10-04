import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import {
  DEMO_LEGAL_ACTS,
  DEMO_LEGAL_SECTIONS,
  DEMO_LEGAL_CONFLICTS,
  DEMO_LEGAL_RELATIONSHIPS,
  DEMO_POLICY_OVERLAYS,
  CONFLICT_MATRIX,
  getActsByCategory,
  getSectionsForAct,
  getConflictDetails,
  LegalCategory,
} from "@/lib/land-governance/legal-knowledge";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Legal Harmonizer." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const actId = searchParams.get("actId");
  const category = searchParams.get("category");
  const conflictId = searchParams.get("conflictId");
  const query = searchParams.get("query")?.toLowerCase();

  if (conflictId) {
    const conflict = getConflictDetails(conflictId);
    if (!conflict) {
      return NextResponse.json({ error: "Conflict not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, conflict });
  }

  if (actId) {
    const act = DEMO_LEGAL_ACTS.find((a) => a.id === actId);
    if (!act) {
      return NextResponse.json({ error: "Act not found" }, { status: 404 });
    }
    const sections = getSectionsForAct(actId);
    return NextResponse.json({ success: true, act, sections });
  }

  if (category) {
    const acts = getActsByCategory(category as LegalCategory);
    return NextResponse.json({ success: true, acts });
  }

  if (query) {
    const matchedActs = DEMO_LEGAL_ACTS.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.shortName.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
    );
    const matchedSections = DEMO_LEGAL_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.sectionNumber.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query)
    );
    const matchedConflicts = DEMO_LEGAL_CONFLICTS.filter(
      (c) =>
        c.conflictDescription.toLowerCase().includes(query) ||
        c.frameworkA.toLowerCase().includes(query) ||
        c.frameworkB.toLowerCase().includes(query)
    );

    return NextResponse.json({
      success: true,
      acts: matchedActs,
      sections: matchedSections,
      conflicts: matchedConflicts,
    });
  }

  // Return complete matrix and overview
  return NextResponse.json({
    success: true,
    acts: DEMO_LEGAL_ACTS,
    sections: DEMO_LEGAL_SECTIONS,
    conflicts: DEMO_LEGAL_CONFLICTS,
    relationships: DEMO_LEGAL_RELATIONSHIPS,
    overlays: DEMO_POLICY_OVERLAYS,
    conflictMatrix: CONFLICT_MATRIX,
  });
}
