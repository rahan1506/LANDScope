import { LandCase, CaseStatus, SeverityLevel } from "../types";

export const CANONICAL_DEMO_CASES: LandCase[] = [
  {
    id: "case-001",
    caseId: "CASE-2024-001",
    parcelId: "parcel-001",
    ulpin: "KA-BLR-DEV-2024-00189",
    surveyNumber: "142/3A",
    location: {
      village: "Devanahalli Rural",
      taluk: "Devanahalli",
      district: "Bengaluru Rural",
      state: "Karnataka",
      coordinates: { lat: 13.2458, lng: 77.7126 },
    },
    riskScore: 84,
    riskLevel: "HIGH",
    status: "FIELD_VERIFICATION",
    priority: "HIGH",
    assignedOfficer: "M. Gowda (Village Accountant)",
    assignedOfficerId: "usr_field_01",
    description: "Commercial warehouse erection detected on agricultural parcel without Section 95 KLR non-agricultural conversion permission.",
    createdAt: "2024-02-25T11:30:00Z",
    updatedAt: "2024-02-26T12:00:00Z",
  },
  {
    id: "case-002",
    caseId: "CASE-2024-002",
    parcelId: "parcel-003",
    ulpin: "DL-SWD-NAJ-2024-00312",
    surveyNumber: "12/4/1",
    location: {
      village: "Najafgarh",
      taluk: "Najafgarh",
      district: "South West Delhi",
      state: "Delhi",
      coordinates: { lat: 28.6092, lng: 76.9854 },
    },
    riskScore: 96,
    riskLevel: "CRITICAL",
    status: "LEGAL_REVIEW",
    priority: "CRITICAL",
    assignedOfficer: "Dr. Aarti Singhal (SDM Najafgarh)",
    assignedOfficerId: "usr_sdm_002",
    description: "Active wetland reclamation and unapproved plinth work on Najafgarh eco-fragile buffer. Violates Wetlands Rules 2017 & EPA 1986.",
    createdAt: "2024-02-15T09:45:00Z",
    updatedAt: "2024-02-18T15:00:00Z",
  },
];

export class CaseRepository {
  private static store: LandCase[] = [...CANONICAL_DEMO_CASES];

  static async findAll(status?: CaseStatus, priority?: SeverityLevel): Promise<LandCase[]> {
    let list = this.store;
    if (status) list = list.filter((c) => c.status === status);
    if (priority) list = list.filter((c) => c.priority === priority);
    return list;
  }

  static async findById(id: string): Promise<LandCase | null> {
    return this.store.find((c) => c.id === id || c.caseId === id) || null;
  }

  static async create(landCase: LandCase): Promise<LandCase> {
    this.store.unshift(landCase);
    return landCase;
  }

  static async updateStatus(caseId: string, newStatus: CaseStatus): Promise<LandCase | null> {
    const c = this.store.find((item) => item.id === caseId || item.caseId === caseId);
    if (c) {
      c.status = newStatus;
      c.updatedAt = new Date().toISOString();
      return c;
    }
    return null;
  }
}
