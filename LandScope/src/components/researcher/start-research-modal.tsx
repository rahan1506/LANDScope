"use client";

import React, { useState } from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { Button } from "@/components/ui/button";
import { ResearchProject } from "@/lib/research/research-data";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";

interface StartResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: ResearchProject) => void;
  initialGeography?: string;
}

export function StartResearchModal({
  isOpen,
  onClose,
  onSuccess,
  initialGeography,
}: StartResearchModalProps) {
  const [title, setTitle] = useState(() =>
    initialGeography ? `Spatial Land Systems Study: ${initialGeography}` : ""
  );
  const [subtitle, setSubtitle] = useState(() =>
    initialGeography ? `Research Geography: ${initialGeography}` : ""
  );
  const [primaryQuestion, setPrimaryQuestion] = useState(() =>
    initialGeography
      ? `How do land classification shifts, cadastral formalization, and aquifer buffer pressures interact in ${initialGeography}?`
      : ""
  );
  const [hypothesis, setHypothesis] = useState(() =>
    initialGeography
      ? `Transit corridor expansion and zoning conversion drive informal land subdivision in ${initialGeography}.`
      : ""
  );
  const [description, setDescription] = useState(() =>
    initialGeography
      ? `Empirical land systems research project initialized from LANDScope GIS for ${initialGeography}. Connecting cadastral evidence trails and spatial audit datasets.`
      : ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Sync if initialGeography changes when modal opens
  React.useEffect(() => {
    if (isOpen && initialGeography) {
      const timer = setTimeout(() => {
        setTitle((prev) => (prev ? prev : `Spatial Land Systems Study: ${initialGeography}`));
        setSubtitle((prev) => (prev ? prev : `Research Geography: ${initialGeography}`));
        setPrimaryQuestion((prev) =>
          prev
            ? prev
            : `How do land classification shifts, cadastral formalization, and aquifer buffer pressures interact in ${initialGeography}?`
        );
        setHypothesis((prev) =>
          prev
            ? prev
            : `Transit corridor expansion and zoning conversion drive informal land subdivision in ${initialGeography}.`
        );
        setDescription((prev) =>
          prev
            ? prev
            : `Empirical land systems research project initialized from LANDScope GIS for ${initialGeography}. Connecting cadastral evidence trails and spatial audit datasets.`
        );
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialGeography]);

  const handleCreate = async () => {
    if (!title.trim()) {
      setErrorMsg("Please provide a research project title.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/research/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim() || undefined,
          description: description.trim() || undefined,
          researchQuestions: primaryQuestion.trim()
            ? [{ question: primaryQuestion.trim(), hypothesis: hypothesis.trim() }]
            : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Failed to create research project.");
      } else {
        setSuccessMsg("Research project initialized successfully.");
        setTimeout(() => {
          onSuccess(data.project);
          onClose();
          // Reset form
          setTitle("");
          setSubtitle("");
          setPrimaryQuestion("");
          setHypothesis("");
          setDescription("");
          setSuccessMsg("");
        }, 800);
      }
    } catch {
      setErrorMsg("Network error creating research project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Start New Research Project"
      subtitle="Establish a dedicated research workspace in the National Land SDI Registry"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="xs" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="saffron"
            size="xs"
            onClick={handleCreate}
            disabled={submitting || !title.trim()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {submitting ? "Initializing..." : "Create Project"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cadastral Demarcation & Agricultural Tenancy Transitions"
            className="w-full h-8 px-3 text-xs bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#112A4A]"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Subtitle / Focus Area
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Empirical spatial-econometric study of titling formalization"
            className="w-full h-8 px-3 text-xs bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#112A4A]"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Primary Research Question
            </label>
            <input
              type="text"
              value={primaryQuestion}
              onChange={(e) => setPrimaryQuestion(e.target.value)}
              placeholder="e.g. How does high-resolution cadastral surveying reduce civil boundary dispute pendency?"
              className="w-full h-8 px-3 text-xs bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#112A4A]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Working Hypothesis
            </label>
            <input
              type="text"
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="e.g. CORS-referenced RTK boundary demarcation reduces revenue dispute duration by > 40%."
              className="w-full h-8 px-3 text-xs bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#112A4A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Project Description & Scope
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the research methodology, geographic extent, target datasets, and expected policy outcomes..."
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#112A4A]"
          />
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
