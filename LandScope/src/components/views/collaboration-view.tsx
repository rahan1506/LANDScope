import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Filter,
  Send,
  Building2,
  FileCheck,
  Shield,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

export function CollaborationView() {
  const [activeFilter, setActiveFilter] = useState("all");

  const tasks = [
    {
      id: "TSK-2026-904",
      title: "Cadastral Boundary Reconciliation: Khasra 402/A Eco-Buffer",
      sender: "Forest Dept (Sehore Division)",
      recipient: "Revenue Department (Tehsildar Ashta)",
      priority: "high",
      status: "In Progress",
      dueDate: "08 Oct 2026",
      khasra: "402/A",
      village: "Beda Munjhkheda",
    },
    {
      id: "TSK-2026-891",
      title: "Ground-Truth Verification of SVAMITVA Drone Ortho-Mosaic",
      sender: "Survey of India (Bhopal Node)",
      recipient: "District Magistrate Collectorate",
      priority: "normal",
      status: "Review Pending",
      dueDate: "14 Oct 2026",
      khasra: "Sheet 12-B",
      village: "Ashta Rural",
    },
    {
      id: "TSK-2026-877",
      title: "Gram Sabha Community Forest Title Demarcation Approval",
      sender: "Tribal Affairs Department",
      recipient: "Divisional Forest Officer",
      priority: "high",
      status: "Awaiting Sign-off",
      dueDate: "10 Oct 2026",
      khasra: "CFR-89",
      village: "Beda Munjhkheda",
    },
    {
      id: "TSK-2026-860",
      title: "Highway Right-of-Way Acquisition Mutation Ledger Audit",
      sender: "MSRDC & PWD",
      recipient: "Sub-Registrar Land Records",
      priority: "normal",
      status: "Completed",
      dueDate: "01 Oct 2026",
      khasra: "406/C",
      village: "Ashta Bypass",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-500/15">
        <div>
          <Breadcrumbs
            items={[
              { label: "National SDI Registry" },
              { label: "Inter-Departmental Nodal Collaboration", active: true },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-100 tracking-tight mt-1">
            Inter-Departmental Task Pipeline & Nodal Desk
          </h1>
          <p className="text-xs text-slate-400">
            Realtime dispute conciliation, cross-ministerial boundary consensus, and statutory sign-offs (Revenue, Forest, Survey of India)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Initiate Inter-Agency Protocol
          </Button>
        </div>
      </div>

      {/* Main Grid: 12 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Inter-Agency Tasks Table */}
        <div className="lg:col-span-8 space-y-4">
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Active Multi-Departmental Routing Queue</CardTitle>
                <CardDescription>
                  Tracking inter-agency boundary rectifications, Gram Sabha FRA verifications, and highway land transfers
                </CardDescription>
              </div>

              <Badge variant="official" size="sm" dot>
                Secure Gov Exchange
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow isHeader>
                    <TableHead>Case Ref</TableHead>
                    <TableHead>Action Title</TableHead>
                    <TableHead>Origin & Target</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-mono text-[11px] font-bold text-emerald-400">
                        {task.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-slate-100">{task.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {task.village} • Khasra: {task.khasra}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold text-slate-200">{task.sender}</div>
                        <div className="text-[10px] text-slate-400">&rarr; {task.recipient}</div>
                      </TableCell>
                      <TableCell className="font-mono text-slate-300 text-xs">
                        {task.dueDate}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.status === "Completed"
                              ? "official"
                              : task.priority === "high"
                              ? "saffron"
                              : "neutral"
                          }
                          size="sm"
                          dot
                        >
                          {task.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Nodal Officer Directory */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Designated District Nodal Officers</CardTitle>
              <CardDescription>Active verified officers for Sehore District (MP)</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-[#060e1a] border border-emerald-500/20 rounded-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Shri Alok Verma, IAS</span>
                  <span className="text-[10px] bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                    Active
                  </span>
                </div>
                <div className="text-slate-400">District Magistrate & Collector</div>
                <div className="text-[11px] text-slate-500 font-mono">Revenue Records Appellate Authority</div>
              </div>

              <div className="p-3 bg-[#060e1a] border border-emerald-500/20 rounded-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Ms. Sunita Rawat, IFS</span>
                  <span className="text-[10px] bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                    Active
                  </span>
                </div>
                <div className="text-slate-400">Divisional Forest Officer (DFO)</div>
                <div className="text-[11px] text-slate-500 font-mono">Eco-Buffer & CAMPA Nodal Officer</div>
              </div>

              <div className="p-3 bg-[#060e1a] border border-emerald-500/20 rounded-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Dr. Rajesh Trivedi</span>
                  <span className="text-[10px] bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                    Active
                  </span>
                </div>
                <div className="text-slate-400">Superintending Surveyor (SoI)</div>
                <div className="text-[11px] text-slate-500 font-mono">CORS Station & Drone Demarcation</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
