-- ==============================================================================
-- LANDScope Sovereign Spatial Intelligence Platform
-- Migration: 0003_land_governance.sql
--
-- Adds tables for:
-- 1. Cadastral parcels & ULPIN registration
-- 2. Revenue mutation records
-- 3. Temporal satellite change detections (NDVI / NDBI)
-- 4. Land governance risk alerts & discrepancies
-- 5. Land governance cases & lifecycle tracking
-- 6. Evidence dossiers with SHA-256 integrity seal
-- 7. Bhu-Mitra offline field observations & ground photos
-- ==============================================================================

-- 1. CADASTRAL PARCELS
CREATE TABLE IF NOT EXISTS public.cadastral_parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ulpin TEXT UNIQUE NOT NULL,
    survey_number TEXT NOT NULL,
    village TEXT NOT NULL,
    taluk TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    registered_area_ha NUMERIC(10, 4) NOT NULL,
    land_use_classification TEXT NOT NULL,
    registration_date DATE NOT NULL,
    last_mutation_date DATE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    boundary_geojson JSONB,
    boundary_geom GEOMETRY(Polygon, 4326),
    is_demo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parcels_ulpin ON public.cadastral_parcels(ulpin);
CREATE INDEX IF NOT EXISTS idx_parcels_district_taluk ON public.cadastral_parcels(district, taluk);
CREATE INDEX IF NOT EXISTS idx_parcels_boundary_geom ON public.cadastral_parcels USING GIST(boundary_geom);

-- 2. REVENUE MUTATIONS
CREATE TABLE IF NOT EXISTS public.revenue_mutations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mutation_id TEXT UNIQUE NOT NULL,
    parcel_id UUID REFERENCES public.cadastral_parcels(id) ON DELETE CASCADE,
    ulpin TEXT NOT NULL,
    old_area_ha NUMERIC(10, 4) NOT NULL,
    new_area_ha NUMERIC(10, 4) NOT NULL,
    mutation_date DATE NOT NULL,
    mutation_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    source TEXT NOT NULL,
    registration_number TEXT,
    reference_number TEXT,
    old_owner TEXT NOT NULL,
    new_owner TEXT NOT NULL,
    remarks TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mutations_parcel_id ON public.revenue_mutations(parcel_id);
CREATE INDEX IF NOT EXISTS idx_mutations_ulpin ON public.revenue_mutations(ulpin);

-- 3. SATELLITE OBSERVATIONS & DETECTIONS
CREATE TABLE IF NOT EXISTS public.satellite_change_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES public.cadastral_parcels(id) ON DELETE CASCADE,
    detection_date TIMESTAMPTZ NOT NULL,
    change_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    confidence NUMERIC(4, 3) NOT NULL,
    description TEXT NOT NULL,
    ndvi_change NUMERIC(5, 3),
    ndbi_change NUMERIC(5, 3),
    vegetation_loss_pct NUMERIC(5, 2),
    built_up_expansion_pct NUMERIC(5, 2),
    waterbody_shrinkage_pct NUMERIC(5, 2),
    boundary_drift_meters NUMERIC(6, 2),
    new_structural_growth BOOLEAN DEFAULT false,
    area_affected_ha NUMERIC(10, 4),
    previous_image_date DATE,
    current_image_date DATE,
    is_demo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_change_detections_parcel ON public.satellite_change_detections(parcel_id);
CREATE INDEX IF NOT EXISTS idx_change_detections_severity ON public.satellite_change_detections(severity);

-- 4. RISK ALERTS
CREATE TABLE IF NOT EXISTS public.land_risk_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES public.cadastral_parcels(id) ON DELETE CASCADE,
    ulpin TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    evidence TEXT NOT NULL,
    confidence NUMERIC(4, 3) NOT NULL,
    category TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    is_acknowledged BOOLEAN NOT NULL DEFAULT false,
    acknowledged_by TEXT,
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_alerts_parcel ON public.land_risk_alerts(parcel_id);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_severity ON public.land_risk_alerts(severity);

-- 5. LAND GOVERNANCE CASES
CREATE TABLE IF NOT EXISTS public.land_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id TEXT UNIQUE NOT NULL,
    parcel_id UUID REFERENCES public.cadastral_parcels(id) ON DELETE CASCADE,
    ulpin TEXT NOT NULL,
    survey_number TEXT NOT NULL,
    village TEXT NOT NULL,
    taluk TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (
        status IN ('NEW', 'AI_FLAGGED', 'UNDER_REVIEW', 'FIELD_VERIFICATION', 'LEGAL_REVIEW', 'RESOLVED', 'DISMISSED')
    ),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    assigned_officer TEXT NOT NULL,
    assigned_officer_id TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cases_case_id ON public.land_cases(case_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.land_cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_risk_level ON public.land_cases(risk_level);

-- 6. EVIDENCE DOSSIERS
CREATE TABLE IF NOT EXISTS public.evidence_dossiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id TEXT NOT NULL REFERENCES public.land_cases(case_id) ON DELETE CASCADE,
    ulpin TEXT NOT NULL,
    integrity_hash TEXT NOT NULL,
    qr_code_svg TEXT NOT NULL,
    dossier_payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'finalized' CHECK (status IN ('draft', 'finalized', 'verified', 'disputed')),
    generated_by TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dossiers_case_id ON public.evidence_dossiers(case_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_hash ON public.evidence_dossiers(integrity_hash);

-- 7. BHU-MITRA FIELD OBSERVATIONS
CREATE TABLE IF NOT EXISTS public.field_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id TEXT NOT NULL,
    parcel_id UUID REFERENCES public.cadastral_parcels(id) ON DELETE CASCADE,
    observer_id TEXT NOT NULL,
    observer_name TEXT NOT NULL,
    observer_role TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    gps_accuracy NUMERIC(5, 2),
    compass_orientation NUMERIC(5, 2),
    boundary_points JSONB,
    observations TEXT NOT NULL,
    notes TEXT,
    photos JSONB DEFAULT '[]'::jsonb,
    sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('pending', 'synced', 'failed')),
    device_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_field_obs_case_id ON public.field_observations(case_id);
CREATE INDEX IF NOT EXISTS idx_field_obs_parcel_id ON public.field_observations(parcel_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.cadastral_parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_mutations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satellite_change_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_risk_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_observations ENABLE ROW LEVEL SECURITY;

-- POLICIES: Read access for authenticated users
CREATE POLICY "Allow authenticated read on cadastral_parcels"
    ON public.cadastral_parcels FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on revenue_mutations"
    ON public.revenue_mutations FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on satellite_change_detections"
    ON public.satellite_change_detections FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on land_risk_alerts"
    ON public.land_risk_alerts FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on land_cases"
    ON public.land_cases FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on evidence_dossiers"
    ON public.evidence_dossiers FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on field_observations"
    ON public.field_observations FOR SELECT
    TO authenticated USING (true);

-- Allow public verification of evidence dossiers via hash or caseId
CREATE POLICY "Allow public read on verified evidence_dossiers"
    ON public.evidence_dossiers FOR SELECT
    TO anon USING (true);
