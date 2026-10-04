import { GeoPoint, GeoJSONPolygon } from "../types";

/**
 * Calculates Haversine distance in meters between two coordinates.
 */
export function calculateDistanceMeters(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (p1.lat * Math.PI) / 180;
  const phi2 = (p2.lat * Math.PI) / 180;
  const deltaPhi = ((p2.lat - p1.lat) * Math.PI) / 180;
  const deltaLambda = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Computes polygon centroid from GeoJSON coordinates.
 */
export function calculatePolygonCentroid(polygon: GeoJSONPolygon): GeoPoint {
  const ring = polygon.coordinates[0];
  let sumLat = 0;
  let sumLng = 0;
  const count = ring.length - 1 || 1; // GeoJSON rings close with duplicate first point

  for (let i = 0; i < count; i++) {
    sumLng += ring[i][0];
    sumLat += ring[i][1];
  }

  return {
    lat: Number((sumLat / count).toFixed(6)),
    lng: Number((sumLng / count).toFixed(6)),
  };
}

/**
 * Calculates approximate polygon area in hectares using planar projection for local cadastre scale.
 */
export function calculatePolygonAreaHa(polygon: GeoJSONPolygon): number {
  const ring = polygon.coordinates[0];
  if (ring.length < 3) return 0;

  let areaM2 = 0;
  const degToRad = Math.PI / 180;
  const R = 6378137; // WGS84 semi-major axis

  for (let i = 0; i < ring.length - 1; i++) {
    const p1 = ring[i];
    const p2 = ring[i + 1];

    const x1 = p1[0] * degToRad * R * Math.cos((p1[1] * degToRad + p2[1] * degToRad) / 2);
    const y1 = p1[1] * degToRad * R;
    const x2 = p2[0] * degToRad * R * Math.cos((p1[1] * degToRad + p2[1] * degToRad) / 2);
    const y2 = p2[1] * degToRad * R;

    areaM2 += x1 * y2 - x2 * y1;
  }

  areaM2 = Math.abs(areaM2) / 2;
  return Number((areaM2 / 10000).toFixed(4));
}

/**
 * Check if a point is within bounding box of polygon
 */
export function isPointInBoundingBox(point: GeoPoint, bbox: [number, number, number, number]): boolean {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  return point.lng >= minLng && point.lng <= maxLng && point.lat >= minLat && point.lat <= maxLat;
}

/**
 * Validates GeoJSON Polygon structure.
 */
export function validateGeoJSONPolygon(poly: any): poly is GeoJSONPolygon {
  if (!poly || poly.type !== "Polygon" || !Array.isArray(poly.coordinates)) return false;
  const ring = poly.coordinates[0];
  if (!Array.isArray(ring) || ring.length < 4) return false;
  const first = ring[0];
  const last = ring[ring.length - 1];
  return first[0] === last[0] && first[1] === last[1];
}
