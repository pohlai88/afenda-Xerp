# ADR-0027 — Frontend Presentation Reset

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-29 |
| **Owner** | Architecture Authority |
| **Supersedes** | Governed UI pipeline (`@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, PAS-005 CSS authority chain for ERP) |
| **Superseded by** | — |

---

## Context

The ERP frontend accumulated multiple presentation layers — governed UI primitives, AppShell promotion, metadata-ui composition, and css-authority token registries — with overlapping enforcement (`ui:guard`, package CSS dist sync across four packages, appshell bridge wrappers).

Operational cost and architectural drift exceeded delivery value. ADR-0017 MCP vendor approval remains valid; the **promotion pipeline target** changes.

---

## Decision

### 1. Sole ERP presentation chain

```txt
MCP / shadcn CLI  →  @afenda/shadcn-studio  →  apps/erp
```

- **Install cwd:** `packages/shadcn-studio`
- **ERP CSS entry:** `apps/erp/src/app/globals.css` (PAS-006 three-layer import)
- **Storybook:** `@afenda/shadcn-studio` blocks only

### 2. Deleted packages (filesystem removed)

| Package | Status |
|---------|--------|
| `@afenda/ui` | Retired — do not restore without ADR |
| `@afenda/appshell` | Retired |
| `@afenda/metadata-ui` | Retired |
| `@afenda/ui-composition` | Retired |
| `@afenda/css-authority` | Retired |

Disposition: `archive-lane` in `foundation-disposition.registry.ts`.

### 3. ERP skeleton scope

`apps/erp` retains:

- App Router shell (`layout`, `page`, error/loading surfaces)
- Better Auth API route
- Health API route
- Correlation-id `proxy.ts`
- Observability `instrumentation.ts`

Removed: `lib/`, `components/`, `server/`, protected routes, internal APIs, governed-ui wiring.

### 4. Enforcement

| Gate | Scope |
|------|-------|
| `pnpm --filter @afenda/shadcn-studio typecheck` | Presentation package |
| `pnpm --filter @afenda/erp build` | ERP skeleton |
| `pnpm sync:package-css-dist` | `@afenda/shadcn-studio` only |
| `pnpm check:foundation-disposition` | Registry truth |

Retired gates: `pnpm ui:guard*`, legacy css-authority checks, appshell test gates.

### 5. Metadata-driven UI

Future metadata surfaces are **greenfield on shadcn-studio**, not revival of deleted packages. Kernel vocabulary and enterprise-knowledge contracts remain authoritative for meaning; presentation is rebuilt under PAS-006.

---

## Consequences

- Positive: Single presentation owner, smaller typecheck surface, deterministic CSS chain
- Negative: ERP feature UI must be re-built block-by-block from shadcn-studio
- Migration: Legacy PAS-005 docs archived under `docs/_retired/legacy-css-authority/`

---

## References

- [PAS-006](../PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md)
- [North star](../NORTHSTAR/shadcn-studio-presentation-north-star.md)
- [Blueprint](../BLUEPRINT/shadcn-studio-presentation-blueprint.md)
- [ADR-0017](ADR-0017-shadcn-studio-ui-delivery-acceleration.md) — MCP vendor approval (retained)
