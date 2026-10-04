import crypto from "crypto";

export function sha256Hex(data: string | Buffer): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function verifyHash(data: string | Buffer, expectedHex: string): boolean {
  const actual = sha256Hex(data);
  return actual.toLowerCase() === expectedHex.trim().toLowerCase();
}

export function hmacSha256(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}
