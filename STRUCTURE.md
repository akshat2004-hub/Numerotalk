# 📁 Numerotalk — Project Architecture & Directory Structure

This project follows a **Modular Layered Architecture** separating Frontend, Backend, Core Domain, and Next.js App Router adapters.

---

## 🏛️ Directory Layout

```
Numerotalk/
│
├── 🧠 core/                    # Core Business & Numerology Domain (Framework Agnostic)
│   ├── engine/                 # 13 pure TypeScript calculation modules (Vedic Grid, Yogas, Dasha, etc.)
│   ├── mocks/                  # Astrological rules, remedies, planetary meanings JSON data
│   ├── types/                  # Domain TypeScript interfaces (UserProfile, Readings, etc.)
│   └── index.ts                # Main export barrel for @/core
│
├── 🎨 frontend/                # Client-Side Application Layer
│   ├── components/             # Reusable UI widgets, layout headers, modals, VedicGrid, etc.
│   │   └── ui/                 # Atomic design tokens (Buttons, Badges, Cards, etc.)
│   ├── store/                  # Client state management (Zustand persistent stores)
│   ├── services/               # API clients (backendService, numerologyService)
│   ├── utils.ts                # Tailwind class mergers (cn)
│   └── index.ts                # Main export barrel for @/frontend
│
├── ⚡ backend/                 # Server-Side & Database Infrastructure Layer
│   ├── database/               # SQL migrations (schema.sql) and Database TypeScript models
│   ├── supabase/               # Supabase browser client and App Router server client with cookies
│   ├── services/               # Server-side business logic (profileService, reportService, remedyService)
│   └── index.ts                # Main export barrel for @/backend
│
├── 🌐 app/                     # Next.js 16 App Router (Thin Routing Layer)
│   ├── [locale]/               # Localized frontend pages (English / Hindi routes)
│   └── api/                    # REST API route handlers (/api/auth, /api/profiles, /api/reports, etc.)
│
├── 🌍 i18n/                    # next-intl routing configuration
├── 💬 messages/                # Translation dictionaries (en.json, hi.json)
├── 🧪 tests/                   # Vitest unit test suite for calculation engines
├── 📁 public/                  # Static assets and favicons
└── ⚙️ Root Configs             # package.json, tsconfig.json, vercel.json, next.config.ts, .npmrc
```

---

## 🧩 TypeScript Path Aliases

| Alias | Target Folder | Purpose |
|---|---|---|
| `@/core/*` | `./core/*` | Access core calculation engines, mocks, domain types |
| `@/frontend/*` | `./frontend/*` | Access UI components, Zustand stores, client services |
| `@/backend/*` | `./backend/*` | Access database schemas, Supabase clients, backend services |
| `@/app/*` | `./app/*` | App router |

---

## 🚀 Key Advantages of this Architecture

1. **Clean Separation of Concerns:** Frontend UI, Backend DB/API logic, and Core math are completely isolated.
2. **Framework-Agnostic Core:** The `core/engine/` contains zero DOM or framework dependencies — ready for CLI, mobile, or microservice use.
3. **Vercel 1-Click Native Deploy:** Kept within Next.js App Router for zero configuration builds.
4. **Zero Confusion for Developers:** No messy mixing of API logic with React component trees.
