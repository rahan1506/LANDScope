/**
 * LANDScope — SHA-256 Hashing Utilities
 * Used for evidence integrity verification, document hashing, and QR code generation
 * NOTE: Uses Web Crypto API for browser-side hashing, Node crypto for server-side
 */

/**
 * Generate SHA-256 hash of a string (works in both browser and Node.js)
 */
export async function sha256(data: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    // Browser environment
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } else {
    // Node.js environment
    const crypto = await import("crypto");
    return crypto.createHash("sha256").update(data).digest("hex");
  }
}

export const generateSha256Hex = sha256;

export async function verifyHash(data: string, expectedHash: string): Promise<boolean> {
  const computed = await sha256(data);
  return computed.toLowerCase() === expectedHash.trim().toLowerCase();
}

/**
 * Generate SHA-256 hash of a file/blob (browser only)
 */
export async function sha256File(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback for SSR: convert to string hash
  const uint8 = new Uint8Array(arrayBuffer);
  const str = Array.from(uint8).map((b) => String.fromCharCode(b)).join("");
  return sha256(str);
}

/**
 * Generate a case-level integrity hash from all document hashes
 */
export async function generateCaseHash(documentHashes: string[]): Promise<string> {
  const combined = documentHashes.sort().join("|");
  return sha256(combined);
}

/**
 * Generate QR code data URL (simple SVG-based QR for prototype)
 * In production, use a proper QR library
 */
export const generateSvgQrCode = generateQRCodeSVG;

export function generateQRCodeSVG(data: string, size: number = 200): string {
  // Simple deterministic pattern based on data hash for visual prototype
  const hash = simpleHash(data);
  const gridSize = 21; // Standard QR grid
  const cellSize = size / gridSize;

  let cells = "";
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // QR finder patterns (3 corners)
      const isFinderPattern =
        (row < 7 && col < 7) ||
        (row < 7 && col >= gridSize - 7) ||
        (row >= gridSize - 7 && col < 7);

      const isFinderBorder =
        isFinderPattern &&
        (row === 0 || row === 6 || col === 0 || col === 6 ||
          (row >= gridSize - 7 && (row === gridSize - 7 || row === gridSize - 1)) ||
          (col >= gridSize - 7 && (col === gridSize - 7 || col === gridSize - 1)));

      const isFinderInner =
        isFinderPattern &&
        ((row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
          (row >= 2 && row <= 4 && col >= gridSize - 5 && col <= gridSize - 3) ||
          (row >= gridSize - 5 && row <= gridSize - 3 && col >= 2 && col <= 4));

      let isFilled = false;
      if (isFinderBorder || isFinderInner) {
        isFilled = true;
      } else if (!isFinderPattern) {
        // Data modules based on hash
        const idx = (row * gridSize + col) % hash.length;
        const charCode = hash.charCodeAt(idx);
        isFilled = (charCode + row + col) % 3 !== 0;
      }

      if (isFilled) {
        cells += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="#f8fafc"/>`;
      }
    }
  }

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#0a1526"/>
      ${cells}
    </svg>`
  )}`;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).padStart(12, "0").repeat(4);
}

/**
 * Generate verification URL for an evidence package
 */
export function getVerificationUrl(caseId: string): string {
  return `/verify/evidence/${caseId}`;
}

/**
 * Format hash for display (truncated with ellipsis)
 */
export function formatHash(hash: string, length: number = 16): string {
  if (hash.length <= length) return hash;
  return `${hash.slice(0, length / 2)}...${hash.slice(-length / 2)}`;
}
