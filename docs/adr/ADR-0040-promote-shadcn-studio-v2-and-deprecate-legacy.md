# ADR-0040 — Promote shadcn-studio-v2 and Deprecate Legacy shadcn-studio

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-06 |
| **Owner** | Architecture Authority |
| **Supersedes** | ADR-0027 |
| **Superseded by** | — |
| **Implementation slice** | `P06-013` onward |
| **Related ADRs** | [ADR-0006](ADR-0006-package-lifecycle-governance.md) · [ADR-0017](ADR-0017-shadcn-studio-ui-delivery-acceleration.md) · [ADR-0027](ADR-0027-frontend-presentation-reset.md) |

---

## Context

The repo now has two presentation package tracks:

- `@afenda/shadcn-studio` (legacy, PKG-026, PKGR05A, PAS-006 authority)
- `@afenda/shadcn-studio-v2` (PKG-030, currently experimental)

The v2 package is already present and validated for taxonomy experiments, but enterprise delivery still imports from the legacy package. Continuing dual-track execution increases split authority and migration drift.

This ADR resolves the migration boundary: deprecate `@afenda/shadcn-studio` and promote `@afenda/shadcn-studio-v2` as the canonical ERP presentation package.

---

## Decision

### 1. Deprecate legacy `@afenda/shadcn-studio`

- `@afenda/shadcn-studio` transitions to `deprecated` lifecycle for presentation ownership.
- Its existing `PKGR05A_SHADCN_STUDIO` disposition authority is retired to **archive-lane**.
- Legacy package imports are treated as migration debt: acceptable only for controlled compatibility shims and temporary bridge windows, with explicit date-bounded expiry approved by a follow-up ADR.

### 2. Promote `@afenda/shadcn-studio-v2` as canonical package

- `@afenda/shadcn-studio-v2` lifecycle is set to `active`, and experimental guardrails/expiry metadata are removed.
- A new production-ready presentation lane for v2 is established as the canonical PAS-006 consumer owner.
- All PAS-006 consumers migrate to v2 imports and CSS entry points:
  - `apps/erp`
  - `apps/storybook`
  - `apps/developer`
  - any route-lab or block lab references resolved by governance scripts

### 3. Registry and package truth updates

Migration is authoritative only when both registries agree:

- `package-registry.data.ts` reflects `@afenda/shadcn-studio-v2` as the Design package with active lifecycle and production purpose.
- `foundation-disposition.registry.ts` reflects v2 as the live presentation row and marks v1 lane `archive-lane`.
- `foundation-disposition` evidence and PAS docs are updated to reference v2 canonical paths.

### 4. Migration execution constraints

No direct restore of retired UI packages (`@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, `@afenda/css-authority`, `@afenda/ui-composition`) is implied. This ADR only addresses the shadcn studio family.

### 5. Compatibility and compatibility-window policy

During transition:

- API-level exports currently used by apps may be compatibility-adapted in v2 when they have no semantic change.
- New features are authored only in v2.
- Legacy shadcn-studio references are removed in a coordinated slice sequence (consumer, theme, and tests in one bounded migration window).

---

## Consequences

### Positive

- Single authoritative presentation runtime package under PAS-006.
- Reduced long-term risk from split import paths and dual authority.
- Cleaner package-lifecycle state (`retired`/`archive` for v1, `active` for v2).

### Negative / trade-offs

- Coordinated consumer migration can cause short-term churn across `apps/erp`, `apps/storybook`, and lab surface imports.
- Re-baselining of registry evidence and documentation is required before ADR closure.
- Any incompatibility in v2 public exports is a migration blocker and must be resolved before cutover.

---

## Acceptance Gate

The ADR is complete when all are true:

1. `PKG-030` (`@afenda/shadcn-studio-v2`) is non-experimental in `package-registry.data.ts` and clearly documented as Design production package.
2. A canonical `PKGR05`-style presentation lane for v2 exists in `foundation-disposition.registry.ts`.
3. `PKGR05A_SHADCN_STUDIO` is moved to `archive-lane` and marked deprecated per package lifecycle truth.
4. `docs/architecture/foundation-disposition.md` and `docs/PAS/pas-status-index.md` reflect the presentation lane transfer.
5. Consumption migration is complete (`@afenda/shadcn-studio-v2` imports in production-facing apps).
6. `pnpm --filter @afenda/shadcn-studio-v2 typecheck`, `pnpm --filter @afenda/shadcn-studio-v2 test:run`, and `pnpm --filter @afenda/shadcn-studio-v2 build` pass.
7. PAS-006 production surfaces using theme/CSS are validated by existing build/typecheck gates after migration:
   - `pnpm --filter @afenda/erp typecheck`
   - `pnpm --filter @afenda/storybook test:storybook:run`

---

## References

- [ADR-0027](ADR-0027-frontend-presentation-reset.md) — Frontend Presentation Reset
- [ADR-0017](ADR-0017-shadcn-studio-ui-delivery-acceleration.md) — MCP vendor and production target
- [PAS-006 Family](../PAS/PRESENTATION/README.md)
- [PAS-006A](../PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md)
- `packages/architecture-authority/src/data/package-registry.data.ts`
- `packages/architecture-authority/src/data/foundation-disposition.registry.ts`
- `docs/architecture/foundation-disposition.md`