import React, { useState } from "react";
import {
  Layers,
  CheckCircle,
  Copy,
  ExternalLink,
  Sliders,
  Bell,
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  Download,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SearchBar } from "@/components/ui/search-bar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { DropdownMenu } from "@/components/ui/dropdown";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { MapControls } from "@/components/ui/map-controls";
import { TimelineControls } from "@/components/ui/timeline-controls";
import { EvidenceCard } from "@/components/ui/evidence-card";
import { ScenarioControls } from "@/components/ui/scenario-controls";
import { NotificationPanel } from "@/components/ui/notification-panel";

export function DesignSystemShowcaseView() {
  const [activeTab, setActiveTab] = useState("foundations");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simYear, setSimYear] = useState(2026);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="official" size="sm" dot>
            Production Component Library
          </Badge>
          <Badge variant="gazetted" size="sm">
            Government Grade
          </Badge>
        </div>
        <h1 className="text-2xl font-black text-[#0A1C30] tracking-tight">
          LANDScope Design System & Reusable Component Library
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-4xl">
          A rigorous, institutional design language tailored for Indian land governance, National Spatial Data Infrastructure (NSDI), and evidence-based policy formulation.
        </p>
      </div>

      {/* Showcase Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="pills">
        <TabsList className="mb-4">
          <TabsTrigger value="foundations">1. Foundations & Tokens</TabsTrigger>
          <TabsTrigger value="inputs-buttons">2. Controls & Inputs</TabsTrigger>
          <TabsTrigger value="data-display">3. Cards, Tables & Stats</TabsTrigger>
          <TabsTrigger value="gis-controls">4. GIS & Spatial Controls</TabsTrigger>
          <TabsTrigger value="domain-components">5. Land Governance Cards</TabsTrigger>
        </TabsList>

        {/* 1. FOUNDATIONS & COLOR SYSTEM */}
        <TabsContent value="foundations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Institutional Color Architecture</CardTitle>
              <CardDescription>
                Curated palette avoiding generic SaaS blues and excessive gradients; engineered for high contrast and trustworthiness.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Navy */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Primary: Deep Navy / Government Blue
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { name: "Navy 950", hex: "#07172A", desc: "Base Foundation" },
                    { name: "Navy 900", hex: "#0A1C30", desc: "Top Banners & Headers" },
                    { name: "Navy 800", hex: "#112A4A", desc: "Primary Buttons & Active Items" },
                    { name: "Navy 700", hex: "#173860", desc: "Interactive States" },
                    { name: "Navy 100", hex: "#E5EEF8", desc: "Pills & Selection Bg" },
                  ].map((c) => (
                    <div
                      key={c.hex}
                      onClick={() => copyToClipboard(c.hex)}
                      className="p-3 rounded-sm border border-slate-200 cursor-pointer hover:shadow-2xs transition-all"
                    >
                      <div className="h-10 rounded-2xs mb-2 border border-black/10" style={{ backgroundColor: c.hex }} />
                      <div className="text-xs font-bold text-slate-800">{c.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{c.hex}</div>
                      <div className="text-[10px] text-slate-400">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saffron Accent */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Secondary: Muted Dignified Indian Saffron
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: "Saffron 600", hex: "#B44A08", desc: "Borders & Active Hover" },
                    { name: "Saffron 500", hex: "#D35E0E", desc: "Accent Actions & Highlights" },
                    { name: "Saffron 200", hex: "#FED7AA", desc: "Subtle Warning Border" },
                    { name: "Saffron 50", hex: "#FFF9F4", desc: "Advisory Cards Bg" },
                  ].map((c) => (
                    <div
                      key={c.hex}
                      onClick={() => copyToClipboard(c.hex)}
                      className="p-3 rounded-sm border border-slate-200 cursor-pointer hover:shadow-2xs transition-all"
                    >
                      <div className="h-10 rounded-2xs mb-2 border border-black/10" style={{ backgroundColor: c.hex }} />
                      <div className="text-xs font-bold text-slate-800">{c.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{c.hex}</div>
                      <div className="text-[10px] text-slate-400">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting Forest Green & Teal */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Supporting: Forest Green (Ecological/Verified) & Teal (GIS/Hydrology)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: "Forest Green", hex: "#166534", desc: "FRA Verified & Reserve" },
                    { name: "Forest Light", hex: "#DCFCE7", desc: "Verified Badge Background" },
                    { name: "Teal Hydro", hex: "#0E7490", desc: "Water Bodies & Surveys" },
                    { name: "Teal Light", hex: "#E0F2FE", desc: "GIS Overlay Background" },
                  ].map((c) => (
                    <div
                      key={c.hex}
                      onClick={() => copyToClipboard(c.hex)}
                      className="p-3 rounded-sm border border-slate-200 cursor-pointer hover:shadow-2xs transition-all"
                    >
                      <div className="h-10 rounded-2xs mb-2 border border-black/10" style={{ backgroundColor: c.hex }} />
                      <div className="text-xs font-bold text-slate-800">{c.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{c.hex}</div>
                      <div className="text-[10px] text-slate-400">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. CONTROLS, BUTTONS & INPUTS */}
        <TabsContent value="inputs-buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buttons & Action Triggers</CardTitle>
              <CardDescription>Structured button hierarchy for unambiguous governance workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary (Gov Navy)</Button>
                <Button variant="saffron">Saffron (Priority Action)</Button>
                <Button variant="secondary">Secondary Slate</Button>
                <Button variant="outline">Institutional Outline</Button>
                <Button variant="success">Success / Verified</Button>
                <Button variant="danger">Dispute / Alert</Button>
                <Button variant="ghost">Ghost Action</Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button size="xs" variant="primary">Size Extra-Small (xs)</Button>
                <Button size="sm" variant="primary">Size Small (sm)</Button>
                <Button size="md" variant="primary">Size Medium (md)</Button>
                <Button size="lg" variant="primary">Size Large (lg)</Button>
                <Button variant="primary" isLoading>Loading State</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Institutional Form Controls & Search</CardTitle>
              <CardDescription>High contrast input fields, select menus, and shortcut-enabled search</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Village Revenue Khasra Number"
                placeholder="e.g. 402/1A"
                helperText="Standard revenue surveyor format"
                required
              />

              <Select
                label="Land Tenure Classification"
                options={[
                  { value: "bhumiswami", label: "Bhumiswami (Freehold Agricultural)" },
                  { value: "fra", label: "Forest Rights Act (FRA Title)" },
                  { value: "commons", label: "Community Commons (Gauchar)" },
                ]}
                helperText="Derived from State Record of Rights (RoR)"
              />

              <div className="md:col-span-2">
                <SearchBar
                  placeholder="Search 142M cadastral parcels, khasra numbers, legal disputes..."
                  showShortcut={true}
                  filters={[
                    { id: "all", label: "All Layers" },
                    { id: "parcels", label: "Cadastral Parcels" },
                    { id: "disputes", label: "Dispute Cases" },
                  ]}
                  activeFilter="all"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. CARDS, TABLES & STAT CARDS */}
        <TabsContent value="data-display" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              accentBar="navy"
              title="Geo-Referenced Parcels"
              value="142.8"
              unit="Million"
              change={{ value: "+3.2%", trend: "up", label: "YoY" }}
              badge={{ text: "96.4% Verified", variant: "navy" }}
            />
            <StatCard
              accentBar="saffron"
              title="Active Boundary Disputes"
              value="34,812"
              unit="Parcels"
              change={{ value: "-6.4%", trend: "down", label: "Resolved" }}
              badge={{ text: "Conciliation", variant: "saffron" }}
            />
            <StatCard
              accentBar="green"
              title="Tenure Security Index"
              value="78.6"
              unit="/ 100"
              change={{ value: "+2.1 pts", trend: "up", label: "National Target" }}
              badge={{ text: "Tier-1", variant: "green" }}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Government Badges & Status Indicators</CardTitle>
              <CardDescription>Semantically distinct badges communicating legal status without relying only on color</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
              <Badge variant="official" dot>Official / Verified</Badge>
              <Badge variant="gazetted" dot>Gazetted Notification</Badge>
              <Badge variant="saffron" dot>Saffron Priority</Badge>
              <Badge variant="dispute" dot>Active Litigation Dispute</Badge>
              <Badge variant="pending" dot>Under Survey Demarcation</Badge>
              <Badge variant="cadastral" dot>WGS84 Cadastre Layer</Badge>
              <Badge variant="neutral">Neutral Record</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. GIS & SPATIAL CONTROLS */}
        <TabsContent value="gis-controls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spatio-Temporal Timeline Slider</CardTitle>
              <CardDescription>Interactive timeline component tracking historical land use epochs and national policy milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <TimelineControls
                currentYear={simYear}
                onYearChange={setSimYear}
                years={[2010, 2014, 2018, 2022, 2026]}
                milestones={[
                  { year: 2014, label: "National Land Records Digitization", tag: "DILRMP" },
                  { year: 2022, label: "SVAMITVA Drone Survey 75%", tag: "Tech" },
                  { year: 2026, label: "LANDScope AI Platform", tag: "SIH26019" },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Administrative Breadcrumbs</CardTitle>
              <CardDescription>Hierarchical multi-level geographical navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <Breadcrumbs
                items={[
                  { label: "Madhya Pradesh" },
                  { label: "Sehore District" },
                  { label: "Ashta Tehsil" },
                  { label: "Cadastral Parcel 402/A", active: true },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. DOMAIN-SPECIFIC LAND GOVERNANCE CARDS */}
        <TabsContent value="domain-components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Empirical Evidence Card Component</CardTitle>
              <CardDescription>Standardized format for legislative research dossiers with DOI and confidence scores</CardDescription>
            </CardHeader>
            <CardContent>
              <EvidenceCard
                title="Impact of Drone Cadastral Mapping on Boundary Litigation in Rural Central India"
                agency="National Institute of Public Finance and Policy & Survey of India"
                year={2026}
                referenceNumber="NIPFP-LGD-2026-02"
                abstract="Econometric analysis of 8,400 rural parcels demonstrating that CORS-backed RTK drone boundaries reduce land boundary disputes by 58% within 18 months of RoR issuance."
                confidenceScore={95}
                methodology="Double difference quasi-experimental field control study."
                peerReviewStatus="Government Audit"
                sampleSize="8,400 Plots in 32 Villages"
                tags={["SVAMITVA", "CORS", "LitigationReduction"]}
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Test Accessible Modal Dialog
            </Button>
          </div>

          <ModalDialog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Design System Verification Modal"
            subtitle="Demonstrating accessible dialog window with institutional styling"
            badge={<Badge variant="official" size="sm">SIH26019</Badge>}
            footer={
              <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
                Confirm & Dismiss
              </Button>
            }
          >
            <p className="text-xs text-slate-700 leading-relaxed">
              This dialog implements full focus trapping, background blur, Escape key dismissibility, and institutional government borders.
            </p>
          </ModalDialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
