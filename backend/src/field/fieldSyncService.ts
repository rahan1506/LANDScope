import { FieldObservation, GeoPoint } from "../types";
import { logger } from "../utils/logger";
import { sha256Hex } from "../utils/hash";

export interface SyncBatchResult {
  totalReceived: number;
  syncedCount: number;
  duplicatesSkipped: number;
  failedCount: number;
  records: {
    clientGeneratedId: string;
    serverGeneratedId: string;
    status: "SYNCED" | "DUPLICATE_SKIPPED" | "FAILED";
  }[];
}

const observationsStore: Map<string, FieldObservation> = new Map();
const clientGeneratedIdIndex: Map<string, string> = new Map(); // clientGeneratedId -> serverId

export class FieldSyncService {
  /**
   * Ingest single observation with idempotency protection.
   */
  static async ingestObservation(input: Partial<FieldObservation>): Promise<{
    observation: FieldObservation;
    isDuplicate: boolean;
  }> {
    const clientId = input.clientGeneratedId;

    // Check duplicate idempotency key
    if (clientId && clientGeneratedIdIndex.has(clientId)) {
      const existingId = clientGeneratedIdIndex.get(clientId)!;
      const existing = observationsStore.get(existingId);
      if (existing) {
        logger.info(`Duplicate offline field observation detected (${clientId}), returning existing record.`);
        return { observation: existing, isDuplicate: true };
      }
    }

    const serverId = `field-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const observation: FieldObservation = {
      id: serverId,
      clientGeneratedId: clientId,
      caseId: input.caseId || "UNASSIGNED",
      parcelId: input.parcelId || "UNKNOWN",
      observerId: input.observerId || "usr_field_01",
      observerName: input.observerName || "Patwari Field Officer",
      timestamp: input.timestamp || new Date().toISOString(),
      gpsCoordinates: input.gpsCoordinates || { lat: 13.2458, lng: 77.7126, accuracyMeters: 3.2 },
      compassOrientation: input.compassOrientation || 0,
      boundaryPoints: input.boundaryPoints || [],
      observations: input.observations || "Field verification submitted via Bhu-Mitra PWA.",
      notes: input.notes,
      photos: input.photos || [],
      syncStatus: "synced",
      deviceInfo: input.deviceInfo || "Bhu-Mitra PWA v1.0",
    };

    observationsStore.set(serverId, observation);
    if (clientId) {
      clientGeneratedIdIndex.set(clientId, serverId);
    }

    logger.info(`Field observation recorded: ${serverId} (Client Ref: ${clientId})`);
    return { observation, isDuplicate: false };
  }

  /**
   * Batch synchronize multiple offline records.
   */
  static async syncBatch(records: Partial<FieldObservation>[]): Promise<SyncBatchResult> {
    const result: SyncBatchResult = {
      totalReceived: records.length,
      syncedCount: 0,
      duplicatesSkipped: 0,
      failedCount: 0,
      records: [],
    };

    for (const rec of records) {
      try {
        const { observation, isDuplicate } = await this.ingestObservation(rec);
        if (isDuplicate) {
          result.duplicatesSkipped++;
          result.records.push({
            clientGeneratedId: rec.clientGeneratedId || "none",
            serverGeneratedId: observation.id,
            status: "DUPLICATE_SKIPPED",
          });
        } else {
          result.syncedCount++;
          result.records.push({
            clientGeneratedId: rec.clientGeneratedId || "none",
            serverGeneratedId: observation.id,
            status: "SYNCED",
          });
        }
      } catch (err) {
        result.failedCount++;
        result.records.push({
          clientGeneratedId: rec.clientGeneratedId || "none",
          serverGeneratedId: "",
          status: "FAILED",
        });
      }
    }

    return result;
  }

  static getObservationById(id: string): FieldObservation | undefined {
    return observationsStore.get(id);
  }

  static getAllObservations(caseId?: string): FieldObservation[] {
    const all = Array.from(observationsStore.values());
    if (caseId) return all.filter((o) => o.caseId === caseId);
    return all;
  }

  static async attachPhoto(
    observationId: string,
    photoBuffer: Buffer,
    coordinates?: GeoPoint
  ): Promise<FieldObservation> {
    const obs = observationsStore.get(observationId);
    if (!obs) throw new Error("Field observation not found");

    const hash = sha256Hex(photoBuffer);
    const photoId = `photo-${Date.now()}`;
    const url = `/uploads/photos/${photoId}.jpg`;

    obs.photos.push({
      photoId,
      url,
      sha256Hash: hash,
      timestamp: new Date().toISOString(),
      coordinates,
    });

    return obs;
  }
}
