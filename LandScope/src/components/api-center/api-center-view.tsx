"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Code,
  Key,
  Shield,
  Activity,
  Layers,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  Play,
  Copy,
  Plus,
  Trash2,
  Database,
  Globe,
  Radio,
  Clock,
  Sparkles,
  Server,
  ArrowRight,
  Upload,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ApiKeyRecord,
  ApiActivityLog,
  IntegrationConnector,
  SystemServiceHealth,
  IngestionJob,
} from "@/lib/api/api-center-data";

export interface ApiCenterViewProps {
  userRole?: string;
  userEmail?: string;
}

export function ApiCenterView({
  userRole = "ADMIN",
  userEmail = "admin@landscope.demo",
}: ApiCenterViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "docs" | "keys" | "connectors" | "health" | "activity"
  >("overview");

  // State
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<ApiActivityLog[]>([]);
  const [healthServices, setHealthServices] = useState<SystemServiceHealth[]>([]);
  const [connectors, setConnectors] = useState<IntegrationConnector[]>([]);
  const [ingestionJobs, setIngestionJobs] = useState<IngestionJob[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Modals
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([
    "read:gis",
    "read:research",
  ]);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);

  // Interactive Endpoint Explorer State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("/api/gis/context");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  // Ingestion Simulator State
  const [ingestFormat, setIngestFormat] = useState<"CSV" | "JSON" | "GeoJSON">("CSV");
  const [ingestDatasetName, setIngestDatasetName] = useState("Village Khasra Demographic Inflow");
  const [ingestContent, setIngestContent] = useState(
    "khasra_no,village,soil_type,irrigated_pct\n101/1,Ashta Rural,Black Cotton,85\n102/2,Ashta Rural,Alluvial,72"
  );
  const [ingestResult, setIngestResult] = useState<IngestionJob | null>(null);

  const isPublicUser = userRole === "PUBLIC";

  // Data Loading
  const fetchKeys = useCallback(async () => {
    if (isPublicUser) return;
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.keys || []);
      }
    } catch (err) {
      console.error("Failed to load API keys:", err);
    }
  }, [isPublicUser]);

  const fetchHealthAndConnectors = useCallback(async () => {
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setHealthServices(data.services || []);
      }
      // Connectors
      setConnectors([
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
      ]);
    } catch (err) {
      console.error("Failed to load health:", err);
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    if (isPublicUser) return;
    try {
      const res = await fetch("/api/api-center/activity");
      if (res.ok) {
        const data = await res.json();
        setActivityLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load activity:", err);
    }
  }, [isPublicUser]);

  useEffect(() => {
    async function loadInitialData() {
      await Promise.all([fetchKeys(), fetchHealthAndConnectors(), fetchActivity()]);
    }
    loadInitialData();
  }, [fetchKeys, fetchHealthAndConnectors, fetchActivity]);

  // Execute Interactive Endpoint Test
  const handleTestEndpoint = async (path: string) => {
    setSelectedEndpoint(path);
    setTestLoading(true);
    setTestResponse(null);
    try {
      const res = await fetch(path);
      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch {
      setTestResponse(JSON.stringify({ error: "Network request failed" }, null, 2));
    }
    setTestLoading(false);
  };

  // Create API Key
  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          permissions: newKeyPermissions,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedSecret(data.oneTimeSecret);
        setActionMessage("API key provisioned successfully.");
        await fetchKeys();
      } else {
        const err = await res.json();
        setActionMessage(err.error || "Failed to create API key");
      }
    } catch {
      setActionMessage("Network error creating key");
    }
  };

  // Revoke API Key
  const handleRevokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (res.ok) {
        setActionMessage("API key revoked. Requests using this token will now be rejected.");
        await fetchKeys();
      } else {
        const err = await res.json();
        setActionMessage(err.error || "Failed to revoke key");
      }
    } catch {
      setActionMessage("Network error revoking key");
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Ingest Dataset Simulator
  const handleIngestDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ingestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetName: ingestDatasetName,
          format: ingestFormat,
          source: `${userRole} Console Simulation`,
          content: ingestContent,
          targetModule: "GIS & Cadastre Engine",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIngestResult(data.job);
        setActionMessage("Dataset processed through validation, schema checks and ingestion pipeline!");
      } else {
        setIngestResult(data.job || null);
        setActionMessage(data.error || "Ingestion rejected during validation");
      }
    } catch {
      setActionMessage("Network error during ingestion");
    }
  };

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto text-[#f8fafc]">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel-primary border border-[rgba(59, 130, 246,0.25)] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3b82f6]/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b1c38]/80 border border-[#3b82f6]/30 text-[#93c5fd] text-[11px] font-mono tracking-wider uppercase">
              <Code className="w-3.5 h-3.5 text-[#3b82f6]" />
              LANDScope National SDI Open API & Integration Architecture
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f8fafc]">
              LANDScope API Center
            </h1>
            <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
              &quot;Secure APIs for land intelligence, research, analytics and policy innovation.&quot;
              Standardized RESTful interfaces and OGC WMS/WFS spatial connectors protected by server-side
              cryptographic role authorization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/api/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10274e] hover:bg-[#19386c] text-[#93c5fd] border border-[#3b82f6]/40 font-semibold text-xs transition-all shadow-[0_0_20px_rgba(59, 130, 246,0.2)]"
            >
              <Download className="w-4 h-4" />
              Download API Specification
            </a>
            <div className="bg-[#060e1a]/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[rgba(59, 130, 246,0.2)] text-center">
              <span className="text-[10px] uppercase tracking-wider text-[#94a3b8] block font-mono">
                Gateway Status
              </span>
              <span className="text-xs font-bold text-[#93c5fd] flex items-center justify-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="glass-panel-floating border border-[#3b82f6]/40 text-[#93c5fd] px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#3b82f6]" />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Primary Navigation Tabs */}
      <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.15)] rounded-2xl p-1.5 flex flex-wrap items-center gap-1.5 text-xs font-medium">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "overview"
              ? "bg-[#10274e] text-[#93c5fd] border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59, 130, 246,0.15)] font-semibold"
              : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0b1c38]/40"
          }`}
        >
          <Globe className="w-4 h-4 text-[#3b82f6]" />
          API Overview & Services
        </button>

        <button
          onClick={() => setActiveTab("docs")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "docs"
              ? "bg-[#10274e] text-[#93c5fd] border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59, 130, 246,0.15)] font-semibold"
              : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0b1c38]/40"
          }`}
        >
          <FileText className="w-4 h-4 text-[#38bdf8]" />
          API Documentation & Explorer
        </button>

        {!isPublicUser && (
          <button
            onClick={() => setActiveTab("keys")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "keys"
                ? "bg-[#10274e] text-[#93c5fd] border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59, 130, 246,0.15)] font-semibold"
                : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0b1c38]/40"
            }`}
          >
            <Key className="w-4 h-4 text-[#f59e0b]" />
            API Keys ({apiKeys.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab("connectors")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "connectors"
              ? "bg-[#10274e] text-[#93c5fd] border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59, 130, 246,0.15)] font-semibold"
              : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0b1c38]/40"
          }`}
        >
          <Layers className="w-4 h-4 text-[#38bdf8]" />
          External Connectors & Ingestion
        </button>

        <button
          onClick={() => setActiveTab("health")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "health"
              ? "bg-[#10274e] text-[#93c5fd] border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59, 130, 246,0.15)] font-semibold"
              : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0b1c38]/40"
          }`}
        >
          <Radio className="w-4 h-4 text-[#3b82f6]" />
          Integration Health
        </button>

        {!isPublicUser && (
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "activity"
                ? "bg-[#10274e] text-[#93c5fd] border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59, 130, 246,0.15)] font-semibold"
                : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0b1c38]/40"
            }`}
          >
            <Activity className="w-4 h-4 text-[#e47d72]" />
            Audit Activity Log
          </button>
        )}
      </div>

      {/* 3. Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Services Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3 hover:border-[#3b82f6]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider">Research APIs</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#93c5fd] border border-[#3b82f6]/30">
                  REST
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Peer-reviewed empirical studies, confidence scores, and multi-district evidence.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38bdf8] space-y-1.5 border-t border-[rgba(59, 130, 246,0.1)]">
                <div>GET /api/research/projects</div>
                <div>GET /api/research/evidence</div>
                <div>GET /api/research/evidence/:id</div>
              </div>
            </div>

            <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3 hover:border-[#3b82f6]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider">GIS & Spatial</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#93c5fd] border border-[#3b82f6]/30">
                  OGC WMS / WFS
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Multi-layer spatial intelligence, cadastral boundaries, and environmental buffers.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38bdf8] space-y-1.5 border-t border-[rgba(59, 130, 246,0.1)]">
                <div>GET /api/gis/layers</div>
                <div>GET /api/gis/geographies</div>
                <div>GET /api/gis/context</div>
              </div>
            </div>

            <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3 hover:border-[#3b82f6]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider">Analytics</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#93c5fd] border border-[#3b82f6]/30">
                  Time-Series
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Multi-temporal land conversion rates, climate risk indicators, and tenure metrics.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38bdf8] space-y-1.5 border-t border-[rgba(59, 130, 246,0.1)]">
                <div>GET /api/analytics/trends</div>
                <div>GET /api/analytics/indicators</div>
                <div>GET /api/analytics/why</div>
              </div>
            </div>

            <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3 hover:border-[#3b82f6]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider">Policy Twin</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#f59e0b] border border-[#f59e0b]/30">
                  Simulate
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Spatial what-if simulations, multi-dimensional trade-offs, and evidence trails.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38bdf8] space-y-1.5 border-t border-[rgba(59, 130, 246,0.1)]">
                <div>GET /api/policy/scenarios</div>
                <div>POST /api/policy/simulate</div>
                <div>GET /api/policy/why</div>
              </div>
            </div>

            <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3 hover:border-[#3b82f6]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider">Reports</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#93c5fd] border border-[#3b82f6]/30">
                  PDF / JSON
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Automated policy briefs, evidence audits, and statutory executive summaries.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38bdf8] space-y-1.5 border-t border-[rgba(59, 130, 246,0.1)]">
                <div>GET /api/reports</div>
                <div>GET /api/reports/:id</div>
              </div>
            </div>

            <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3 hover:border-[#3b82f6]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider">Collaboration</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#93c5fd] border border-[#3b82f6]/30">
                  Workspaces
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Institutional project collaboration, dataset sharing, and member management.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38bdf8] space-y-1.5 border-t border-[rgba(59, 130, 246,0.1)]">
                <div>GET /api/collaboration/projects</div>
                <div>GET /api/collaboration/projects/:id</div>
              </div>
            </div>

            <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3 hover:border-[#3b82f6]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider">Innovation Hub</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#f59e0b] border border-[#f59e0b]/30">
                  Challenges
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                National hackathons, pilot sandboxes, proposals, and multi-criteria reviews.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38bdf8] space-y-1.5 border-t border-[rgba(59, 130, 246,0.1)]">
                <div>GET /api/innovation/challenges</div>
                <div>POST /api/innovation/challenges</div>
                <div>POST /api/innovation/pilots</div>
              </div>
            </div>

            <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3 hover:border-[#3b82f6]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider">System & Ingestion</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#93c5fd] border border-[#3b82f6]/30">
                  Pipeline
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Controlled dataset ingestion, rate limiting verification, and health telemetry.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38bdf8] space-y-1.5 border-t border-[rgba(59, 130, 246,0.1)]">
                <div>POST /api/ingestion</div>
                <div>GET /api/health</div>
                <div>GET /api/openapi.json</div>
              </div>
            </div>
          </div>

          {/* Authentication & Security Standard Card */}
          <div className="glass-panel-primary border border-[rgba(59, 130, 246,0.2)] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#3b82f6]" />
              Sovereign Authentication & Rate Limiting Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#94a3b8]">
              <div className="p-4 bg-[#060e1a]/70 rounded-xl border border-[rgba(59, 130, 246,0.15)] space-y-1.5">
                <span className="font-bold text-[#93c5fd] block">Session & Bearer Tokens</span>
                <p className="leading-relaxed">
                  Browser sessions use cryptographically signed HMAC-SHA256 cookies. Headless external
                  services pass the token via standard <code className="text-[#3b82f6] font-mono">Authorization: Bearer &lt;token&gt;</code> headers.
                </p>
              </div>
              <div className="p-4 bg-[#060e1a]/70 rounded-xl border border-[rgba(59, 130, 246,0.15)] space-y-1.5">
                <span className="font-bold text-[#f59e0b] block">Demonstration API Keys</span>
                <p className="leading-relaxed">
                  Provisioned via the API Center with permission scopes (e.g. <code className="text-[#3b82f6] font-mono">read:gis</code>). Keys are
                  stored as one-way SHA-256 hashes and displayed strictly masked.
                </p>
              </div>
              <div className="p-4 bg-[#060e1a]/70 rounded-xl border border-[rgba(59, 130, 246,0.15)] space-y-1.5">
                <span className="font-bold text-[#38bdf8] block">Rate Limiting (100 req/min)</span>
                <p className="leading-relaxed">
                  Enforces 100 requests per minute per authenticated client. Requests exceeding this threshold
                  return <code className="text-[#e47d72] font-mono">HTTP 429 RATE_LIMIT_EXCEEDED</code> with retry intervals.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Documentation & Live Explorer Tab */}
      {activeTab === "docs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Endpoints Sidebar */}
            <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(59, 130, 246,0.12)]">
                <h3 className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider">Documented Endpoints</h3>
                <span className="text-[10px] text-[#94a3b8] font-mono">14 Endpoints</span>
              </div>

              <div className="space-y-1.5 text-xs max-h-[550px] overflow-y-auto pr-1">
                {[
                  { method: "GET", path: "/api/gis/context", label: "Cadastral Context" },
                  { method: "GET", path: "/api/gis/layers", label: "OGC WMS/WFS Layers" },
                  { method: "GET", path: "/api/gis/geographies", label: "Supported Geographies" },
                  { method: "GET", path: "/api/research/evidence", label: "Empirical Evidence" },
                  { method: "GET", path: "/api/analytics/trends", label: "Temporal Trends" },
                  { method: "GET", path: "/api/analytics/indicators", label: "Governance Indicators" },
                  { method: "GET", path: "/api/policy/scenarios", label: "Policy Twin Scenarios" },
                  { method: "GET", path: "/api/reports", label: "Policy Briefs" },
                  { method: "GET", path: "/api/collaboration/projects", label: "Collaboration Projects" },
                  { method: "GET", path: "/api/innovation/challenges", label: "Innovation Challenges" },
                  { method: "GET", path: "/api/health", label: "System Health Status" },
                  { method: "GET", path: "/api/rate-limit-test", label: "Rate Limit Demonstration" },
                ].map((ep) => (
                  <button
                    key={ep.path}
                    onClick={() => handleTestEndpoint(ep.path)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between font-mono text-[11px] ${
                      selectedEndpoint === ep.path
                        ? "bg-[#10274e] text-[#93c5fd] border border-[#3b82f6]/40 font-bold shadow-[0_0_15px_rgba(59, 130, 246,0.15)]"
                        : "hover:bg-[#0b1c38]/40 text-[#94a3b8] hover:text-[#f8fafc] border border-transparent"
                    }`}
                  >
                    <span className="truncate mr-2">{ep.path}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#060e1a] text-[#3b82f6] font-mono border border-[rgba(59, 130, 246,0.2)]">
                      {ep.method}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive Explorer Console */}
            <div className="lg:col-span-2 glass-panel-primary border border-[rgba(59, 130, 246,0.2)] rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[rgba(59, 130, 246,0.12)]">
                <div>
                  <h3 className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#3b82f6]" />
                    Interactive API Console
                  </h3>
                  <span className="text-xs text-[#38bdf8] font-mono">{selectedEndpoint}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      navigator.clipboard.writeText(`curl -X GET "${window.location.origin}${selectedEndpoint}"`);
                      setActionMessage("Curl command copied to clipboard!");
                      setTimeout(() => setActionMessage(null), 3000);
                    }}
                    leftIcon={<Copy className="w-3 h-3" />}
                  >
                    Copy cURL
                  </Button>
                  <Button
                    variant="saffron"
                    size="xs"
                    onClick={() => handleTestEndpoint(selectedEndpoint)}
                    leftIcon={<Play className="w-3 h-3" />}
                  >
                    {testLoading ? "Executing..." : "Send Request"}
                  </Button>
                </div>
              </div>

              {/* Endpoint Documentation Card */}
              <div className="bg-[#060e1a]/80 p-4 rounded-xl border border-[rgba(59, 130, 246,0.15)] space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="font-semibold text-[#94a3b8] block">Authentication:</span>
                    <span className="font-mono text-[#f8fafc]">Session Cookie or Bearer Token</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#94a3b8] block">Required Permission:</span>
                    <span className="font-mono text-[#93c5fd]">gis:read / authenticated</span>
                  </div>
                </div>
                <div className="pt-1 text-[11px]">
                  <span className="font-semibold text-[#94a3b8] block">Standard Error Responses:</span>
                  <span className="font-mono text-[#94a3b8]">
                    401 Unauthenticated • 403 Forbidden • 400 Bad Request • 429 Rate Limit
                  </span>
                </div>
              </div>

              {/* Response Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Live JSON Response:</span>
                  <span className="text-[10px] text-[#93c5fd] font-mono">Status: 200 OK</span>
                </div>
                <div className="bg-[#02050b] border border-[rgba(59, 130, 246,0.2)] text-[#93c5fd] p-4 rounded-xl font-mono text-[11px] max-h-96 overflow-y-auto shadow-inner">
                  {testLoading ? (
                    <div className="text-[#94a3b8] animate-pulse">Dispatching API call to edge gateway...</div>
                  ) : testResponse ? (
                    <pre className="text-[#bfdbfe] leading-relaxed whitespace-pre-wrap">{testResponse}</pre>
                  ) : (
                    <div className="text-[#94a3b8]">
                      Click &quot;Send Request&quot; above to inspect live output.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. API Keys Tab */}
      {activeTab === "keys" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 glass-panel-primary p-5 border border-[rgba(59, 130, 246,0.2)] rounded-2xl">
            <div>
              <h2 className="text-base font-bold text-[#f8fafc]">Demonstration API Key Credentials</h2>
              <p className="text-xs text-[#94a3b8]">
                Generate and manage restricted keys for automated research pipelines and field stations.
              </p>
            </div>
            <Button
              variant="saffron"
              size="xs"
              onClick={() => {
                setCreatedSecret(null);
                setIsKeyModalOpen(true);
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              + Create API Key
            </Button>
          </div>

          {/* Keys Table */}
          <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060e1a]/80 border-b border-[rgba(59, 130, 246,0.15)] text-[#94a3b8] uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Key Name</th>
                  <th className="p-3.5">Masked Secret</th>
                  <th className="p-3.5">Permissions</th>
                  <th className="p-3.5">Created</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(59, 130, 246,0.08)] text-[#f8fafc]">
                {apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-[rgba(59, 130, 246,0.03)] transition-colors">
                    <td className="p-3.5 font-semibold text-[#f8fafc]">{k.name}</td>
                    <td className="p-3.5 font-mono text-[11px] text-[#38bdf8]">{k.maskedKey}</td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {k.permissions.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#93c5fd] text-[10px] font-mono border border-[#3b82f6]/20"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-[#94a3b8]">{new Date(k.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          k.status === "ACTIVE"
                            ? "bg-[#0b1c38] text-[#93c5fd] border-[#3b82f6]/40"
                            : "bg-[#2d1215] text-[#e47d72] border-[#e47d72]/40"
                        }`}
                      >
                        {k.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {k.status === "ACTIVE" && (
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="text-[#e47d72] hover:text-[#f87171] font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. External Connectors & Ingestion Tab */}
      {activeTab === "connectors" && (
        <div className="space-y-6">
          {/* Ingestion Pipeline Visualization */}
          <div className="glass-panel-primary border border-[rgba(59, 130, 246,0.2)] rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#f8fafc]">Controlled Data Ingestion Pipeline</h3>
              <p className="text-xs text-[#94a3b8]">
                Rigorous schema mapping, spatial coordinate validation (EPSG:4326/EPSG:32643), and topological checks.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-[#060e1a]/70 rounded-xl border border-[rgba(59, 130, 246,0.15)] text-xs text-center font-medium">
              <span className="px-3 py-1.5 rounded-lg bg-[#0b1c38]/60 border border-[rgba(59, 130, 246,0.25)] text-[#f8fafc] shadow-sm">
                1. Source File
              </span>
              <ArrowRight className="w-4 h-4 text-[#3b82f6]/40 hidden sm:inline" />
              <span className="px-3 py-1.5 rounded-lg bg-[#0b1c38]/60 border border-[rgba(59, 130, 246,0.25)] text-[#f8fafc] shadow-sm">
                2. Validation
              </span>
              <ArrowRight className="w-4 h-4 text-[#3b82f6]/40 hidden sm:inline" />
              <span className="px-3 py-1.5 rounded-lg bg-[#0b1c38]/60 border border-[rgba(59, 130, 246,0.25)] text-[#f8fafc] shadow-sm">
                3. Schema Mapping
              </span>
              <ArrowRight className="w-4 h-4 text-[#3b82f6]/40 hidden sm:inline" />
              <span className="px-3 py-1.5 rounded-lg bg-[#0b1c38]/60 border border-[rgba(59, 130, 246,0.25)] text-[#f8fafc] shadow-sm">
                4. Quality Checks
              </span>
              <ArrowRight className="w-4 h-4 text-[#3b82f6]/40 hidden sm:inline" />
              <span className="px-3 py-1.5 rounded-lg bg-[#0b1c38]/60 border border-[rgba(59, 130, 246,0.25)] text-[#f8fafc] shadow-sm">
                5. Normalization
              </span>
              <ArrowRight className="w-4 h-4 text-[#3b82f6]/40 hidden sm:inline" />
              <span className="px-3 py-1.5 rounded-lg bg-[#10274e] text-[#93c5fd] border border-[#3b82f6]/40 font-bold shadow-[0_0_15px_rgba(59, 130, 246,0.15)]">
                6. Spatial Store
              </span>
            </div>

            {/* Ingestion Test Form */}
            <form onSubmit={handleIngestDataset} className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#94a3b8] block mb-1">Dataset Name</label>
                  <input
                    type="text"
                    value={ingestDatasetName}
                    onChange={(e) => setIngestDatasetName(e.target.value)}
                    className="w-full p-2.5 bg-[#060e1a] border border-[rgba(59, 130, 246,0.2)] rounded-xl text-xs text-[#f8fafc] focus:outline-hidden focus:border-[#3b82f6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#94a3b8] block mb-1">Format</label>
                  <select
                    value={ingestFormat}
                    onChange={(e) => setIngestFormat(e.target.value as "CSV" | "JSON" | "GeoJSON")}
                    className="w-full p-2.5 bg-[#060e1a] border border-[rgba(59, 130, 246,0.2)] rounded-xl text-xs text-[#f8fafc] focus:outline-hidden focus:border-[#3b82f6]"
                  >
                    <option value="CSV">CSV (Tabular)</option>
                    <option value="JSON">JSON (Structured)</option>
                    <option value="GeoJSON">GeoJSON (Spatial Features)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#94a3b8] block mb-1">Raw Dataset Content</label>
                <textarea
                  rows={3}
                  value={ingestContent}
                  onChange={(e) => setIngestContent(e.target.value)}
                  className="w-full p-2.5 bg-[#060e1a] border border-[rgba(59, 130, 246,0.2)] rounded-xl font-mono text-[11px] text-[#93c5fd] focus:outline-hidden focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-[#94a3b8]">
                  Submissions are checked for CRS bounds, missing headers, and coordinate topology.
                </span>
                <Button type="submit" variant="saffron" size="xs" leftIcon={<Upload className="w-3.5 h-3.5" />}>
                  Ingest & Validate Dataset
                </Button>
              </div>

              {ingestResult && (
                <div
                  className={`p-4 rounded-xl border text-xs ${
                    ingestResult.status === "Processed"
                      ? "bg-[#0b1c38]/80 border-[#3b82f6]/40 text-[#93c5fd]"
                      : "bg-[#2d1215]/80 border-[#e47d72]/40 text-[#e47d72]"
                  }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    {ingestResult.status === "Processed" ? (
                      <CheckCircle className="w-4 h-4 text-[#3b82f6]" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#e47d72]" />
                    )}
                    <span>
                      Pipeline Outcome: {ingestResult.status} ({ingestResult.recordCount} records parsed)
                    </span>
                  </div>
                  {ingestResult.errors && (
                    <div className="mt-1 pl-6 text-[11px] text-[#f87171]">Reason: {ingestResult.errors.join("; ")}</div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* External Connectors Architecture Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#f8fafc]">
              External Integration Architecture & Demonstration Connectors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectors.map((c) => (
                <div
                  key={c.id}
                  className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3 hover:border-[#3b82f6]/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#93c5fd] border border-[#3b82f6]/20 font-bold">
                      {c.category}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        c.status === "Live"
                          ? "bg-[#0b1c38] text-[#93c5fd] border-[#3b82f6]/40"
                          : c.status === "Demonstration"
                          ? "bg-[#2a2415] text-[#f59e0b] border-[#f59e0b]/40"
                          : "bg-[#060e1a] text-[#94a3b8] border-[rgba(59, 130, 246,0.15)]"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#f8fafc]">{c.name}</h4>
                    <span className="text-[11px] text-[#38bdf8] block mt-0.5">
                      Provider: {c.provider}
                    </span>
                  </div>

                  <p className="text-xs text-[#94a3b8] leading-relaxed">{c.description}</p>

                  <div className="pt-3 border-t border-[rgba(59, 130, 246,0.1)] flex items-center justify-between text-[11px] text-[#94a3b8] font-mono">
                    <span>Protocol: {c.protocol}</span>
                    <span>Sync: {c.updateFrequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Health & Audit Activity Tab */}
      {activeTab === "health" && (
        <div className="space-y-6">
          <div className="glass-panel-primary p-5 border border-[rgba(59, 130, 246,0.2)] rounded-2xl">
            <h2 className="text-base font-bold text-[#f8fafc]">Subsystem & Service Health Telemetry</h2>
            <p className="text-xs text-[#94a3b8]">
              Live operational monitoring of API gateways, PostGIS spatial clusters, and policy engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthServices.map((s) => (
              <div
                key={s.serviceId}
                className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f8fafc]">{s.serviceName}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      s.status === "Operational"
                        ? "bg-[#0b1c38] text-[#93c5fd] border-[#3b82f6]/40"
                        : "bg-[#2a2415] text-[#f59e0b] border-[#f59e0b]/40"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#060e1a]/70 p-3 rounded-xl border border-[rgba(59, 130, 246,0.12)]">
                  <div>
                    <span className="text-[#94a3b8] block text-[10px]">Latency</span>
                    <span className="font-bold text-[#f8fafc] font-mono">{s.latencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8] block text-[10px]">Availability</span>
                    <span className="font-bold text-[#93c5fd] font-mono">{s.uptimePct}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#94a3b8] leading-relaxed">{s.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Audit Activity Log Tab */}
      {activeTab === "activity" && (
        <div className="space-y-6">
          <div className="glass-panel-primary p-5 border border-[rgba(59, 130, 246,0.2)] rounded-2xl">
            <h2 className="text-base font-bold text-[#f8fafc]">Recent API Request Audit Log</h2>
            <p className="text-xs text-[#94a3b8]">
              Sanitized request traces. Credentials, secrets, and session tokens are strictly stripped.
            </p>
          </div>

          <div className="glass-panel-secondary border border-[rgba(59, 130, 246,0.18)] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060e1a]/80 border-b border-[rgba(59, 130, 246,0.15)] text-[#94a3b8] uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Actor / Client</th>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Endpoint</th>
                  <th className="p-3.5">Resource</th>
                  <th className="p-3.5">Latency</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(59, 130, 246,0.08)] text-[#f8fafc] font-mono text-[11px]">
                {activityLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-[rgba(59, 130, 246,0.03)] transition-colors">
                    <td className="p-3.5 text-[#94a3b8] font-sans">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-3.5 font-sans font-medium text-[#f8fafc]">{l.actor}</td>
                    <td className="p-3.5 font-bold text-[#38bdf8]">{l.method}</td>
                    <td className="p-3.5 text-[#93c5fd]">{l.endpoint}</td>
                    <td className="p-3.5 font-sans text-[#94a3b8]">{l.resource}</td>
                    <td className="p-3.5 text-[#94a3b8]">{l.responseTimeMs} ms</td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans border ${
                          l.statusCode >= 200 && l.statusCode < 300
                            ? "bg-[#0b1c38] text-[#93c5fd] border-[#3b82f6]/40"
                            : l.statusCode === 401 || l.statusCode === 403
                            ? "bg-[#2d1215] text-[#e47d72] border-[#e47d72]/40"
                            : "bg-[#2a2415] text-[#f59e0b] border-[#f59e0b]/40"
                        }`}
                      >
                        {l.statusCode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel-floating w-full max-w-md rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.8)] border border-[rgba(59, 130, 246,0.3)] p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-[#f8fafc]">Provision New API Key</h3>

            {createdSecret ? (
              <div className="space-y-3">
                <div className="p-4 bg-[#0b1c38]/90 border border-[#3b82f6]/40 text-[#93c5fd] rounded-xl text-xs space-y-2">
                  <span className="font-bold block">API Secret Generated:</span>
                  <p className="font-mono text-xs break-all bg-[#060e1a] text-[#3b82f6] p-3 rounded-lg border border-[#3b82f6]/30 select-all">
                    {createdSecret}
                  </p>
                  <span className="text-[11px] text-[#f59e0b] block mt-1">
                    ⚠️ Copy this secret immediately. It is stored as a one-way hash and will not be displayed again.
                  </span>
                </div>
                <div className="text-right">
                  <Button
                    variant="saffron"
                    size="xs"
                    onClick={() => {
                      setIsKeyModalOpen(false);
                      setCreatedSecret(null);
                    }}
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateKey} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[#94a3b8] block mb-1">Key Description / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Field Station RTK Demarcation Stream"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full p-2.5 bg-[#060e1a] border border-[rgba(59, 130, 246,0.25)] rounded-xl text-xs text-[#f8fafc] placeholder:text-[#94a3b8]/40 focus:outline-hidden focus:border-[#3b82f6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#94a3b8] block mb-1">Permission Scopes</label>
                  <div className="space-y-2 bg-[#060e1a]/70 p-3 rounded-xl border border-[rgba(59, 130, 246,0.15)] text-[11px]">
                    {["read:gis", "read:research", "read:policy", "read:analytics", "datasets:write"].map((scope) => (
                      <label key={scope} className="flex items-center gap-2 cursor-pointer text-[#94a3b8] hover:text-[#f8fafc]">
                        <input
                          type="checkbox"
                          checked={newKeyPermissions.includes(scope)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewKeyPermissions([...newKeyPermissions, scope]);
                            } else {
                              setNewKeyPermissions(newKeyPermissions.filter((s) => s !== scope));
                            }
                          }}
                          className="rounded border-[rgba(59, 130, 246,0.3)] bg-[#030712] text-[#3b82f6] focus:ring-[#3b82f6]"
                        />
                        <span className="font-mono text-[#93c5fd]">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgba(59, 130, 246,0.12)]">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => setIsKeyModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="saffron" size="xs">
                    Generate Secret
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
