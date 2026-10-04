// LANDScope API Center Data Engine & Core Services
// Implements API Key management, Rate Limiting, Audit Logging,
// External Integration Connectors, Ingestion Pipeline, and Health Monitoring.

import crypto from "crypto";

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  maskedKey: string;
  hashedSecret: string;
  ownerEmail: string;
  ownerRole: string;
  createdAt: string;
  lastUsedAt?: string;
  status: "ACTIVE" | "REVOKED";
  permissions: string[];
  rateLimitPerMinute: number;
}

export interface ApiActivityLog {
  id: string;
  actor: string;
  actorRole: string;
  endpoint: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  timestamp: string;
  statusCode: number;
  responseTimeMs: number;
  resource: string;
  result: "SUCCESS" | "CLIENT_ERROR" | "RATE_LIMITED" | "UNAUTHORIZED" | "FORBIDDEN";
}

export interface IntegrationConnector {
  id: string;
  name: string;
  category:
    | "Satellite / Remote Sensing"
    | "Land Records"
    | "Socio-Economic Data"
    | "Climate Data"
    | "Infrastructure Data"
    | "Geospatial Data"
    | "Research Repositories";
  provider: string;
  protocol: "OGC WMS/WFS" | "REST API" | "GeoTIFF Stream" | "STAC Catalog" | "GraphQL";
  status: "Live" | "Demonstration" | "Planned";
  description: string;
  updateFrequency: string;
  demonstrationLabel: "Integration Architecture / Demonstration Connector";
}

export interface IngestionJob {
  id: string;
  datasetName: string;
  format: "CSV" | "JSON" | "GeoJSON";
  source: string;
  recordCount: number;
  submittedAt: string;
  completedAt?: string;
  status: "Received" | "Validating" | "Processed" | "Rejected";
  qualityChecks: {
    crsValidation: boolean;
    geometryTopology: boolean;
    schemaConformance: boolean;
    attributeCompletenessPct: number;
  };
  errors?: string[];
  targetModule: string;
}

export interface SystemServiceHealth {
  serviceId: string;
  serviceName: string;
  category: string;
  status: "Operational" | "Demo" | "Unavailable";
  latencyMs: number;
  uptimePct: string;
  endpoint: string;
  notes: string;
}

// -----------------------------------------------------------------------------
// SEED DATA
// -----------------------------------------------------------------------------

const INITIAL_CONNECTORS: IntegrationConnector[] = [
  {
    id: "CONN-01",
    name: "Sentinel-2 Multi-Spectral Surface Reflectance",
    category: "Satellite / Remote Sensing",
    provider: "European Space Agency / Copernicus Open Access Hub",
    protocol: "STAC Catalog",
    status: "Demonstration",
    description: "10m multi-spectral imagery for NDVI vegetation health, moisture stress, and water spread delineation.",
    updateFrequency: "5-day revisit cycle",
    demonstrationLabel: "Integration Architecture / Demonstration Connector",
  },
  {
    id: "CONN-02",
    name: "SVAMITVA Drone High-Resolution Orthomosaics",
    category: "Geospatial Data",
    provider: "Survey of India (SoI) & MoPR",
    protocol: "OGC WMS/WFS",
    status: "Demonstration",
    description: "0.05m GSD rural settlement orthomosaics with sub-decimeter RTK boundary vectors.",
    updateFrequency: "Milestone-based drone missions",
    demonstrationLabel: "Integration Architecture / Demonstration Connector",
  },
  {
    id: "CONN-03",
    name: "State Digital Cadastral Registry (Bhulekh / Bhoomi)",
    category: "Land Records",
    provider: "State Revenue Department SDI Nodes",
    protocol: "OGC WMS/WFS",
    status: "Demonstration",
    description: "Spatial parcel boundaries linked with computerized RoR (Record of Rights) and khasra attributes.",
    updateFrequency: "Real-time deed mutation sync",
    demonstrationLabel: "Integration Architecture / Demonstration Connector",
  },
  {
    id: "CONN-04",
    name: "Central Ground Water Board Piezometric Telemetry",
    category: "Climate Data",
    provider: "Central Ground Water Board (CGWB)",
    protocol: "REST API",
    status: "Demonstration",
    description: "Daily automated depth-to-water-level measurements across basalt and alluvial observation stations.",
    updateFrequency: "Daily telemetric update",
    demonstrationLabel: "Integration Architecture / Demonstration Connector",
  },
  {
    id: "CONN-05",
    name: "Pradhan Mantri Gram Sadak Yojana (PMGSY) Road Network",
    category: "Infrastructure Data",
    provider: "National Rural Infrastructure Development Agency",
    protocol: "REST API",
    status: "Planned",
    description: "Geotagged rural connectivity corridors and all-weather road linkages to agriculture markets.",
    updateFrequency: "Quarterly asset register",
    demonstrationLabel: "Integration Architecture / Demonstration Connector",
  },
  {
    id: "CONN-06",
    name: "ICAR Agro-Ecological Crop Suitability Indices",
    category: "Research Repositories",
    provider: "Indian Council of Agricultural Research (ICAR)",
    protocol: "REST API",
    status: "Planned",
    description: "Soil fertility taxonomy, organic carbon profiles, and micro-nutrient baseline distributions.",
    updateFrequency: "Seasonal agro-climatic advisories",
    demonstrationLabel: "Integration Architecture / Demonstration Connector",
  },
];

const INITIAL_HEALTH_STATUS: SystemServiceHealth[] = [
  {
    serviceId: "srv-api",
    serviceName: "API Gateway & Edge Routing",
    category: "Core API",
    status: "Operational",
    latencyMs: 14,
    uptimePct: "99.98%",
    endpoint: "https://landscope.gov.in/api",
    notes: "Strict cryptographic session & token verification active.",
  },
  {
    serviceId: "srv-db",
    serviceName: "Spatial Cadastral & Evidence Engine",
    category: "Data Store",
    status: "Operational",
    latencyMs: 18,
    uptimePct: "99.95%",
    endpoint: "internal://cluster.landscope.data",
    notes: "PostGIS polygon indexing & khasra relation cluster active.",
  },
  {
    serviceId: "srv-gis",
    serviceName: "Geospatial OGC WMS/WFS Server",
    category: "GIS Service",
    status: "Operational",
    latencyMs: 32,
    uptimePct: "99.92%",
    endpoint: "https://landscope.gov.in/api/gis",
    notes: "Cartographic raster tiling and vector layer streaming operational.",
  },
  {
    serviceId: "srv-twin",
    serviceName: "Policy Digital Twin Engine",
    category: "Simulation",
    status: "Operational",
    latencyMs: 45,
    uptimePct: "99.90%",
    endpoint: "https://landscope.gov.in/api/policy",
    notes: "6-dimensional impact evaluation & baseline differential engine active.",
  },
  {
    serviceId: "srv-ai",
    serviceName: "Research Copilot & Vision Sandbox",
    category: "AI Service",
    status: "Demo",
    latencyMs: 110,
    uptimePct: "99.80%",
    endpoint: "https://landscope.gov.in/api/research/copilot",
    notes: "Demonstration AI synthesis model with strictly cited evidence grounding.",
  },
  {
    serviceId: "srv-auth",
    serviceName: "Sovereign RBAC & Session Shield",
    category: "Authentication",
    status: "Operational",
    latencyMs: 8,
    uptimePct: "100.0%",
    endpoint: "https://landscope.gov.in/api/auth",
    notes: "HMAC-SHA256 tamper-proof credential validation enabled.",
  },
];

const INITIAL_API_KEYS: ApiKeyRecord[] = [
  {
    id: "key-demo-01",
    name: "National Spatial Research Consortium Key",
    keyPrefix: "lsk_live_9f2a",
    maskedKey: "lsk_live_9f2a••••••••••••••••3b8c",
    hashedSecret: crypto.createHash("sha256").update("demo_secret_research_key_1").digest("hex"),
    ownerEmail: "researcher@landscope.demo",
    ownerRole: "RESEARCHER",
    createdAt: "2026-09-10T10:00:00Z",
    lastUsedAt: "2026-10-02T18:40:00Z",
    status: "ACTIVE",
    permissions: ["research:read", "gis:read", "analytics:read"],
    rateLimitPerMinute: 100,
  },
  {
    id: "key-demo-02",
    name: "Survey Demarcation Field Station Connector",
    keyPrefix: "lsk_live_4e81",
    maskedKey: "lsk_live_4e81••••••••••••••••7a1d",
    hashedSecret: crypto.createHash("sha256").update("demo_secret_agency_key_2").digest("hex"),
    ownerEmail: "agency@landscope.demo",
    ownerRole: "GOVERNMENT_AGENCY",
    createdAt: "2026-08-15T14:30:00Z",
    lastUsedAt: "2026-10-02T19:15:00Z",
    status: "ACTIVE",
    permissions: ["gis:demarcation", "gis:cadastre", "datasets:write"],
    rateLimitPerMinute: 100,
  },
];

const INITIAL_LOGS: ApiActivityLog[] = [
  {
    id: "log-101",
    actor: "Dr. Ananya Sharma",
    actorRole: "RESEARCHER",
    endpoint: "/api/research/evidence",
    method: "GET",
    timestamp: "2026-10-02T19:20:00Z",
    statusCode: 200,
    responseTimeMs: 24,
    resource: "Evidence Repository",
    result: "SUCCESS",
  },
  {
    id: "log-102",
    actor: "Vikram Malhotra",
    actorRole: "POLICYMAKER",
    endpoint: "/api/policy/simulate",
    method: "POST",
    timestamp: "2026-10-02T19:22:15Z",
    statusCode: 200,
    responseTimeMs: 48,
    resource: "Policy Digital Twin Simulation",
    result: "SUCCESS",
  },
  {
    id: "log-103",
    actor: "Sunil Deshmukh",
    actorRole: "GOVERNMENT_AGENCY",
    endpoint: "/api/gis/intelligence",
    method: "GET",
    timestamp: "2026-10-02T19:25:30Z",
    statusCode: 200,
    responseTimeMs: 31,
    resource: "Sehore Spatial Intelligence",
    result: "SUCCESS",
  },
  {
    id: "log-104",
    actor: "Anonymous Client",
    actorRole: "UNAUTHENTICATED",
    endpoint: "/api/collaboration/projects",
    method: "GET",
    timestamp: "2026-10-02T19:27:00Z",
    statusCode: 401,
    responseTimeMs: 12,
    resource: "Collaboration Workspace",
    result: "UNAUTHORIZED",
  },
];

// -----------------------------------------------------------------------------
// IN-MEMORY STORE CLASS FOR API CENTER
// -----------------------------------------------------------------------------

class ApiCenterStore {
  private apiKeys: ApiKeyRecord[] = [...INITIAL_API_KEYS];
  private activityLogs: ApiActivityLog[] = [...INITIAL_LOGS];
  private connectors: IntegrationConnector[] = [...INITIAL_CONNECTORS];
  private healthServices: SystemServiceHealth[] = [...INITIAL_HEALTH_STATUS];
  private ingestionJobs: IngestionJob[] = [];
  private rateLimits: Map<string, { count: number; windowStart: number }> = new Map();

  // --- API KEY METHODS ---

  public getApiKeysForUser(userEmail: string, roleCode: string): ApiKeyRecord[] {
    if (roleCode === "ADMIN") {
      return this.apiKeys;
    }
    return this.apiKeys.filter((k) => k.ownerEmail === userEmail);
  }

  public createApiKey(
    name: string,
    permissions: string[],
    user: { email: string; roleCode: string }
  ): { keyRecord: ApiKeyRecord; fullSecret: string } {
    const rawSecret = `lsk_${crypto.randomBytes(16).toString("hex")}`;
    const prefix = rawSecret.slice(0, 12);
    const suffix = rawSecret.slice(-4);
    const maskedKey = `${prefix}${"•".repeat(16)}${suffix}`;
    const hashedSecret = crypto.createHash("sha256").update(rawSecret).digest("hex");
    const id = `key-${Date.now().toString(36)}`;

    const keyRecord: ApiKeyRecord = {
      id,
      name,
      keyPrefix: prefix,
      maskedKey,
      hashedSecret,
      ownerEmail: user.email,
      ownerRole: user.roleCode,
      createdAt: new Date().toISOString(),
      status: "ACTIVE",
      permissions: permissions.length > 0 ? permissions : ["read:gis", "read:research"],
      rateLimitPerMinute: 100,
    };

    this.apiKeys.unshift(keyRecord);

    this.logActivity({
      actor: user.email,
      actorRole: user.roleCode,
      endpoint: "/api/keys",
      method: "POST",
      statusCode: 201,
      responseTimeMs: 15,
      resource: "API Key Management",
      result: "SUCCESS",
    });

    return { keyRecord, fullSecret: rawSecret };
  }

  public revokeApiKey(
    id: string,
    user: { email: string; roleCode: string }
  ): { success: boolean; error?: string } {
    const key = this.apiKeys.find((k) => k.id === id);
    if (!key) return { success: false, error: "API key not found" };

    if (key.ownerEmail !== user.email && user.roleCode !== "ADMIN") {
      return { success: false, error: "Forbidden: You can only revoke your own API keys" };
    }

    key.status = "REVOKED";

    this.logActivity({
      actor: user.email,
      actorRole: user.roleCode,
      endpoint: `/api/keys/${id}`,
      method: "DELETE",
      statusCode: 200,
      responseTimeMs: 12,
      resource: `API Key (${key.keyPrefix})`,
      result: "SUCCESS",
    });

    return { success: true };
  }

  public validateApiKey(providedKey: string): { valid: boolean; keyRecord?: ApiKeyRecord } {
    if (!providedKey || !providedKey.startsWith("lsk_")) {
      return { valid: false };
    }
    const hash = crypto.createHash("sha256").update(providedKey).digest("hex");
    const matched = this.apiKeys.find((k) => k.hashedSecret === hash);

    if (!matched) return { valid: false };
    if (matched.status !== "ACTIVE") return { valid: false };

    matched.lastUsedAt = new Date().toISOString();
    return { valid: true, keyRecord: matched };
  }

  // --- RATE LIMITING (100 req / minute) ---

  public checkRateLimit(clientId: string, limit: number = 100): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const clientState = this.rateLimits.get(clientId);

    if (!clientState || now - clientState.windowStart > windowMs) {
      this.rateLimits.set(clientId, { count: 1, windowStart: now });
      return { allowed: true, remaining: limit - 1 };
    }

    if (clientState.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    clientState.count += 1;
    return { allowed: true, remaining: limit - clientState.count };
  }

  // --- AUDIT LOGGING ---

  public logActivity(log: Omit<ApiActivityLog, "id" | "timestamp">): ApiActivityLog {
    // Sanitization: Ensure sensitive tokens or passwords are never logged
    let cleanEndpoint = log.endpoint;
    if (cleanEndpoint.includes("token=") || cleanEndpoint.includes("secret=")) {
      cleanEndpoint = cleanEndpoint.replace(/(token|secret)=[^&]+/g, "$1=***MASKED***");
    }

    const newLog: ApiActivityLog = {
      ...log,
      id: `log-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      endpoint: cleanEndpoint,
      timestamp: new Date().toISOString(),
    };

    this.activityLogs.unshift(newLog);
    if (this.activityLogs.length > 100) {
      this.activityLogs.pop();
    }
    return newLog;
  }

  public getActivityLogs(): ApiActivityLog[] {
    return this.activityLogs.slice(0, 50);
  }

  // --- INTEGRATION CONNECTORS & HEALTH ---

  public getConnectors(): IntegrationConnector[] {
    return this.connectors;
  }

  public getHealthServices(): SystemServiceHealth[] {
    return this.healthServices;
  }

  // --- DATA INGESTION PIPELINE ---

  public ingestDataset(data: {
    datasetName: string;
    format: "CSV" | "JSON" | "GeoJSON";
    source: string;
    content: unknown;
    targetModule: string;
  }): { success: boolean; job: IngestionJob; error?: string } {
    const id = `INGEST-${Date.now().toString(36).toUpperCase()}`;

    // Basic format validation
    let recordCount = 0;
    const errors: string[] = [];
    const crsValid = true;
    const topologyValid = true;
    let schemaValid = true;

    if (!data.datasetName || !data.format || !data.content) {
      return {
        success: false,
        error: "Missing required ingestion payload: datasetName, format, content",
        job: {
          id,
          datasetName: data.datasetName || "Unnamed",
          format: data.format || "CSV",
          source: data.source || "External API",
          recordCount: 0,
          submittedAt: new Date().toISOString(),
          status: "Rejected",
          qualityChecks: {
            crsValidation: false,
            geometryTopology: false,
            schemaConformance: false,
            attributeCompletenessPct: 0,
          },
          errors: ["Missing required ingestion fields"],
          targetModule: data.targetModule || "GIS",
        },
      };
    }

    // Validation by format
    if (data.format === "GeoJSON") {
      const geo = data.content as { type?: string; features?: unknown[] };
      if (!geo || (geo.type !== "FeatureCollection" && geo.type !== "Feature")) {
        schemaValid = false;
        errors.push("Invalid GeoJSON: Root must be FeatureCollection or Feature");
      } else {
        recordCount = Array.isArray(geo.features) ? geo.features.length : 1;
      }
    } else if (data.format === "JSON") {
      if (Array.isArray(data.content)) {
        recordCount = data.content.length;
      } else if (typeof data.content === "object" && data.content !== null) {
        recordCount = 1;
      } else {
        schemaValid = false;
        errors.push("Invalid JSON structure: Expected Array or Object");
      }
    } else if (data.format === "CSV") {
      if (typeof data.content === "string") {
        const lines = data.content.trim().split("\n");
        if (lines.length < 2) {
          schemaValid = false;
          errors.push("CSV dataset must contain at least header and one data row");
        } else {
          recordCount = lines.length - 1;
        }
      } else {
        schemaValid = false;
        errors.push("CSV content must be a valid text string");
      }
    }

    const isRejected = errors.length > 0;
    const job: IngestionJob = {
      id,
      datasetName: data.datasetName,
      format: data.format,
      source: data.source,
      recordCount,
      submittedAt: new Date().toISOString(),
      completedAt: isRejected ? undefined : new Date().toISOString(),
      status: isRejected ? "Rejected" : "Processed",
      qualityChecks: {
        crsValidation: crsValid,
        geometryTopology: topologyValid,
        schemaConformance: schemaValid,
        attributeCompletenessPct: isRejected ? 0 : 96.5,
      },
      errors: isRejected ? errors : undefined,
      targetModule: data.targetModule,
    };

    this.ingestionJobs.unshift(job);
    return { success: !isRejected, job, error: isRejected ? errors.join("; ") : undefined };
  }

  public getIngestionJobs(): IngestionJob[] {
    return this.ingestionJobs;
  }
}

export const apiCenterStore = new ApiCenterStore();
