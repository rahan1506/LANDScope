/**
 * LANDScope GIS Centralized Shared Selected Geography Model
 *
 * Single source of truth for geographic context shared across:
 * - Real MapTiler Geocoding Search
 * - Map Clicks & Boundary Highlights
 * - Hierarchy Breadcrumbs & Dropdowns
 * - Region Inspector & Parcel Inspector
 * - Right Intelligence Panel
 * - Research Workspace Bridge
 * - Policy Digital Twin Bridge
 * - Analytics & Reporting Bridges
 */

export interface SelectedGeography {
  country: string;
  state?: string;
  district?: string;
  tehsil?: string;
  latitude?: number;
  longitude?: number;
  bbox?: [number, number, number, number];
  source: "GIS" | "SEARCH" | "MAP_CLICK" | "PRESET";
  featureType?: "country" | "state" | "district" | "tehsil" | "parcel" | "locality" | "city";
  featureId?: string;
  placeName?: string;
  displayName?: string;
  parcelId?: string;
}

export const DEFAULT_SELECTED_GEOGRAPHY: SelectedGeography = {
  country: "India",
  state: "Madhya Pradesh",
  district: "Sehore",
  tehsil: "Ashta",
  latitude: 23.0232,
  longitude: 76.7214,
  source: "PRESET",
  featureType: "tehsil",
  placeName: "Ashta",
  displayName: "Ashta, Sehore, Madhya Pradesh, India",
};

/**
 * Format a human-readable display string for a geography
 */
export function formatGeographyLabel(geo: SelectedGeography): string {
  if (geo.displayName) return geo.displayName;
  const parts: string[] = [];
  if (geo.parcelId) parts.push(`Khasra ${geo.parcelId}`);
  if (geo.tehsil) parts.push(geo.tehsil);
  if (geo.district && geo.district !== geo.tehsil) parts.push(geo.district);
  if (geo.state) parts.push(geo.state);
  parts.push(geo.country || "India");
  return parts.join(", ");
}
