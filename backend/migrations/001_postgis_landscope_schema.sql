-- ==============================================================================
-- LANDScope Sovereign Spatial Intelligence Platform
-- Migration: 001_postgis_landscope_schema.sql
-- Complete PostgreSQL + PostGIS database schema
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. ROLES & USERS
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT,
    role_code TEXT NOT NULL,
    organization TEXT NOT NULL,
    designation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_code ON users(role_code);

-- 3. CADASTRAL BOUNDARIES & PARCELS
CREATE TABLE IF NOT EXISTS cadastral_boundaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_number TEXT NOT NULL,
    village TEXT NOT NULL,
    taluk TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    boundary_geom GEOMETRY(MultiPolygon, 4326) NOT NULL,
    area_sq_meters NUMERIC(12, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cadastral_boundaries_geom ON cadastral_boundaries USING GIST(boundary_geom);

CREATE TABLE IF NOT EXISTS cadastral_parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ulpin TEXT UNIQUE NOT NULL,
    survey_number TEXT NOT NULL,
    village TEXT NOT NULL,
    taluk TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    registered_area_ha NUMERIC(10, 4) NOT NULL,
    observed_area_ha NUMERIC(10, 4),
    land_use_classification TEXT NOT NULL,
    registration_date DATE NOT NULL,
    last_mutation_date DATE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    centroid_geom GEOMETRY(Point, 4326),
    boundary_geojson JSONB,
    boundary_geom GEOMETRY(Polygon, 4326),
    is_demo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parcels_ulpin ON cadastral_parcels(ulpin);
CREATE INDEX IF NOT EXISTS idx_parcels_district ON cadastral_parcels(district);
CREATE INDEX IF NOT EXISTS idx_parcels_centroid ON cadastral_parcels USING GIST(centroid_geom);
CREATE INDEX IF NOT EXISTS idx_parcels_boundary ON cadastral_parcels USING GIST(boundary_geom);

-- 4. ULPIN RECORDS
CREATE TABLE IF NOT EXISTS ulpin_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ulpin TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    is_demo BOOLEAN NOT NULL DEFAULT true,
    survey_number TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    centroid_point GEOMETRY(Point, 4326),
    registered_area_ha NUMERIC(10, 4) NOT NULL,
    land_use TEXT NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ulpin_records_ulpin ON ulpin_records(ulpin);

-- 5. REVENUE MUTATIONS
CREATE TABLE IF NOT EXISTS revenue_mutations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mutation_id TEXT UNIQUE NOT NULL,
    parcel_id UUID REFERENCES cadastral_parcels(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_mutations_parcel_id ON revenue_mutations(parcel_id);
CREATE INDEX IF NOT EXISTS idx_mutations_ulpin ON revenue_mutations(ulpin);

-- 6. SATELLITE OBSERVATIONS & DETECTIONS
CREATE TABLE IF NOT EXISTS satellite_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES cadastral_parcels(id) ON DELETE CASCADE,
    scene_id TEXT NOT NULL,
    source TEXT NOT NULL,
    acquisition_date TIMESTAMPTZ NOT NULL,
    cloud_coverage_pct NUMERIC(5, 2),
    resolution_meters NUMERIC(6, 2),
    ndvi_value NUMERIC(5, 3),
    ndbi_value NUMERIC(5, 3),
    is_demo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_satellite_obs_parcel ON satellite_observations(parcel_id);

CREATE TABLE IF NOT EXISTS change_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES cadastral_parcels(id) ON DELETE CASCADE,
    detection_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    change_score NUMERIC(5, 2) NOT NULL,
    built_up_change_pct NUMERIC(5, 2),
    vegetation_change_pct NUMERIC(5, 2),
    water_change_pct NUMERIC(5, 2),
    boundary_discrepancy_meters NUMERIC(6, 2),
    status TEXT NOT NULL,
    confidence NUMERIC(4, 3) NOT NULL,
    evidence_references JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_change_detections_parcel ON change_detections(parcel_id);

-- 7. RISK ALERTS
CREATE TABLE IF NOT EXISTS risk_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES cadastral_parcels(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_risk_alerts_parcel ON risk_alerts(parcel_id);

-- 8. LAND CASES
CREATE TABLE IF NOT EXISTS land_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id TEXT UNIQUE NOT NULL,
    parcel_id UUID REFERENCES cadastral_parcels(id) ON DELETE CASCADE,
    ulpin TEXT NOT NULL,
    survey_number TEXT NOT NULL,
    village TEXT NOT NULL,
    taluk TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    location_point GEOMETRY(Point, 4326),
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status TEXT NOT NULL DEFAULT 'NEW',
    priority TEXT NOT NULL DEFAULT 'MEDIUM',
    assigned_officer TEXT NOT NULL,
    assigned_officer_id TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_land_cases_case_id ON land_cases(case_id);
CREATE INDEX IF NOT EXISTS idx_land_cases_status ON land_cases(status);

-- 9. LEGAL KNOWLEDGE TABLES
CREATE TABLE IF NOT EXISTS legal_acts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    year INTEGER NOT NULL,
    jurisdiction TEXT NOT NULL,
    region TEXT,
    category TEXT NOT NULL,
    effective_date DATE NOT NULL,
    source_document TEXT NOT NULL,
    source_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    confidence TEXT NOT NULL DEFAULT 'verified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legal_sections (
    id TEXT PRIMARY KEY,
    act_id TEXT REFERENCES legal_acts(id) ON DELETE CASCADE,
    section_number TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    applies_to JSONB,
    restrictions JSONB,
    authorities JSONB,
    confidence TEXT NOT NULL DEFAULT 'verified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legal_relationships (
    id TEXT PRIMARY KEY,
    source_act_id TEXT REFERENCES legal_acts(id),
    target_act_id TEXT REFERENCES legal_acts(id),
    relationship_type TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS policy_overlays (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    region TEXT NOT NULL,
    restrictions JSONB,
    governing_act TEXT NOT NULL,
    effective_date DATE NOT NULL,
    boundary_geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_policy_overlays_geom ON policy_overlays USING GIST(boundary_geom);

-- 10. BHU-MITRA FIELD OBSERVATIONS & PHOTOS
CREATE TABLE IF NOT EXISTS field_observations (
    id TEXT PRIMARY KEY,
    client_generated_id TEXT UNIQUE,
    case_id TEXT NOT NULL,
    parcel_id TEXT NOT NULL,
    observer_id TEXT NOT NULL,
    observer_name TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    gps_point GEOMETRY(Point, 4326),
    gps_accuracy_meters NUMERIC(5, 2),
    compass_orientation NUMERIC(5, 2),
    boundary_points_geojson JSONB,
    observations TEXT NOT NULL,
    notes TEXT,
    sync_status TEXT NOT NULL DEFAULT 'synced',
    device_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_field_obs_case ON field_observations(case_id);
CREATE INDEX IF NOT EXISTS idx_field_obs_gps ON field_observations USING GIST(gps_point);

CREATE TABLE IF NOT EXISTS field_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    observation_id TEXT REFERENCES field_observations(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    sha256_hash TEXT NOT NULL,
    photo_point GEOMETRY(Point, 4326),
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. EVIDENCE DOSSIERS & VERIFICATION
CREATE TABLE IF NOT EXISTS evidence_documents (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256_hash TEXT NOT NULL,
    source TEXT NOT NULL,
    uploaded_by TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_docs_hash ON evidence_documents(sha256_hash);

CREATE TABLE IF NOT EXISTS evidence_hashes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id TEXT NOT NULL,
    package_hash TEXT NOT NULL,
    ulpin TEXT NOT NULL,
    generated_by TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id TEXT NOT NULL,
    verifier_ip TEXT,
    verifier_user_agent TEXT,
    is_valid BOOLEAN NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    ip_address TEXT,
    old_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
