export type RoleCode =
  | "RESEARCHER"
  | "POLICYMAKER"
  | "ACADEMIC_INSTITUTION"
  | "GOVERNMENT_AGENCY"
  | "INNOVATOR"
  | "PUBLIC"
  | "ADMIN";

export type RoleSlug =
  | "researcher"
  | "policymaker"
  | "academic"
  | "agency"
  | "innovator"
  | "public"
  | "admin";

export type PermissionCode =
  | "research:read"
  | "research:write"
  | "copilot:access"
  | "policy:read"
  | "policy:simulate"
  | "policy:gazette"
  | "gis:public"
  | "gis:cadastre"
  | "gis:demarcation"
  | "collaboration:read"
  | "collaboration:tasks"
  | "agency:operational"
  | "innovation:sandbox"
  | "innovation:deploy"
  | "reports:public"
  | "reports:audit"
  | "sentinel:read"
  | "sentinel:write"
  | "legal:read"
  | "legal:write"
  | "evidence:read"
  | "evidence:write"
  | "field:read"
  | "field:write"
  | "cases:read"
  | "cases:write"
  | "admin:manage_users"
  | "admin:system"
  | "admin:all";

export interface RoleDefinition {
  code: RoleCode;
  slug: RoleSlug;
  title: string;
  badge: string;
  workspaceTitle: string;
  primaryActionLabel: string;
  description: string;
  permissions: PermissionCode[];
  allowedModules: string[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  roleCode: RoleCode;
  organization: string;
  designation: string;
  accountType: "SIH Demonstration Account";
  status: "ACTIVE";
  supabaseId?: string;
}

export const ROLES: Record<RoleCode, RoleDefinition> = {
  RESEARCHER: {
    code: "RESEARCHER",
    slug: "researcher",
    title: "Researcher",
    badge: "Empirical Studies",
    workspaceTitle: "Research Intelligence Workspace",
    primaryActionLabel: "Start Research",
    description: "Empirical land governance studies, dataset exploration, peer-reviewed indices and geospatial correlations.",
    permissions: [
      "research:read",
      "research:write",
      "copilot:access",
      "gis:public",
      "gis:cadastre",
      "collaboration:read",
      "innovation:sandbox",
      "reports:public",
      "sentinel:read",
      "legal:read",
      "evidence:read",
    ],
    allowedModules: [
      "research-evidence",
      "ai-copilot",
      "datasets",
      "land-intelligence",
      "sentinel",
      "legal-harmonizer",
      "evidence-dossier",
      "research-projects",
      "collaboration",
      "innovation-hub",
      "reports",
    ],
  },
  POLICYMAKER: {
    code: "POLICYMAKER",
    slug: "policymaker",
    title: "Policymaker",
    badge: "Policy Decision",
    workspaceTitle: "Policy Decision Workspace",
    primaryActionLabel: "Create Policy Scenario",
    description: "Policy Lab simulation, spatial digital twin what-if modeling, trade-off analysis, and statutory brief drafting.",
    permissions: [
      "policy:read",
      "policy:simulate",
      "policy:gazette",
      "gis:public",
      "gis:cadastre",
      "research:read",
      "collaboration:read",
      "innovation:sandbox",
      "reports:public",
      "reports:audit",
      "sentinel:read",
      "legal:read",
      "legal:write",
      "evidence:read",
      "cases:read",
    ],
    allowedModules: [
      "policy-lab",
      "land-intelligence",
      "sentinel",
      "legal-harmonizer",
      "evidence-dossier",
      "cases",
      "analytics",
      "research-evidence",
      "scenario-history",
      "collaboration",
      "innovation-hub",
      "reports",
    ],
  },
  ACADEMIC_INSTITUTION: {
    code: "ACADEMIC_INSTITUTION",
    slug: "academic",
    title: "Academic Institution",
    badge: "Institutional Research",
    workspaceTitle: "Institutional Research Workspace",
    primaryActionLabel: "Create Research Project",
    description: "Inter-institutional research projects, academic collaboration, datasets, publications and innovation challenges.",
    permissions: [
      "research:read",
      "research:write",
      "collaboration:read",
      "collaboration:tasks",
      "gis:public",
      "gis:cadastre",
      "innovation:sandbox",
      "reports:public",
    ],
    allowedModules: [
      "research-projects",
      "collaboration",
      "research-evidence",
      "datasets",
      "land-intelligence",
      "innovation-hub",
      "reports",
    ],
  },
  GOVERNMENT_AGENCY: {
    code: "GOVERNMENT_AGENCY",
    slug: "agency",
    title: "Government Agency",
    badge: "Agency Operations",
    workspaceTitle: "Agency Intelligence Workspace",
    primaryActionLabel: "Review Demarcation",
    description: "Operational land datasets, inter-agency cadastral reconciliation, state compliance audits, and field demarcation.",
    permissions: [
      "gis:public",
      "gis:cadastre",
      "gis:demarcation",
      "agency:operational",
      "policy:read",
      "collaboration:read",
      "collaboration:tasks",
      "innovation:sandbox",
      "reports:public",
      "reports:audit",
      "sentinel:read",
      "sentinel:write",
      "legal:read",
      "legal:write",
      "evidence:read",
      "evidence:write",
      "field:read",
      "field:write",
      "cases:read",
      "cases:write",
    ],
    allowedModules: [
      "collaboration",
      "land-intelligence",
      "sentinel",
      "legal-harmonizer",
      "evidence-dossier",
      "bhu-mitra",
      "cases",
      "operational-datasets",
      "policy-lab",
      "analytics",
      "innovation-hub",
      "reports",
    ],
  },
  INNOVATOR: {
    code: "INNOVATOR",
    slug: "innovator",
    title: "Innovator",
    badge: "AI & Innovation",
    workspaceTitle: "Innovation Workspace",
    primaryActionLabel: "Deploy Model to Sandbox",
    description: "Open innovation sandbox, deep learning spatial vision models, pilot projects and crowdsourced ground-truth verification.",
    permissions: [
      "innovation:sandbox",
      "innovation:deploy",
      "gis:public",
      "research:read",
      "reports:public",
    ],
    allowedModules: [
      "innovation-hub",
      "public-datasets",
      "research-evidence",
      "land-intelligence",
      "pilot-projects",
    ],
  },
  PUBLIC: {
    code: "PUBLIC",
    slug: "public",
    title: "Public User",
    badge: "Public Access",
    workspaceTitle: "Public Land Intelligence",
    primaryActionLabel: "Explore Land Maps",
    description: "Public maps, national land-use trends, published research summaries, and climate telemetry. Restricted tools hidden.",
    permissions: [
      "gis:public",
      "research:read",
      "reports:public",
    ],
    allowedModules: [
      "overview",
      "land-intelligence",
      "published-research",
      "public-reports",
      "climate-trends",
    ],
  },
  ADMIN: {
    code: "ADMIN",
    slug: "admin",
    title: "Platform Administrator",
    badge: "System Authority",
    workspaceTitle: "Administration & System Control",
    primaryActionLabel: "Manage Platform Access",
    description: "Full platform configuration, user account management, audit logs, and spatial node credentials.",
    permissions: [
      "admin:all",
      "admin:manage_users",
      "admin:system",
      "research:read",
      "research:write",
      "policy:read",
      "policy:simulate",
      "policy:gazette",
      "gis:public",
      "gis:cadastre",
      "gis:demarcation",
      "collaboration:read",
      "collaboration:tasks",
      "agency:operational",
      "innovation:sandbox",
      "innovation:deploy",
      "reports:public",
      "reports:audit",
      "sentinel:read",
      "sentinel:write",
      "legal:read",
      "legal:write",
      "evidence:read",
      "evidence:write",
      "field:read",
      "field:write",
      "cases:read",
      "cases:write",
    ],
    allowedModules: [
      "overview",
      "user-management",
      "system-audit",
      "land-intelligence",
      "sentinel",
      "legal-harmonizer",
      "evidence-dossier",
      "bhu-mitra",
      "cases",
      "policy-lab",
      "research-evidence",
      "analytics",
      "collaboration",
      "innovation-hub",
      "reports",
      "settings",
    ],
  },
};

export const DEMO_USERS: Record<string, UserAccount> = {
  "researcher@landscope.demo": {
    id: "usr_researcher_01",
    supabaseId: "d0a1b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c",
    name: "Dr. Ananya Sharma",
    email: "researcher@landscope.demo",
    roleCode: "RESEARCHER",
    organization: "National Land Research Consortium",
    designation: "Senior Policy Research Fellow",
    accountType: "SIH Demonstration Account",
    status: "ACTIVE",
  },
  "policymaker@landscope.demo": {
    id: "usr_policy_01",
    supabaseId: "e1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d",
    name: "Vikram Malhotra",
    email: "policymaker@landscope.demo",
    roleCode: "POLICYMAKER",
    organization: "Policy Planning Directorate",
    designation: "Strategic Policy Analyst",
    accountType: "SIH Demonstration Account",
    status: "ACTIVE",
  },
  "academic@landscope.demo": {
    id: "usr_academic_01",
    supabaseId: "f2c3d4e5-f6a7-4b8c-9d0e-2f3a4b5c6d7e",
    name: "Prof. Sudhir Kulkarni",
    email: "academic@landscope.demo",
    roleCode: "ACADEMIC_INSTITUTION",
    organization: "Centre for Spatial Governance Studies",
    designation: "Dean of Spatial Sciences",
    accountType: "SIH Demonstration Account",
    status: "ACTIVE",
  },
  "agency@landscope.demo": {
    id: "usr_agency_01",
    supabaseId: "a3d4e5f6-a7b8-4c9d-0e1f-3a4b5c6d7e8f",
    name: "Sunil Deshmukh",
    email: "agency@landscope.demo",
    roleCode: "GOVERNMENT_AGENCY",
    organization: "Land Records Modernization Desk",
    designation: "Cadastral Reconciliation Officer",
    accountType: "SIH Demonstration Account",
    status: "ACTIVE",
  },
  "innovator@landscope.demo": {
    id: "usr_innovator_01",
    supabaseId: "b4e5f6a7-b8c9-4d0e-1f2a-4b5c6d7e8f9a",
    name: "Rohan Varma",
    email: "innovator@landscope.demo",
    roleCode: "INNOVATOR",
    organization: "GeoVision Spatial AI Lab",
    designation: "Lead Geospatial AI Engineer",
    accountType: "SIH Demonstration Account",
    status: "ACTIVE",
  },
  "public@landscope.demo": {
    id: "usr_public_01",
    supabaseId: "c5f6a7b8-c9d0-4e1f-2a3b-5c6d7e8f9a0b",
    name: "Kavita Rao",
    email: "public@landscope.demo",
    roleCode: "PUBLIC",
    organization: "Citizen Stakeholder",
    designation: "Community Land Advocate",
    accountType: "SIH Demonstration Account",
    status: "ACTIVE",
  },
  "admin@landscope.demo": {
    id: "usr_admin_01",
    supabaseId: "d6a7b8c9-d0e1-4f2a-3b4c-6d7e8f9a0b1c",
    name: "System Admin",
    email: "admin@landscope.demo",
    roleCode: "ADMIN",
    organization: "LANDScope Platform Architecture Cell",
    designation: "Lead Security & System Architect",
    accountType: "SIH Demonstration Account",
    status: "ACTIVE",
  },
};

// Aliases for standard TLD emails
DEMO_USERS["researcher@landscope.in"] = DEMO_USERS["researcher@landscope.demo"];
DEMO_USERS["policymaker@landscope.in"] = DEMO_USERS["policymaker@landscope.demo"];
DEMO_USERS["academic@landscope.in"] = DEMO_USERS["academic@landscope.demo"];
DEMO_USERS["agency@landscope.in"] = DEMO_USERS["agency@landscope.demo"];
DEMO_USERS["innovator@landscope.in"] = DEMO_USERS["innovator@landscope.demo"];
DEMO_USERS["public@landscope.in"] = DEMO_USERS["public@landscope.demo"];
DEMO_USERS["admin@landscope.in"] = DEMO_USERS["admin@landscope.demo"];

export const ROLE_SLUG_TO_CODE: Record<string, RoleCode> = {
  researcher: "RESEARCHER",
  policymaker: "POLICYMAKER",
  academic: "ACADEMIC_INSTITUTION",
  agency: "GOVERNMENT_AGENCY",
  government: "GOVERNMENT_AGENCY",
  "government-agency": "GOVERNMENT_AGENCY",
  innovator: "INNOVATOR",
  public: "PUBLIC",
  admin: "ADMIN",
};
