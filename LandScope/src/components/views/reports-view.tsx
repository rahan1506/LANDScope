import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Building,
  CheckCircle,
  FileText,
  Search,
  ArrowUpRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ModalDialog } from "@/components/ui/modal-dialog";

interface ReportItem {
  id: string;
  title: string;
  category: string;
  releaseDate: string;
  pages: number;
  status: string;
  summary: string;
}

export function ReportsView() {
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const reportsList: ReportItem[] = [
    {
      id: "REP-2026-081",
      title: "Parliamentary Standing Committee on Rural Development: Cadastral Geo-Referencing Audit 2026",
      category: "Parliamentary Brief",
      releaseDate: "28 Sep 2026",
      pages: 48,
      status: "Gazetted & Tabled",
      summary: "Comprehensive nationwide audit of digital cadastral maps, Cors network synchronization, and Forest Rights Act title deeds recognition.",
    },
    {
      id: "REP-2026-074",
      title: "State of Central India Land Governance: Annual Land Insecurity & Dispute Conciliation Report",
      category: "Annual Governance Audit",
      releaseDate: "15 Sep 2026",
      pages: 112,
      status: "Approved",
      summary: "Empirical evaluation of 18,000 revenue court cases, average mutation durations, and institutional effectiveness of digital RoR issuance.",
    },
    {
      id: "REP-2026-062",
      title: "Special Report: Peri-Urban Agricultural Conversion Trajectories & Master Plan 2031 Alignment",
      category: "Policy Advisory",
      releaseDate: "02 Aug 2026",
      pages: 36,
      status: "Internal Circular",
      summary: "Detailed geospatial study on peri-urban ring-road acquisitions and proposed compensatory land banking protocols.",
    },
    {
      id: "REP-2026-049",
      title: "SVAMITVA Drone Survey Verification & Abadi Area Property Cards Dispatch Status",
      category: "Operational Brief",
      releaseDate: "19 Jul 2026",
      pages: 64,
      status: "Gazetted & Tabled",
      summary: "Telemetry report covering 240,000 village Abadi zones, property card dispatch velocity, and dispute rate analysis.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3b82f6]/15">
        <div>
          <Breadcrumbs
            items={[
              { label: "National SDI Registry" },
              { label: "Institutional Reports & Parliamentary Briefs", active: true },
            ]}
          />
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1.5">
            Institutional Audit Reports & Policy Briefs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official legislative documentation, State Land Governance Audits, and DILRMP statutory compliance publications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Catalogue
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
          >
            Generate Custom Audit
          </Button>
        </div>
      </div>

      {/* Reports Table Card */}
      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-slate-100">Gazetted & Parliamentary Report Repository</CardTitle>
            <CardDescription className="text-slate-400">
              Authenticated official publications available for legislative and judicial reference
            </CardDescription>
          </div>

          <Badge variant="gazetted" size="sm">
            Official Archive
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow isHeader>
                <TableHead>Dossier ID</TableHead>
                <TableHead>Publication Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Extent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsList.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell className="font-mono text-[11px] font-bold text-[#3b82f6]">
                    {rep.id}
                  </TableCell>
                  <TableCell>
                    <div
                      className="font-bold text-slate-100 hover:text-[#3b82f6] cursor-pointer transition-colors"
                      onClick={() => setSelectedReport(rep)}
                    >
                      {rep.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{rep.summary}</div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-300">{rep.category}</TableCell>
                  <TableCell className="font-mono text-slate-400">{rep.releaseDate}</TableCell>
                  <TableCell className="font-mono text-slate-300">{rep.pages} Pages</TableCell>
                  <TableCell>
                    <Badge variant="official" size="sm" dot>
                      {rep.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedReport(rep)}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                    >
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Dialog for Report Inspection */}
      <ModalDialog
        isOpen={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.title || ""}
        subtitle={`Dossier ${selectedReport?.id} • Released ${selectedReport?.releaseDate}`}
        badge={<Badge variant="official" size="sm">Parliamentary Certified</Badge>}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
              Download Official PDF ({selectedReport?.pages} Pages)
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 glass-panel-secondary border border-[#3b82f6]/20 rounded-lg">
            <span className="font-bold text-[#3b82f6] uppercase text-[10px] tracking-wider block mb-1.5">
              Executive Summary
            </span>
            <p className="leading-relaxed text-slate-200">{selectedReport?.summary}</p>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-1">
            <span className="font-bold text-amber-300 uppercase text-[10px] tracking-wider block">
              Statutory Certification
            </span>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              This dossier has been generated directly from the LANDScope Spatial Ledger Engine and validated against State Land Record Directorate databases.
            </p>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
