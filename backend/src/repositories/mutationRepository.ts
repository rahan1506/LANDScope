import { Mutation } from "../types";

export const CANONICAL_DEMO_MUTATIONS: Mutation[] = [
  {
    id: "mut-001",
    mutationId: "MUT-2024-BLR-0182",
    parcelId: "parcel-001",
    ulpin: "KA-BLR-DEV-2024-00189",
    oldAreaHa: 2.45,
    newAreaHa: 2.15,
    mutationDate: "2024-01-15",
    mutationType: "Partition",
    status: "Completed",
    source: "Bhoomi Karnataka Portal",
    registrationNumber: "REG/2024/DEV/9912",
    referenceNumber: "TAH/DEV/MUT/441/2023",
    oldOwner: "Rameshwar Rao & Brothers",
    newOwner: "Rameshwar Rao (0.95 Ha) & Suresh Rao (1.20 Ha)",
    remarks: "Partition deed sub-division executed; 0.30 Ha remaining unrecorded / disputed corridor",
    isDemo: true,
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "mut-002",
    mutationId: "MUT-2023-PUN-8419",
    parcelId: "parcel-002",
    ulpin: "MH-PUN-HAV-2023-04912",
    oldAreaHa: 1.18,
    newAreaHa: 1.40,
    mutationDate: "2023-11-04",
    mutationType: "Sale",
    status: "Under_Review",
    source: "Mahabhulekh 7/12",
    registrationNumber: "HAV/SRO-4/2023/11029",
    referenceNumber: "REV/HAV/APPEAL/12/2023",
    oldOwner: "Babanrao Jagtap",
    newOwner: "Anand Urban Developers LLP",
    remarks: "Non-agricultural (NA) conversion permission pending with Collector Pune; commercial excavation reported",
    isDemo: true,
    createdAt: "2023-11-04T10:00:00Z",
  },
];

export class MutationRepository {
  private static store: Mutation[] = [...CANONICAL_DEMO_MUTATIONS];

  static async findByParcelId(parcelId: string): Promise<Mutation[]> {
    return this.store.filter((m) => m.parcelId === parcelId);
  }

  static async findById(id: string): Promise<Mutation | null> {
    return this.store.find((m) => m.id === id || m.mutationId === id) || null;
  }

  static async create(mutation: Omit<Mutation, "id" | "createdAt">): Promise<Mutation> {
    const created: Mutation = {
      ...mutation,
      id: `mut-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.store.unshift(created);
    return created;
  }
}
