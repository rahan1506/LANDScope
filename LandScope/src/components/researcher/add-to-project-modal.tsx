"use client";

import React, { useState } from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { Button } from "@/components/ui/button";
import { EvidenceItem, ResearchProject } from "@/lib/research/research-data";
import { FolderPlus, CheckCircle2, AlertCircle } from "lucide-react";

interface AddToProjectModalProps {
  evidence: EvidenceItem | null;
  projects: ResearchProject[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (projectId: string, evidenceId: string) => void;
}

export function AddToProjectModal({
  evidence,
  projects,
  isOpen,
  onClose,
  onSuccess,
}: AddToProjectModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects.length > 0 ? projects[0].id : ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!evidence) return null;

  const handleAdd = async () => {
    if (!selectedProjectId) {
      setErrorMsg("Please select a target research project.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/research/projects/${selectedProjectId}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidenceId: evidence.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Failed to add evidence to project.");
      } else {
        setSuccessMsg(`Successfully added to project.`);
        setTimeout(() => {
          onSuccess(selectedProjectId, evidence.id);
          onClose();
          setSuccessMsg("");
        }, 900);
      }
    } catch {
      setErrorMsg("Network error adding evidence to project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Evidence to Research Project"
      subtitle={`Connecting study Ref: ${evidence.referenceNumber}`}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="xs" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="xs"
            onClick={handleAdd}
            disabled={submitting || !selectedProjectId}
            leftIcon={<FolderPlus className="w-3.5 h-3.5" />}
          >
            {submitting ? "Adding..." : "Confirm & Save"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
            Target Evidence Item
          </span>
          <p className="font-semibold text-slate-900 leading-snug">{evidence.title}</p>
          <span className="text-[11px] text-slate-500 block mt-1">
            {evidence.authorOrOrg} • {evidence.year}
          </span>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">
            Select Destination Research Project:
          </label>
          {projects.length === 0 ? (
            <p className="text-slate-500 italic p-3 bg-slate-50 border border-slate-200 rounded-sm">
              No active projects found. Please create a project first using &quot;+ Start Research&quot;.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {projects.map((proj) => {
                const isAlreadyAdded = proj.evidenceIds.includes(evidence.id);
                return (
                  <label
                    key={proj.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-sm border cursor-pointer transition-all ${
                      selectedProjectId === proj.id
                        ? "border-[#112A4A] bg-blue-50/40"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetProject"
                      value={proj.id}
                      checked={selectedProjectId === proj.id}
                      onChange={() => setSelectedProjectId(proj.id)}
                      className="mt-0.5 text-[#112A4A] focus:ring-[#112A4A]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-slate-900 font-medium text-xs truncate">
                          {proj.title}
                        </strong>
                        {isAlreadyAdded && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-medium shrink-0">
                            Already Linked
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {proj.status} • {proj.evidenceCount} evidence items • {proj.datasetCount} datasets
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
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
