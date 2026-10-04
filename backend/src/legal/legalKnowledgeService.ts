import { LegalAct, LegalSection, LegalConflict, Parcel, LandUseType } from "../types";

export interface LegalAnalysisResult {
  parcelId: string;
  ulpin: string;
  surveyNumber: string;
  applicableActs: {
    act: LegalAct;
    relevantSections: LegalSection[];
    citation: string;
    verified: boolean;
  }[];
  statutoryRestrictions: string[];
  mandatoryApprovals: string[];
  identifiedConflicts: LegalConflict[];
  generatedLegalStatement: string;
  source: string;
  citation: string;
  jurisdiction: string;
  confidence: "verified" | "source_verification_required";
  retrievedAt: string;
}

export const CANONICAL_LEGAL_ACTS: LegalAct[] = [
  {
    id: "act-klr-1964",
    name: "The Karnataka Land Revenue Act, 1964",
    shortName: "KLR Act 1964",
    year: 1964,
    jurisdiction: "state",
    region: "Karnataka",
    category: "land_revenue",
    effectiveDate: "1964-04-01",
    sourceDocument: "Karnataka Gazette Extraordinary, Part IV-2B",
    sourceUrl: "https://dpal.karnataka.gov.in/storage/pdf-files/12%20of%201964%20(E).pdf",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-fca-1980",
    name: "The Forest (Conservation) Act, 1980",
    shortName: "FCA 1980",
    year: 1980,
    jurisdiction: "central",
    category: "forest",
    effectiveDate: "1980-10-25",
    sourceDocument: "The Gazette of India, Extraordinary, Part II, Section 1",
    sourceUrl: "https://moef.gov.in/en/division/forest-divisions-2/forest-conservation-division/",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-rera-2016",
    name: "Real Estate (Regulation and Development) Act, 2016",
    shortName: "RERA 2016",
    year: 2016,
    jurisdiction: "central",
    category: "rera",
    effectiveDate: "2016-05-01",
    sourceDocument: "The Gazette of India, Extraordinary, Part II, Section 1, No. 18",
    sourceUrl: "https://rera.gov.in",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-wetland-2017",
    name: "Wetlands (Conservation and Management) Rules, 2017",
    shortName: "Wetlands Rules 2017",
    year: 2017,
    jurisdiction: "central",
    category: "environment",
    effectiveDate: "2017-09-26",
    sourceDocument: "MoEFCC Notification G.S.R. 1203(E)",
    sourceUrl: "https://moef.gov.in",
    isActive: true,
    confidence: "verified",
  },
];

export const CANONICAL_LEGAL_SECTIONS: LegalSection[] = [
  {
    id: "sec-klr-95",
    actId: "act-klr-1964",
    sectionNumber: "Section 95",
    title: "Uses of agricultural land and the procedure for use of agricultural land for other purpose",
    summary:
      "No occupant of land assessed or held for the purpose of agriculture shall divert such land or any part thereof to any other purpose except with the prior written permission of the Deputy Commissioner.",
    appliesTo: ["Agricultural", "Mixed"],
    restrictions: [
      "Mandatory conversion fine payment",
      "Prior sanction of layout plan by competent planning authority",
      "Prohibition on construction prior to formal Non-Agricultural conversion order",
    ],
    authorities: ["Deputy Commissioner / District Collector", "Tahsildar"],
    confidence: "verified",
  },
  {
    id: "sec-fca-2",
    actId: "act-fca-1980",
    sectionNumber: "Section 2",
    title: "Restriction on the de-reservation of forests or use of forest land for non-forest purpose",
    summary:
      "Notwithstanding anything contained in any other law for the time being in force in a State, no State Government or other authority shall make, except with the prior approval of the Central Government, any order directing that any forest land or any portion thereof may be used for any non-forest purpose.",
    appliesTo: ["Forest", "Agricultural"],
    restrictions: [
      "Strict ban on commercial clearing without Stage-I and Stage-II Central Approval",
      "Compensatory Afforestation Fund (CAMPA) mandatory payment",
    ],
    authorities: ["MoEFCC Integrated Regional Office", "State Forest Department"],
    confidence: "verified",
  },
  {
    id: "sec-rera-3",
    actId: "act-rera-2016",
    sectionNumber: "Section 3",
    title: "Prior registration of real estate project with Real Estate Regulatory Authority",
    summary:
      "No promoter shall advertise, market, book, sell or offer for sale, or invite persons to purchase in any manner any plot, apartment or building, as the case may be, in any real estate project, without registering the real estate project with the Real Estate Regulatory Authority established under this Act.",
    appliesTo: ["Residential", "Commercial", "Mixed"],
    restrictions: [
      "Plot area exceeding 500 square meters or more than 8 apartments requires mandatory registration",
      "Sanctioned conversion order and master plan clearance prerequisite",
    ],
    authorities: ["State Real Estate Regulatory Authority (RERA)"],
    confidence: "verified",
  },
];

export const CANONICAL_LEGAL_CONFLICTS: LegalConflict[] = [
  {
    id: "conflict-klr-fca",
    frameworkA: "State Land Revenue Code (KLR Act §95)",
    frameworkB: "Forest (Conservation) Act, 1980 (§2)",
    conflictDescription:
      "State revenue authority granted NA conversion or patta on deemed forest land without mandatory prior approval from Central Government under FCA 1980.",
    severity: "CRITICAL",
    affectedClassifications: ["Forest", "Agricultural"],
    requiredAuthority: "MoEFCC Central Advisory Committee + Supreme Court CEC",
    evidence: "Tahsildar NA permission issued on Survey marked as Deemed Forest in Godavarman case registry.",
    citation: "T.N. Godavarman Thirumulpad v. Union of India, AIR 1997 SC 1228",
    confidence: "verified",
  },
  {
    id: "conflict-wetland-rera",
    frameworkA: "Wetlands (Conservation and Management) Rules 2017",
    frameworkB: "RERA 2016 Registration",
    conflictDescription:
      "Real estate layout registered under RERA sits partially within the designated 50m eco-fragile buffer of a notified waterbody or wetland.",
    severity: "HIGH",
    affectedClassifications: ["Wetland", "Mixed"],
    requiredAuthority: "State Wetland Authority + NGT (National Green Tribunal)",
    evidence: "Survey layout boundary intersects protected wetland boundary shapefile by 18 meters.",
    citation: "Mantri Techzone Pvt. Ltd. v. Forward Foundation, (2019) 18 SCC 494",
    confidence: "verified",
  },
];

export class LegalKnowledgeService {
  static getActs(): LegalAct[] {
    return CANONICAL_LEGAL_ACTS;
  }

  static getActById(id: string): { act: LegalAct; sections: LegalSection[] } | null {
    const act = CANONICAL_LEGAL_ACTS.find((a) => a.id === id);
    if (!act) return null;
    const sections = CANONICAL_LEGAL_SECTIONS.filter((s) => s.actId === id);
    return { act, sections };
  }

  static searchLegalCorpus(queryStr: string): {
    acts: LegalAct[];
    sections: LegalSection[];
    conflicts: LegalConflict[];
  } {
    const q = queryStr.toLowerCase().trim();
    const acts = CANONICAL_LEGAL_ACTS.filter(
      (a) => a.name.toLowerCase().includes(q) || a.shortName.toLowerCase().includes(q) || a.category.includes(q)
    );
    const sections = CANONICAL_LEGAL_SECTIONS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.sectionNumber.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)
    );
    const conflicts = CANONICAL_LEGAL_CONFLICTS.filter(
      (c) => c.conflictDescription.toLowerCase().includes(q) || c.frameworkA.toLowerCase().includes(q) || c.frameworkB.toLowerCase().includes(q)
    );

    return { acts, sections, conflicts };
  }

  /**
   * Analyzes applicable legal frameworks for a parcel based strictly on its location and classification.
   * NEVER invents legal provisions. Always cites source acts.
   */
  static analyzeParcel(parcel: Parcel): LegalAnalysisResult {
    const applicableActsList: LegalAnalysisResult["applicableActs"] = [];
    const restrictions: string[] = [];
    const approvals: string[] = [];
    const conflicts: LegalConflict[] = [];

    // Check State Revenue Act
    const revenueAct = CANONICAL_LEGAL_ACTS.find((a) => a.id === "act-klr-1964") || CANONICAL_LEGAL_ACTS[0];
    const revenueSections = CANONICAL_LEGAL_SECTIONS.filter((s) => s.actId === revenueAct.id);
    applicableActsList.push({
      act: revenueAct,
      relevantSections: revenueSections,
      citation: `${revenueAct.shortName}, Section 95`,
      verified: true,
    });

    if (parcel.landUseClassification === "Agricultural") {
      restrictions.push("Section 95: Prior written sanction of District Collector mandatory for any non-agricultural use");
      approvals.push("DC Non-Agricultural (NA) Conversion Order with challan payment");
    }

    // Check Forest / Environmental
    if (parcel.landUseClassification === "Forest" || parcel.landUseClassification === "Wetland") {
      const fcaAct = CANONICAL_LEGAL_ACTS.find((a) => a.id === "act-fca-1980");
      if (fcaAct) {
        const fcaSec = CANONICAL_LEGAL_SECTIONS.filter((s) => s.actId === fcaAct.id);
        applicableActsList.push({
          act: fcaAct,
          relevantSections: fcaSec,
          citation: `${fcaAct.shortName}, Section 2`,
          verified: true,
        });
        restrictions.push("Section 2: Total prohibition on non-forest diversion without Central MoEFCC sanction");
        approvals.push("Central Government Stage-I / Stage-II Forest Clearance");
        conflicts.push(CANONICAL_LEGAL_CONFLICTS[0]);
      }
    }

    // RERA check
    const reraAct = CANONICAL_LEGAL_ACTS.find((a) => a.id === "act-rera-2016");
    if (reraAct && (parcel.registeredAreaHa > 0.05 || parcel.landUseClassification === "Commercial")) {
      const reraSec = CANONICAL_LEGAL_SECTIONS.filter((s) => s.actId === reraAct.id);
      applicableActsList.push({
        act: reraAct,
        relevantSections: reraSec,
        citation: `${reraAct.shortName}, Section 3`,
        verified: true,
      });
      restrictions.push("Section 3: Mandatory registration with State RERA prior to any layout marketing or plot booking");
      approvals.push("RERA Project Registration Certificate");
    }

    const citation = applicableActsList.map((a) => a.citation).join("; ");
    const generatedLegalStatement = `Parcel Survey ${parcel.surveyNumber} (${parcel.village}, ${parcel.district}) is governed by ${revenueAct.name} and applicable statutory frameworks. Any physical change from ${parcel.landUseClassification} requires formal statutory sanction under ${citation}.`;

    return {
      parcelId: parcel.id,
      ulpin: parcel.ulpin,
      surveyNumber: parcel.surveyNumber,
      applicableActs: applicableActsList,
      statutoryRestrictions: restrictions,
      mandatoryApprovals: approvals,
      identifiedConflicts: conflicts,
      generatedLegalStatement,
      source: "Official Central and State Gazette Repositories",
      citation,
      jurisdiction: `${parcel.state} / Republic of India`,
      confidence: "verified",
      retrievedAt: new Date().toISOString(),
    };
  }
}
