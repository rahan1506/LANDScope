import fs from "fs";
import path from "path";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { sha256Hex } from "../utils/hash";

export interface StoredFileRecord {
  fileId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string;
  storagePath: string;
  url: string;
  uploadedAt: string;
}

export abstract class StorageProvider {
  abstract saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<StoredFileRecord>;
  abstract getFile(fileId: string): Promise<{ buffer: Buffer; mimeType: string } | null>;
  abstract deleteFile(fileId: string): Promise<boolean>;
}

export class LocalStorageProvider extends StorageProvider {
  private baseDir: string;

  constructor() {
    super();
    this.baseDir = path.resolve(env.STORAGE_LOCAL_DIR);
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<StoredFileRecord> {
    const hash = sha256Hex(buffer);
    const ext = path.extname(originalName) || ".bin";
    const fileId = `${Date.now()}-${hash.slice(0, 10)}${ext}`;
    const filePath = path.join(this.baseDir, fileId);

    await fs.promises.writeFile(filePath, buffer);

    return {
      fileId,
      originalName,
      mimeType,
      sizeBytes: buffer.length,
      sha256Hash: hash,
      storagePath: filePath,
      url: `/uploads/${fileId}`,
      uploadedAt: new Date().toISOString(),
    };
  }

  async getFile(fileId: string) {
    const filePath = path.join(this.baseDir, path.basename(fileId));
    if (!fs.existsSync(filePath)) return null;
    const buffer = await fs.promises.readFile(filePath);
    return { buffer, mimeType: "application/octet-stream" };
  }

  async deleteFile(fileId: string): Promise<boolean> {
    const filePath = path.join(this.baseDir, path.basename(fileId));
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}

export class S3StorageProvider extends StorageProvider {
  async saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<StoredFileRecord> {
    logger.info(`S3 Provider active: Simulating direct S3 bucket upload to ${env.STORAGE_BUCKET}`);
    const hash = sha256Hex(buffer);
    const fileId = `${Date.now()}-${hash.slice(0, 12)}${path.extname(originalName)}`;

    return {
      fileId,
      originalName,
      mimeType,
      sizeBytes: buffer.length,
      sha256Hash: hash,
      storagePath: `s3://${env.STORAGE_BUCKET}/${fileId}`,
      url: `https://${env.STORAGE_BUCKET}.s3.${env.STORAGE_REGION}.amazonaws.com/${fileId}`,
      uploadedAt: new Date().toISOString(),
    };
  }

  async getFile(fileId: string) {
    return null;
  }

  async deleteFile(fileId: string): Promise<boolean> {
    return true;
  }
}

export function getStorageProvider(): StorageProvider {
  if (env.STORAGE_PROVIDER === "s3" && env.STORAGE_BUCKET) {
    return new S3StorageProvider();
  }
  return new LocalStorageProvider();
}
