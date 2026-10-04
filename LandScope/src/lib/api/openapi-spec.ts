// LANDScope OpenAPI 3.0.3 Specification Document
// Completely documents implemented endpoints across all system modules:
// Research, GIS, Analytics, Policy Digital Twin, Reports, Collaboration, Innovation, and API Center.

export const LANDSCOPE_OPENAPI_SPEC = {
  openapi: "3.0.3",
  info: {
    title: "LANDScope Sovereign Land Intelligence API",
    version: "1.0.0",
    description:
      "Secure, institutional-grade REST APIs for land research, cadastral GIS intelligence, policy digital twin simulation, analytical indicators, and multi-agency collaboration.",
    contact: {
      name: "LANDScope Platform Architecture Cell",
      email: "api-support@landscope.gov.in",
    },
    license: {
      name: "Government Open Data License (India)",
      url: "https://data.gov.in",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Prototype / Development Node",
    },
    {
      url: "https://landscope.gov.in",
      description: "National Sovereign Deployment Node",
    },
  ],
  components: {
    securitySchemes: {
      SessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "landscope_session_token",
        description: "HMAC-SHA256 signed session cookie obtained via /api/auth/login",
      },
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-LANDScope-Key",
        description: "Demonstration API key (starts with lsk_live_)",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", example: "Unauthorized: Authentication required" },
          statusCode: { type: "integer", example: 401 },
        },
      },
      EvidenceItem: {
        type: "object",
        properties: {
          id: { type: "string", example: "EV-2026-001" },
          title: { type: "string", example: "Peri-Urban Agricultural Land Conversion Velocity" },
          confidenceScore: { type: "number", example: 94 },
          geography: {
            type: "object",
            properties: {
              state: { type: "string", example: "Madhya Pradesh" },
              district: { type: "string", example: "Sehore" },
              tehsil: { type: "string", example: "Ashta" },
            },
          },
          evidenceType: { type: "string", example: "Empirical Remote Sensing" },
        },
      },
      GisContext: {
        type: "object",
        properties: {
          geography: {
            type: "object",
            properties: {
              state: { type: "string", example: "Madhya Pradesh" },
              district: { type: "string", example: "Sehore" },
              tehsil: { type: "string", example: "Ashta" },
              areaSqKm: { type: "number", example: 1240 },
              totalParcels: { type: "number", example: 38400 },
            },
          },
          landUse: {
            type: "object",
            properties: {
              agriculturePct: { type: "number", example: 68.4 },
              forestPct: { type: "number", example: 14.2 },
              builtUpPct: { type: "number", example: 12.1 },
              waterPct: { type: "number", example: 5.3 },
            },
          },
        },
      },
      PolicySimulationRequest: {
        type: "object",
        required: ["scenarioName", "state", "district", "tehsil"],
        properties: {
          scenarioName: { type: "string", example: "Controlled Peri-Urban Expansion" },
          state: { type: "string", example: "Madhya Pradesh" },
          district: { type: "string", example: "Sehore" },
          tehsil: { type: "string", example: "Ashta" },
          parameters: {
            type: "object",
            properties: {
              bufferDistanceM: { type: "number", example: 750 },
              conversionCeilingPct: { type: "number", example: 5 },
            },
          },
        },
      },
    },
  },
  security: [
    {
      SessionCookie: [],
    },
  ],
  paths: {
    "/api/research/evidence": {
      get: {
        summary: "Retrieve Empirical Research Evidence",
        tags: ["Research"],
        parameters: [
          { name: "state", in: "query", schema: { type: "string" } },
          { name: "district", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "List of empirical evidence records with confidence scores",
          },
          "401": { description: "Unauthenticated" },
        },
      },
    },
    "/api/gis/context": {
      get: {
        summary: "Get Geospatial Cadastral Context",
        tags: ["GIS"],
        parameters: [
          { name: "state", in: "query", required: true, schema: { type: "string" } },
          { name: "district", in: "query", schema: { type: "string" } },
          { name: "tehsil", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Spatial layers and parcel intelligence" },
        },
      },
    },
    "/api/gis/layers": {
      get: {
        summary: "List Available Geospatial Map Layers",
        tags: ["GIS"],
        responses: {
          "200": { description: "OGC WMS/WFS map layer catalog" },
        },
      },
    },
    "/api/analytics/trends": {
      get: {
        summary: "Retrieve Multi-temporal Land Trends",
        tags: ["Analytics"],
        responses: {
          "200": { description: "Temporal land-use, climate, and governance trends" },
        },
      },
    },
    "/api/analytics/indicators": {
      get: {
        summary: "Get Key Governance & Resilience Indicators",
        tags: ["Analytics"],
        responses: {
          "200": { description: "Quantitative indicator scores" },
        },
      },
    },
    "/api/policy/scenarios": {
      get: {
        summary: "List Policy Digital Twin Scenarios",
        tags: ["Policy Digital Twin"],
        responses: {
          "200": { description: "Scenarios catalog" },
        },
      },
      post: {
        summary: "Create Policy Scenario",
        tags: ["Policy Digital Twin"],
        responses: {
          "201": { description: "Scenario created" },
          "403": { description: "Unauthorized role" },
        },
      },
    },
    "/api/policy/simulate": {
      post: {
        summary: "Execute Policy Simulation",
        tags: ["Policy Digital Twin"],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PolicySimulationRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Multi-dimensional simulation impact results" },
        },
      },
    },
    "/api/reports": {
      get: {
        summary: "List Policy Briefs & Evidence Audits",
        tags: ["Reports"],
        responses: {
          "200": { description: "Reports repository" },
        },
      },
    },
    "/api/collaboration/projects": {
      get: {
        summary: "List Collaboration Projects",
        tags: ["Collaboration"],
        responses: {
          "200": { description: "User's owned and shared collaboration projects" },
          "401": { description: "Authentication required" },
          "403": { description: "Non-member denied" },
        },
      },
    },
    "/api/innovation/challenges": {
      get: {
        summary: "List Innovation Opportunities & Hackathons",
        tags: ["Innovation Hub"],
        responses: {
          "200": { description: "Published challenges and grants" },
        },
      },
      post: {
        summary: "Create Innovation Challenge",
        tags: ["Innovation Hub"],
        responses: {
          "201": { description: "Challenge created" },
          "403": { description: "Public user forbidden" },
        },
      },
    },
    "/api/keys": {
      get: {
        summary: "List User API Keys",
        tags: ["API Center"],
        responses: {
          "200": { description: "Masked API credentials" },
        },
      },
      post: {
        summary: "Create Demonstration API Key",
        tags: ["API Center"],
        responses: {
          "201": { description: "API Key created with masked preview" },
        },
      },
    },
    "/api/ingestion": {
      post: {
        summary: "Ingest CSV/JSON/GeoJSON Datasets",
        tags: ["API Center"],
        responses: {
          "200": { description: "Dataset validated and processed" },
          "400": { description: "Malformed dataset rejected" },
        },
      },
    },
    "/api/health": {
      get: {
        summary: "System Services Health Status",
        tags: ["API Center"],
        responses: {
          "200": { description: "Status of core subsystems" },
        },
      },
    },
  },
};
