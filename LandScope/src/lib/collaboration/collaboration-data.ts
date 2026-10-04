/**
 * LANDScope Collaboration Data Engine
 *
 * Implements real project-based multi-stakeholder collaboration for:
 * Researchers, Policymakers, Academic Institutions, and Government Agencies.
 *
 * Strict server-side enforced RBAC & Project-level authorization.
 * Seamless bidirectional connections with Research, GIS, Policy Lab, and Reports.
 */

export type ProjectRole =
  | "OWNER"
  | "RESEARCHER"
  | "POLICYMAKER"
  | "ACADEMIC"
  | "GOVERNMENT_AGENCY"
  | "VIEWER";

export type ProjectPermission =
  | "admin"
  | "write"
  | "read"
  | "comment";

export type ProjectType =
  | "Research"
  | "Policy Analysis"
  | "Land Governance"
  | "Climate & Resilience"
  | "Infrastructure"
  | "Academic Study"
  | "Innovation Pilot";

export type ProjectVisibility = "Private" | "Project Members";

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  organization: string;
  projectRole: ProjectRole;
  projectPermission: ProjectPermission;
  status: "ACTIVE" | "PENDING_INVITE";
  joinedDate: string;
}

export interface MemberInvitation {
  id: string;
  projectId: string;
  projectTitle: string;
  inviterName: string;
  inviterEmail: string;
  recipientName: string;
  recipientEmail: string;
  assignedRole: ProjectRole;
  assignedPermission: ProjectPermission;
  status: "PENDING_INVITE" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

export interface SharedEvidence {
  id: string;
  evidenceId: string;
  title: string;
  authorOrOrg: string;
  year: number;
  confidence: number;
  evidenceType: string;
  addedBy: string;
  addedByEmail: string;
  dateAdded: string;
  notes?: string;
}

export interface SharedDataset {
  id: string;
  name: string;
  format: "CSV" | "GeoJSON" | "JSON" | "Cloud-Optimized GeoTIFF" | "Shapefile";
  geography: string;
  timePeriod: string;
  source: string;
  coverage: string;
  status: "Illustrative Demo Dataset" | "Observed External Layer";
  recordsCount?: number;
  addedBy: string;
  addedByEmail: string;
  dateAdded: string;
}

export interface SharedGisContext {
  id: string;
  state: string;
  district: string;
  tehsil: string;
  selectedLayers: string[];
  timePeriod: string;
  notes?: string;
  savedBy: string;
  savedByEmail: string;
  dateSaved: string;
}

export interface SharedPolicyScenario {
  id: string;
  scenarioId: string;
  name: string;
  geography: string;
  policyType: string;
  createdBy: string;
  createdByEmail: string;
  createdDate: string;
  lastSimulation: string;
  impactDimensions: string[];
  status: "Draft" | "Simulated" | "Gazetted" | "Illustrative Model Output";
}

export interface ProjectComment {
  id: string;
  authorName: string;
  authorEmail: string;
  authorRole: string;
  content: string;
  timestamp: string;
  parentId?: string; // Support for replies
}

export interface ProjectActivityEvent {
  id: string;
  type:
    | "PROJECT_CREATED"
    | "MEMBER_INVITED"
    | "MEMBER_ACCEPTED"
    | "MEMBER_REJECTED"
    | "MEMBER_ROLE_CHANGED"
    | "MEMBER_REMOVED"
    | "EVIDENCE_ADDED"
    | "EVIDENCE_REMOVED"
    | "DATASET_ADDED"
    | "GIS_CONTEXT_SAVED"
    | "SCENARIO_ASSOCIATED"
    | "REPORT_GENERATED"
    | "COMMENT_ADDED";
  actorName: string;
  actorEmail: string;
  actorRole: string;
  description: string;
  timestamp: string;
}

export interface CollaborativeProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  researchArea: string;
  geography: string;
  projectType: ProjectType;
  visibility: ProjectVisibility;
  category: "Research Project" | "Policy Project" | "Inter-Agency Demarcation";
  status: "Active" | "Under Review" | "Completed" | "Archived";
  ownerName: string;
  ownerEmail: string;
  ownerOrganization: string;
  ownerRole: string;
  isPrivate: boolean;
  createdAt: string;
  lastUpdated: string;
  members: ProjectMember[];
  evidence: SharedEvidence[];
  datasets: SharedDataset[];
  gisContexts: SharedGisContext[];
  scenarios: SharedPolicyScenario[];
  associatedReportIds: string[];
  comments: ProjectComment[];
  activities: ProjectActivityEvent[];
}

export const INITIAL_COLLABORATIVE_PROJECTS: CollaborativeProject[] = [
  {
    id: "collab-proj-01",
    title: "Peri-Urban Land Governance Study: Ashta Tehsil",
    subtitle: "Cross-sectoral empirical evaluation of prime agricultural zoning and industrial expansion corridors",
    description:
      "Joint collaborative initiative between academic researchers, spatial planning agencies, and the state land governance directorate to evaluate farmland conversion trade-offs along NH-46 in Ashta tehsil.",
    researchArea: "Land Economics & Peri-Urban Governance",
    geography: "Madhya Pradesh > Sehore > Ashta",
    projectType: "Research",
    visibility: "Private",
    category: "Research Project",
    status: "Active",
    ownerName: "Dr. Ananya Sharma",
    ownerEmail: "researcher@landscope.demo",
    ownerOrganization: "Center for Land Policy & Econometrics (SIH Demo)",
    ownerRole: "RESEARCHER",
    isPrivate: true,
    createdAt: "2026-09-15T10:00:00Z",
    lastUpdated: "Today, 11:20",
    members: [
      {
        id: "mem-01",
        name: "Dr. Ananya Sharma",
        email: "researcher@landscope.demo",
        organization: "Center for Land Policy & Econometrics (SIH Demo)",
        projectRole: "OWNER",
        projectPermission: "admin",
        status: "ACTIVE",
        joinedDate: "15 Sep 2026",
      },
      {
        id: "mem-02",
        name: "Prof. Sudhir Kulkarni",
        email: "academic@landscope.demo",
        organization: "National Institute of Advanced Rural Studies (SIH Demo)",
        projectRole: "ACADEMIC",
        projectPermission: "write",
        status: "ACTIVE",
        joinedDate: "16 Sep 2026",
      },
      {
        id: "mem-03",
        name: "Vikram Malhotra",
        email: "policymaker@landscope.demo",
        organization: "State Land Governance Directorate (SIH Demo)",
        projectRole: "POLICYMAKER",
        projectPermission: "write",
        status: "ACTIVE",
        joinedDate: "18 Sep 2026",
      },
      {
        id: "mem-04",
        name: "Sunil Deshmukh",
        email: "agency@landscope.demo",
        organization: "Department of Land Records & Demarcation (SIH Demo)",
        projectRole: "GOVERNMENT_AGENCY",
        projectPermission: "write",
        status: "ACTIVE",
        joinedDate: "20 Sep 2026",
      },
    ],
    evidence: [
      {
        id: "sh-ev-01",
        evidenceId: "ev-101",
        title: "Peri-Urban Agricultural Land Conversion Under Master Plan 2031: Impacts on Ground Water Depletion",
        authorOrOrg: "Central Ground Water Board (CGWB) & Town Planning Directorate",
        year: 2026,
        confidence: 94,
        evidenceType: "Research Paper",
        addedBy: "Dr. Ananya Sharma",
        addedByEmail: "researcher@landscope.demo",
        dateAdded: "22 Sep 2026",
        notes: "Key baseline evidence verifying 1,200 Ha annual diversion ceiling impact.",
      },
      {
        id: "sh-ev-02",
        evidenceId: "ev-102",
        title: "Dynamic Ground Water Resources Assessment of India (National Water Informatics)",
        authorOrOrg: "Ministry of Jal Shakti / CGWB",
        year: 2025,
        confidence: 91,
        evidenceType: "Government Audit",
        addedBy: "Prof. Sudhir Kulkarni",
        addedByEmail: "academic@landscope.demo",
        dateAdded: "24 Sep 2026",
        notes: "Aquifer stress hydrographs for Ashta basalt formations.",
      },
    ],
    datasets: [
      {
        id: "sh-ds-01",
        name: "High-Resolution Sentinel-2 Multi-Spectral Reflectance Stack (2018–2026)",
        format: "Cloud-Optimized GeoTIFF",
        geography: "Madhya Pradesh > Sehore > Ashta",
        timePeriod: "2018–2026",
        source: "European Space Agency / NRSC Bhuvan Node",
        coverage: "1,240 Sq Km Area",
        status: "Illustrative Demo Dataset",
        recordsCount: 42000,
        addedBy: "Prof. Sudhir Kulkarni",
        addedByEmail: "academic@landscope.demo",
        dateAdded: "25 Sep 2026",
      },
      {
        id: "sh-ds-02",
        name: "Cadastral Vector Parcel Boundaries & SVAMITVA Orthomosaic",
        format: "GeoJSON",
        geography: "Madhya Pradesh > Sehore > Ashta",
        timePeriod: "2024–2026",
        source: "Survey of India & MP Land Records Dept",
        coverage: "48,200 Revenue Parcels",
        status: "Illustrative Demo Dataset",
        recordsCount: 48200,
        addedBy: "Sunil Deshmukh",
        addedByEmail: "agency@landscope.demo",
        dateAdded: "26 Sep 2026",
      },
    ],
    gisContexts: [
      {
        id: "sh-gis-01",
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
        selectedLayers: ["Land Use", "Climate Risk", "Infrastructure", "Governance"],
        timePeriod: "2026 Current Baseline",
        notes: "Focal area around NH-46 corridor experiencing highest farmland conversion pressure.",
        savedBy: "Dr. Ananya Sharma",
        savedByEmail: "researcher@landscope.demo",
        dateSaved: "27 Sep 2026",
      },
    ],
    scenarios: [
      {
        id: "sh-scn-01",
        scenarioId: "SCN-MURBW3IF",
        name: "Controlled Peri-Urban Expansion 2031",
        geography: "Madhya Pradesh > Sehore > Ashta",
        policyType: "Zoning Ceiling & Aquifer Buffer",
        createdBy: "Vikram Malhotra",
        createdByEmail: "policymaker@landscope.demo",
        createdDate: "28 Sep 2026",
        lastSimulation: "2026-09-28 14:20",
        impactDimensions: ["Agriculture", "Water", "Ecology", "Urban Development", "Infrastructure", "Land Governance"],
        status: "Illustrative Model Output",
      },
    ],
    associatedReportIds: ["REP-MURBV2PG"],
    comments: [
      {
        id: "cmt-01",
        authorName: "Dr. Ananya Sharma",
        authorEmail: "researcher@landscope.demo",
        authorRole: "RESEARCHER",
        content: "We have finalized the baseline multi-spectral layers for 2018-2026. The 10.3 percentage point drop in cropland is confirmed by revenue records.",
        timestamp: "28 Sep 2026, 14:15",
      },
      {
        id: "cmt-02",
        authorName: "Vikram Malhotra",
        authorEmail: "policymaker@landscope.demo",
        authorRole: "POLICYMAKER",
        content: "Policy Digital Twin simulation shows the 650 Ha diversion cap protects 550 Ha of alluvial soil with minimal disruption to logistics zoning.",
        timestamp: "29 Sep 2026, 09:30",
      },
    ],
    activities: [
      {
        id: "act-01",
        type: "PROJECT_CREATED",
        actorName: "Dr. Ananya Sharma",
        actorEmail: "researcher@landscope.demo",
        actorRole: "RESEARCHER",
        description: "Created collaborative project 'Peri-Urban Land Governance Study: Ashta Tehsil'",
        timestamp: "15 Sep 2026, 10:00",
      },
      {
        id: "act-02",
        type: "MEMBER_INVITED",
        actorName: "Dr. Ananya Sharma",
        actorEmail: "researcher@landscope.demo",
        actorRole: "RESEARCHER",
        description: "Invited Vikram Malhotra (Policymaker) and Sunil Deshmukh (Government Agency)",
        timestamp: "20 Sep 2026, 11:30",
      },
      {
        id: "act-03",
        type: "EVIDENCE_ADDED",
        actorName: "Dr. Ananya Sharma",
        actorEmail: "researcher@landscope.demo",
        actorRole: "RESEARCHER",
        description: "Added empirical study 'Peri-Urban Agricultural Land Conversion Under Master Plan 2031'",
        timestamp: "22 Sep 2026, 15:40",
      },
      {
        id: "act-04",
        type: "SCENARIO_ASSOCIATED",
        actorName: "Vikram Malhotra",
        actorEmail: "policymaker@landscope.demo",
        actorRole: "POLICYMAKER",
        description: "Associated Policy Digital Twin simulation 'Controlled Peri-Urban Expansion 2031'",
        timestamp: "28 Sep 2026, 17:00",
      },
    ],
  },
  {
    id: "collab-proj-02",
    title: "State Cadastral Digitization & DILRMP Demarcation Pilot",
    subtitle: "High-precision CORS network boundary conciliation and mutation latency reduction audit",
    description:
      "Confidential agency demarcation initiative evaluating RTK drone accuracy standards, revenue sub-registrar integration, and Gram Sabha boundary consensus.",
    researchArea: "Cadastral Demarcation & Survey Tech",
    geography: "Madhya Pradesh > Sehore",
    projectType: "Land Governance",
    visibility: "Private",
    category: "Inter-Agency Demarcation",
    status: "Active",
    ownerName: "Sunil Deshmukh",
    ownerEmail: "agency@landscope.demo",
    ownerOrganization: "Department of Land Records & Demarcation (SIH Demo)",
    ownerRole: "GOVERNMENT_AGENCY",
    isPrivate: true,
    createdAt: "2026-09-18T09:00:00Z",
    lastUpdated: "Yesterday, 16:45",
    members: [
      {
        id: "mem-201",
        name: "Sunil Deshmukh",
        email: "agency@landscope.demo",
        organization: "Department of Land Records & Demarcation (SIH Demo)",
        projectRole: "OWNER",
        projectPermission: "admin",
        status: "ACTIVE",
        joinedDate: "18 Sep 2026",
      },
      {
        id: "mem-202",
        name: "Vikram Malhotra",
        email: "policymaker@landscope.demo",
        organization: "State Land Governance Directorate (SIH Demo)",
        projectRole: "POLICYMAKER",
        projectPermission: "write",
        status: "ACTIVE",
        joinedDate: "19 Sep 2026",
      },
    ],
    evidence: [],
    datasets: [
      {
        id: "sh-ds-201",
        name: "CORS Reference Station Coordinates & Demarcation Logs",
        format: "CSV",
        geography: "Madhya Pradesh > Sehore",
        timePeriod: "2025–2026",
        source: "Survey of India National Geospatial Node",
        coverage: "District CORS Grid",
        status: "Illustrative Demo Dataset",
        recordsCount: 15400,
        addedBy: "Sunil Deshmukh",
        addedByEmail: "agency@landscope.demo",
        dateAdded: "20 Sep 2026",
      },
    ],
    gisContexts: [
      {
        id: "sh-gis-201",
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
        selectedLayers: ["Cadastral Parcels Overlay", "CORS Network Baseline"],
        timePeriod: "2026",
        savedBy: "Sunil Deshmukh",
        savedByEmail: "agency@landscope.demo",
        dateSaved: "21 Sep 2026",
      },
    ],
    scenarios: [],
    associatedReportIds: [],
    comments: [
      {
        id: "cmt-201",
        authorName: "Sunil Deshmukh",
        authorEmail: "agency@landscope.demo",
        authorRole: "GOVERNMENT_AGENCY",
        content: "Pilot CORS network coverage has reduced boundary measurement discrepancy to under 5cm.",
        timestamp: "24 Sep 2026, 11:00",
      },
    ],
    activities: [
      {
        id: "act-201",
        type: "PROJECT_CREATED",
        actorName: "Sunil Deshmukh",
        actorEmail: "agency@landscope.demo",
        actorRole: "GOVERNMENT_AGENCY",
        description: "Created confidential project 'State Cadastral Digitization & DILRMP Demarcation Pilot'",
        timestamp: "18 Sep 2026, 09:00",
      },
    ],
  },
  {
    id: "collab-proj-03",
    title: "National Water Commons & Aquifer Sustainability Framework",
    subtitle: "Inter-institutional hydrological analysis for unconfined basalt formations in the Deccan Plateau",
    description:
      "Collaborative research consortium modeling groundwater extraction stress, artificial recharge structures, and participatory community water budgeting.",
    researchArea: "Hydrology & Water Commons",
    geography: "Maharashtra > Pune > Haveli",
    projectType: "Climate & Resilience",
    visibility: "Private",
    category: "Policy Project",
    status: "Active",
    ownerName: "Prof. Sudhir Kulkarni",
    ownerEmail: "academic@landscope.demo",
    ownerOrganization: "National Institute of Advanced Rural Studies (SIH Demo)",
    ownerRole: "ACADEMIC",
    isPrivate: true,
    createdAt: "2026-09-10T08:30:00Z",
    lastUpdated: "3 days ago",
    members: [
      {
        id: "mem-301",
        name: "Prof. Sudhir Kulkarni",
        email: "academic@landscope.demo",
        organization: "National Institute of Advanced Rural Studies (SIH Demo)",
        projectRole: "OWNER",
        projectPermission: "admin",
        status: "ACTIVE",
        joinedDate: "10 Sep 2026",
      },
      {
        id: "mem-302",
        name: "Dr. Ananya Sharma",
        email: "researcher@landscope.demo",
        organization: "Center for Land Policy & Econometrics (SIH Demo)",
        projectRole: "RESEARCHER",
        projectPermission: "write",
        status: "ACTIVE",
        joinedDate: "12 Sep 2026",
      },
    ],
    evidence: [],
    datasets: [],
    gisContexts: [],
    scenarios: [],
    associatedReportIds: [],
    comments: [],
    activities: [],
  },
];

// In-Memory store for collaboration operations
class CollaborationStore {
  private projects: CollaborativeProject[] = [...INITIAL_COLLABORATIVE_PROJECTS];
  private invitations: MemberInvitation[] = [];

  getAllProjects(): CollaborativeProject[] {
    return this.projects;
  }

  getProjectById(id: string): CollaborativeProject | undefined {
    return this.projects.find((p) => p.id === id);
  }

  getProjectsForUser(email: string, roleCode: string): {
    owned: CollaborativeProject[];
    shared: CollaborativeProject[];
    invitations: MemberInvitation[];
  } {
    if (roleCode === "ADMIN") {
      return {
        owned: this.projects.filter((p) => p.ownerEmail === email),
        shared: this.projects.filter((p) => p.ownerEmail !== email),
        invitations: this.invitations.filter((i) => i.status === "PENDING_INVITE"),
      };
    }

    if (roleCode === "PUBLIC") {
      return {
        owned: [],
        shared: this.projects.filter((p) => !p.isPrivate),
        invitations: [],
      };
    }

    const owned = this.projects.filter((p) => p.ownerEmail.toLowerCase() === email.toLowerCase());
    const shared = this.projects.filter(
      (p) =>
        p.ownerEmail.toLowerCase() !== email.toLowerCase() &&
        p.members.some(
          (m) => m.email.toLowerCase() === email.toLowerCase() && m.status === "ACTIVE"
        )
    );

    const userInvitations = this.invitations.filter(
      (i) => i.recipientEmail.toLowerCase() === email.toLowerCase() && i.status === "PENDING_INVITE"
    );

    return { owned, shared, invitations: userInvitations };
  }

  createProject(
    projectData: Omit<
      CollaborativeProject,
      | "id"
      | "createdAt"
      | "lastUpdated"
      | "members"
      | "evidence"
      | "datasets"
      | "gisContexts"
      | "scenarios"
      | "associatedReportIds"
      | "comments"
      | "activities"
    >,
    ownerUser: { name: string; email: string; organization: string; roleCode: string }
  ): CollaborativeProject {
    const id = `collab-proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const ownerMember: ProjectMember = {
      id: `mem-${Date.now().toString(36)}`,
      name: ownerUser.name,
      email: ownerUser.email,
      organization: ownerUser.organization,
      projectRole: "OWNER",
      projectPermission: "admin",
      status: "ACTIVE",
      joinedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };

    const initialActivity: ProjectActivityEvent = {
      id: `act-${Date.now().toString(36)}`,
      type: "PROJECT_CREATED",
      actorName: ownerUser.name,
      actorEmail: ownerUser.email,
      actorRole: ownerUser.roleCode,
      description: `Created collaborative project '${projectData.title}'`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newProject: CollaborativeProject = {
      ...projectData,
      id,
      ownerName: ownerUser.name,
      ownerEmail: ownerUser.email,
      ownerOrganization: ownerUser.organization,
      ownerRole: ownerUser.roleCode,
      createdAt: now,
      lastUpdated: "Just now",
      members: [ownerMember],
      evidence: [],
      datasets: [],
      gisContexts: [],
      scenarios: [],
      associatedReportIds: [],
      comments: [],
      activities: [initialActivity],
    };

    this.projects.unshift(newProject);
    return newProject;
  }

  inviteMember(
    projectId: string,
    member: { name: string; email: string; organization: string; projectRole: ProjectRole; projectPermission: ProjectPermission },
    inviter: { name: string; email: string; roleCode: string }
  ): { member: ProjectMember; invitation: MemberInvitation } | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    // Check if member already exists
    let existingMember = project.members.find(
      (m) => m.email.toLowerCase() === member.email.toLowerCase()
    );

    if (existingMember) {
      existingMember.projectRole = member.projectRole;
      existingMember.projectPermission = member.projectPermission;
      existingMember.status = "PENDING_INVITE";
    } else {
      existingMember = {
        id: `mem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
        name: member.name,
        email: member.email,
        organization: member.organization,
        projectRole: member.projectRole,
        projectPermission: member.projectPermission,
        status: "PENDING_INVITE",
        joinedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      };
      project.members.push(existingMember);
    }

    const invitation: MemberInvitation = {
      id: `inv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      projectId: project.id,
      projectTitle: project.title,
      inviterName: inviter.name,
      inviterEmail: inviter.email,
      recipientName: member.name,
      recipientEmail: member.email,
      assignedRole: member.projectRole,
      assignedPermission: member.projectPermission,
      status: "PENDING_INVITE",
      createdAt: new Date().toISOString(),
    };

    this.invitations.unshift(invitation);
    project.lastUpdated = "Just now";

    project.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      type: "MEMBER_INVITED",
      actorName: inviter.name,
      actorEmail: inviter.email,
      actorRole: inviter.roleCode,
      description: `Invited ${member.name} (${member.organization}) as ${member.projectRole}`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return { member: existingMember, invitation };
  }

  acceptInvitation(invitationId: string, userEmail: string): boolean {
    const invite = this.invitations.find(
      (i) => i.id === invitationId && i.recipientEmail.toLowerCase() === userEmail.toLowerCase()
    );
    if (!invite) return false;

    invite.status = "ACCEPTED";
    const project = this.getProjectById(invite.projectId);
    if (project) {
      const member = project.members.find(
        (m) => m.email.toLowerCase() === userEmail.toLowerCase()
      );
      if (member) {
        member.status = "ACTIVE";
      }
      project.activities.unshift({
        id: `act-${Date.now().toString(36)}`,
        type: "MEMBER_ACCEPTED",
        actorName: invite.recipientName,
        actorEmail: invite.recipientEmail,
        actorRole: invite.assignedRole,
        description: `${invite.recipientName} accepted project invitation as ${invite.assignedRole}`,
        timestamp: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      project.lastUpdated = "Just now";
    }
    return true;
  }

  rejectInvitation(invitationId: string, userEmail: string): boolean {
    const invite = this.invitations.find(
      (i) => i.id === invitationId && i.recipientEmail.toLowerCase() === userEmail.toLowerCase()
    );
    if (!invite) return false;

    invite.status = "REJECTED";
    const project = this.getProjectById(invite.projectId);
    if (project) {
      project.members = project.members.filter(
        (m) => m.email.toLowerCase() !== userEmail.toLowerCase()
      );
      project.activities.unshift({
        id: `act-${Date.now().toString(36)}`,
        type: "MEMBER_REJECTED",
        actorName: invite.recipientName,
        actorEmail: invite.recipientEmail,
        actorRole: invite.assignedRole,
        description: `${invite.recipientName} declined project invitation`,
        timestamp: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      project.lastUpdated = "Just now";
    }
    return true;
  }

  removeMember(projectId: string, memberEmail: string, actor: { name: string; email: string; roleCode: string }): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;

    const memberIdx = project.members.findIndex((m) => m.email.toLowerCase() === memberEmail.toLowerCase());
    if (memberIdx === -1) return false;

    const removed = project.members[memberIdx];
    project.members.splice(memberIdx, 1);
    project.lastUpdated = "Just now";

    project.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      type: "MEMBER_REMOVED",
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.roleCode,
      description: `Removed ${removed.name} from project collaborators`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return true;
  }

  changeMemberRole(
    projectId: string,
    memberEmail: string,
    newRole: ProjectRole,
    newPermission: ProjectPermission,
    actor: { name: string; email: string; roleCode: string }
  ): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;

    const member = project.members.find((m) => m.email.toLowerCase() === memberEmail.toLowerCase());
    if (!member) return false;

    member.projectRole = newRole;
    member.projectPermission = newPermission;
    project.lastUpdated = "Just now";

    project.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      type: "MEMBER_ROLE_CHANGED",
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.roleCode,
      description: `Updated ${member.name}'s role to ${newRole} (${newPermission})`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return true;
  }

  addEvidence(
    projectId: string,
    evidence: Omit<SharedEvidence, "id" | "dateAdded">,
    actor: { name: string; email: string; roleCode: string }
  ): SharedEvidence | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const newEvidence: SharedEvidence = {
      ...evidence,
      id: `sh-ev-${Date.now().toString(36)}`,
      dateAdded: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };

    project.evidence.push(newEvidence);
    project.lastUpdated = "Just now";

    project.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      type: "EVIDENCE_ADDED",
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.roleCode,
      description: `Added empirical evidence '${newEvidence.title}'`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return newEvidence;
  }

  removeEvidence(projectId: string, evidenceId: string, actor: { name: string; email: string; roleCode: string }): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;

    const idx = project.evidence.findIndex((e) => e.id === evidenceId || e.evidenceId === evidenceId);
    if (idx === -1) return false;

    const removed = project.evidence[idx];
    project.evidence.splice(idx, 1);
    project.lastUpdated = "Just now";

    project.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      type: "EVIDENCE_REMOVED",
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.roleCode,
      description: `Removed empirical evidence '${removed.title}'`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return true;
  }

  addDataset(
    projectId: string,
    dataset: Omit<SharedDataset, "id" | "dateAdded">,
    actor: { name: string; email: string; roleCode: string }
  ): SharedDataset | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const newDataset: SharedDataset = {
      ...dataset,
      id: `sh-ds-${Date.now().toString(36)}`,
      status: "Illustrative Demo Dataset",
      dateAdded: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };

    project.datasets.push(newDataset);
    project.lastUpdated = "Just now";

    project.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      type: "DATASET_ADDED",
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.roleCode,
      description: `Associated dataset '${newDataset.name}' for ${newDataset.geography}`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return newDataset;
  }

  saveGisContext(
    projectId: string,
    gis: Omit<SharedGisContext, "id" | "dateSaved">,
    actor: { name: string; email: string; roleCode: string }
  ): SharedGisContext | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const newGis: SharedGisContext = {
      ...gis,
      id: `sh-gis-${Date.now().toString(36)}`,
      dateSaved: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };

    project.gisContexts.push(newGis);
    project.lastUpdated = "Just now";

    project.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      type: "GIS_CONTEXT_SAVED",
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.roleCode,
      description: `Saved GIS spatial context for ${newGis.state} > ${newGis.district} > ${newGis.tehsil}`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return newGis;
  }

  associateScenario(
    projectId: string,
    scenario: Omit<SharedPolicyScenario, "id" | "createdDate">,
    actor: { name: string; email: string; roleCode: string }
  ): SharedPolicyScenario | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const newScenario: SharedPolicyScenario = {
      ...scenario,
      id: `sh-scn-${Date.now().toString(36)}`,
      status: "Illustrative Model Output",
      createdDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };

    project.scenarios.push(newScenario);
    project.lastUpdated = "Just now";

    project.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      type: "SCENARIO_ASSOCIATED",
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.roleCode,
      description: `Associated policy digital twin scenario '${newScenario.name}'`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return newScenario;
  }

  addComment(
    projectId: string,
    content: string,
    author: { name: string; email: string; roleCode: string },
    parentId?: string
  ): ProjectComment | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const newComment: ProjectComment = {
      id: `cmt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      authorName: author.name,
      authorEmail: author.email,
      authorRole: author.roleCode,
      content,
      parentId,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    project.comments.push(newComment);
    project.lastUpdated = "Just now";

    project.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      type: "COMMENT_ADDED",
      actorName: author.name,
      actorEmail: author.email,
      actorRole: author.roleCode,
      description: `Added comment: "${content.substring(0, 45)}${content.length > 45 ? "..." : ""}"`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return newComment;
  }

  deleteComment(projectId: string, commentId: string, userEmail: string, userRole: string): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;

    const commentIdx = project.comments.findIndex((c) => c.id === commentId);
    if (commentIdx === -1) return false;

    const comment = project.comments[commentIdx];
    if (
      comment.authorEmail.toLowerCase() === userEmail.toLowerCase() ||
      project.ownerEmail.toLowerCase() === userEmail.toLowerCase() ||
      userRole === "ADMIN"
    ) {
      project.comments.splice(commentIdx, 1);
      return true;
    }

    return false;
  }

  associateReport(projectId: string, reportId: string, actor: { name: string; email: string; roleCode: string }): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;

    if (!project.associatedReportIds.includes(reportId)) {
      project.associatedReportIds.push(reportId);
      project.activities.unshift({
        id: `act-${Date.now().toString(36)}`,
        type: "REPORT_GENERATED",
        actorName: actor.name,
        actorEmail: actor.email,
        actorRole: actor.roleCode,
        description: `Linked policy brief report '${reportId}' to project`,
        timestamp: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      return true;
    }
    return false;
  }

  canUserAccessProject(project: CollaborativeProject, userEmail: string, roleCode: string): boolean {
    if (roleCode === "ADMIN") return true;
    if (project.ownerEmail.toLowerCase() === userEmail.toLowerCase()) return true;
    return project.members.some(
      (m) => m.email.toLowerCase() === userEmail.toLowerCase() && m.status === "ACTIVE"
    );
  }

  getUserRoleInProject(
    project: CollaborativeProject,
    userEmail: string,
    roleCode: string
  ): { projectRole: ProjectRole; permission: ProjectPermission } {
    if (project.ownerEmail.toLowerCase() === userEmail.toLowerCase() || roleCode === "ADMIN") {
      return { projectRole: "OWNER", permission: "admin" };
    }
    const member = project.members.find(
      (m) => m.email.toLowerCase() === userEmail.toLowerCase() && m.status === "ACTIVE"
    );
    if (member) {
      return { projectRole: member.projectRole, permission: member.projectPermission };
    }
    return { projectRole: "VIEWER", permission: "read" };
  }
}

// Global persistent instance across API routes
export const collaborationStore = new CollaborationStore();
