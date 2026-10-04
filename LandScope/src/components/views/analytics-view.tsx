"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Share2,
  TrendingUp,
  ShieldCheck,
  Building,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DistrictIndexBarChart, DistrictBenchmarkItem } from "@/components/ui/charts";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TablePagination } from "@/components/ui/table";

export function AnalyticsView() {
  const [activeTab, setActiveTab] = useState("tenure");
  const [currentPage, setCurrentPage] = useState(1);

  const districtBenchmarks: DistrictBenchmarkItem[] = [
    { district: "Sehore", state: "Madhya Pradesh", score: 86.4, target: 80, status: "high" },
    { district: "Pune", state: "Maharashtra", score: 84.1, target: 80, status: "high" },
    { district: "Surat", state: "Gujarat", score: 82.5, target: 80, status: "high" },
    { district: "Belagavi", state: "Karnataka", score: 79.2, target: 80, status: "medium" },
    { district: "Cuttack", state: "Odisha", score: 76.8, target: 80, status: "medium" },
    { district: "Sambalpur", state: "Odisha", score: 72.3, target: 80, status: "medium" },
    { district: "Varanasi", state: "Uttar Pradesh", score: 68.1, target: 80, status: "medium" },
    { district: "Kamrup Metro", state: "Assam", score: 61.4, target: 80, status: "medium" },
  ];

  const fullAnalyticsData = [
    {
      district: "Sehore",
      state: "Madhya Pradesh",
      tenureScore: 86.4,
      dilrmpCompliance: "99.1%",
      avgDisputeDays: "142 Days",
      fraSettlementRate: "94.2%",
      conversionRateYoY: "+2.4%",
      rank: 1,
    },
    {
      district: "Pune",
      state: "Maharashtra",
      tenureScore: 84.1,
      dilrmpCompliance: "98.4%",
      avgDisputeDays: "186 Days",
      fraSettlementRate: "88.7%",
      conversionRateYoY: "+5.8%",
      rank: 2,
    },
    {
      district: "Surat",
      state: "Gujarat",
      tenureScore: 82.5,
      dilrmpCompliance: "98.9%",
      avgDisputeDays: "128 Days",
      fraSettlementRate: "86.1%",
      conversionRateYoY: "+4.1%",
      rank: 3,
    },
    {
      district: "Belagavi",
      state: "Karnataka",
      tenureScore: 79.2,
      dilrmpCompliance: "96.2%",
      avgDisputeDays: "210 Days",
      fraSettlementRate: "79.4%",
      conversionRateYoY: "+3.2%",
      rank: 4,
    },
    {
      district: "Cuttack",
      state: "Odisha",
      tenureScore: 76.8,
      dilrmpCompliance: "94.5%",
      avgDisputeDays: "244 Days",
      fraSettlementRate: "81.9%",
      conversionRateYoY: "+1.9%",
      rank: 5,
    },
    {
      district: "Sambalpur",
      state: "Odisha",
      tenureScore: 72.3,
      dilrmpCompliance: "92.8%",
      avgDisputeDays: "280 Days",
      fraSettlementRate: "75.4%",
      conversionRateYoY: "+1.5%",
      rank: 6,
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3b82f6]/15 relative">
        <div className="space-y-1.5">
          <Breadcrumbs
            items={[
              { label: "National SDI Registry" },
              { label: "District Benchmarking & Comparative Analytics", active: true },
            ]}
          />
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Comparative Land Governance Analytics
          </h1>
          <p className="text-xs text-[#94a3b8]">
            Multi-district performance indicators, dispute resolution velocity, and NITI Aayog aspirational district alignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5 text-[#3b82f6]" />}
            className="font-mono text-xs"
          >
            Export Complete Dataset (CSV)
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<BarChart3 className="w-3.5 h-3.5" />}
            className="font-mono text-xs font-bold"
          >
            Generate Benchmark Dossier
          </Button>
        </div>
      </div>

      {/* Main Grid: 12 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): District Tenure Security Benchmark Chart */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="accent-emerald">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Tenure Security Index (TSI) Rankings</CardTitle>
              <CardDescription>
                Composite index: Cadastral accuracy (40%), Mutation speed (30%), Dispute rate (30%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DistrictIndexBarChart items={districtBenchmarks} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 cols): Full Analytical Table */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-white">District Governance Metrics Matrix</CardTitle>
                <CardDescription>
                  Realtime performance metrics reported by District Magistrates & Land Commissioners
                </CardDescription>
              </div>

              <Badge variant="official" size="sm" dot>
                NITI Aayog Aligned
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow isHeader>
                    <TableHead>Rank</TableHead>
                    <TableHead>District & State</TableHead>
                    <TableHead>Tenure Score</TableHead>
                    <TableHead>DILRMP Sync</TableHead>
                    <TableHead>Avg Dispute Cycle</TableHead>
                    <TableHead>FRA Settled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fullAnalyticsData.map((row) => (
                    <TableRow key={row.district}>
                      <TableCell className="font-bold text-white font-mono">
                        #{row.rank}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-white">{row.district}</div>
                        <div className="text-[10px] text-[#94a3b8] font-mono">{row.state}</div>
                      </TableCell>
                      <TableCell className="font-tabular font-bold font-mono text-[#3b82f6]">
                        {row.tenureScore}
                      </TableCell>
                      <TableCell className="font-tabular font-mono text-white">{row.dilrmpCompliance}</TableCell>
                      <TableCell className="font-tabular font-mono text-[#94a3b8]">
                        {row.avgDisputeDays}
                      </TableCell>
                      <TableCell className="font-tabular font-mono text-[#93c5fd]">
                        {row.fraSettlementRate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                currentPage={currentPage}
                totalPages={3}
                totalItems={18}
                itemsPerPage={6}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
