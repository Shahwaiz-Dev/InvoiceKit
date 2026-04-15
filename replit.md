# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### InvoiceKit (`artifacts/invoicekit`)
- **Type**: react-vite, frontend-only
- **Preview path**: `/`
- **Description**: Free, no-login, browser-only invoice generator
- **Stack**: React, Vite, Tailwind CSS, framer-motion, react-hook-form, zod, shadcn/ui
- **Features**:
  - 4 invoice templates (Clean, Corporate, Minimal, Contractor)
  - Live preview pane with real-time updates (150ms debounce)
  - Slide-in editor panel with full form (business details, client, line items, tax, discount, currency)
  - PDF download via window.print() with @media print CSS
  - Logo upload with FileReader preview
  - No backend, no login, data stays in browser
- **Sections**: Hero, How It Works, Templates, Editor Drawer, FAQ, Footer
- **Colors**: Slate Blue (#3B5BDB), Deep Navy (#1E3A8A), Teal Mint (#0D9488), Warm White (#F8F7F4)
- **Typography**: Inter (UI) + DM Serif Display (hero headline)
