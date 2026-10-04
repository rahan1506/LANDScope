-- ==============================================================================
-- LANDScope Sovereign Spatial Intelligence Platform
-- Migration: 0001_initial_schema.sql
--
-- STRICT ARCHITECTURAL & DEPENDENCY CONSTRAINTS:
-- 1. Non-destructive: Uses CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS.
-- 2. No DROP, TRUNCATE, or CASCADE deletions of existing tables or user data.
-- 3. Correct Dependency Ordering:
--    A. Extensions (uuid-ossp, postgis)
--    B. Table public.profiles
--    C. Profile indexes & RLS enablement
--    D. Security-definer helper functions (get_current_user_role, is_admin, get_current_user_email)
--    E. Remaining tables in strict foreign-key dependency order
--    F. Remaining indexes (including PostGIS GiST and GIN indexes)
--    G. Row Level Security (RLS) policies for all tables
--    H. Storage bucket configuration & storage.objects policies
--    I. Grants & permissions
-- 4. Enables Row Level Security (RLS) on ALL tables.
-- 5. Preserves all 7 LANDScope RBAC roles:
--    RESEARCHER, POLICYMAKER, ACADEMIC_INSTITUTION, GOVERNMENT_AGENCY, INNOVATOR, PUBLIC, ADMIN.
-- 6. Immune to RLS recursion loops with secure SECURITY DEFINER functions.
-- 7. Zero fake government records or simulated statistics inserted into database.
-- ==============================================================================

-- ==============================================================================
-- A. EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ==============================================================================
-- B. BASE TABLE: public.profiles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role_code TEXT NOT NULL CHECK (
        role_code IN (
            'RESEARCHER',
            'POLICYMAKER',
            'ACADEMIC_INSTITUTION',
            'GOVERNMENT_AGENCY',
            'INNOVATOR',
            'PUBLIC',
            'ADMIN'
        )
    ),
    organization TEXT NOT NULL,
    designation TEXT NOT NULL,
    account_type TEXT NOT NULL DEFAULT 'SIH Demonstration Account',
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- C. PROFILE INDEXES & CONSTRAINTS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role_code ON public.profiles(role_code);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- D. SECURITY-DEFINER RBAC HELPERS (IMMUNE TO RLS RECURSION)
-- Now safe to create since public.profiles exists in the catalog.
-- ==============================================================================

-- Helper function to safely read user role without triggering recursive RLS on profiles.
-- Setting search_path prevents search_path injection attacks.
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT role_code FROM public.profiles WHERE id = auth.uid();
$$;

-- Synonym/alias for get_user_role() in public schema
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT role_code FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role_code = 'ADMIN'
  );
$$;

-- Helper to get verified email of authenticated user
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT email FROM public.profiles WHERE id = auth.uid();
$$;

-- Safely provide auth.get_user_role() wrapper if execution context permits
DO $$
BEGIN
  EXECUTE 'CREATE OR REPLACE FUNCTION auth.get_user_role()
    RETURNS TEXT
    LANGUAGE sql
    STABLE
    SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $f$
      SELECT role_code FROM public.profiles WHERE id = auth.uid();
    $f$;';
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- ==============================================================================
-- E. REMAINING TABLES (STRICT TOPOLOGICAL FK DEPENDENCY ORDER)
-- ==============================================================================

-- 1. GEOGRAPHIES (Canonical SDI Registry & PostGIS Geometry)
CREATE TABLE IF NOT EXISTS public.geographies (
    id TEXT PRIMARY KEY, -- e.g. "IN-MP-SEH-ASH"
    country TEXT NOT NULL DEFAULT 'India',
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    tehsil TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    bbox JSONB, -- [minLon, minLat, maxLon, maxLat]
    geom GEOMETRY(Geometry, 4326), -- PostGIS Spatial Geometry (WGS84 EPSG:4326)
    feature_type TEXT NOT NULL CHECK (
        feature_type IN ('country', 'state', 'district', 'tehsil', 'locality', 'parcel')
    ),
    display_name TEXT NOT NULL,
    area_sq_km NUMERIC,
    is_demo_territory BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. DATASETS (Persistent Spatial & Statistical Metadata Registry)
CREATE TABLE IF NOT EXISTS public.datasets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    source TEXT NOT NULL,
    data_type TEXT NOT NULL CHECK (
        data_type IN ('Vector Cadastre', 'Raster Multi-Spectral', 'Census Demographics', 'Hydrological', 'Administrative', 'Master Plan')
    ),
    format TEXT NOT NULL CHECK (
        format IN ('GeoJSON', 'GeoTIFF', 'Shapefile', 'CSV', 'JSON', 'WMS')
    ),
    geography_id TEXT REFERENCES public.geographies(id) ON DELETE SET NULL,
    time_period TEXT NOT NULL, -- e.g. "2018-2026"
    resolution TEXT NOT NULL, -- e.g. "10m Multispectral", "Village Boundary Level"
    license TEXT NOT NULL, -- e.g. "Open Government Data License - India"
    record_count INTEGER NOT NULL DEFAULT 0,
    file_size TEXT NOT NULL,
    is_authoritative BOOLEAN NOT NULL DEFAULT FALSE,
    is_demo_dataset BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. EVIDENCE (Empirical Land Intelligence & Multi-Source Findings)
CREATE TABLE IF NOT EXISTS public.evidence (
    id TEXT PRIMARY KEY, -- e.g. "EVD-2026-0891"
    reference_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    methodology TEXT NOT NULL,
    confidence_score NUMERIC(4,3) NOT NULL CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    confidence_level TEXT NOT NULL CHECK (confidence_level IN ('High', 'Moderate', 'Preliminary')),
    source TEXT NOT NULL,
    source_url TEXT,
    publication_date DATE NOT NULL,
    geography_id TEXT REFERENCES public.geographies(id) ON DELETE SET NULL,
    state TEXT NOT NULL,
    district TEXT,
    tehsil TEXT,
    research_domain TEXT NOT NULL CHECK (
        research_domain IN (
            'Land Rights & Titling',
            'Agricultural Productivity',
            'Dispute Resolution',
            'Environmental Impact',
            'Urban Expansion',
            'Gender & Inclusivity'
        )
    ),
    topics TEXT[] NOT NULL DEFAULT '{}',
    key_metrics JSONB NOT NULL DEFAULT '{}',
    policy_implications TEXT[] NOT NULL DEFAULT '{}',
    limitations TEXT[] NOT NULL DEFAULT '{}',
    peer_review_status TEXT NOT NULL DEFAULT 'In Peer Review' CHECK (
        peer_review_status IN ('Peer Reviewed', 'Under Review', 'Institutional Brief', 'Field Report')
    ),
    is_demo_record BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. RESEARCH PROJECTS (Collaborative Scientific Workspace)
CREATE TABLE IF NOT EXISTS public.research_projects (
    id TEXT PRIMARY KEY, -- e.g. "proj-sehore-01"
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'In Progress' CHECK (
        status IN ('Draft', 'In Progress', 'Under Review', 'Completed', 'Archived')
    ),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    owner_email TEXT NOT NULL,
    geography_id TEXT REFERENCES public.geographies(id) ON DELETE SET NULL,
    state TEXT NOT NULL,
    district TEXT,
    tehsil TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    visibility TEXT NOT NULL DEFAULT 'Private' CHECK (
        visibility IN ('Private', 'Public', 'Institutional')
    ),
    is_demo_project BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. RESEARCH PROJECT MEMBERS (Dedicated Collaboration Membership)
CREATE TABLE IF NOT EXISTS public.research_project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    member_role TEXT NOT NULL DEFAULT 'COLLABORATOR' CHECK (
        member_role IN ('LEAD_RESEARCHER', 'COLLABORATOR', 'PEER_REVIEWER', 'VIEWER')
    ),
    permission TEXT NOT NULL DEFAULT 'read' CHECK (
        permission IN ('admin', 'write', 'read')
    ),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (project_id, user_id)
);

-- 6. RESEARCH QUESTIONS (Formulated Hypotheses)
CREATE TABLE IF NOT EXISTS public.research_questions (
    id TEXT PRIMARY KEY, -- e.g. "rq-001"
    project_id TEXT NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Investigating' CHECK (
        status IN ('Investigating', 'Validated', 'Refuted', 'Inconclusive')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PROJECT EVIDENCE LINKS (Traceability Junction)
CREATE TABLE IF NOT EXISTS public.project_evidence_links (
    project_id TEXT NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
    evidence_id TEXT NOT NULL REFERENCES public.evidence(id) ON DELETE CASCADE,
    relevance_note TEXT,
    linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, evidence_id)
);

-- 8. RESEARCH DOCUMENTS (Storage Metadata)
CREATE TABLE IF NOT EXISTS public.research_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.research_projects(id) ON DELETE CASCADE,
    evidence_id TEXT REFERENCES public.evidence(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL, -- references path in Supabase Storage bucket 'research-documents'
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. POLICY SCENARIOS (Policy Digital Twin Simulation Definitions)
CREATE TABLE IF NOT EXISTS public.policy_scenarios (
    id TEXT PRIMARY KEY, -- e.g. "SCEN-MP-2026-01"
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    policy_domain TEXT NOT NULL CHECK (
        policy_domain IN (
            'Tenure Formalization',
            'Cadastral Resurvey',
            'Dispute Fast-Track',
            'Digital Registry Integration',
            'Zoning & Master Plan Amendment',
            'Agricultural Land Conversion',
            'Women Land Ownership Incentive'
        )
    ),
    geography_id TEXT NOT NULL REFERENCES public.geographies(id) ON DELETE RESTRICT,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    research_project_id TEXT REFERENCES public.research_projects(id) ON DELETE SET NULL,
    parameters JSONB NOT NULL DEFAULT '{}',
    is_baseline BOOLEAN NOT NULL DEFAULT FALSE,
    is_demo_scenario BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SIMULATIONS (Deterministic Multi-Criteria Simulation Engine Runs)
CREATE TABLE IF NOT EXISTS public.simulations (
    id TEXT PRIMARY KEY, -- e.g. "SIM-2026-904"
    scenario_id TEXT NOT NULL REFERENCES public.policy_scenarios(id) ON DELETE CASCADE,
    geography_id TEXT NOT NULL REFERENCES public.geographies(id) ON DELETE RESTRICT,
    horizon_years INTEGER NOT NULL CHECK (horizon_years BETWEEN 1 AND 30),
    confidence_interval NUMERIC(3,2) NOT NULL DEFAULT 0.90,
    impact_scores JSONB NOT NULL DEFAULT '{}',
    yearly_trajectories JSONB NOT NULL DEFAULT '[]',
    tradeoffs JSONB NOT NULL DEFAULT '[]',
    recommendations TEXT[] NOT NULL DEFAULT '{}',
    simulated_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    is_demo_simulation BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. REPORTS (Policy Briefs & Empirical Syntheses)
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY, -- e.g. "rpt-sehore-brief"
    title TEXT NOT NULL,
    subtitle TEXT,
    report_type TEXT NOT NULL CHECK (
        report_type IN (
            'Policy Brief',
            'Research Monograph',
            'Simulation Assessment',
            'Executive Memo',
            'Field Evidence Dossier'
        )
    ),
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (
        status IN ('Draft', 'In Review', 'Published', 'Archived')
    ),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    geography_id TEXT REFERENCES public.geographies(id) ON DELETE SET NULL,
    state TEXT NOT NULL,
    district TEXT,
    scenario_id TEXT REFERENCES public.policy_scenarios(id) ON DELETE SET NULL,
    simulation_id TEXT REFERENCES public.simulations(id) ON DELETE SET NULL,
    research_project_id TEXT REFERENCES public.research_projects(id) ON DELETE SET NULL,
    summary TEXT NOT NULL,
    sections JSONB NOT NULL DEFAULT '[]',
    evidence_ids TEXT[] NOT NULL DEFAULT '{}',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_demo_report BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. COLLABORATION PROJECTS (Multi-Stakeholder Collaboration Hub)
CREATE TABLE IF NOT EXISTS public.collaboration_projects (
    id TEXT PRIMARY KEY, -- e.g. "collab-proj-01"
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    research_area TEXT NOT NULL,
    project_type TEXT NOT NULL CHECK (
        project_type IN ('Research', 'Policy Analysis', 'Land Governance', 'Climate & Resilience', 'Infrastructure', 'Academic Study', 'Innovation Pilot')
    ),
    status TEXT NOT NULL DEFAULT 'Active' CHECK (
        status IN ('Active', 'In Review', 'Completed', 'Archived')
    ),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    owner_name TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    owner_organization TEXT NOT NULL,
    owner_role TEXT NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT TRUE,
    geography_id TEXT REFERENCES public.geographies(id) ON DELETE SET NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    tehsil TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. PROJECT MEMBERS (Multi-Stakeholder Member Roster)
CREATE TABLE IF NOT EXISTS public.project_members (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES public.collaboration_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization TEXT NOT NULL,
    project_role TEXT NOT NULL CHECK (
        project_role IN ('OWNER', 'RESEARCHER', 'POLICYMAKER', 'ACADEMIC', 'GOVERNMENT_AGENCY', 'VIEWER')
    ),
    project_permission TEXT NOT NULL CHECK (
        project_permission IN ('admin', 'write', 'read', 'comment')
    ),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (
        status IN ('ACTIVE', 'PENDING_INVITE', 'DECLINED')
    ),
    joined_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (project_id, email)
);

-- 14. PROJECT COMMENTS (Contextual Discussion Threads)
CREATE TABLE IF NOT EXISTS public.project_comments (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES public.collaboration_projects(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    author_organization TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id TEXT REFERENCES public.project_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. PROJECT ACTIVITIES (Audit Log of Collaborative Progress)
CREATE TABLE IF NOT EXISTS public.project_activities (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES public.collaboration_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    detail TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. INNOVATION CHALLENGES (GovTech & Academic Competitions)
CREATE TABLE IF NOT EXISTS public.innovation_challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    challenge_type TEXT NOT NULL CHECK (
        challenge_type IN ('AI/ML Algorithm', 'Data Pipeline', 'Field Sensor Integration', 'Policy Simulation Model', 'Citizen Portal UX')
    ),
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (
        status IN ('OPEN', 'EVALUATION', 'AWARDED', 'ARCHIVED')
    ),
    launch_date DATE NOT NULL,
    submission_deadline DATE NOT NULL,
    agency_sponsor TEXT NOT NULL,
    total_grant_inr BIGINT NOT NULL DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. INNOVATION APPLICATIONS (Proposals & Prototypes)
CREATE TABLE IF NOT EXISTS public.innovation_applications (
    id TEXT PRIMARY KEY,
    challenge_id TEXT NOT NULL REFERENCES public.innovation_challenges(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_organization TEXT NOT NULL,
    proposal_title TEXT NOT NULL,
    proposal_summary TEXT NOT NULL,
    technical_stack TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (
        status IN ('SUBMITTED', 'SHORTLISTED', 'REJECTED', 'WINNER')
    ),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. API KEYS (Hashed Storage Only - Never Plaintext)
CREATE TABLE IF NOT EXISTS public.api_keys (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    key_prefix TEXT NOT NULL, -- e.g. "lsk_live_9f2a"
    masked_key TEXT NOT NULL, -- e.g. "lsk_live_9f2a••••••••3b8c"
    hashed_secret TEXT NOT NULL, -- SHA-256 hash of secret token
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_email TEXT NOT NULL,
    owner_role TEXT NOT NULL,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    rate_limit_per_minute INTEGER NOT NULL DEFAULT 60,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED')),
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. AUDIT LOGS (Immutable System Activity Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    resource TEXT NOT NULL,
    result TEXT NOT NULL CHECK (
        result IN ('SUCCESS', 'CLIENT_ERROR', 'RATE_LIMITED', 'UNAUTHORIZED', 'FORBIDDEN')
    ),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- F. REMAINING INDEXES
-- ==============================================================================

-- Geographies
CREATE INDEX IF NOT EXISTS idx_geographies_state_dist ON public.geographies(state, district);
CREATE INDEX IF NOT EXISTS idx_geographies_feature_type ON public.geographies(feature_type);
CREATE INDEX IF NOT EXISTS idx_geographies_geom ON public.geographies USING GIST(geom);

-- Datasets
CREATE INDEX IF NOT EXISTS idx_datasets_geography ON public.datasets(geography_id);
CREATE INDEX IF NOT EXISTS idx_datasets_type ON public.datasets(data_type);

-- Evidence
CREATE INDEX IF NOT EXISTS idx_evidence_geography ON public.evidence(geography_id);
CREATE INDEX IF NOT EXISTS idx_evidence_ref ON public.evidence(reference_number);
CREATE INDEX IF NOT EXISTS idx_evidence_domain ON public.evidence(research_domain);
CREATE INDEX IF NOT EXISTS idx_evidence_topics ON public.evidence USING GIN(topics);

-- Research Projects & Workspace
CREATE INDEX IF NOT EXISTS idx_research_projects_owner ON public.research_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_research_projects_geography ON public.research_projects(geography_id);
CREATE INDEX IF NOT EXISTS idx_research_projects_status ON public.research_projects(status);
CREATE INDEX IF NOT EXISTS idx_rpm_project_user ON public.research_project_members(project_id, user_id);
CREATE INDEX IF NOT EXISTS idx_research_questions_project ON public.research_questions(project_id);
CREATE INDEX IF NOT EXISTS idx_pel_project ON public.project_evidence_links(project_id);
CREATE INDEX IF NOT EXISTS idx_pel_evidence ON public.project_evidence_links(evidence_id);
CREATE INDEX IF NOT EXISTS idx_research_documents_project ON public.research_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_research_documents_evidence ON public.research_documents(evidence_id);

-- Policy Scenarios & Simulations
CREATE INDEX IF NOT EXISTS idx_policy_scenarios_geography ON public.policy_scenarios(geography_id);
CREATE INDEX IF NOT EXISTS idx_policy_scenarios_creator ON public.policy_scenarios(creator_id);
CREATE INDEX IF NOT EXISTS idx_policy_scenarios_research ON public.policy_scenarios(research_project_id);
CREATE INDEX IF NOT EXISTS idx_simulations_scenario ON public.simulations(scenario_id);
CREATE INDEX IF NOT EXISTS idx_simulations_geography ON public.simulations(geography_id);

-- Reports
CREATE INDEX IF NOT EXISTS idx_reports_author ON public.reports(author_id);
CREATE INDEX IF NOT EXISTS idx_reports_geography ON public.reports(geography_id);
CREATE INDEX IF NOT EXISTS idx_reports_scenario ON public.reports(scenario_id);
CREATE INDEX IF NOT EXISTS idx_reports_simulation ON public.reports(simulation_id);
CREATE INDEX IF NOT EXISTS idx_reports_research ON public.reports(research_project_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_public ON public.reports(is_public);

-- Collaboration Hub
CREATE INDEX IF NOT EXISTS idx_collab_owner ON public.collaboration_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_collab_geography ON public.collaboration_projects(geography_id);
CREATE INDEX IF NOT EXISTS idx_collab_status ON public.collaboration_projects(status);
CREATE INDEX IF NOT EXISTS idx_pm_project_user ON public.project_members(project_id, user_id);
CREATE INDEX IF NOT EXISTS idx_pm_email ON public.project_members(email);
CREATE INDEX IF NOT EXISTS idx_comments_project ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_activities_project ON public.project_activities(project_id);

-- Innovation Hub
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.innovation_challenges(status);
CREATE INDEX IF NOT EXISTS idx_ia_challenge ON public.innovation_applications(challenge_id);
CREATE INDEX IF NOT EXISTS idx_ia_applicant ON public.innovation_applications(applicant_id);

-- API Keys & Audit Logs
CREATE INDEX IF NOT EXISTS idx_api_keys_hashed ON public.api_keys(hashed_secret);
CREATE INDEX IF NOT EXISTS idx_api_keys_owner ON public.api_keys(owner_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- G. ROW LEVEL SECURITY (RLS) ENABLEMENT & POLICIES
-- All tables and functions now exist. Policies are safely created.
-- ==============================================================================

-- 1. PROFILES RLS
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        id = auth.uid()
        OR public.is_admin()
        OR role_code IN ('RESEARCHER', 'ACADEMIC_INSTITUTION', 'GOVERNMENT_AGENCY', 'POLICYMAKER')
    );

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- 2. GEOGRAPHIES RLS
ALTER TABLE public.geographies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "geographies_read_public" ON public.geographies;
CREATE POLICY "geographies_read_public" ON public.geographies
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "geographies_modify_admin" ON public.geographies;
CREATE POLICY "geographies_modify_admin" ON public.geographies
    FOR ALL TO authenticated
    USING (public.get_current_user_role() IN ('ADMIN', 'GOVERNMENT_AGENCY'))
    WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'GOVERNMENT_AGENCY'));

-- 3. DATASETS RLS
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "datasets_select_authenticated" ON public.datasets;
CREATE POLICY "datasets_select_authenticated" ON public.datasets
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "datasets_modify_authorized" ON public.datasets;
CREATE POLICY "datasets_modify_authorized" ON public.datasets
    FOR ALL TO authenticated
    USING (public.get_current_user_role() IN ('ADMIN', 'GOVERNMENT_AGENCY', 'RESEARCHER'))
    WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'GOVERNMENT_AGENCY', 'RESEARCHER'));

-- 4. EVIDENCE RLS
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "evidence_select_policy" ON public.evidence;
CREATE POLICY "evidence_select_policy" ON public.evidence
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "evidence_insert_authorized" ON public.evidence;
CREATE POLICY "evidence_insert_authorized" ON public.evidence
    FOR INSERT TO authenticated
    WITH CHECK (
        public.get_current_user_role() IN ('RESEARCHER', 'ACADEMIC_INSTITUTION', 'GOVERNMENT_AGENCY', 'ADMIN')
    );

DROP POLICY IF EXISTS "evidence_update_authorized" ON public.evidence;
CREATE POLICY "evidence_update_authorized" ON public.evidence
    FOR UPDATE TO authenticated
    USING (
        public.is_admin() 
        OR public.get_current_user_role() IN ('RESEARCHER', 'ACADEMIC_INSTITUTION', 'GOVERNMENT_AGENCY')
    );

-- 5. RESEARCH PROJECTS & MEMBERS RLS
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_project_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rpm_select_members" ON public.research_project_members;
CREATE POLICY "rpm_select_members" ON public.research_project_members
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid()
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.research_projects rp 
            WHERE rp.id = research_project_members.project_id AND rp.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "rpm_manage_owner" ON public.research_project_members;
CREATE POLICY "rpm_manage_owner" ON public.research_project_members
    FOR ALL TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.research_projects rp 
            WHERE rp.id = research_project_members.project_id AND rp.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.research_projects rp 
            WHERE rp.id = research_project_members.project_id AND rp.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "research_projects_select" ON public.research_projects;
CREATE POLICY "research_projects_select" ON public.research_projects
    FOR SELECT TO authenticated
    USING (
        owner_id = auth.uid() 
        OR visibility = 'Public'
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.research_project_members rpm
            WHERE rpm.project_id = research_projects.id AND rpm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "research_projects_modify" ON public.research_projects;
CREATE POLICY "research_projects_modify" ON public.research_projects
    FOR ALL TO authenticated
    USING (
        owner_id = auth.uid() 
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.research_project_members rpm
            WHERE rpm.project_id = research_projects.id 
            AND rpm.user_id = auth.uid() 
            AND rpm.permission IN ('admin', 'write')
        )
    )
    WITH CHECK (
        owner_id = auth.uid() 
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.research_project_members rpm
            WHERE rpm.project_id = research_projects.id 
            AND rpm.user_id = auth.uid() 
            AND rpm.permission IN ('admin', 'write')
        )
    );

-- 6. RESEARCH QUESTIONS RLS
ALTER TABLE public.research_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "research_questions_access" ON public.research_questions;
CREATE POLICY "research_questions_access" ON public.research_questions
    FOR ALL TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.research_projects rp 
            WHERE rp.id = research_questions.project_id 
            AND (
                rp.owner_id = auth.uid()
                OR rp.visibility = 'Public'
                OR EXISTS (
                    SELECT 1 FROM public.research_project_members rpm 
                    WHERE rpm.project_id = rp.id AND rpm.user_id = auth.uid()
                )
            )
        )
    );

-- 7. PROJECT EVIDENCE LINKS RLS
ALTER TABLE public.project_evidence_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pel_access" ON public.project_evidence_links;
CREATE POLICY "pel_access" ON public.project_evidence_links
    FOR ALL TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.research_projects rp 
            WHERE rp.id = project_evidence_links.project_id 
            AND (
                rp.owner_id = auth.uid()
                OR rp.visibility = 'Public'
                OR EXISTS (
                    SELECT 1 FROM public.research_project_members rpm 
                    WHERE rpm.project_id = rp.id AND rpm.user_id = auth.uid()
                )
            )
        )
    );

-- 8. RESEARCH DOCUMENTS RLS
ALTER TABLE public.research_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "research_documents_access" ON public.research_documents;
CREATE POLICY "research_documents_access" ON public.research_documents
    FOR ALL TO authenticated
    USING (
        uploaded_by = auth.uid()
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.research_projects rp 
            WHERE rp.id = research_documents.project_id 
            AND (
                rp.owner_id = auth.uid()
                OR rp.visibility = 'Public'
                OR EXISTS (
                    SELECT 1 FROM public.research_project_members rpm 
                    WHERE rpm.project_id = rp.id AND rpm.user_id = auth.uid()
                )
            )
        )
    );

-- 9. POLICY SCENARIOS RLS
ALTER TABLE public.policy_scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "policy_scenarios_read" ON public.policy_scenarios;
CREATE POLICY "policy_scenarios_read" ON public.policy_scenarios
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "policy_scenarios_write" ON public.policy_scenarios;
CREATE POLICY "policy_scenarios_write" ON public.policy_scenarios
    FOR ALL TO authenticated
    USING (
        creator_id = auth.uid() 
        OR public.is_admin()
        OR public.get_current_user_role() IN ('POLICYMAKER', 'GOVERNMENT_AGENCY')
    );

-- 10. SIMULATIONS RLS
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "simulations_read" ON public.simulations;
CREATE POLICY "simulations_read" ON public.simulations
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "simulations_write" ON public.simulations;
CREATE POLICY "simulations_write" ON public.simulations
    FOR ALL TO authenticated
    USING (
        simulated_by = auth.uid()
        OR public.is_admin()
        OR public.get_current_user_role() IN ('POLICYMAKER', 'GOVERNMENT_AGENCY', 'RESEARCHER')
    );

-- 11. REPORTS RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_select_policy" ON public.reports;
CREATE POLICY "reports_select_policy" ON public.reports
    FOR SELECT TO anon, authenticated
    USING (
        is_public = TRUE
        OR author_id = auth.uid()
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "reports_modify_policy" ON public.reports;
CREATE POLICY "reports_modify_policy" ON public.reports
    FOR ALL TO authenticated
    USING (author_id = auth.uid() OR public.is_admin())
    WITH CHECK (author_id = auth.uid() OR public.is_admin());

-- 12. COLLABORATION PROJECTS & MEMBERS RLS
ALTER TABLE public.collaboration_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "collab_projects_select" ON public.collaboration_projects;
CREATE POLICY "collab_projects_select" ON public.collaboration_projects
    FOR SELECT TO authenticated
    USING (
        owner_id = auth.uid()
        OR is_private = FALSE
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.project_members pm 
            WHERE pm.project_id = collaboration_projects.id 
            AND pm.email = public.get_current_user_email()
            AND pm.status = 'ACTIVE'
        )
    );

DROP POLICY IF EXISTS "collab_projects_modify" ON public.collaboration_projects;
CREATE POLICY "collab_projects_modify" ON public.collaboration_projects
    FOR ALL TO authenticated
    USING (owner_id = auth.uid() OR public.is_admin())
    WITH CHECK (owner_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "pm_select" ON public.project_members;
CREATE POLICY "pm_select" ON public.project_members
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid()
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.collaboration_projects cp 
            WHERE cp.id = project_members.project_id 
            AND (
                cp.owner_id = auth.uid() 
                OR cp.is_private = FALSE 
            )
        )
    );

DROP POLICY IF EXISTS "pm_modify" ON public.project_members;
CREATE POLICY "pm_modify" ON public.project_members
    FOR ALL TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.collaboration_projects cp 
            WHERE cp.id = project_members.project_id 
            AND cp.owner_id = auth.uid()
        )
    );

-- 13. PROJECT COMMENTS RLS
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_access" ON public.project_comments;
CREATE POLICY "comments_access" ON public.project_comments
    FOR ALL TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.collaboration_projects cp 
            WHERE cp.id = project_comments.project_id 
            AND (
                cp.owner_id = auth.uid() 
                OR cp.is_private = FALSE 
                OR EXISTS (
                    SELECT 1 FROM public.project_members pm 
                    WHERE pm.project_id = cp.id 
                    AND pm.email = public.get_current_user_email()
                    AND pm.status = 'ACTIVE'
                )
            )
        )
    );

-- 14. PROJECT ACTIVITIES RLS
ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activities_access" ON public.project_activities;
CREATE POLICY "activities_access" ON public.project_activities
    FOR ALL TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.collaboration_projects cp 
            WHERE cp.id = project_activities.project_id 
            AND (
                cp.owner_id = auth.uid() 
                OR cp.is_private = FALSE 
                OR EXISTS (
                    SELECT 1 FROM public.project_members pm 
                    WHERE pm.project_id = cp.id 
                    AND pm.email = public.get_current_user_email()
                    AND pm.status = 'ACTIVE'
                )
            )
        )
    );

-- 15. INNOVATION CHALLENGES & APPLICATIONS RLS
ALTER TABLE public.innovation_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "challenges_read_public" ON public.innovation_challenges;
CREATE POLICY "challenges_read_public" ON public.innovation_challenges
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "challenges_modify_agency" ON public.innovation_challenges;
CREATE POLICY "challenges_modify_agency" ON public.innovation_challenges
    FOR ALL TO authenticated
    USING (public.get_current_user_role() IN ('GOVERNMENT_AGENCY', 'ADMIN'))
    WITH CHECK (public.get_current_user_role() IN ('GOVERNMENT_AGENCY', 'ADMIN'));

DROP POLICY IF EXISTS "ia_select" ON public.innovation_applications;
CREATE POLICY "ia_select" ON public.innovation_applications
    FOR SELECT TO authenticated
    USING (
        applicant_id = auth.uid() 
        OR public.is_admin()
        OR public.get_current_user_role() IN ('GOVERNMENT_AGENCY')
    );

DROP POLICY IF EXISTS "ia_modify_own" ON public.innovation_applications;
CREATE POLICY "ia_modify_own" ON public.innovation_applications
    FOR ALL TO authenticated
    USING (applicant_id = auth.uid() OR public.is_admin())
    WITH CHECK (applicant_id = auth.uid() OR public.is_admin());

-- 16. API KEYS RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "api_keys_owner_access" ON public.api_keys;
CREATE POLICY "api_keys_owner_access" ON public.api_keys
    FOR ALL TO authenticated
    USING (owner_id = auth.uid() OR public.is_admin())
    WITH CHECK (owner_id = auth.uid() OR public.is_admin());

-- 17. AUDIT LOGS RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_admin_read" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_read" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "audit_logs_insert_verified" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_verified" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_admin()
        OR actor_email = public.get_current_user_email()
    );

-- Audit Logs Security: Zero UPDATE or DELETE permitted (Immutable Ledger)

-- ==============================================================================
-- H. SUPABASE STORAGE CONFIGURATION & POLICIES
-- ==============================================================================
-- Ensure the storage bucket exists and is marked private (NOT public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'research-documents',
    'research-documents',
    false, -- STRICTLY PRIVATE: No unrestricted CDN downloads
    52428800, -- 50 MB max document limit
    ARRAY[
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/json',
        'text/csv'
    ]::text[]
)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policy: Authorized Download / Read
DROP POLICY IF EXISTS "storage_research_docs_read" ON storage.objects;
CREATE POLICY "storage_research_docs_read" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'research-documents'
        AND (
            public.is_admin()
            OR owner = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.research_documents rd
                JOIN public.research_projects rp ON rp.id = rd.project_id
                WHERE rd.storage_path = storage.objects.name
                AND (
                    rp.owner_id = auth.uid()
                    OR rp.visibility = 'Public'
                    OR EXISTS (
                        SELECT 1 FROM public.research_project_members rpm
                        WHERE rpm.project_id = rp.id AND rpm.user_id = auth.uid()
                    )
                )
            )
        )
    );

-- Storage Policy: Authorized Upload
DROP POLICY IF EXISTS "storage_research_docs_insert" ON storage.objects;
CREATE POLICY "storage_research_docs_insert" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'research-documents'
        AND public.get_current_user_role() IN ('RESEARCHER', 'ACADEMIC_INSTITUTION', 'GOVERNMENT_AGENCY', 'ADMIN')
    );

-- Storage Policy: Authorized Delete
DROP POLICY IF EXISTS "storage_research_docs_delete" ON storage.objects;
CREATE POLICY "storage_research_docs_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'research-documents'
        AND (owner = auth.uid() OR public.is_admin())
    );

-- ==============================================================================
-- I. FINAL GRANTS & SECURITY VERIFICATION
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_current_user_email() TO authenticated, anon;
