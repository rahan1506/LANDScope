"use client";

import React, { useState } from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { Button } from "@/components/ui/button";
import { EvidenceItem } from "@/lib/research/research-data";
import { Scale, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface LinkPolicyModalProps {
  evidence: EvidenceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (evidenceId: string, scenarioTitle: string) => void;
}

export function LinkPolicyModal({
  evidence,
  isOpen,
  onClose,
  onSuccess,
}: LinkPolicyModalProps) {
  const [scenarioTitle, setScenarioTitle] = useState(
    "National Master Plan 2031 Agro-Preservation Zoning Scenario"
  );
  const [rationale, setRationale] = useState(
    "Ground-truth empirical dataset submitted for calibrating the Policy Digital Twin simulation parameters."
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!evidence) return null;

  const handleLink = async () => {
    if (!scenarioTitle.trim()) {
      setErrorMsg("Please provide a policy scenario title.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/research/evidence/link-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidenceId: evidence.id,
          scenarioTitle: scenarioTitle.trim(),
          rationale: rationale.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Failed to link evidence to policy scenario.");
      } else {
        setSuccessMsg("Successfully linked evidence to Policy Digital Twin scenario candidate.");
        setTimeout(() => {
          onSuccess(evidence.id, scenarioTitle);
          onClose();
          setSuccessMsg("");
        }, 900);
      }
    } catch {
      setErrorMsg("Network error linking evidence to policy scenario.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Link Evidence to Policy Digital Twin Scenario"
      subtitle="Connecting empirical research findings to policy simulation engines"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="xs" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="saffron"
            size="xs"
            onClick={handleLink}
            disabled={submitting || !scenarioTitle.trim()}
            leftIcon={<Scale className="w-3.5 h-3.5" />}
          >
            {submitting ? "Linking..." : "Register Policy Candidate"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-sm">
          <span className="text-[10px] text-blue-900 font-bold uppercase tracking-wider block mb-1">
            Empirical Evidence Source
          </span>
          <p className="font-semibold text-slate-900 leading-snug">{evidence.title}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
            <span>{evidence.authorOrOrg}</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Confidence: {evidence.confidenceScore}%</span>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Target Policy Scenario Title:
          </label>
          <input
            type="text"
            value={scenarioTitle}
            onChange={(e) => setScenarioTitle(e.target.value)}
            className="w-full h-8 px-3 text-xs bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#112A4A]"
            placeholder="e.g. Peri-Urban Agro-Preservation Zoning Scenario 2031"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Evidence-to-Policy Rationale:
          </label>
          <textarea
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            rows={3}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#112A4A]"
            placeholder="Explain how this empirical study parameterizes the policy simulation..."
          />
        </div>

        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] text-slate-600 space-y-1">
          <strong className="text-slate-800 block">Bridge to Policy Decision Workspace:</strong>
          <p>
            Registering this evidence allows Policymakers in the Policy Lab to import these exact econometrics regressions and spatial coefficients when running digital twin scenarios.
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-sm text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-sm text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
