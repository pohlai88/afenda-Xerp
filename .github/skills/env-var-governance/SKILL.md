---
name: env-var-governance
description: Enforces environment variable naming, access, typing, and scoping rules for the @afenda/erp Next.js app and all workspace packages. Covers NEXT_PUBLIC_ restrictions, type-safe env module pattern, startup fast-fail, .env.example maintenance, and Vercel preview/production scoping. Use when adding environment variables, reviewing env access in components or services, configuring Vercel environments, or when the user mentions env vars, secrets, NEXT_PUBLIC_, or process.env.
disable-model-invocation: true
paths:
  - apps/erp/**
  - packages/**
  - .env*
---

# env-var-governance

Environment variables are the most common path for secrets to leak. A single mis-prefixed variable can expose a database connection string to every browser user.

## The three zones

| Zone | Prefix | Visible to | Rule |
|------|--------|------------|------|
| Client config | `NEXT_PUBLIC_` | Browser + Server | Non-secret only (URLs, feature flags, analytics IDs) |
| Server secrets | (no prefix) | Server only | All secrets, DB URLs, API keys |
| Build-time | Injected via CI | Build process | Static constants baked at build time |

---

## Non-negotiable rules

1. **`NEXT_PUBLIC_` is for non-secrets only.** Never prefix a DB URL, API secret, service token, or private key with `NEXT_PUBLIC_`. The hook `guard-next-public-env.mjs` enforces this — CI will reject the PR.

2. **No `process.env` scattered in components or services.** All env access goes through a typed `lib/env.ts` module. Components import from `lib/env`, never from `process.env` directly.

3. **Type-safe env module pattern.** Parse `process.env` once at module load time with Zod. If a required variable is missing, throw at startup — not at the moment a user makes a request.

4. **Missing vars fail fast at startup.** A missing `DATABASE_URL` should crash the server on boot with a clear error, not throw a `Cannot read properties of undefined` in a request handler three seconds after launch.

5. **`.env.example` maintained in every PR that adds a variable.** The example file is the contract — reviewers check it, new engineers copy it. A variable not in `.env.example` will be missed on the next setup.

6. **`.env.local` is never committed.** It is in `.gitignore`. Vercel's env pull hook asks for confirmation before overwriting it.

7. **Preview and production use separate DB connection strings.** Never share a production database URL with preview deployments. Vercel environment scoping enforces this when configured correctly.

---

## Type-safe env module

```ts
// apps/erp/src/lib/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  // Server-only secrets (no NEXT_PUBLIC_ prefix)
  DATABASE_URL:          z.string().url(),
  SUPABASE_URL:          z.string().url(),
  SUPABASE_ANON_KEY:     z.string().min(1),
  SUPABASE_SERVICE_KEY:  z.string().min(1),

  // Client-safe config (NEXT_PUBLIC_ prefix allowed)
  NEXT_PUBLIC_APP_URL:   z.string().url().optional(),
  NEXT_PUBLIC_ENV:       z.enum(["development", "preview", "production"]).default("development"),
});

// Throws at module load if required vars are absent
export const env = EnvSchema.parse(process.env);
```

Usage:
```ts
// ✅ Import from lib/env — typed, validated
import { env } from "@/lib/env";
const db = createClient(env.DATABASE_URL);

// ❌ Scattered process.env access — untyped, silently undefined
const db = createClient(process.env.DATABASE_URL);
```

---

## Vercel environment scoping

```
Environment: Production
  DATABASE_URL = postgresql://prod-host/prod-db
  NEXT_PUBLIC_ENV = production

Environment: Preview
  DATABASE_URL = postgresql://preview-host/preview-db   ← different DB!
  NEXT_PUBLIC_ENV = preview

Environment: Development
  (local only, from .env.local)
```

To add a new variable:
1. Add to `EnvSchema` in `lib/env.ts`
2. Add to `.env.example` with a placeholder value and comment
3. Add to Vercel with correct scope (Production, Preview, Development)
4. If secret: never set in `NEXT_PUBLIC_*`

---

## .env.example format

```bash
# Database (Supabase)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Supabase config
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Client-visible config (NEXT_PUBLIC_ prefix — no secrets)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENV=development
```

---

## Checklist when adding a new environment variable

```
[ ] 1. Correct zone: server secret (no prefix) vs client config (NEXT_PUBLIC_)
[ ] 2. Added to EnvSchema in lib/env.ts with appropriate type/validation
[ ] 3. Added to .env.example with placeholder and comment
[ ] 4. Added to Vercel with correct environment scope
[ ] 5. Not accessed via process.env directly — imported from lib/env
[ ] 6. For secrets: not committed to git, not in NEXT_PUBLIC_
[ ] 7. Startup fast-fail confirmed: missing var throws at boot
```

---

## Existing hooks (already active)

| Hook | What it does |
|------|-------------|
| `guard-next-public-env.mjs` | Rejects any `NEXT_PUBLIC_` var whose value looks like a secret (length, pattern) |
| `ask-vercel-env-pull.mjs` | Confirms before overwriting `.env.local` with `vercel env pull` |
