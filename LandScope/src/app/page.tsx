"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  MapPin,
  FlaskConical,
  Scale,
  GraduationCap,
  Building,
  Sparkles,
  Globe,
  CheckCircle,
  Radio,
  Layers,
  Activity,
  Compass,
  FileCheck2,
  Database,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { LandScopeLogo } from "@/components/branding/landscope-logo";
import { Button } from "@/components/ui/button";
import { LandIntelligenceCanvas } from "@/components/canvas/land-intelligence-canvas";

export default function PublicLandingPage() {
  const [activeStage, setActiveStage] = useState<"research" | "gis" | "policy">("research");
  const [activeScenarioTab, setActiveScenarioTab] = useState<"buffer" | "conversion" | "tod">("buffer");

  return (
    <div className="min-h-screen bg-[#030712] text-[#f8fafc] font-sans selection:bg-[#10274e] selection:text-[#93c5fd] overflow-x-hidden">
      {/* 1. Floating Instrument Navigation Panel */}
      <header className="fixed top-0 z-50 w-full bg-[#030712]/80 backdrop-blur-xl border-b border-[#3b82f6]/15 transition-all">
        <div className="max-w-[1520px] mx-auto px-6 sm:px-10 h-18 flex items-center justify-between gap-6">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <LandScopeLogo size="sm" variant="emerald" showTagline={false} />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-[#94a3b8] tracking-wide">
            <a href="#three-stages" className="hover:text-[#3b82f6] transition-colors">
              Platform Architecture
            </a>
            <a href="#test-policy" className="hover:text-[#3b82f6] transition-colors flex items-center gap-1.5">
              <span>Policy Digital Twin</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
            </a>
            <a href="#evidence" className="hover:text-[#3b82f6] transition-colors">
              Evidence Traceability
            </a>
            <a href="#stakeholders" className="hover:text-[#3b82f6] transition-colors">
              Stakeholders
            </a>
          </nav>

          <div className="flex items-center gap-3.5">
            <Link
              href="/login"
              className="text-xs font-mono font-semibold text-[#94a3b8] hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>

            <Link href="/login">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="font-bold text-xs"
              >
                Enter LANDScope
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Cinematic Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center border-b border-[#3b82f6]/15 overflow-hidden">
        {/* Fullscreen Interactive 3D WebGL Background */}
        <div className="absolute inset-0 z-0">
          <LandIntelligenceCanvas intensity="hero" showCoordinates={true} />
        </div>

        {/* Ambient Topographic Grid Overlay */}
        <div className="absolute inset-0 topo-grid pointer-events-none opacity-25 z-1" />

        {/* Left Editorial Vignette Gradient to keep typography razor-sharp */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent pointer-events-none z-2" />

        <div className="relative z-10 max-w-[1520px] mx-auto px-6 sm:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Massive Editorial Typography & National Identity */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#060e1a]/90 backdrop-blur-md text-[#3b82f6] text-xs font-mono font-semibold tracking-wide border border-[#3b82f6]/30 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
              <span>National Spatial Decision-Support Architecture</span>
              <span className="text-[#3b82f6]/30">•</span>
              <span className="text-[#94a3b8] text-[11px]">SIH 2026 Sovereign Prototype</span>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#f59e0b] font-bold">
                AI-Powered Land Intelligence & Policy Innovation Platform
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black tracking-tight text-white leading-[1.05]">
                Explore. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#93c5fd] to-[#38bdf8]">
                  Analyze. Simulate.
                </span>{" "}
                <br />
                Decide.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-2xl font-normal">
              LANDScope connects empirical research, geospatial telemetry, and policy digital twin
              simulation to empower decision-makers to evaluate regulatory impacts before gazette notification.
            </p>

            {/* Scientific Telemetry Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 max-w-2xl">
              <div className="p-3 bg-[#060e1a]/80 backdrop-blur-md rounded border border-[#3b82f6]/15">
                <span className="text-[10px] font-mono text-[#94a3b8] block uppercase">Cadastral Sync</span>
                <span className="text-lg font-bold font-mono text-white font-tabular">18,400+</span>
                <span className="text-[10px] text-[#3b82f6] block font-mono">RTK Parcels</span>
              </div>
              <div className="p-3 bg-[#060e1a]/80 backdrop-blur-md rounded border border-[#3b82f6]/15">
                <span className="text-[10px] font-mono text-[#94a3b8] block uppercase">Precision</span>
                <span className="text-lg font-bold font-mono text-white font-tabular">±3.2 cm</span>
                <span className="text-[10px] text-[#38bdf8] block font-mono">SVAMITVA RTK</span>
              </div>
              <div className="p-3 bg-[#060e1a]/80 backdrop-blur-md rounded border border-[#3b82f6]/15">
                <span className="text-[10px] font-mono text-[#94a3b8] block uppercase">Policy Twins</span>
                <span className="text-lg font-bold font-mono text-white font-tabular">42 Scenarios</span>
                <span className="text-[10px] text-[#f59e0b] block font-mono">Multi-Tier</span>
              </div>
              <div className="p-3 bg-[#060e1a]/80 backdrop-blur-md rounded border border-[#3b82f6]/15">
                <span className="text-[10px] font-mono text-[#94a3b8] block uppercase">OGC Layers</span>
                <span className="text-lg font-bold font-mono text-white font-tabular">WMS / WFS</span>
                <span className="text-[10px] text-[#3b82f6] block font-mono">NSDI Compliant</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="/login">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold text-sm h-12 px-6"
                >
                  Enter LANDScope Workspace
                </Button>
              </Link>

              <a href="#three-stages">
                <Button variant="outline" size="lg" className="font-semibold text-sm h-12 px-6">
                  Explore Architecture
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column: Floating Geospatial Intelligence Command HUD */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 bg-[#060e1a]/85 backdrop-blur-2xl border border-[#3b82f6]/30 rounded-lg shadow-2xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-[#3b82f6]/15">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                  <Activity className="w-4 h-4 text-[#3b82f6]" />
                  <span>LIVE GEOSPATIAL INTELLIGENCE NODE</span>
                </div>
                <span className="text-[10px] font-mono text-[#3b82f6] px-2 py-0.5 rounded bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                  ONLINE
                </span>
              </div>

              {/* Sample District Spatial Inspector */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#030712]/80 rounded border border-[#3b82f6]/15 space-y-1">
                  <div className="flex items-center justify-between text-[#94a3b8] text-[11px]">
                    <span>FOCUS JURISDICTION</span>
                    <span className="text-[#3b82f6]">MP-SEHORE-014</span>
                  </div>
                  <div className="text-white font-bold text-sm">
                    Ashta Tehsil, Sehore District
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">
                    Cadastral Parcels: 4,120 • Forest Buffer Overlap: 42 Flags
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#94a3b8]">LULC Retention Index:</span>
                    <span className="text-[#3b82f6] font-bold">91.4% (Optimal)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#030712] rounded-full overflow-hidden border border-[#3b82f6]/20">
                    <div className="h-full bg-[#3b82f6] rounded-full w-[91.4%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#94a3b8]">Aquifer Recharge Stress:</span>
                    <span className="text-[#e8b85c] font-bold">Moderate (58.2)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#030712] rounded-full overflow-hidden border border-[#3b82f6]/20">
                    <div className="h-full bg-[#e8b85c] rounded-full w-[58.2%]" />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] text-[#94a3b8] border-t border-[#3b82f6]/10">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3 h-3 text-[#38bdf8]" />
                    <span>22.59° N, 78.96° E</span>
                  </span>
                  <Link href="/login" className="text-[#3b82f6] hover:underline flex items-center gap-1">
                    <span>Inspect Layer</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Three Connected Stages */}
      <section id="three-stages" className="py-28 max-w-[1520px] mx-auto px-6 sm:px-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-[#3b82f6] uppercase tracking-widest block">
            INTEGRATED EVIDENCE JOURNEY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            From Empirical Data to Statutory Decisions
          </h2>
          <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            A unified, explainable decision loop replacing fragmented reports with continuous geospatial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stage 1: Research */}
          <div className="bg-[#060e1a]/70 backdrop-blur-xl border border-[#3b82f6]/20 rounded-md p-8 space-y-5 hover:border-[#3b82f6]/40 card-tilt-hover shadow-xl relative group">
            <div className="w-12 h-12 rounded bg-[#0b1c38] border border-[#3b82f6]/30 text-[#3b82f6] flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#3b82f6] uppercase tracking-wider block">
                STAGE 01 • RESEARCH
              </span>
              <h3 className="text-xl font-bold text-white">Find and understand evidence.</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Curate empirical land research, peer-reviewed indices, econometric correlations, and AI-assisted synthesis grounded in verifiable source documents.
            </p>
            <ul className="space-y-2.5 pt-4 text-xs text-[#f8fafc] border-t border-[#3b82f6]/10">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#3b82f6] shrink-0" />
                <span>Empirical confidence scoring (0–100%)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#3b82f6] shrink-0" />
                <span>Document citation provenance</span>
              </li>
            </ul>
          </div>

          {/* Stage 2: Land Intelligence */}
          <div className="bg-[#060e1a]/70 backdrop-blur-xl border border-[#38bdf8]/25 rounded-md p-8 space-y-5 hover:border-[#38bdf8]/45 card-tilt-hover shadow-xl relative group">
            <div className="w-12 h-12 rounded bg-[#10242b] border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase tracking-wider block">
                STAGE 02 • LAND INTELLIGENCE
              </span>
              <h3 className="text-xl font-bold text-white">Explore what is happening on the ground.</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Multi-spectral satellite telemetry, sub-decimeter SVAMITVA drone cadastre, and multi-temporal land use change maps across State, District, and Tehsil tiers.
            </p>
            <ul className="space-y-2.5 pt-4 text-xs text-[#f8fafc] border-t border-[#38bdf8]/15">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span>OGC WMS 1.3 / WFS 2.0 spatial layers</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span>Historical LULC trend vectors (2018–2026)</span>
              </li>
            </ul>
          </div>

          {/* Stage 3: Policy Simulation */}
          <div className="bg-[#060e1a]/70 backdrop-blur-xl border border-[#f59e0b]/25 rounded-md p-8 space-y-5 hover:border-[#f59e0b]/45 card-tilt-hover shadow-xl relative group">
            <div className="w-12 h-12 rounded bg-[#2a251b] border border-[#f59e0b]/30 text-[#f59e0b] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#f59e0b] uppercase tracking-wider block">
                STAGE 03 • POLICY SIMULATION
              </span>
              <h3 className="text-xl font-bold text-white">Test what could happen before implementation.</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Spatial Digital Twin what-if modeling across 6 impact dimensions. Forecast agricultural retention, water stress, and tenure displacement before notifying gazettes.
            </p>
            <ul className="space-y-2.5 pt-4 text-xs text-[#f8fafc] border-t border-[#f59e0b]/15">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <span>Multi-dimensional baseline vs. scenario</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <span>Automated statutory policy brief generation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Flagship Innovation: TEST A POLICY BEFORE YOU IMPLEMENT IT */}
      <section id="test-policy" className="py-28 bg-[#060e1a]/60 border-y border-[#3b82f6]/15 relative">
        <div className="max-w-[1520px] mx-auto px-6 sm:px-10 space-y-16">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono font-bold text-[#3b82f6] uppercase tracking-widest block">
              FLAGSHIP POLICY DIGITAL TWIN
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              TEST A POLICY BEFORE YOU IMPLEMENT IT.
            </h2>
            <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
              Eliminate unintended statutory consequences by simulating regulatory interventions against live cadastral, hydrological, and socio-economic baselines.
            </p>
          </div>

          {/* Stepper Pipeline Architecture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0a1526]/80 backdrop-blur-md border border-[#3b82f6]/20 p-6 rounded-md space-y-3">
              <span className="text-xs font-mono text-[#3b82f6] font-bold block">STEP 01</span>
              <h4 className="text-base font-bold text-white">Current Landscape</h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Ingest real-time multi-spectral satellite reflectance, aquifer piezometers, and SVAMITVA title status.
              </p>
            </div>

            <div className="bg-[#0a1526]/80 backdrop-blur-md border border-[#38bdf8]/20 p-6 rounded-md space-y-3">
              <span className="text-xs font-mono text-[#38bdf8] font-bold block">STEP 02</span>
              <h4 className="text-base font-bold text-white">Policy Scenario</h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Define zoning ceilings, eco-buffer corridors, TOD transit incentives, or industrial conversion caps.
              </p>
            </div>

            <div className="bg-[#0a1526]/80 backdrop-blur-md border border-[#f59e0b]/20 p-6 rounded-md space-y-3">
              <span className="text-xs font-mono text-[#f59e0b] font-bold block">STEP 03</span>
              <h4 className="text-base font-bold text-white">Simulated Impact</h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Execute mathematical digital twin engine evaluating 6 dimensions with trade-off radar analysis.
              </p>
            </div>

            <div className="bg-[#0a1526]/80 backdrop-blur-md border border-[#3b82f6]/30 p-6 rounded-md space-y-3">
              <span className="text-xs font-mono text-[#93c5fd] font-bold block">STEP 04</span>
              <h4 className="text-base font-bold text-white">Evidence-Based Decision</h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Inspect explainable &quot;WHY&quot; evidence trail and compile statutory executive policy briefs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Evidence Traceability Section */}
      <section id="evidence" className="py-28 max-w-[1520px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase tracking-widest block">
              CREDIBILITY & EXPLAINABILITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Complete Evidence Traceability
            </h2>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Every flag, simulation metric, and policy recommendation can be inspected down to the underlying peer-reviewed monograph, drone survey flight, or sensor node.
            </p>
            <div className="pt-2 space-y-2.5 text-xs text-[#f8fafc]">
              <div className="p-3.5 bg-[#060e1a]/80 border border-[#3b82f6]/15 rounded flex items-center justify-between">
                <span className="font-semibold text-white">Statutory Grounding:</span>
                <span className="font-mono text-[#3b82f6]">Neutral non-causal terminology</span>
              </div>
              <div className="p-3.5 bg-[#060e1a]/80 border border-[#3b82f6]/15 rounded flex items-center justify-between">
                <span className="font-semibold text-white">Provenance Transparency:</span>
                <span className="font-mono text-[#38bdf8]">ICAR, CGWB, FSI Baselines</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060e1a]/90 border border-[#3b82f6]/20 rounded-md p-7 shadow-2xl space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#3b82f6]/15 text-[#94a3b8]">
              <span className="text-white font-bold">Evidence Trace Sample • SCN-2026-PERIURBAN-01</span>
              <span className="text-[#3b82f6] font-bold px-2 py-0.5 rounded bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                Confidence: 94%
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-[#94a3b8] block text-[10px] uppercase">Finding:</span>
                <p className="font-sans font-semibold text-white text-base mt-0.5">
                  Urban conversion velocity along Ashta corridor exceeds sustainable agrarian threshold by 38%.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 text-[11px] border-t border-[#3b82f6]/10">
                <div>
                  <span className="text-[#94a3b8] block text-[10px] uppercase">Empirical Source:</span>
                  <span className="font-sans text-[#f8fafc]">Centre for Spatial Governance (2025)</span>
                </div>
                <div>
                  <span className="text-[#94a3b8] block text-[10px] uppercase">Spatial Telemetry Layers:</span>
                  <span className="font-sans text-[#38bdf8]">Sentinel-2 LULC + SVAMITVA RTK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Who LANDScope Serves */}
      <section id="stakeholders" className="py-28 bg-[#060e1a]/60 border-t border-[#3b82f6]/15">
        <div className="max-w-[1520px] mx-auto px-6 sm:px-10 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-[#94a3b8] uppercase tracking-widest block">
              MULTI-STAKEHOLDER ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Who LANDScope Serves
            </h2>
            <p className="text-sm text-[#94a3b8]">
              Role-specific workflows ensuring appropriate access boundaries for every land stakeholder.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="bg-[#0a1526]/80 border border-[#3b82f6]/20 p-5 rounded-md space-y-3 hover:border-[#3b82f6]/40 card-tilt-hover">
              <div className="w-10 h-10 rounded bg-[#0b1c38] text-[#3b82f6] flex items-center justify-center mx-auto">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Researchers</h4>
              <p className="text-[11px] text-[#94a3b8]">Empirical studies & evidence curation</p>
            </div>

            <div className="bg-[#0a1526]/80 border border-[#f59e0b]/20 p-5 rounded-md space-y-3 hover:border-[#f59e0b]/40 card-tilt-hover">
              <div className="w-10 h-10 rounded bg-[#2a251b] text-[#f59e0b] flex items-center justify-center mx-auto">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Policymakers</h4>
              <p className="text-[11px] text-[#94a3b8]">Policy Twin modeling & statutory briefs</p>
            </div>

            <div className="bg-[#0a1526]/80 border border-[#38bdf8]/20 p-5 rounded-md space-y-3 hover:border-[#38bdf8]/40 card-tilt-hover">
              <div className="w-10 h-10 rounded bg-[#10242b] text-[#38bdf8] flex items-center justify-center mx-auto">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Academic Inst.</h4>
              <p className="text-[11px] text-[#94a3b8]">Fellowships & research grants</p>
            </div>

            <div className="bg-[#0a1526]/80 border border-[#3b82f6]/20 p-5 rounded-md space-y-3 hover:border-[#3b82f6]/40 card-tilt-hover">
              <div className="w-10 h-10 rounded bg-[#0b1c38] text-[#93c5fd] flex items-center justify-center mx-auto">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Agencies</h4>
              <p className="text-[11px] text-[#94a3b8]">Demarcation & cadastre reconciliation</p>
            </div>

            <div className="bg-[#0a1526]/80 border border-[#e8b85c]/20 p-5 rounded-md space-y-3 hover:border-[#e8b85c]/40 card-tilt-hover">
              <div className="w-10 h-10 rounded bg-[#2e2614] text-[#e8b85c] flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Innovators</h4>
              <p className="text-[11px] text-[#94a3b8]">Spatial AI sandbox & pilot deployments</p>
            </div>

            <div className="bg-[#0a1526]/80 border border-white/10 p-5 rounded-md space-y-3 hover:border-white/20 card-tilt-hover">
              <div className="w-10 h-10 rounded bg-white/5 text-white flex items-center justify-center mx-auto">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Public Citizens</h4>
              <p className="text-[11px] text-[#94a3b8]">Open land use maps & public summaries</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Institutional Sovereign Footer */}
      <footer className="bg-[#050b0a] text-[#94a3b8] py-12 border-t border-[#3b82f6]/15 text-xs font-sans">
        <div className="max-w-[1520px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-wide">LANDScope</span>
            <span className="text-white/20">|</span>
            <span className="text-[#94a3b8]">National Land Intelligence & Policy Innovation Platform</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono text-[#94a3b8]">
            <span>SIH 2026 Prototype • SIH26019</span>
            <span>All rights reserved</span>
            <Link href="/login" className="text-[#3b82f6] hover:underline">
              Enter Workspace &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
