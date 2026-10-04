import { Parcel, GeoPoint } from "../types";
import { query, isDbConnected } from "../config/database";
import { calculateDistanceMeters } from "../gis/spatialUtils";

export const CANONICAL_DEMO_PARCELS: Parcel[] = [
  {
    id: "parcel-001",
    ulpin: "KA-BLR-DEV-2024-00189",
    surveyNumber: "142/3A",
    village: "Devanahalli Rural",
    taluk: "Devanahalli",
    district: "Bengaluru Rural",
    state: "Karnataka",
    ownerName: "Rameshwar Rao & Brothers",
    registeredAreaHa: 2.45,
    observedAreaHa: 2.15,
    landUseClassification: "Agricultural",
    registrationDate: "2018-04-12",
    lastMutationDate: "2024-01-15",
    centroid: { lat: 13.2458, lng: 77.7126 },
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [
        [
          [77.7118, 13.2451],
          [77.7135, 13.2451],
          [77.7137, 13.2466],
          [77.7121, 13.2467],
          [77.7118, 13.2451],
        ],
      ],
    },
    isDemo: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-02-25T11:00:00Z",
  },
  {
    id: "parcel-002",
    ulpin: "MH-PUN-HAV-2023-04912",
    surveyNumber: "88/1B/2",
    village: "Wagholi",
    taluk: "Haveli",
    district: "Pune",
    state: "Maharashtra",
    ownerName: "Anand Urban Developers LLP",
    registeredAreaHa: 1.18,
    observedAreaHa: 1.40,
    landUseClassification: "Mixed",
    registrationDate: "2021-09-20",
    lastMutationDate: "2023-11-04",
    centroid: { lat: 18.5793, lng: 73.9785 },
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [
        [
          [73.9778, 18.5786],
          [73.9792, 18.5788],
          [73.9791, 18.5801],
          [73.9776, 18.5799],
          [73.9778, 18.5786],
        ],
      ],
    },
    isDemo: true,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2024-01-12T14:00:00Z",
  },
  {
    id: "parcel-003",
    ulpin: "DL-SWD-NAJ-2024-00312",
    surveyNumber: "12/4/1",
    village: "Najafgarh",
    taluk: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    ownerName: "Om Prakash Verma",
    registeredAreaHa: 0.85,
    observedAreaHa: 0.85,
    landUseClassification: "Wetland",
    registrationDate: "2012-03-10",
    lastMutationDate: "2023-08-19",
    centroid: { lat: 28.6092, lng: 76.9854 },
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [
        [
          [76.9845, 28.6085],
          [76.9862, 28.6087],
          [76.9861, 28.6099],
          [76.9843, 28.6097],
          [76.9845, 28.6085],
        ],
      ],
    },
    isDemo: true,
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-02-15T09:30:00Z",
  },
  {
    id: "parcel-004",
    ulpin: "KL-EKM-KNP-2024-01205",
    surveyNumber: "204/8",
    village: "Maradu",
    taluk: "Kanayannur",
    district: "Ernakulam",
    state: "Kerala",
    ownerName: "Coastal Green Estates Ltd.",
    registeredAreaHa: 1.62,
    observedAreaHa: 1.62,
    landUseClassification: "Forest",
    registrationDate: "2019-11-22",
    lastMutationDate: "2024-03-01",
    centroid: { lat: 9.9248, lng: 76.3265 },
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [
        [
          [76.3255, 9.9240],
          [76.3276, 9.9242],
          [76.3274, 9.9257],
          [76.3252, 9.9255],
          [76.3255, 9.9240],
        ],
      ],
    },
    isDemo: true,
    createdAt: "2024-03-05T00:00:00Z",
    updatedAt: "2024-03-05T08:00:00Z",
  },
];

export class ParcelRepository {
  static async findById(id: string): Promise<Parcel | null> {
    if (isDbConnected()) {
      const res = await query("SELECT * FROM cadastral_parcels WHERE id = $1 LIMIT 1", [id]);
      if (res && res.rows[0]) return this.mapRowToParcel(res.rows[0]);
    }
    return CANONICAL_DEMO_PARCELS.find((p) => p.id === id) || null;
  }

  static async findByUlpin(ulpin: string): Promise<Parcel | null> {
    const clean = ulpin.trim().toLowerCase();
    if (isDbConnected()) {
      const res = await query("SELECT * FROM cadastral_parcels WHERE LOWER(ulpin) = $1 LIMIT 1", [clean]);
      if (res && res.rows[0]) return this.mapRowToParcel(res.rows[0]);
    }
    return CANONICAL_DEMO_PARCELS.find((p) => p.ulpin.toLowerCase() === clean) || null;
  }

  static async search(queryStr?: string, district?: string, state?: string): Promise<Parcel[]> {
    if (isDbConnected()) {
      let sql = "SELECT * FROM cadastral_parcels WHERE 1=1";
      const params: any[] = [];
      if (queryStr) {
        params.push(`%${queryStr}%`);
        sql += ` AND (survey_number ILIKE $${params.length} OR village ILIKE $${params.length} OR ulpin ILIKE $${params.length})`;
      }
      if (district) {
        params.push(district);
        sql += ` AND district = $${params.length}`;
      }
      const res = await query(sql, params);
      if (res && res.rows.length > 0) return res.rows.map(this.mapRowToParcel);
    }

    let results = CANONICAL_DEMO_PARCELS;
    if (queryStr) {
      const q = queryStr.toLowerCase();
      results = results.filter(
        (p) =>
          p.surveyNumber.toLowerCase().includes(q) ||
          p.village.toLowerCase().includes(q) ||
          p.ulpin.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q)
      );
    }
    if (district) {
      results = results.filter((p) => p.district.toLowerCase() === district.toLowerCase());
    }
    return results;
  }

  /**
   * Spatial query: Find parcels within radius of point using PostGIS or Haversine fallback
   */
  static async findNearby(point: GeoPoint, radiusMeters: number = 5000): Promise<Parcel[]> {
    if (isDbConnected()) {
      const sql = `
        SELECT *, ST_Distance(boundary_geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance
        FROM cadastral_parcels
        WHERE ST_DWithin(boundary_geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
        ORDER BY distance ASC
      `;
      const res = await query(sql, [point.lng, point.lat, radiusMeters]);
      if (res && res.rows.length > 0) return res.rows.map(this.mapRowToParcel);
    }

    return CANONICAL_DEMO_PARCELS.filter((p) => {
      const dist = calculateDistanceMeters(point, p.centroid);
      return dist <= radiusMeters;
    });
  }

  private static mapRowToParcel(row: any): Parcel {
    return {
      id: row.id,
      ulpin: row.ulpin,
      surveyNumber: row.survey_number,
      village: row.village,
      taluk: row.taluk,
      district: row.district,
      state: row.state,
      ownerName: row.owner_name,
      registeredAreaHa: Number(row.registered_area_ha),
      observedAreaHa: row.observed_area_ha ? Number(row.observed_area_ha) : undefined,
      landUseClassification: row.land_use_classification,
      registrationDate: row.registration_date,
      lastMutationDate: row.last_mutation_date,
      centroid: { lat: Number(row.latitude), lng: Number(row.longitude) },
      boundaryGeoJSON: row.boundary_geojson,
      isDemo: row.is_demo,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
