-- ==============================================================================
-- LANDScope Sovereign Spatial Intelligence Platform
-- Migration: 0002_seed_demo_accounts.sql
--
-- Non-destructive Seed Script:
-- 1. Populates canonical baseline geography ('IN-MP-SEH-ASH').
-- 2. Populates verified auth.users & public.profiles for all 7 RBAC roles with
--    email confirmation pre-satisfied.
-- 3. Enables immediate, fully authenticated Supabase RLS sessions.
-- ==============================================================================

-- 1. CANONICAL BASELINE GEOGRAPHY
INSERT INTO public.geographies (
    id, country, state, district, tehsil, latitude, longitude, bbox, feature_type, display_name, area_sq_km, is_demo_territory
) VALUES (
    'IN-MP-SEH-ASH',
    'India',
    'Madhya Pradesh',
    'Sehore',
    'Ashta',
    23.0167,
    76.7167,
    '[76.50, 22.85, 76.90, 23.20]'::jsonb,
    'tehsil',
    'Ashta Tehsil, Sehore District, Madhya Pradesh',
    1420.5,
    true
) ON CONFLICT (id) DO NOTHING;

-- 2. VERIFIED AUTH USERS & PROFILES FOR 7 SOVEREIGN ROLES
DO $$
DECLARE
    u_researcher UUID  := 'd0a1b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c';
    u_policymaker UUID := 'e1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d';
    u_academic UUID    := 'f2c3d4e5-f6a7-4b8c-9d0e-2f3a4b5c6d7e';
    u_agency UUID      := 'a3d4e5f6-a7b8-4c9d-0e1f-3a4b5c6d7e8f';
    u_innovator UUID   := 'b4e5f6a7-b8c9-4d0e-1f2a-4b5c6d7e8f9a';
    u_public UUID      := 'c5f6a7b8-c9d0-4e1f-2a3b-5c6d7e8f9a0b';
    u_admin UUID       := 'd6a7b8c9-d0e1-4f2a-3b4c-6d7e8f9a0b1c';
BEGIN
    -- Researcher
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', u_researcher, 'authenticated', 'authenticated', 'researcher@landscope.in',
        crypt('LandScope2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Dr. Ananya Sharma","role_code":"RESEARCHER"}', NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET email_confirmed_at = NOW();

    INSERT INTO public.profiles (
        id, name, email, role_code, organization, designation, account_type, status
    ) VALUES (
        u_researcher, 'Dr. Ananya Sharma', 'researcher@landscope.in', 'RESEARCHER', 'National Land Research Consortium', 'Senior Policy Research Fellow', 'SIH Demonstration Account', 'ACTIVE'
    ) ON CONFLICT (id) DO NOTHING;

    -- Policymaker
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', u_policymaker, 'authenticated', 'authenticated', 'policymaker@landscope.in',
        crypt('LandScope2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Vikram Malhotra","role_code":"POLICYMAKER"}', NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET email_confirmed_at = NOW();

    INSERT INTO public.profiles (
        id, name, email, role_code, organization, designation, account_type, status
    ) VALUES (
        u_policymaker, 'Vikram Malhotra', 'policymaker@landscope.in', 'POLICYMAKER', 'Policy Planning Directorate', 'Strategic Policy Analyst', 'SIH Demonstration Account', 'ACTIVE'
    ) ON CONFLICT (id) DO NOTHING;

    -- Academic
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', u_academic, 'authenticated', 'authenticated', 'academic@landscope.in',
        crypt('LandScope2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Prof. Sudhir Kulkarni","role_code":"ACADEMIC_INSTITUTION"}', NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET email_confirmed_at = NOW();

    INSERT INTO public.profiles (
        id, name, email, role_code, organization, designation, account_type, status
    ) VALUES (
        u_academic, 'Prof. Sudhir Kulkarni', 'academic@landscope.in', 'ACADEMIC_INSTITUTION', 'Centre for Spatial Governance Studies', 'Dean of Spatial Sciences', 'SIH Demonstration Account', 'ACTIVE'
    ) ON CONFLICT (id) DO NOTHING;

    -- Government Agency
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', u_agency, 'authenticated', 'authenticated', 'agency@landscope.in',
        crypt('LandScope2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Sunil Deshmukh","role_code":"GOVERNMENT_AGENCY"}', NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET email_confirmed_at = NOW();

    INSERT INTO public.profiles (
        id, name, email, role_code, organization, designation, account_type, status
    ) VALUES (
        u_agency, 'Sunil Deshmukh', 'agency@landscope.in', 'GOVERNMENT_AGENCY', 'Land Records Modernization Desk', 'Cadastral Reconciliation Officer', 'SIH Demonstration Account', 'ACTIVE'
    ) ON CONFLICT (id) DO NOTHING;

    -- Innovator
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', u_innovator, 'authenticated', 'authenticated', 'innovator@landscope.in',
        crypt('LandScope2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Rohan Varma","role_code":"INNOVATOR"}', NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET email_confirmed_at = NOW();

    INSERT INTO public.profiles (
        id, name, email, role_code, organization, designation, account_type, status
    ) VALUES (
        u_innovator, 'Rohan Varma', 'innovator@landscope.in', 'INNOVATOR', 'GeoVision Spatial AI Lab', 'Lead Geospatial AI Engineer', 'SIH Demonstration Account', 'ACTIVE'
    ) ON CONFLICT (id) DO NOTHING;

    -- Public
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', u_public, 'authenticated', 'authenticated', 'public@landscope.in',
        crypt('LandScope2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Kavita Rao","role_code":"PUBLIC"}', NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET email_confirmed_at = NOW();

    INSERT INTO public.profiles (
        id, name, email, role_code, organization, designation, account_type, status
    ) VALUES (
        u_public, 'Kavita Rao', 'public@landscope.in', 'PUBLIC', 'Citizen Stakeholder', 'Community Land Advocate', 'SIH Demonstration Account', 'ACTIVE'
    ) ON CONFLICT (id) DO NOTHING;

    -- Admin
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', u_admin, 'authenticated', 'authenticated', 'admin@landscope.in',
        crypt('LandScope2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"System Admin","role_code":"ADMIN"}', NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET email_confirmed_at = NOW();

    INSERT INTO public.profiles (
        id, name, email, role_code, organization, designation, account_type, status
    ) VALUES (
        u_admin, 'System Admin', 'admin@landscope.in', 'ADMIN', 'LANDScope Platform Architecture Cell', 'Lead Security & System Architect', 'SIH Demonstration Account', 'ACTIVE'
    ) ON CONFLICT (id) DO NOTHING;
END $$;
