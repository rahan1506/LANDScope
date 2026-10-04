# LANDScope: Sovereign Indian Land Governance & Cadastral Intelligence Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey.svg)](https://expressjs.com/)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.4-336791.svg)](https://postgis.net/)
[![License: Proprietary / Sovereign](https://img.shields.io/badge/License-Sovereign_Gov_Tech-orange.svg)]()

LANDScope is an end-to-end Indian Land Governance, Cadastral Intelligence, and Legal AI platform integrating Copernicus Sentinel-2 satellite earth observation, PostGIS spatial cadastre indexing, automated Section 65B-compliant court-admissible evidence dossiers, offline-first field synchronization (Bhu-Mitra), and Gazette-grounded legal harmonisation.

---

## 🏛️ Platform Architecture

```
                                 LANDScope Architecture
 ┌──────────────────────────────────────────────────────────────────────────────────┐
 │                               FRONTEND (Next.js 16)                              │
 │  • Sentinel GIS Canvas (MapLibre / Leaflet)       • Legal Harmonizer RAG Chat    │
 │  • ULPIN / Cadastral Mutation Engine              • Section 65B Evidence Dossier │
 │  • Bhu-Mitra Offline PWA (Service Worker)        • Executive Risk Dashboard      │
 └────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │  Reverse Proxy Rewrite (/api/v1/*)
 ┌────────────────────────────────────────▼─────────────────────────────────────────┐
 │                               BACKEND (Express.js)                               │
 │                                                                                  │
 │  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────────────┐  │
 │  │    GIS & Spectral    │  │   Legal AI & RAG     │  │  Evidence & Cryptography│ │
 │  │ • Sentinel-2 (Copernicus│ • LLM Engine         │  │ • SHA-256 Hashes       │  │
 │  │ • NDVI Vegetation    │  │ • Section Citation   │  │ • Dynamic QR Codes     │  │
 │  │ • NDBI Built-up      │  │ • Gazette Grounding  │  │ • PDF Audit Dossiers   │  │
 │  │ • Temporal Change    │  │ • Deterministic Fallback│• Court Admissibility   │  │
 │  └──────────────────────┘  └──────────────────────┘  └────────────────────────┘  │
 │                                                                                  │
 │  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────────────┐  │
 │  │   Bhu-Mitra Sync     │  │   Cadastral Engine   │  │   Security & Auditing  │  │
 │  │ • clientGeneratedId  │  │ • PostGIS Spatial    │  │ • JWT Authentication   │  │
 │  │ • Idempotent Queue   │  │ • ULPIN Resolution   │  │ • Fine-Grained RBAC    │  │
 │  │ • Ground Alignment   │  │ • Mutation Reconciliation│ Immutable Audit Trail │  │
 │  └──────────────────────┘  └──────────────────────┘  └────────────────────────┘  │
 └────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │
 ┌────────────────────────────────────────▼─────────────────────────────────────────┐
 │                                  STORAGE & DATA                                  │
 │ • PostgreSQL 16 + PostGIS Spatial Geometries (Point, Polygon, MultiPolygon)      │
 │ • Sovereign In-Memory Engine (Zero-credential DEMO mode fallback)                │
 │ • Local / S3-compatible Object Storage for Evidence & Geotagged Field Photos     │
 └──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Modules

1. **Satellite Earth Observation & Spectral Engines**
   - Direct integration with European Space Agency Copernicus Data Space Ecosystem (CDSE) Sentinel-2 MSI and USGS Landsat-8/9.
   - Spectral band math:
     $$\text{NDVI} = \frac{\text{NIR (B08)} - \text{RED (B04)}}{\text{NIR (B08)} + \text{RED (B04)}}$$
     $$\text{NDBI} = \frac{\text{SWIR (B11)} - \text{NIR (B08)}}{\text{SWIR (B11)} + \text{NIR (B08)}}$$
   - Temporal change detection flagging built-up expansion, vegetation loss, water body encroachment, and boundary discrepancies.

2. **Mutation Reconciliation & ULPIN Provider**
   - Standard 14-digit Indian Bhu-Aadhaar / ULPIN resolution.
   - Automated spatial vs. revenue mutation comparison calculating divergence in registered vs. observed area, survey splits, and boundary drift.

3. **Grounded Legal AI Harmonizer (RAG)**
   - Strict citation-grounded retrieval over Indian land acts:
     - Real Estate (Regulation and Development) Act (RERA), 2016
     - Wetlands (Conservation and Management) Rules, 2017
     - Forest (Conservation) Act, 1980 & Land Acquisition (LARR) Act, 2013
     - State-specific Land Revenue Codes (Karnataka, Maharashtra, UP, etc.)
   - Zero hallucination policy: If unverified by statutory gazette citations, explicitly returns `"Unable to verify source"`.

4. **Section 65B Evidence Dossier & Cryptographic Verification**
   - Generates court-admissible forensic packages with SHA-256 document hashing.
   - SVG QR verification code pointing to `/verify/evidence/{caseId}` with tamper-evident certificate manifests.

5. **Bhu-Mitra Offline Field Synchronization**
   - Offline-first field inspection with IndexedDB local cache.
   - Idempotent conflict resolution via `clientGeneratedId` UUID preventing duplicate field uploads upon network reconnection.
   - Spatial ground-to-cadastral alignment scoring using PostGIS distance calculations.

---

## 📦 Directory Structure

```
├── LandScope/                  # Next.js 16 Frontend Web Application & PWA
│   ├── src/
│   │   ├── app/                # App Router (Sentinel, Legal, Evidence, Field, Cases)
│   │   ├── components/         # Reusable UI & GIS canvas components
│   │   ├── lib/                # Client state, Leaflet / MapLibre integrations
│   │   └── types/              # TypeScript interfaces
│   ├── public/                 # Static assets, PWA manifest, service worker
│   └── package.json
│
├── backend/                    # Express.js + TypeScript Sovereign Backend
│   ├── migrations/             # 001_postgis_landscope_schema.sql (20 PostGIS tables)
│   ├── src/
│   │   ├── config/             # Environment parsing (Zod) & database pool
│   │   ├── controllers/        # REST route controllers
│   │   ├── docs/               # OpenAPI 3.0 / Swagger specification
│   │   ├── evidence/           # Section 65B cryptographic dossier & QR generator
│   │   ├── field/              # Bhu-Mitra offline sync & ground-satellite aligner
│   │   ├── gis/                # Satellite providers (Sentinel, Landsat, Demo) & spectral math
│   │   ├── legal/              # Gazette RAG knowledge retriever & LLM abstractions
│   │   ├── middleware/         # JWT auth, RBAC permissions, audit logger, rate limiter
│   │   ├── repositories/       # PostGIS data access layer with sovereign fallback
│   │   ├── routes/             # Versioned API routes (/api/v1/*)
│   │   ├── services/           # Mutation engine, ULPIN provider, multi-factor risk scoring
│   │   └── tests/              # Automated Jest integration tests (25 test cases)
│   └── package.json
│
├── docker-compose.yml          # Container configuration (PostGIS 16, Redis, Backend, Frontend)
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **Docker & Docker Compose** for PostGIS and Redis

### 2. Clone & Setup
```bash
git clone https://github.com/rahan1506/LANDScope.git
cd LANDScope
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
*Backend starts on `http://localhost:5000` (defaults to zero-credential DEMO mode with sovereign in-memory fallback).*

### 4. Frontend Setup
```bash
cd ../LandScope
npm install
npm run dev
```
*Frontend starts on `http://localhost:3000`.*

---

## 🐳 Docker Deployment

To launch the full production-ready stack with PostgreSQL 16 + PostGIS and Redis:

```bash
docker-compose up --build -d
```

Services exposed:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **API Documentation**: `http://localhost:5000/api-docs`
- **PostgreSQL / PostGIS**: `localhost:5432`
- **Redis Cache**: `localhost:6379`

---

## 🔑 Environment Configuration

Refer to [backend/.env.example](backend/.env.example) for all configurable parameters:

```env
NODE_ENV=development
PORT=5000
DEMO_MODE=true
PUBLIC_BASE_URL=http://localhost:3000

# Database (PostGIS)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/landscope

# Satellite Imagery (Copernicus CDSE)
SATELLITE_PROVIDER=demo
COPERNICUS_CLIENT_ID=
COPERNICUS_CLIENT_SECRET=

# Legal AI & RAG Engine
LLM_PROVIDER=demo
LLM_API_KEY=
LLM_MODEL=gemini-2.5-flash

# Object Storage
STORAGE_PROVIDER=local
STORAGE_BUCKET=landscope-evidence
```

---

## 🧪 Testing

Run backend automated integration test suite:

```bash
cd backend
npm test
```
*Executes 25 comprehensive test suites covering Auth, RBAC, ULPIN resolution, NDVI/NDBI calculations, Mutation comparison, Legal citations, SHA-256 evidence seals, and Idempotent field sync.*

---

## 📜 Compliance & Legal Notice

- **Information Technology Act, 2000 & Bharatiya Sakshya Adhiniyam, 2023 (formerly Indian Evidence Act, Section 65B)**: Electronic records generated by the Evidence Engine include cryptographic SHA-256 checksums and verification manifests.
- **National Spatial Data Infrastructure (NSDI) Guidelines**: Cadastral shapefiles and satellite layers conform to WGS 84 (EPSG:4326) and Web Mercator standards.
