# ARS EXIM Corporate Website — Master Product Requirements Document (PRD)

## Document Metadata
- **Project:** ARS EXIM Corporate Website
- **Domain:** arsexim.com
- **Client:** ARS EXIM
- **Development Company:** NK SkillEdge Pvt. Ltd.
- **Document Version:** 2.0 — MERN Full-Stack Architecture
- **Business Type:** Specialist Industrial Contractor (Industrial Insulation, Passive Fire Protection, Scaffolding & Access Management)

---

## 1. Project Identity & Objectives
ARS EXIM is a specialist industrial contractor delivering high-specification industrial services across critical infrastructure, oil & gas, petrochemical, power generation, and heavy manufacturing sectors.
The corporate website serves as an engineering-focused, high-credibility digital asset designed to:
- Establish authoritative industrial credibility.
- Clearly present technical capabilities across Industrial Insulation, Passive Fire Protection (PFP), and Scaffolding & Access Management.
- Showcase verified, client-approved industrial projects with technical execution details.
- Articulate rigorous Health, Safety, Environment (HSE) and Quality Assurance (QA/QC) standards.
- Capture and process high-value qualified project quotation requests and technical enquiries.
- Provide a secure, role-based Content Management System (CMS) / Admin Panel for non-technical content management.
- Provide structured recruitment/career application management.
- Comply with global web performance (Core Web Vitals), WCAG 2.2 AA accessibility, and enterprise security standards.

---

## 2. Core Stack Requirements
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, TypeScript, Next.js Server Actions / API Routes + modular Express architecture.
- **Database:** Supabase-hosted PostgreSQL with Prisma ORM. Configure `DATABASE_URL` (pooled runtime connection) and `DIRECT_URL` (direct migration connection); see `docs/DATABASE.md`.
- **Authentication:** HttpOnly Secure Session Cookies / JWT, Argon2id/Bcrypt password hashing, Role-Based Access Control (RBAC).
- **Storage:** Abstracted S3-compatible object storage provider (AWS S3 / Cloudflare R2 / Local FS adapter fallback).
- **Email:** Abstracted Transactional Email Service (Resend / SendGrid / SES / SMTP fallback).
- **Media Pipeline:** Sharp image optimization (WebP/AVIF generation, EXIF stripping, responsive variants).
- **Anti-Spam:** Cloudflare Turnstile / Honeypot / Rate Limiting.
- **Auditing & Logging:** Structured JSON audit logger, Sentry integration support, health check endpoints.

---

## 3. Brand Identity & Visual System
- **Navy 900:** `#10233F` (Primary header, dark sections, footer, authority anchor)
- **Navy 700:** `#16305A` (Secondary navy, card accents, borders)
- **Steel 500:** `#6B7480` (Technical text, meta descriptions, secondary copy)
- **Steel 100:** `#F1F3F5` (Subtle backgrounds, engineering grid lines, alternating rows)
- **White:** `#FFFFFF` (Surface cards, readable content areas)
- **Gold Accent:** `#C9A961` (Primary CTA, key numerical metrics, active tabs, dividers)
- **Red Accent:** `#A31621` (Exclusively for Safety/HSE badges, alerts, error states, and emergency protocols — NEVER as primary CTA)
- **Success:** `#1E7A46` (Verification ticks, successful submissions, published indicators)

---

## 4. Key Public Routes & Modules
- `/` — Homepage (Industrial Hero, Core Capabilities, Verification Metrics, Featured Projects, Safety Charter, Quote CTA)
- `/about` — Corporate Profile, Leadership, Mission, Engineering Heritage, Global Footprint
- `/services` — Services Overview Matrix
- `/services/industrial-insulation` — Hot/Cold/Cryogenic Insulation, Acoustic Insulation, Personnel Protection
- `/services/passive-fire-protection` — Hydrocarbon/Cellulosic PFP, Structural Steel Fireproofing, Intumescent Coatings
- `/services/scaffolding` — Engineered System Scaffolding, Industrial Access Management, Rigging
- `/projects` — Project Case Study Repository with multi-dimensional filtering (Service, Industry, Country)
- `/projects/[slug]` — Detailed Project Technical Case Study (Scope, Technical Challenges, Execution Approach, Safety, Gallery)
- `/safety-quality` — HSE Management System, Zero-Harm Policy, Quality Assurance & Certifications
- `/sustainability` — Energy Efficiency, Waste Minimization, Carbon Footprint Mitigation
- `/careers` — Job Board & Culture
- `/careers/[slug]` — Job Description & Structured Application Form
- `/contact` — Office Locations, Interactive Form, Direct Communication Channels
- `/request-a-quote` — High-Value Multi-Step Quote Request System (File attachments, Scope spec, Project duration)
- `/privacy-policy` & `/terms-and-conditions` — Legal Compliance
- `/thank-you` — Dynamic Enquiry Confirmation with Reference Number

---

## 5. Admin Panel & CMS Routes
- `/admin/login` — Secure Admin Authentication (Brute force protection, Rate limiting)
- `/admin/dashboard` — Operational KPIs, Pending Quotes, Recent Activity, Ingestion Stream
- `/admin/projects` — Full Project CRUD, Publishing Workflow, Gallery & Tags
- `/admin/services` — Service Content & Technical Specifications Management
- `/admin/enquiries` — Quotations & Inquiries Inbox, Status Tracking, Reference Search, CSV Export
- `/admin/careers` & `/admin/applications` — Job Postings & Resume/Applicant Review
- `/admin/testimonials` & `/admin/faqs` — Controlled Proof Elements (Strict client permission toggle)
- `/admin/media` — Media Library with Sharp Optimization & Variant Tracking
- `/admin/site-settings` — Global Configuration, Contact Coordinates, SEO defaults
- `/admin/users` & `/admin/audit-logs` — RBAC User Governance & Security Audit Trail

---

## 6. Strict Compliance Rules
- **No Fake Data / No Invented Clients:** Zero placeholder text, zero generic stock claims. If proof does not exist, the section remains hidden or in CMS draft state.
- **Banned Content Scanner:** Automated pre-launch scanner enforcing zero occurrences of lorem ipsum, Urban Nest, example.com, etc.
- **Database-First Submission:** Enquiries are persistently committed to PostgreSQL before dispatching transactional notifications.
- **WCAG 2.2 AA & Core Web Vitals:** Strict performance targets (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1).
