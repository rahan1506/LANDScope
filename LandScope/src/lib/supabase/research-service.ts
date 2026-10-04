/**
 * LANDScope Sovereign Spatial Intelligence Platform
 * Supabase Persistence Service for Research & Evidence Module
 *
 * Implements strict PostgreSQL persistence over Supabase with RLS compliance:
 * - public.research_projects
 * - public.research_questions
 * - public.evidence
 * - public.project_evidence_links
 * - public.geographies
 */

import { SupabaseClient } from "@supabase/supabase-js";
import {
  ResearchProject,
  ResearchQuestion,
  EvidenceItem,
  EvidenceType,
  EvidenceStatus,
  INITIAL_RESEARCH_PROJECTS,
  INITIAL_EVIDENCE_REPOSITORY,
  GisLayerLink,
} from "@/lib/research/research-data";

export interface CreateProjectInput {
  title: string;
  subtitle?: string;
  description?: string;
  geographyId?: string;
  state?: string;
  district?: string;
  tehsil?: string;
  researchQuestions?: Array<{ question: string; hypothesis?: string }>;
}

export interface CreateEvidenceInput {
  title: string;
  abstract: string;
  authorOrOrg: string;
  year?: number;
  type: EvidenceType;
  researchDomain:
    | "Land Rights & Titling"
    | "Agricultural Productivity"
    | "Dispute Resolution"
    | "Environmental Impact"
    | "Urban Expansion"
    | "Gender & Inclusivity";
  source: string;
  sourceUrl?: string;
  confidenceScore: number;
  methodology: string;
  referenceNumber?: string;
  state: string;
  district?: string;
  tehsil?: string;
  topics?: string[];
  evidenceStatus?: EvidenceStatus;
}

const DEFAULT_GIS_LAYERS: GisLayerLink[] = [
  {
    id: "gl-nsdi-cadastre",
    name: "National SDI Baseline Cadastre",
    type: "Vector Cadastre",
    source: "Survey of India (NSDI)",
    crs: "EPSG:4326",
    coverage: "State / District Extent",
  },
];

/**
 * Retrieves all research projects accessible to the authenticated user.
 * Merges Supabase persistent records with illustrative demo projects.
 */
export async function getPersistedResearchProjects(
  client: SupabaseClient,
  userEmail?: string
): Promise<ResearchProject[]> {
  try {
    // 1. Fetch persistent projects from public.research_projects
    const { data: dbProjects, error } = await client
      .from("research_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase research_projects query notice:", error.message);
      return getFilteredDemoProjects(userEmail);
    }

    if (!dbProjects || dbProjects.length === 0) {
      return getFilteredDemoProjects(userEmail);
    }

    // 2. Fetch all linked questions and evidence links for these projects
    const projectIds = dbProjects.map((p) => p.id);

    const [questionsRes, evidenceLinksRes] = await Promise.all([
      client.from("research_questions").select("*").in("project_id", projectIds),
      client.from("project_evidence_links").select("*").in("project_id", projectIds),
    ]);

    const questionsByProject = new Map<string, ResearchQuestion[]>();
    (questionsRes.data || []).forEach((q) => {
      const list = questionsByProject.get(q.project_id) || [];
      list.push({
        id: q.id,
        question: q.question,
        hypothesis: "Formulated research question stored in Supabase",
        status: q.status === "Refuted" ? "Draft" : q.status,
      });
      questionsByProject.set(q.project_id, list);
    });

    const evidenceLinksByProject = new Map<string, string[]>();
    (evidenceLinksRes.data || []).forEach((link) => {
      const list = evidenceLinksByProject.get(link.project_id) || [];
      list.push(link.evidence_id);
      evidenceLinksByProject.set(link.project_id, list);
    });

    // 3. Map database rows to application ResearchProject models
    const persistedProjects: ResearchProject[] = dbProjects.map((row) => {
      const questions = questionsByProject.get(row.id) || [];
      const evidenceIds = evidenceLinksByProject.get(row.id) || [];

      return {
        id: row.id,
        title: row.title,
        subtitle: `${row.state}${row.district ? ` / ${row.district}` : ""} (${row.status})`,
        description: row.description,
        status: row.status === "In Progress" ? "Active" : row.status,
        leadResearcherId: row.owner_id,
        leadResearcherName: row.owner_email.split("@")[0].replace(".", " "),
        leadResearcherEmail: row.owner_email,
        organization: "National Land Research Consortium",
        lastUpdated: new Date(row.updated_at || row.created_at).toLocaleDateString(),
        evidenceCount: evidenceIds.length,
        datasetCount: 1,
        collaborators: [
          {
            name: row.owner_email.split("@")[0],
            role: "Principal Investigator",
            email: row.owner_email,
            organization: "LANDScope Sovereign Intelligence",
          },
        ],
        researchQuestions: questions,
        evidenceIds,
        datasets: [],
        gisLayers: DEFAULT_GIS_LAYERS,
        analysisNotes: "Synchronized with Supabase PostgreSQL research registry.",
        policyScenarios: [],
        reports: [],
        isDemoProject: row.is_demo_project ?? false,
      };
    });

    // 4. Merge user-created persistent projects with demo projects
    const demoProjects = getFilteredDemoProjects(userEmail);
    // Filter out demo projects with colliding IDs
    const existingIds = new Set(persistedProjects.map((p) => p.id));
    const merged = [
      ...persistedProjects,
      ...demoProjects.filter((d) => !existingIds.has(d.id)),
    ];

    return merged;
  } catch (err) {
    console.error("Error in getPersistedResearchProjects:", err);
    return getFilteredDemoProjects(userEmail);
  }
}

/**
 * Retrieves a single research project by ID from Supabase, falling back to demo repository.
 */
export async function getPersistedResearchProjectById(
  client: SupabaseClient,
  projectId: string
): Promise<ResearchProject | null> {
  try {
    const { data: row, error } = await client
      .from("research_projects")
      .select("*")
      .eq("id", projectId)
      .maybeSingle();

    if (error || !row) {
      // Check in demo projects
      const demo = INITIAL_RESEARCH_PROJECTS.find((p) => p.id === projectId);
      return demo || null;
    }

    // Fetch linked questions and evidence
    const [questionsRes, linksRes] = await Promise.all([
      client.from("research_questions").select("*").eq("project_id", projectId),
      client.from("project_evidence_links").select("*").eq("project_id", projectId),
    ]);

    const questions: ResearchQuestion[] = (questionsRes.data || []).map((q) => ({
      id: q.id,
      question: q.question,
      hypothesis: "",
      status: q.status === "Refuted" ? "Draft" : q.status,
    }));

    const evidenceIds: string[] = (linksRes.data || []).map((l) => l.evidence_id);

    return {
      id: row.id,
      title: row.title,
      subtitle: `${row.state}${row.district ? ` / ${row.district}` : ""} (${row.status})`,
      description: row.description,
      status: row.status === "In Progress" ? "Active" : row.status,
      leadResearcherId: row.owner_id,
      leadResearcherName: row.owner_email.split("@")[0].replace(".", " "),
      leadResearcherEmail: row.owner_email,
      organization: "National Land Research Consortium",
      lastUpdated: new Date(row.updated_at || row.created_at).toLocaleDateString(),
      evidenceCount: evidenceIds.length,
      datasetCount: 1,
      collaborators: [
        {
          name: row.owner_email.split("@")[0],
          role: "Principal Investigator",
          email: row.owner_email,
          organization: "LANDScope Sovereign Intelligence",
        },
      ],
      researchQuestions: questions,
      evidenceIds,
      datasets: [],
      gisLayers: DEFAULT_GIS_LAYERS,
      analysisNotes: "Synchronized with Supabase PostgreSQL research registry.",
      policyScenarios: [],
      reports: [],
      isDemoProject: row.is_demo_project ?? false,
    };
  } catch (err) {
    console.error("Error in getPersistedResearchProjectById:", err);
    return INITIAL_RESEARCH_PROJECTS.find((p) => p.id === projectId) || null;
  }
}

/**
 * Creates a new research project in Supabase public.research_projects and public.research_questions.
 */
export async function createPersistedResearchProject(
  client: SupabaseClient,
  input: CreateProjectInput,
  user: { id: string; email: string; name: string }
): Promise<ResearchProject> {
  const newId = `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const geographyId = input.geographyId || "IN-MP-SEH-ASH";
  const state = input.state || "Madhya Pradesh";
  const district = input.district || "Sehore";
  const tehsil = input.tehsil || "Ashta";

  // 1. Insert into public.research_projects
  const { error: projError } = await client.from("research_projects").insert({
    id: newId,
    title: input.title.trim(),
    description: input.description?.trim() || "Empirical land governance and spatial evidence study.",
    status: "In Progress",
    owner_id: user.id,
    owner_email: user.email,
    geography_id: geographyId,
    state,
    district,
    tehsil,
    tags: ["Land Titling", "Cadastre", "Spatial Intelligence"],
    visibility: "Private",
    is_demo_project: false,
  });

  if (projError) {
    console.error("Failed to insert into public.research_projects:", projError);
    throw new Error(`Database error creating research project: ${projError.message}`);
  }

  // 2. Insert initial research questions
  const questionsToInsert = (input.researchQuestions && input.researchQuestions.length > 0)
    ? input.researchQuestions
    : [
        {
          question: "What spatial and econometrics determinants drive land conversion?",
          hypothesis: "Baseline empirical hypothesis to be validated with cadastral data.",
        },
      ];

  const questionRows = questionsToInsert.map((q, idx) => ({
    id: `rq-${Date.now()}-${idx}`,
    project_id: newId,
    question: q.question,
    status: "Investigating" as const,
  }));

  const { error: qError } = await client.from("research_questions").insert(questionRows);
  if (qError) {
    console.warn("Failed to insert research questions:", qError.message);
  }

  return {
    id: newId,
    title: input.title.trim(),
    subtitle: `${state} / ${district} (Active)`,
    description: input.description?.trim() || "Empirical land governance and spatial evidence study.",
    status: "Active",
    leadResearcherId: user.id,
    leadResearcherName: user.name,
    leadResearcherEmail: user.email,
    organization: "National Land Research Consortium",
    lastUpdated: "Just now",
    evidenceCount: 0,
    datasetCount: 0,
    collaborators: [
      {
        name: user.name,
        role: "Principal Investigator",
        email: user.email,
        organization: "National Land Research Consortium",
      },
    ],
    researchQuestions: questionRows.map((q) => ({
      id: q.id,
      question: q.question,
      hypothesis: "",
      status: "Investigating" as const,
    })),
    evidenceIds: [],
    datasets: [],
    gisLayers: DEFAULT_GIS_LAYERS,
    analysisNotes: "Initial project workspace established. Ready for dataset integration and spatial cadastre overlay.",
    policyScenarios: [],
    reports: [],
    isDemoProject: false,
  };
}

/**
 * Links an evidence item to a research project in public.project_evidence_links.
 */
export async function linkEvidenceToPersistedProject(
  client: SupabaseClient,
  projectId: string,
  evidenceId: string
): Promise<boolean> {
  const { error } = await client.from("project_evidence_links").insert({
    project_id: projectId,
    evidence_id: evidenceId,
    relevance_note: "Linked from LANDScope Research Intelligence Workspace",
  });

  if (error) {
    // Check if duplicate (PGRST23505)
    if (error.code === "23505") {
      return true; // already linked
    }
    console.error("Failed to link evidence to project in Supabase:", error);
    return false;
  }

  return true;
}

/**
 * Adds a research question to a research project in public.research_questions.
 */
export async function addPersistedResearchQuestion(
  client: SupabaseClient,
  projectId: string,
  question: string
): Promise<ResearchQuestion> {
  const newId = `rq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const { error } = await client.from("research_questions").insert({
    id: newId,
    project_id: projectId,
    question,
    status: "Investigating",
  });

  if (error) {
    throw new Error(`Failed to add research question: ${error.message}`);
  }

  return {
    id: newId,
    question,
    hypothesis: "",
    status: "Investigating",
  };
}

/**
 * Retrieves all evidence items from Supabase public.evidence merged with demo repository.
 */
export async function getPersistedEvidence(
  client: SupabaseClient,
  filters?: {
    query?: string;
    type?: string;
    topic?: string;
    geography?: string;
    domain?: string;
    year?: number;
  }
): Promise<EvidenceItem[]> {
  try {
    const { data: dbEvidence, error } = await client
      .from("evidence")
      .select("*")
      .order("created_at", { ascending: false });

    const dbItems: EvidenceItem[] = (dbEvidence || []).map((row) => ({
      id: row.id,
      title: row.title,
      authorOrOrg: row.source,
      year: new Date(row.publication_date).getFullYear() || 2026,
      type: "Research Paper",
      abstract: row.summary,
      geography: {
        state: row.state,
        district: row.district || undefined,
        tehsil: row.tehsil || undefined,
      },
      topics: row.topics || [],
      researchDomain: row.research_domain as EvidenceItem["researchDomain"],
      source: row.source,
      evidenceStatus: row.peer_review_status === "Peer Reviewed" ? "Peer-Reviewed" : "Empirical Fieldwork",
      confidenceScore: Number(row.confidence_score) || 0.90,
      methodology: row.methodology,
      sampleSize: "Sample Size: Empirical Cadastral Records",
      referenceNumber: row.reference_number,
      isDemoRecord: row.is_demo_record ?? false,
      keyFindings: row.policy_implications || [row.summary],
      spatialContext: {
        state: row.state,
        district: row.district || undefined,
        tehsil: row.tehsil || undefined,
      },
      policyScenarioEligibility: {
        eligible: true,
        targetPolicyDomains: [row.research_domain],
        recommendedInterventions: row.policy_implications || [],
      },
    }));

    // Merge persistent records with demo repository (which are labeled Illustrative Demo Records)
    const existingIds = new Set(dbItems.map((e) => e.id));
    const allEvidence = [
      ...dbItems,
      ...INITIAL_EVIDENCE_REPOSITORY.filter((e) => !existingIds.has(e.id)),
    ];

    if (!filters) return allEvidence;

    let result = allEvidence;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.abstract.toLowerCase().includes(q) ||
          e.authorOrOrg.toLowerCase().includes(q) ||
          e.referenceNumber.toLowerCase().includes(q) ||
          e.topics.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.type && filters.type !== "All") {
      result = result.filter((e) => e.type.toLowerCase() === filters.type!.toLowerCase());
    }

    if (filters.domain && filters.domain !== "All") {
      result = result.filter((e) => e.researchDomain === filters.domain);
    }

    if (filters.geography && filters.geography !== "All") {
      result = result.filter(
        (e) =>
          e.geography.state.toLowerCase() === filters.geography!.toLowerCase() ||
          e.geography.district?.toLowerCase() === filters.geography!.toLowerCase()
      );
    }

    if (filters.year) {
      result = result.filter((e) => e.year === filters.year);
    }

    return result;
  } catch (err) {
    console.error("Error fetching evidence from Supabase:", err);
    return INITIAL_EVIDENCE_REPOSITORY;
  }
}

/**
 * Creates a new evidence item in Supabase public.evidence.
 */
export async function createPersistedEvidence(
  client: SupabaseClient,
  input: CreateEvidenceInput
): Promise<EvidenceItem> {
  const newId = `ev-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const refNum = input.referenceNumber || `REF-${Date.now().toString(36).toUpperCase()}`;

  const row = {
    id: newId,
    reference_number: refNum,
    title: input.title.trim(),
    summary: input.abstract.trim(),
    methodology: input.methodology.trim() || "Empirical econometric & spatial GIS cross-validation",
    confidence_score: input.confidenceScore,
    confidence_level:
      input.confidenceScore >= 0.85
        ? ("High" as const)
        : input.confidenceScore >= 0.70
        ? ("Moderate" as const)
        : ("Preliminary" as const),
    source: input.source.trim(),
    source_url: input.sourceUrl || null,
    publication_date: new Date().toISOString().split("T")[0],
    geography_id: "IN-MP-SEH-ASH",
    state: input.state,
    district: input.district || null,
    tehsil: input.tehsil || null,
    research_domain: input.researchDomain,
    topics: input.topics || ["Cadastre", "Land Governance"],
    key_metrics: {},
    policy_implications: [input.abstract.slice(0, 120)],
    limitations: [],
    peer_review_status:
      input.evidenceStatus === "Peer-Reviewed"
        ? ("Peer Reviewed" as const)
        : ("Under Review" as const),
    is_demo_record: false,
  };

  const { error } = await client.from("evidence").insert(row);
  if (error) {
    throw new Error(`Failed to save evidence into Supabase: ${error.message}`);
  }

  return {
    id: newId,
    title: row.title,
    authorOrOrg: row.source,
    year: new Date().getFullYear(),
    type: input.type,
    abstract: row.summary,
    geography: {
      state: row.state,
      district: row.district || undefined,
      tehsil: row.tehsil || undefined,
    },
    topics: row.topics,
    researchDomain: row.research_domain as EvidenceItem["researchDomain"],
    source: row.source,
    evidenceStatus: input.evidenceStatus || "Empirical Fieldwork",
    confidenceScore: row.confidence_score,
    methodology: row.methodology,
    sampleSize: "Sample Size: Empirical Cadastral Records",
    referenceNumber: row.reference_number,
    isDemoRecord: false,
    keyFindings: row.policy_implications,
    spatialContext: {
      state: row.state,
      district: row.district || undefined,
      tehsil: row.tehsil || undefined,
    },
    policyScenarioEligibility: {
      eligible: true,
      targetPolicyDomains: [row.research_domain],
      recommendedInterventions: row.policy_implications,
    },
  };
}

function getFilteredDemoProjects(userEmail?: string): ResearchProject[] {
  if (!userEmail) return INITIAL_RESEARCH_PROJECTS;
  return INITIAL_RESEARCH_PROJECTS.filter(
    (p) =>
      p.leadResearcherEmail === userEmail ||
      p.collaborators.some((c) => c.email === userEmail) ||
      p.isDemoProject
  );
}
