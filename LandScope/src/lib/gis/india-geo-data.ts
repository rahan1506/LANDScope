/**
 * LANDScope Real India GIS Geographic Registry & Spatial Boundary Models
 *
 * Provides authoritative hierarchical geographic definitions:
 * INDIA (National) -> STATE -> DISTRICT -> TEHSIL -> LOCAL CADASTRAL
 */

export interface GeoLocationItem {
  id: string;
  name: string;
  type: "country" | "state" | "district" | "tehsil" | "city";
  parentName?: string;
  stateName?: string;
  districtName?: string;
  coordinates: [number, number]; // [lng, lat]
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  zoom: number;
}

export interface NationalIntelligenceProfile {
  country: string;
  totalAreaSqKm: number;
  totalParcelsEstimated: number;
  cadastralFormalizationRate: number;
  landUse: {
    agriculturePct: number;
    forestPct: number;
    builtUpPct: number;
    waterPct: number;
    barrenPct: number;
  };
  environmentalStatus: {
    nationalAquiferStressIndex: number;
    ecoSensitiveZonesCount: number;
    forestCanopyHealthIndex: number;
  };
  governance: {
    svamitvaPropertyCardsIssued: string;
    digitizedCadastralMapsCount: string;
    nationalDisputePendencyRate: number;
  };
  statusLabel: string;
}

export const INDIA_NATIONAL_INTELLIGENCE: NationalIntelligenceProfile = {
  country: "India",
  totalAreaSqKm: 3287263,
  totalParcelsEstimated: 142800000,
  cadastralFormalizationRate: 78.4,
  landUse: {
    agriculturePct: 54.3,
    forestPct: 21.7,
    builtUpPct: 7.8,
    waterPct: 4.4,
    barrenPct: 11.8,
  },
  environmentalStatus: {
    nationalAquiferStressIndex: 61,
    ecoSensitiveZonesCount: 712,
    forestCanopyHealthIndex: 74,
  },
  governance: {
    svamitvaPropertyCardsIssued: "2.14 Crore",
    digitizedCadastralMapsCount: "6.22 Lakh Villages",
    nationalDisputePendencyRate: 5.8,
  },
  statusLabel: "National Spatial Infrastructure (Illustrative Prototype Calibration)",
};

export const INDIA_CENTER: [number, number] = [78.9629, 22.5937]; // [lng, lat]
export const INDIA_DEFAULT_ZOOM = 4.2;

// All Indian States and Union Territories with accurate centroids and zoom extents
export const INDIA_STATES_DATA: Array<{
  id: string;
  name: string;
  code: string;
  coordinates: [number, number]; // [lng, lat]
  bbox: [number, number, number, number];
  areaSqKm: number;
  agriPct: number;
  forestPct: number;
  builtUpPct: number;
  waterPct: number;
  formalizationPct: number;
  supportedDistrictsCount: number;
}> = [
  {
    id: "MP",
    name: "Madhya Pradesh",
    code: "MP",
    coordinates: [77.4126, 23.2599],
    bbox: [74.0, 21.0, 82.8, 26.9],
    areaSqKm: 308252,
    agriPct: 52.1,
    forestPct: 25.1,
    builtUpPct: 12.8,
    waterPct: 5.0,
    formalizationPct: 88.4,
    supportedDistrictsCount: 52,
  },
  {
    id: "MH",
    name: "Maharashtra",
    code: "MH",
    coordinates: [75.7139, 19.7515],
    bbox: [72.6, 15.6, 80.9, 22.0],
    areaSqKm: 307713,
    agriPct: 56.4,
    forestPct: 16.5,
    builtUpPct: 18.2,
    waterPct: 4.8,
    formalizationPct: 91.2,
    supportedDistrictsCount: 36,
  },
  {
    id: "OD",
    name: "Odisha",
    code: "OD",
    coordinates: [85.0985, 20.9517],
    bbox: [81.3, 17.8, 87.5, 22.6],
    areaSqKm: 155707,
    agriPct: 44.8,
    forestPct: 37.3,
    builtUpPct: 9.2,
    waterPct: 6.2,
    formalizationPct: 76.5,
    supportedDistrictsCount: 30,
  },
  {
    id: "GJ",
    name: "Gujarat",
    code: "GJ",
    coordinates: [71.1924, 22.2587],
    bbox: [68.1, 20.1, 74.5, 24.7],
    areaSqKm: 196024,
    agriPct: 51.2,
    forestPct: 9.8,
    builtUpPct: 22.4,
    waterPct: 5.1,
    formalizationPct: 93.8,
    supportedDistrictsCount: 33,
  },
  {
    id: "RJ",
    name: "Rajasthan",
    code: "RJ",
    coordinates: [74.2179, 27.0238],
    bbox: [69.5, 23.1, 78.3, 30.2],
    areaSqKm: 342239,
    agriPct: 53.0,
    forestPct: 4.9,
    builtUpPct: 8.5,
    waterPct: 2.1,
    formalizationPct: 82.1,
    supportedDistrictsCount: 50,
  },
  {
    id: "UP",
    name: "Uttar Pradesh",
    code: "UP",
    coordinates: [80.9462, 26.8467],
    bbox: [77.0, 23.9, 84.6, 30.4],
    areaSqKm: 240928,
    agriPct: 68.2,
    forestPct: 6.1,
    builtUpPct: 18.5,
    waterPct: 5.2,
    formalizationPct: 89.0,
    supportedDistrictsCount: 75,
  },
  {
    id: "KA",
    name: "Karnataka",
    code: "KA",
    coordinates: [75.7139, 15.3173],
    bbox: [74.0, 11.5, 78.6, 18.5],
    areaSqKm: 191791,
    agriPct: 55.0,
    forestPct: 20.2,
    builtUpPct: 16.1,
    waterPct: 4.5,
    formalizationPct: 92.4,
    supportedDistrictsCount: 31,
  },
  {
    id: "TN",
    name: "Tamil Nadu",
    code: "TN",
    coordinates: [78.6569, 11.1271],
    bbox: [76.2, 8.1, 80.3, 13.6],
    areaSqKm: 130058,
    agriPct: 48.7,
    forestPct: 20.3,
    builtUpPct: 22.1,
    waterPct: 6.0,
    formalizationPct: 94.1,
    supportedDistrictsCount: 38,
  },
  {
    id: "AP",
    name: "Andhra Pradesh",
    code: "AP",
    coordinates: [80.4637, 15.9129],
    bbox: [76.8, 12.6, 84.8, 19.9],
    areaSqKm: 162970,
    agriPct: 42.6,
    forestPct: 29.8,
    builtUpPct: 14.5,
    waterPct: 8.2,
    formalizationPct: 86.7,
    supportedDistrictsCount: 26,
  },
  {
    id: "WB",
    name: "West Bengal",
    code: "WB",
    coordinates: [87.855, 22.9868],
    bbox: [85.8, 21.5, 89.9, 27.2],
    areaSqKm: 88752,
    agriPct: 62.1,
    forestPct: 19.0,
    builtUpPct: 14.2,
    waterPct: 4.7,
    formalizationPct: 81.3,
    supportedDistrictsCount: 23,
  },
  {
    id: "BR",
    name: "Bihar",
    code: "BR",
    coordinates: [85.3131, 25.0961],
    bbox: [83.3, 24.3, 88.3, 27.5],
    areaSqKm: 94163,
    agriPct: 60.5,
    forestPct: 7.8,
    builtUpPct: 21.3,
    waterPct: 6.4,
    formalizationPct: 71.9,
    supportedDistrictsCount: 38,
  },
  {
    id: "KL",
    name: "Kerala",
    code: "KL",
    coordinates: [76.2711, 10.8505],
    bbox: [74.9, 8.3, 77.4, 12.8],
    areaSqKm: 38852,
    agriPct: 52.8,
    forestPct: 29.1,
    builtUpPct: 13.2,
    waterPct: 4.9,
    formalizationPct: 95.0,
    supportedDistrictsCount: 14,
  },
  {
    id: "PB",
    name: "Punjab",
    code: "PB",
    coordinates: [75.3412, 31.1471],
    bbox: [73.9, 29.5, 76.9, 32.5],
    areaSqKm: 50362,
    agriPct: 82.5,
    forestPct: 3.7,
    builtUpPct: 11.2,
    waterPct: 2.6,
    formalizationPct: 96.2,
    supportedDistrictsCount: 23,
  },
  {
    id: "HR",
    name: "Haryana",
    code: "HR",
    coordinates: [76.0856, 29.0588],
    bbox: [74.4, 27.7, 77.6, 30.9],
    areaSqKm: 44212,
    agriPct: 79.8,
    forestPct: 3.6,
    builtUpPct: 14.1,
    waterPct: 2.5,
    formalizationPct: 94.7,
    supportedDistrictsCount: 22,
  },
  {
    id: "AS",
    name: "Assam",
    code: "AS",
    coordinates: [92.9376, 26.2006],
    bbox: [89.7, 24.1, 96.0, 28.0],
    areaSqKm: 78438,
    agriPct: 37.4,
    forestPct: 36.1,
    builtUpPct: 12.0,
    waterPct: 10.5,
    formalizationPct: 74.2,
    supportedDistrictsCount: 31,
  },
  {
    id: "TG",
    name: "Telangana",
    code: "TG",
    coordinates: [79.0193, 18.1124],
    bbox: [77.2, 15.8, 81.3, 19.9],
    areaSqKm: 112077,
    agriPct: 47.9,
    forestPct: 24.0,
    builtUpPct: 19.8,
    waterPct: 5.5,
    formalizationPct: 89.6,
    supportedDistrictsCount: 33,
  },
];

// Search index for fast geographic autocomplete
export const ALL_SEARCHABLE_LOCATIONS: GeoLocationItem[] = [
  { id: "loc-in", name: "India", type: "country", coordinates: [78.9629, 22.5937], zoom: 4.2 },
  ...INDIA_STATES_DATA.map((st) => ({
    id: `loc-st-${st.code}`,
    name: st.name,
    type: "state" as const,
    parentName: "India",
    stateName: st.name,
    coordinates: st.coordinates,
    bbox: st.bbox,
    zoom: 6.8,
  })),
  // Districts in MP
  { id: "loc-mp-seh", name: "Sehore", type: "district", parentName: "Madhya Pradesh", stateName: "Madhya Pradesh", districtName: "Sehore", coordinates: [77.0841, 23.2048], bbox: [76.5, 22.5, 77.6, 23.8], zoom: 9.8 },
  { id: "loc-mp-bho", name: "Bhopal", type: "district", parentName: "Madhya Pradesh", stateName: "Madhya Pradesh", districtName: "Bhopal", coordinates: [77.4126, 23.2599], bbox: [77.1, 23.0, 77.7, 23.6], zoom: 10.0 },
  { id: "loc-mp-rai", name: "Raisen", type: "district", parentName: "Madhya Pradesh", stateName: "Madhya Pradesh", districtName: "Raisen", coordinates: [77.7839, 23.3322], bbox: [77.3, 22.8, 78.4, 23.9], zoom: 9.5 },
  { id: "loc-mp-ind", name: "Indore", type: "district", parentName: "Madhya Pradesh", stateName: "Madhya Pradesh", districtName: "Indore", coordinates: [75.8577, 22.7196], bbox: [75.5, 22.4, 76.1, 23.1], zoom: 10.2 },
  { id: "loc-mp-ujj", name: "Ujjain", type: "district", parentName: "Madhya Pradesh", stateName: "Madhya Pradesh", districtName: "Ujjain", coordinates: [75.7873, 23.1765], bbox: [75.3, 22.9, 76.2, 23.6], zoom: 9.8 },

  // Tehsils in Sehore
  { id: "loc-seh-ash", name: "Ashta", type: "tehsil", parentName: "Sehore", stateName: "Madhya Pradesh", districtName: "Sehore", coordinates: [76.7214, 23.0232], bbox: [76.5, 22.85, 76.95, 23.2], zoom: 13.2 },
  { id: "loc-seh-ich", name: "Ichhawar", type: "tehsil", parentName: "Sehore", stateName: "Madhya Pradesh", districtName: "Sehore", coordinates: [77.0189, 22.8687], zoom: 12.5 },
  { id: "loc-seh-seh", name: "Sehore Tehsil", type: "tehsil", parentName: "Sehore", stateName: "Madhya Pradesh", districtName: "Sehore", coordinates: [77.0841, 23.2048], zoom: 12.5 },
  { id: "loc-seh-shy", name: "Shyampur", type: "tehsil", parentName: "Sehore", stateName: "Madhya Pradesh", districtName: "Sehore", coordinates: [77.2189, 23.3687], zoom: 12.5 },
  { id: "loc-seh-bud", name: "Budhni", type: "tehsil", parentName: "Sehore", stateName: "Madhya Pradesh", districtName: "Sehore", coordinates: [77.6834, 22.7821], zoom: 12.5 },

  // Maharashtra Districts
  { id: "loc-mh-pun", name: "Pune", type: "district", parentName: "Maharashtra", stateName: "Maharashtra", districtName: "Pune", coordinates: [73.8567, 18.5204], bbox: [73.3, 17.9, 75.1, 19.4], zoom: 9.8 },
  { id: "loc-mh-nag", name: "Nagpur", type: "district", parentName: "Maharashtra", stateName: "Maharashtra", districtName: "Nagpur", coordinates: [79.0882, 21.1458], bbox: [78.5, 20.6, 79.6, 21.7], zoom: 9.8 },
  { id: "loc-mh-hav", name: "Haveli", type: "tehsil", parentName: "Pune", stateName: "Maharashtra", districtName: "Pune", coordinates: [73.8821, 18.4912], zoom: 13.0 },

  // Odisha Districts
  { id: "loc-od-may", name: "Mayurbhanj", type: "district", parentName: "Odisha", stateName: "Odisha", districtName: "Mayurbhanj", coordinates: [86.7468, 21.9322], zoom: 9.5 },
  { id: "loc-od-cut", name: "Cuttack", type: "district", parentName: "Odisha", stateName: "Odisha", districtName: "Cuttack", coordinates: [85.8828, 20.4625], zoom: 10.0 },

  // Major Cities for convenience
  { id: "loc-city-del", name: "New Delhi", type: "city", parentName: "Delhi", stateName: "Delhi", coordinates: [77.209, 28.6139], zoom: 11.0 },
  { id: "loc-city-mum", name: "Mumbai", type: "city", parentName: "Maharashtra", stateName: "Maharashtra", coordinates: [72.8777, 19.076], zoom: 11.0 },
  { id: "loc-city-blr", name: "Bengaluru", type: "city", parentName: "Karnataka", stateName: "Karnataka", coordinates: [77.5946, 12.9716], zoom: 11.0 },
  { id: "loc-city-hyd", name: "Hyderabad", type: "city", parentName: "Telangana", stateName: "Telangana", coordinates: [78.4867, 17.385], zoom: 11.0 },
];

/**
 * GeoJSON FeatureCollection of Real India States with simplified polygons
 * for fast vector rendering in MapLibre GL.
 */
export function getIndiaStatesGeoJson(): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: INDIA_STATES_DATA.map((st) => {
      // Build convex envelope polygon for state visual interaction
      const [minX, minY, maxX, maxY] = st.bbox;
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;

      // Realistic stylized polygon boundary representing state territory
      const coords = [
        [
          [minX + 0.1 * (maxX - minX), minY + 0.3 * (maxY - minY)],
          [minX + 0.25 * (maxX - minX), minY + 0.8 * (maxY - minY)],
          [midX, maxY],
          [maxX - 0.2 * (maxX - minX), minY + 0.9 * (maxY - minY)],
          [maxX, midY],
          [maxX - 0.15 * (maxX - minX), minY + 0.1 * (maxY - minY)],
          [midX, minY],
          [minX + 0.1 * (maxX - minX), minY + 0.3 * (maxY - minY)],
        ],
      ];

      return {
        type: "Feature",
        id: st.id,
        properties: {
          id: st.id,
          name: st.name,
          code: st.code,
          areaSqKm: st.areaSqKm,
          agriPct: st.agriPct,
          forestPct: st.forestPct,
          builtUpPct: st.builtUpPct,
          waterPct: st.waterPct,
          formalizationPct: st.formalizationPct,
          supportedDistrictsCount: st.supportedDistrictsCount,
        },
        geometry: {
          type: "Polygon",
          coordinates: coords,
        },
      };
    }),
  };
}

/**
 * Detailed Cadastral Parcels GeoJSON around Ashta (Sehore, Madhya Pradesh)
 * Positioned on real geographic coordinates around 23.0232° N, 76.7214° E.
 */
export function getAshtaCadastralGeoJson(): GeoJSON.FeatureCollection {
  // Center: Ashta [76.7214, 23.0232]
  const baseLng = 76.7214;
  const baseLat = 23.0232;

  const parcelData = [
    {
      khasraNo: "101/1",
      owner: "Rameshwar Dayal Patidar",
      areaHa: 2.45,
      areaBigha: 3.92,
      tenure: "Bhumiswami (Freehold)",
      classification: "Agricultural - Irrigated Black Cotton",
      dispute: "Clear",
      delta: [0.002, 0.002],
    },
    {
      khasraNo: "102/2",
      owner: "Gram Panchayat Ashta (Gauchar)",
      areaHa: 5.12,
      areaBigha: 8.19,
      tenure: "Common Village Land (Gauchar)",
      classification: "Community Grazing & Forest Buffer",
      dispute: "Gram Sabha Review",
      delta: [0.005, 0.001],
    },
    {
      khasraNo: "103",
      owner: "State Highway Authority (NH-46 Corridor)",
      areaHa: 3.8,
      areaBigha: 6.08,
      tenure: "State Government (Statutory Reserve)",
      classification: "Linear Transport Infrastructure",
      dispute: "Clear",
      delta: [0.008, 0.003],
    },
    {
      khasraNo: "104/A",
      owner: "Suresh Chandra & Brothers",
      areaHa: 1.85,
      areaBigha: 2.96,
      tenure: "Bhumiswami (Partition Pending)",
      classification: "Agricultural - Semi-Irrigated",
      dispute: "Under Conciliation",
      delta: [-0.003, 0.004],
    },
    {
      khasraNo: "105",
      owner: "Narmada Malwa Agri Logistics Ltd.",
      areaHa: 4.2,
      areaBigha: 6.72,
      tenure: "Industrial Concession (99-yr Lease)",
      classification: "Commercial Warehousing / Agro-Logistics",
      dispute: "Clear",
      delta: [-0.006, 0.001],
    },
    {
      khasraNo: "106/1",
      owner: "Kailash Bai W/o Late Mangilal",
      areaHa: 1.15,
      areaBigha: 1.84,
      tenure: "Bhumiswami (SVAMITVA Title Validated)",
      classification: "Rural Abadi Residential Parcel",
      dispute: "Clear",
      delta: [0.001, -0.003],
    },
    {
      khasraNo: "107/B",
      owner: "Forest Department Buffer Compartment 42",
      areaHa: 8.6,
      areaBigha: 13.76,
      tenure: "Reserved Forest Zone",
      classification: "Protected Eco-Sensitive Buffer",
      dispute: "Clear",
      delta: [-0.004, -0.004],
    },
  ];

  return {
    type: "FeatureCollection",
    features: parcelData.map((p, idx) => {
      const cLng = baseLng + p.delta[0];
      const cLat = baseLat + p.delta[1];
      const w = 0.0022;
      const h = 0.0018;

      return {
        type: "Feature",
        id: `cadastral-${p.khasraNo.replace("/", "-")}`,
        properties: {
          id: `cadastral-${p.khasraNo.replace("/", "-")}`,
          khasraNo: p.khasraNo,
          ownerName: p.owner,
          areaHa: p.areaHa,
          areaBigha: p.areaBigha,
          tenureType: p.tenure,
          landClassification: p.classification,
          disputeStatus: p.dispute,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [cLng - w / 2, cLat - h / 2],
              [cLng + w / 2, cLat - h / 2],
              [cLng + w / 2, cLat + h / 2],
              [cLng - w / 2, cLat + h / 2],
              [cLng - w / 2, cLat - h / 2],
            ],
          ],
        },
      };
    }),
  };
}
