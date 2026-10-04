/**
 * Administrative Boundary Provider Architecture (Survey of India Schema Compatible)
 * 
 * Provides hierarchical administrative boundary GeoJSON datasets:
 * Country -> State -> District -> Tehsil
 * 
 * NOTE: Administrative boundary data is a calibrated demonstration dataset.
 * It is NOT live Survey of India API data.
 */

export interface AdministrativeBoundaryMetadata {
  provider: string;
  source: string;
  status: string;
  isLiveSurveyOfIndia: boolean;
  legalNotice: string;
  crs: string;
}

export interface AdministrativeBoundaryFeature {
  type: "Feature";
  id: string;
  properties: {
    id: string;
    name: string;
    code: string;
    level: "country" | "state" | "district" | "tehsil";
    parentId?: string;
    parentName?: string;
    stateName?: string;
    districtName?: string;
    areaSqKm: number;
    centroid: [number, number]; // [lng, lat]
    bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
    metadata: AdministrativeBoundaryMetadata;
    [key: string]: unknown;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

export interface AdministrativeBoundaryCollection {
  type: "FeatureCollection";
  level: "country" | "state" | "district" | "tehsil";
  metadata: AdministrativeBoundaryMetadata;
  features: AdministrativeBoundaryFeature[];
}

export const DEMO_BOUNDARY_METADATA: AdministrativeBoundaryMetadata = {
  provider: "AdministrativeBoundaryProvider",
  source: "Administrative boundary data: Demonstration dataset (Survey of India schema compatible)",
  status: "Demonstration dataset",
  isLiveSurveyOfIndia: false,
  legalNotice: "Administrative boundary data: Demonstration dataset. For production deployment, integrate official Survey of India SDI service.",
  crs: "EPSG:4326",
};

// India National Boundary
export function getCountryBoundary(): AdministrativeBoundaryCollection {
  return {
    type: "FeatureCollection",
    level: "country",
    metadata: DEMO_BOUNDARY_METADATA,
    features: [
      {
        type: "Feature",
        id: "IN",
        properties: {
          id: "IN",
          name: "India",
          code: "IND",
          level: "country",
          areaSqKm: 3287263,
          centroid: [78.9629, 22.5937],
          bbox: [68.1, 6.7, 97.4, 37.1],
          metadata: DEMO_BOUNDARY_METADATA,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [74.0, 37.0], [77.5, 35.5], [80.3, 31.0], [88.2, 27.8],
              [97.4, 28.2], [96.0, 24.5], [92.5, 23.8], [91.8, 22.2],
              [88.8, 21.6], [85.8, 19.8], [80.3, 13.0], [79.8, 10.2],
              [77.5, 8.1],  [75.0, 12.0], [73.0, 15.5], [72.8, 19.0],
              [68.8, 23.5], [71.0, 28.0], [74.0, 32.5], [74.0, 37.0],
            ],
          ],
        },
      },
    ],
  };
}

// Indian States Boundaries
export function getStates(): AdministrativeBoundaryCollection {
  const states = [
    {
      id: "MP",
      name: "Madhya Pradesh",
      code: "MP",
      centroid: [77.4126, 23.2599] as [number, number],
      bbox: [74.0, 21.0, 82.8, 26.9] as [number, number, number, number],
      areaSqKm: 308252,
      coords: [
        [74.0, 22.0], [75.5, 21.1], [77.5, 21.5], [80.5, 21.8],
        [82.0, 23.0], [82.8, 24.5], [80.8, 25.3], [79.2, 26.9],
        [77.8, 26.2], [76.5, 25.0], [74.5, 24.2], [74.0, 22.0],
      ],
    },
    {
      id: "MH",
      name: "Maharashtra",
      code: "MH",
      centroid: [75.7139, 19.7515] as [number, number],
      bbox: [72.6, 15.6, 80.9, 22.0] as [number, number, number, number],
      areaSqKm: 307713,
      coords: [
        [72.6, 19.0], [73.5, 16.0], [76.0, 16.5], [79.0, 18.0],
        [80.9, 19.5], [79.5, 21.8], [76.0, 21.4], [73.5, 20.5],
        [72.6, 19.0],
      ],
    },
    {
      id: "KA",
      name: "Karnataka",
      code: "KA",
      centroid: [75.7139, 15.3173] as [number, number],
      bbox: [74.0, 11.5, 78.6, 18.5] as [number, number, number, number],
      areaSqKm: 191791,
      coords: [
        [74.0, 14.8], [74.5, 12.0], [76.5, 11.8], [77.8, 13.5],
        [78.5, 16.0], [77.2, 18.4], [75.5, 17.5], [74.0, 14.8],
      ],
    },
    {
      id: "UP",
      name: "Uttar Pradesh",
      code: "UP",
      centroid: [80.9462, 26.8467] as [number, number],
      bbox: [77.1, 23.9, 84.6, 30.4] as [number, number, number, number],
      areaSqKm: 240928,
      coords: [
        [77.2, 29.8], [78.5, 28.0], [80.5, 26.0], [83.0, 24.0],
        [84.5, 25.5], [83.5, 27.5], [81.0, 28.8], [78.8, 30.4],
        [77.2, 29.8],
      ],
    },
    {
      id: "TN",
      name: "Tamil Nadu",
      code: "TN",
      centroid: [78.6569, 11.1271] as [number, number],
      bbox: [76.2, 8.1, 80.3, 13.5] as [number, number, number, number],
      areaSqKm: 130058,
      coords: [
        [77.0, 8.2], [78.5, 9.2], [79.8, 10.5], [80.3, 13.4],
        [78.8, 12.8], [77.2, 11.5], [76.5, 9.5], [77.0, 8.2],
      ],
    },
    {
      id: "GJ",
      name: "Gujarat",
      code: "GJ",
      centroid: [71.1924, 22.2587] as [number, number],
      bbox: [68.1, 20.1, 74.5, 24.7] as [number, number, number, number],
      areaSqKm: 196024,
      coords: [
        [68.8, 23.5], [71.5, 24.5], [74.2, 23.0], [73.5, 21.0],
        [72.5, 20.8], [70.5, 21.2], [69.0, 22.5], [68.8, 23.5],
      ],
    },
    {
      id: "RJ",
      name: "Rajasthan",
      code: "RJ",
      centroid: [74.2179, 27.0238] as [number, number],
      bbox: [69.5, 23.0, 78.3, 30.2] as [number, number, number, number],
      areaSqKm: 342239,
      coords: [
        [70.0, 27.0], [72.5, 30.0], [76.5, 29.0], [78.0, 26.5],
        [76.0, 24.0], [73.5, 23.5], [70.5, 25.0], [70.0, 27.0],
      ],
    },
  ];

  return {
    type: "FeatureCollection",
    level: "state",
    metadata: DEMO_BOUNDARY_METADATA,
    features: states.map((s) => ({
      type: "Feature",
      id: s.id,
      properties: {
        id: s.id,
        name: s.name,
        code: s.code,
        level: "state",
        areaSqKm: s.areaSqKm,
        centroid: s.centroid,
        bbox: s.bbox,
        metadata: DEMO_BOUNDARY_METADATA,
      },
      geometry: {
        type: "Polygon",
        coordinates: [s.coords],
      },
    })),
  };
}

// Districts for a given state
export function getDistricts(stateIdOrName: string): AdministrativeBoundaryCollection {
  const norm = stateIdOrName.toLowerCase().trim();
  const isMP = norm === "mp" || norm.includes("madhya");
  const isMH = norm === "mh" || norm.includes("maharashtra");

  const mpDistricts = [
    {
      id: "MP-SEH",
      name: "Sehore",
      code: "SEH",
      centroid: [77.0841, 23.2048] as [number, number],
      bbox: [76.3, 22.5, 77.7, 23.7] as [number, number, number, number],
      areaSqKm: 6578,
      coords: [
        [76.4, 22.8], [76.8, 22.6], [77.4, 22.7], [77.6, 23.2],
        [77.4, 23.6], [76.8, 23.5], [76.4, 23.1], [76.4, 22.8],
      ],
    },
    {
      id: "MP-BHO",
      name: "Bhopal",
      code: "BHO",
      centroid: [77.4126, 23.2599] as [number, number],
      bbox: [77.1, 23.0, 77.7, 23.6] as [number, number, number, number],
      areaSqKm: 2772,
      coords: [
        [77.15, 23.15], [77.55, 23.1], [77.65, 23.45], [77.25, 23.5], [77.15, 23.15],
      ],
    },
    {
      id: "MP-RAI",
      name: "Raisen",
      code: "RAI",
      centroid: [77.7818, 23.3315] as [number, number],
      bbox: [77.3, 22.8, 78.8, 23.8] as [number, number, number, number],
      areaSqKm: 8395,
      coords: [
        [77.5, 23.0], [78.5, 22.9], [78.7, 23.5], [77.8, 23.7], [77.5, 23.0],
      ],
    },
    {
      id: "MP-DEW",
      name: "Dewas",
      code: "DEW",
      centroid: [76.0534, 22.9676] as [number, number],
      bbox: [75.7, 22.2, 77.1, 23.3] as [number, number, number, number],
      areaSqKm: 7020,
      coords: [
        [75.8, 22.4], [76.5, 22.3], [76.9, 22.8], [76.4, 23.2], [75.8, 22.8], [75.8, 22.4],
      ],
    },
    {
      id: "MP-HOS",
      name: "Narmadapuram",
      code: "HOS",
      centroid: [77.7270, 22.7519] as [number, number],
      bbox: [76.9, 22.2, 78.7, 23.1] as [number, number, number, number],
      areaSqKm: 6707,
      coords: [
        [77.1, 22.4], [78.2, 22.3], [78.5, 22.8], [77.6, 22.9], [77.1, 22.4],
      ],
    },
    {
      id: "MP-IND",
      name: "Indore",
      code: "IND",
      centroid: [75.8577, 22.7196] as [number, number],
      bbox: [75.4, 22.4, 76.2, 23.1] as [number, number, number, number],
      areaSqKm: 3898,
      coords: [
        [75.5, 22.5], [76.1, 22.5], [76.1, 22.95], [75.5, 22.95], [75.5, 22.5],
      ],
    },
  ];

  const mhDistricts = [
    {
      id: "MH-PUN",
      name: "Pune",
      code: "PUN",
      centroid: [73.8567, 18.5204] as [number, number],
      bbox: [73.3, 17.9, 75.2, 19.4] as [number, number, number, number],
      areaSqKm: 15643,
      coords: [
        [73.4, 18.2], [74.5, 18.0], [75.0, 18.8], [74.2, 19.3], [73.5, 19.0], [73.4, 18.2],
      ],
    },
    {
      id: "MH-MUM",
      name: "Mumbai Suburban",
      code: "MUM",
      centroid: [72.8777, 19.0760] as [number, number],
      bbox: [72.7, 18.8, 73.1, 19.3] as [number, number, number, number],
      areaSqKm: 446,
      coords: [
        [72.75, 18.9], [73.05, 18.9], [73.0, 19.25], [72.75, 19.2], [72.75, 18.9],
      ],
    },
  ];

  const tnDistricts = [
    {
      id: "TN-TRI",
      name: "Tiruchirappalli",
      code: "TRI",
      centroid: [78.6881, 10.8071] as [number, number],
      bbox: [78.4, 10.5, 79.0, 11.2] as [number, number, number, number],
      areaSqKm: 4404,
      coords: [
        [78.45, 10.55], [78.95, 10.52], [78.98, 11.15], [78.48, 11.18], [78.45, 10.55],
      ],
    },
    {
      id: "TN-THA",
      name: "Thanjavur",
      code: "THA",
      centroid: [79.1381, 10.7860] as [number, number],
      bbox: [78.8, 10.3, 79.5, 11.2] as [number, number, number, number],
      areaSqKm: 3397,
      coords: [
        [78.85, 10.35], [79.45, 10.32], [79.48, 11.12], [78.88, 11.15], [78.85, 10.35],
      ],
    },
    {
      id: "TN-CHE",
      name: "Chennai",
      code: "CHE",
      centroid: [80.2702, 13.0837] as [number, number],
      bbox: [80.1, 12.9, 80.4, 13.3] as [number, number, number, number],
      areaSqKm: 426,
      coords: [
        [80.15, 12.95], [80.35, 12.95], [80.35, 13.25], [80.15, 13.25], [80.15, 12.95],
      ],
    },
    {
      id: "TN-COI",
      name: "Coimbatore",
      code: "COI",
      centroid: [76.9628, 11.0018] as [number, number],
      bbox: [76.7, 10.7, 77.2, 11.3] as [number, number, number, number],
      areaSqKm: 4723,
      coords: [
        [76.75, 10.75], [77.15, 10.72], [77.18, 11.25], [76.78, 11.28], [76.75, 10.75],
      ],
    },
  ];

  const dlDistricts = [
    {
      id: "DL-DEL",
      name: "Delhi",
      code: "DEL",
      centroid: [77.2170, 28.6665] as [number, number],
      bbox: [77.0, 28.4, 77.4, 28.9] as [number, number, number, number],
      areaSqKm: 1484,
      coords: [
        [77.05, 28.45], [77.35, 28.42], [77.38, 28.85], [77.08, 28.88], [77.05, 28.45],
      ],
    },
  ];

  const isTN = norm === "tn" || norm.includes("tamil");
  const isDL = norm === "dl" || norm.includes("delhi");

  const targetDistricts = isMP ? mpDistricts : isMH ? mhDistricts : isTN ? tnDistricts : isDL ? dlDistricts : tnDistricts;
  const parentStateName = isMP ? "Madhya Pradesh" : isMH ? "Maharashtra" : isTN ? "Tamil Nadu" : isDL ? "Delhi" : stateIdOrName;

  return {
    type: "FeatureCollection",
    level: "district",
    metadata: DEMO_BOUNDARY_METADATA,
    features: targetDistricts.map((d) => ({
      type: "Feature",
      id: d.id,
      properties: {
        id: d.id,
        name: d.name,
        code: d.code,
        level: "district",
        parentId: isMP ? "MP" : isMH ? "MH" : isTN ? "TN" : isDL ? "DL" : "IN",
        parentName: parentStateName,
        stateName: parentStateName,
        areaSqKm: d.areaSqKm,
        centroid: d.centroid,
        bbox: d.bbox,
        metadata: DEMO_BOUNDARY_METADATA,
      },
      geometry: {
        type: "Polygon",
        coordinates: [d.coords],
      },
    })),
  };
}

// Tehsils for a given district
export function getTehsils(districtIdOrName: string): AdministrativeBoundaryCollection {
  const norm = districtIdOrName.toLowerCase().trim();
  const isTrichy = norm.includes("trichy") || norm.includes("tiruchirappalli");
  const isThanjavur = norm.includes("thanjavur");

  const trichyTehsils = [
    {
      id: "TEH-TRICHY-URB",
      name: "Trichy Urban",
      code: "TRU",
      centroid: [78.6881, 10.8071] as [number, number],
      bbox: [78.62, 10.75, 78.75, 10.86] as [number, number, number, number],
      areaSqKm: 167,
      coords: [
        [78.63, 10.76], [78.74, 10.75], [78.75, 10.85], [78.64, 10.86], [78.63, 10.76],
      ],
    },
    {
      id: "TEH-SRIRANGAM",
      name: "Srirangam",
      code: "SRI",
      centroid: [78.6922, 10.8622] as [number, number],
      bbox: [78.65, 10.84, 78.75, 10.92] as [number, number, number, number],
      areaSqKm: 210,
      coords: [
        [78.66, 10.85], [78.74, 10.84], [78.75, 10.91], [78.67, 10.92], [78.66, 10.85],
      ],
    },
    {
      id: "TEH-LALGUDI",
      name: "Lalgudi",
      code: "LAL",
      centroid: [78.8167, 10.8667] as [number, number],
      bbox: [78.75, 10.82, 78.92, 10.95] as [number, number, number, number],
      areaSqKm: 340,
      coords: [
        [78.76, 10.83], [78.91, 10.82], [78.92, 10.94], [78.77, 10.95], [78.76, 10.83],
      ],
    },
    {
      id: "TEH-MANAPPARAI",
      name: "Manapparai",
      code: "MAN",
      centroid: [78.4333, 10.6000] as [number, number],
      bbox: [78.35, 10.50, 78.55, 10.70] as [number, number, number, number],
      areaSqKm: 420,
      coords: [
        [78.36, 10.51], [78.54, 10.50], [78.55, 10.69], [78.37, 10.70], [78.36, 10.51],
      ],
    },
  ];

  const thanjavurTehsils = [
    {
      id: "TEH-THANJAVUR",
      name: "Thanjavur",
      code: "THJ",
      centroid: [79.1381, 10.7860] as [number, number],
      bbox: [79.05, 10.70, 79.25, 10.88] as [number, number, number, number],
      areaSqKm: 410,
      coords: [
        [79.06, 10.71], [79.24, 10.70], [79.25, 10.87], [79.07, 10.88], [79.06, 10.71],
      ],
    },
    {
      id: "TEH-KUMBAKONAM",
      name: "Kumbakonam",
      code: "KMB",
      centroid: [79.3800, 10.9600] as [number, number],
      bbox: [79.30, 10.90, 79.48, 11.05] as [number, number, number, number],
      areaSqKm: 320,
      coords: [
        [79.31, 10.91], [79.47, 10.90], [79.48, 11.04], [79.32, 11.05], [79.31, 10.91],
      ],
    },
  ];

  const sehoreTehsils = [
    {
      id: "TEH-ASHTA",
      name: "Ashta",
      code: "ASH",
      centroid: [76.7214, 23.0232] as [number, number],
      bbox: [76.5, 22.85, 76.95, 23.2] as [number, number, number, number],
      areaSqKm: 1485,
      coords: [
        [76.52, 22.92], [76.88, 22.88], [76.94, 23.12], [76.58, 23.18], [76.52, 22.92],
      ],
    },
    {
      id: "TEH-SEHORE",
      name: "Sehore",
      code: "SEH-T",
      centroid: [77.0841, 23.2048] as [number, number],
      bbox: [76.95, 23.05, 77.3, 23.4] as [number, number, number, number],
      areaSqKm: 1320,
      coords: [
        [76.96, 23.08], [77.26, 23.06], [77.28, 23.36], [76.98, 23.38], [76.96, 23.08],
      ],
    },
    {
      id: "TEH-ICHHAWAR",
      name: "Ichhawar",
      code: "ICH",
      centroid: [76.9850, 22.9560] as [number, number],
      bbox: [76.8, 22.8, 77.2, 23.1] as [number, number, number, number],
      areaSqKm: 1040,
      coords: [
        [76.82, 22.82], [77.18, 22.81], [77.16, 23.05], [76.84, 23.06], [76.82, 22.82],
      ],
    },
    {
      id: "TEH-BUDHNI",
      name: "Budhni",
      code: "BUD",
      centroid: [77.6833, 22.7833] as [number, number],
      bbox: [77.5, 22.65, 77.85, 22.95] as [number, number, number, number],
      areaSqKm: 890,
      coords: [
        [77.52, 22.68], [77.82, 22.67], [77.84, 22.92], [77.54, 22.93], [77.52, 22.68],
      ],
    },
    {
      id: "TEH-BHERUNDA",
      name: "Bherunda (Nasrullaganj)",
      code: "BHE",
      centroid: [77.2833, 22.7333] as [number, number],
      bbox: [77.1, 22.6, 77.5, 22.9] as [number, number, number, number],
      areaSqKm: 980,
      coords: [
        [77.12, 22.62], [77.46, 22.61], [77.48, 22.86], [77.14, 22.87], [77.12, 22.62],
      ],
    },
  ];

  const targetTehsils = isTrichy ? trichyTehsils : isThanjavur ? thanjavurTehsils : sehoreTehsils;

  return {
    type: "FeatureCollection",
    level: "tehsil",
    metadata: DEMO_BOUNDARY_METADATA,
    features: targetTehsils.map((t) => ({
      type: "Feature",
      id: t.id,
      properties: {
        id: t.id,
        name: t.name,
        code: t.code,
        level: "tehsil",
        parentId: isTrichy ? "TN-TRI" : isThanjavur ? "TN-THA" : "MP-SEH",
        parentName: isTrichy ? "Tiruchirappalli" : isThanjavur ? "Thanjavur" : "Sehore",
        districtName: isTrichy ? "Tiruchirappalli" : isThanjavur ? "Thanjavur" : "Sehore",
        stateName: isTrichy || isThanjavur ? "Tamil Nadu" : "Madhya Pradesh",
        areaSqKm: t.areaSqKm,
        centroid: t.centroid,
        bbox: t.bbox,
        metadata: DEMO_BOUNDARY_METADATA,
      },
      geometry: {
        type: "Polygon",
        coordinates: [t.coords],
      },
    })),
  };
}

export const AdministrativeBoundaryProvider = {
  getCountryBoundary,
  getStates,
  getDistricts,
  getTehsils,
  metadata: DEMO_BOUNDARY_METADATA,
};
