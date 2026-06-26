# FDR Status Index

> **Authority:** ADR-0014 + ADR-0016. Package identity: [`package-registry.data.ts`](../packages/architecture-authority/src/data/package-registry.data.ts). Disposition lanes: [`foundation-disposition.registry.ts`](../packages/architecture-authority/src/data/foundation-disposition.registry.ts).  
> **Runtime evidence:** [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md).  
> **TIP archive:** [`tip-status-index.md`](tip-status-index.md) — historical evidence only (`legacyTipEvidence` on registry entries).

| Field | Value |
| --- | --- |
| **As-of** | 2026-06-25 |
| **FDR location** | [`FDR/`](FDR/) — `[status] fdr-NNN-<domain-slug>.md` |
| **Registry fingerprint** | `FOUNDATION-DISPOSITION-2026-06-25-v5` |
| **Enforcement** | `pnpm check:documentation-drift` · `pnpm check:foundation-disposition` |

---

## Catalog invariants (PKG ↔ FDR)

| Rule | Detail |
| --- | --- |
| **PKG is canonical anchor** | Every FDR belongs to exactly one `PKG-NNN` / `PKG-R01` from the package registry — never invent package IDs. |
| **FDR count ≥ PKG count** | One **minimum** FDR per active workspace; **multiple FDRs per PKG** when the package owns multiple domains (e.g. `@afenda/observability` → audit + logging). |
| **FDR ID prefix** | `fdr-NNN-<domain-slug>` where `NNN` matches the owning PKG number (`fdr-r01-*` for `PKG-R01`). |
| **Registry entry ID** | Optional second key (`PKG007_ADMIN`, `PKG013_AUDIT`, …) — one registry row may map to one primary FDR; sibling FDRs on the same PKG share `packageId` but have distinct domain slugs. |
| **Delivery status rule** | Phase 2 scaffolds are **Not started** until Research Slice 1 promotes a row — do not copy TIP/runtime-matrix labels into FDR Status or filename prefix. |
| **Stub rule** | Every row in **§FDR register** must have a linked file under `docs/delivery/FDR/` (Phase 2 complete — 33/33). |
| **Do not conflate** | 22 active PKG workspaces ≠ 33 FDR delivery docs — see **§Catalog totals** below. |

---

## §Catalog totals (validated)

| Metric | Count | Notes |
| --- | ---: | --- |
| Active workspace packages (`filesystemRequired`) | **22** | PKG-001–021 + PKG-R01 — [`package-registry.md`](../architecture/package-registry.md) |
| Reserved domain packages (no filesystem) | **4** | PKG-R02–R05 — **no FDR until ADR + registry promotion** |
| **Minimum FDR (1 × active PKG)** | **22** | Floor — every active package must appear in §FDR register |
| **Extra FDR (multi-domain packages)** | **+11** | See §Multi-FDR packages |
| **Catalog FDR total** | **33** | §FDR register row count — must match this table after any edit |
| Registry disposition entries (machine) | **12** | Subset with lane/gates — not 1:1 with FDR count |
| FDR delivery files on disk | **33** | All FDR register rows — Phase 2 scaffold complete |

### Multi-FDR packages (+11 over minimum)

| PKG | Package | FDR count | FDR IDs |
| --- | --- | ---: | --- |
| PKG-001 | `@afenda/appshell` | 2 | shell-composition, manifest-nav |
| PKG-003 | `@afenda/database` | 2 | persistence, tenant-rls |
| PKG-006 | `@afenda/entitlements` | 2 | entitlements, feature-manifest |
| PKG-007 | `@afenda/erp` | 5 | system-admin, operating-context, api-governance, ux-surfaces, accounting-readiness |
| PKG-010 | `@afenda/kernel` | 3 | context-contracts, platform-authority, master-data-authority |
| PKG-013 | `@afenda/observability` | 2 | audit-coverage, logging-tracing |
| PKG-018 | `@afenda/ui` | 2 | governed-primitives, ui-consumption |

All other active PKG rows carry **1 FDR** each (15 packages × 1 = 15).  
**Check:** 7 multi-FDR packages (18 FDR rows) + 15 single-FDR packages = **33**.

---

## Implementation authority rule

An FDR slice may run **only when all five** are true:

1. FDR file exists under `docs/delivery/FDR/[status] fdr-*.md`
2. FDR has a **§Handoff** block for the target slice
3. FDR appears in **§FDR register** below (same `fdr-*` ID)
4. Runtime matrix confirms upstream evidence (or Slice 1 is Research)
5. `afenda-coding-session` Phase 0 receives **exactly one** handoff block

**Gap tracking:** FDR `§Remaining gaps` — not registry `knownGaps` (deprecated).

---

## Implementation workflow

```text
1. Read §Catalog totals + §FDR register — confirm PKG + FDR ID
2. Read foundation-disposition.registry.ts — lane, gates, prohibited, allowedAgents
3. Read enterprise-erp-standards/SKILL.md for domain controls
4. Open docs/delivery/FDR/[status] fdr-*.md — copy ONE §Handoff block
5. fdr-slice-implementer (or afenda-coding-session) — one slice per session
6. §11 Completion Report + enterprise attestation
7. Update FDR doc + this index + runtime matrix; registry-owner for lane changes
8. pnpm check:foundation-disposition && pnpm check:documentation-drift
```

**Current priority:** Phase 1 infrastructure **Complete**. **Next:** Phase 3 — peer review closeout for 29/30 candidates (`fdr-009-rollout-flags`, `fdr-015-tenant-storage`); expand stubs with runtime evidence rows.

---

## §Parallel execution map

| Track | FDR IDs | Safe parallel when | Notes |
| --- | --- | --- | --- |
| **Research-Security** | fdr-002, fdr-009, fdr-015 | Slice 1 Research — disjoint docs-only §3 Files | `fdr-orchestrator` |
| **Observability** | fdr-013-audit-coverage, fdr-013-logging-tracing | Sequential preferred — shared `packages/observability` paths | Same PKG-013 |
| **Amber-UI** | fdr-001-shell-composition, fdr-018-governed-primitives | Sequential — shared UI governance gates | PKG-001 + PKG-018 |
| **Maintain** | Green / Complete FDRs | N/A | No slices unless regression |

**Rule:** Never parallelize overlapping §3 Files or concurrent registry edits.

### shadcn/studio — not an FDR upgrade track

Bulk Tailwind migration and manual per-utility CSS mapping are **not** scheduled FDR implementation. Existing blocks are governed in production; new blocks follow [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../.cursor/skills/afenda-shadcn-components/SKILL.md) per-block promotion pipeline. Constitutional authority: [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md). Remaining ops: ADR acceptance; MCP `shadcn` cwd alignment to `packages/ui`.

---

## §Upgrade sequence

| Step | FDR ID | PKG | Package | Depends on | Next action |
| ---: | --- | --- | --- | --- | --- |
| **→ 1** | fdr-002-auth-disposition | PKG-002 | `@afenda/auth` | Phase 1 complete | **Complete — enterprise 9.5 accepted** (29/30) |
| 2 | fdr-013-audit-coverage | PKG-013 | `@afenda/observability` | — | **Complete — enterprise 9.5 accepted** (29/30) |
| 3 | fdr-013-logging-tracing | PKG-013 | `@afenda/observability` | Step 2 context | **Complete — enterprise 9.5 accepted** (29/30) |
| 4 | fdr-009-rollout-flags | PKG-009 | `@afenda/feature-flags` | — | Evidence-sync Slice 3 ✓ — DoD #14 peer review |
| 5 | fdr-015-tenant-storage | PKG-015 | `@afenda/storage` | — | Evidence-sync Slice 3 ✓ — DoD #14 peer review |
| 6 | fdr-001-shell-composition | PKG-001 | `@afenda/appshell` | Steps 1–2 | Evidence-sync Slice 3 ✓ — DoD #14 peer review |
| 7 | fdr-018-governed-primitives | PKG-018 | `@afenda/ui` | ADR-0008 read | **Partially Implemented — Research Slice 1 ✓** · Slice 2 test debt |
| 8 | fdr-006-feature-manifest | PKG-006 | `@afenda/entitlements` | PKG006_* onboarded ✓ | Evidence-sync / DoD #14 peer review |

---

## §FDR register (canonical — 33 rows)

> **Flat authority list.** Grouped view → [§FDR catalog by PKG](#fdr-catalog-by-pkg).  
> **Validation:** this table must contain exactly **33** data rows. After edits, reconcile with §Catalog totals.

| # | FDR ID | PKG | Package | Registry entry | Lane | Status | Document |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | fdr-001-shell-composition | PKG-001 | `@afenda/appshell` | PKG001_APPSHELL | amber | Partially Implemented | [FDR/[Partially Implemented] fdr-001-shell-composition.md](FDR/%5BPartially%20Implemented%5D%20fdr-001-shell-composition.md) |
| 2 | fdr-001-manifest-nav | PKG-001 | `@afenda/appshell` | PKG001_APPSHELL | amber | Complete | [FDR/[Complete] fdr-001-manifest-nav.md](FDR/%5BComplete%5D%20fdr-001-manifest-nav.md) |
| 3 | fdr-002-auth-disposition | PKG-002 | `@afenda/auth` | PKG002_AUTH | amber | Complete | [FDR/[Complete] fdr-002-auth-disposition.md](FDR/%5BComplete%5D%20fdr-002-auth-disposition.md) |
| 4 | fdr-003-persistence | PKG-003 | `@afenda/database` | PKG003_DATABASE | green | Partially Implemented | [FDR/[Partially Implemented] fdr-003-persistence.md](FDR/%5BPartially%20Implemented%5D%20fdr-003-persistence.md) |
| 5 | fdr-003-tenant-rls | PKG-003 | `@afenda/database` | PKG003_DATABASE | green | Complete | [FDR/[Complete] fdr-003-tenant-rls.md](FDR/%5BComplete%5D%20fdr-003-tenant-rls.md) |
| 6 | fdr-004-design-authority | PKG-004 | `@afenda/design-system` | — | — | Partially Implemented | [FDR/[Partially Implemented] fdr-004-design-authority.md](FDR/%5BPartially%20Implemented%5D%20fdr-004-design-authority.md) |
| 7 | fdr-005-docs-app | PKG-005 | `@afenda/docs` | — | — | Complete — enterprise 9.5 accepted | [FDR/[Complete] fdr-005-docs-app.md](FDR/%5BComplete%5D%20fdr-005-docs-app.md) |
| 8 | fdr-006-entitlements | PKG-006 | `@afenda/entitlements` | PKG006_ENTITLEMENTS | green | Partially Implemented | [FDR/[Partially Implemented] fdr-006-entitlements.md](FDR/%5BPartially%20Implemented%5D%20fdr-006-entitlements.md) |
| 9 | fdr-006-feature-manifest | PKG-006 | `@afenda/entitlements` | PKG006_FEATURE_MANIFEST | green | Partially Implemented | [FDR/[Partially Implemented] fdr-006-feature-manifest.md](FDR/%5BPartially%20Implemented%5D%20fdr-006-feature-manifest.md) |
| 10 | fdr-007-system-admin | PKG-007 | `@afenda/erp` | PKG007_ADMIN | green | Partially Implemented | [FDR/[Partially Implemented] fdr-007-system-admin.md](FDR/%5BPartially%20Implemented%5D%20fdr-007-system-admin.md) — **29/30 audit-adjusted · ARCH-ADMIN-001 Slices 1–6 delivered · settings observability waiver closed in ARCH · DoD #14 peer review pending** |
| 11 | fdr-007-operating-context | PKG-007 | `@afenda/erp` | PKG007_CONTEXT | green | Partially Implemented | [FDR/[Partially Implemented] fdr-007-operating-context.md](FDR/%5BPartially%20Implemented%5D%20fdr-007-operating-context.md) |
| 12 | fdr-007-api-governance | PKG-007 | `@afenda/erp` | PKG007_CONTEXT | green | Partially Implemented | [FDR/[Partially Implemented] fdr-007-api-governance.md](FDR/%5BPartially%20Implemented%5D%20fdr-007-api-governance.md) |
| 13 | fdr-007-ux-surfaces | PKG-007 | `@afenda/erp` | — | — | Partially Implemented | [FDR/[Partially Implemented] fdr-007-ux-surfaces.md](FDR/%5BPartially%20Implemented%5D%20fdr-007-ux-surfaces.md) |
| 14 | fdr-007-accounting-readiness | PKG-007 | `@afenda/erp` | — | green | Partially Implemented | [FDR/[Partially Implemented] fdr-007-accounting-readiness.md](FDR/%5BPartially%20Implemented%5D%20fdr-007-accounting-readiness.md) |
| 15 | fdr-008-outbox-jobs | PKG-008 | `@afenda/execution` | PKG008_EXECUTION | green | Complete | [FDR/[Complete] fdr-008-outbox-jobs.md](FDR/%5BComplete%5D%20fdr-008-outbox-jobs.md) |
| 16 | fdr-009-rollout-flags | PKG-009 | `@afenda/feature-flags` | PKG009_FEATURE_FLAGS | blue | Partially Implemented | [FDR/[Partially Implemented] fdr-009-rollout-flags.md](FDR/%5BPartially%20Implemented%5D%20fdr-009-rollout-flags.md) |
| 17 | fdr-010-context-contracts | PKG-010 | `@afenda/kernel` | PKG010_KERNEL | green | Partially Implemented | [FDR/[Partially Implemented] fdr-010-context-contracts.md](FDR/%5BPartially%20Implemented%5D%20fdr-010-context-contracts.md) |
| 18 | fdr-010-platform-authority | PKG-010 | `@afenda/kernel` | PKG010_KERNEL | green | Partially Implemented | [FDR/[Partially Implemented] fdr-010-platform-authority.md](FDR/%5BPartially%20Implemented%5D%20fdr-010-platform-authority.md) |
| 19 | fdr-010-master-data-authority | PKG-010 | `@afenda/kernel` | PKG010_KERNEL | green | Partially Implemented | [FDR/[Partially Implemented] fdr-010-master-data-authority.md](FDR/%5BPartially%20Implemented%5D%20fdr-010-master-data-authority.md) |
| 20 | fdr-011-metadata-authority | PKG-011 | `@afenda/metadata` | — | — | Partially Implemented | [FDR/[Partially Implemented] fdr-011-metadata-authority.md](FDR/%5BPartially%20Implemented%5D%20fdr-011-metadata-authority.md) |
| 21 | fdr-012-metadata-renderers | PKG-012 | `@afenda/metadata-ui` | — | — | Partially Implemented | [FDR/[Partially Implemented] fdr-012-metadata-renderers.md](FDR/%5BPartially%20Implemented%5D%20fdr-012-metadata-renderers.md) |
| 22 | fdr-013-audit-coverage | PKG-013 | `@afenda/observability` | PKG013_AUDIT | green | Complete | [FDR/[Complete] fdr-013-audit-coverage.md](FDR/%5BComplete%5D%20fdr-013-audit-coverage.md) |
| 23 | fdr-013-logging-tracing | PKG-013 | `@afenda/observability` | PKG013_LOGGING | green | Complete | [FDR/[Complete] fdr-013-logging-tracing.md](FDR/%5BComplete%5D%20fdr-013-logging-tracing.md) |
| 24 | fdr-014-rbac | PKG-014 | `@afenda/permissions` | PKG014_PERMISSIONS | green | Complete | [FDR/[Complete] fdr-014-rbac.md](FDR/%5BComplete%5D%20fdr-014-rbac.md) |
| 25 | fdr-015-tenant-storage | PKG-015 | `@afenda/storage` | PKG015_STORAGE | — | Partially Implemented | [FDR/[Partially Implemented] fdr-015-tenant-storage.md](FDR/%5BPartially%20Implemented%5D%20fdr-015-tenant-storage.md) |
| 26 | fdr-016-test-utilities | PKG-016 | `@afenda/testing` | PKG016_TESTING | blue | Complete | [FDR/[Complete] fdr-016-test-utilities.md](FDR/%5BComplete%5D%20fdr-016-test-utilities.md) — **26/30 audit-adjusted** |
| 27 | fdr-017-ts-config | PKG-017 | `@afenda/typescript-config` | PKG017_TS_CONFIG | blue | Partially Implemented | [FDR/[Partially Implemented] fdr-017-ts-config.md](FDR/%5BPartially%20Implemented%5D%20fdr-017-ts-config.md) — **23/30 audit-adjusted** |
| 28 | fdr-018-governed-primitives | PKG-018 | `@afenda/ui` | PKG018_UI | amber | Partially Implemented | [FDR/[Not started] fdr-018-governed-primitives.md](FDR/%5BNot%20started%5D%20fdr-018-governed-primitives.md) — **Research Slice 1 ✓ · 21/30 audit-adjusted** · Slice 2 test debt |
| 29 | fdr-018-ui-consumption | PKG-018 | `@afenda/ui` | PKG018_UI | green | Not started | [FDR/[Not started] fdr-018-ui-consumption.md](FDR/%5BNot%20started%5D%20fdr-018-ui-consumption.md) |
| 30 | fdr-019-architecture-maps | PKG-019 | `@afenda/architecture-authority` | — | — | Partially Implemented | [FDR/[Partially Implemented] fdr-019-architecture-maps.md](FDR/%5BPartially%20Implemented%5D%20fdr-019-architecture-maps.md) — **Research Slice 1 ✓ · 22/30 audit-adjusted** · Slice 2 registry-sync pending |
| 31 | fdr-020-ai-governance | PKG-020 | `@afenda/ai-governance` | — | — | Not started | [FDR/[Not started] fdr-020-ai-governance.md](FDR/%5BNot%20started%5D%20fdr-020-ai-governance.md) — **22/30 audit-adjusted** · Research Slice 1 ✓ · Slice 2 registry onboard pending |
| 32 | fdr-021-storybook | PKG-021 | `@afenda/storybook` | — | — | Not started | [FDR/[Not started] fdr-021-storybook.md](FDR/%5BNot%20started%5D%20fdr-021-storybook.md) — **Research Slice 1 ✓ · 18/30 audit-adjusted** · gates: `typecheck`, `test:storybook:run` |
| 33 | fdr-r01-accounting-contracts | PKG-R01 | `@afenda/accounting` | PKGR01_ACCOUNTING | green | Complete (authority only) | [FDR/[Complete (authority only)] fdr-r01-accounting-contracts.md](FDR/%5BComplete%20(authority%20only)%5D%20fdr-r01-accounting-contracts.md) |

**Legacy TIP evidence** (archive — map during stub authoring): see [`tip-status-index.md`](tip-status-index.md) §Canonical delivery TIPs; registry `legacyTipEvidence[]` on disposition entries.

---

## §FDR catalog by PKG

Grouped view for package owners. Row counts per PKG must sum to **33**.

### PKG-001 — `@afenda/appshell`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-001-shell-composition | PKG001_APPSHELL | Partially Implemented | Shell contracts + ERP wiring — **29/30 audit-adjusted** · DoD #14 peer review pending · studio blocks governed (per-block skill pipeline; no bulk migration FDR) |
| fdr-001-manifest-nav | PKG001_APPSHELL | Complete | Manifest nav — **enterprise 9.5 accepted** (29/30) |

### PKG-002 — `@afenda/auth`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-002-auth-disposition | PKG002_AUTH | Complete | Identity, session, operating-context bridge — **enterprise 9.5 accepted** (29/30) |

**ARCH extension ([ARCH-AUTH-001](../ARCH/%5BComplete%5D%20ARCH-AUTH-001-enterprise-authentication.md)):** Slices 1–17 delivered (134 PKG tests exit 0; DoD #15 RBAC gate Slice 16 · 2026-06-26). ARCH **Complete — enterprise 9.5 accepted** (Slice 17 · 2026-06-26).

### PKG-003 — `@afenda/database`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-003-persistence | PKG003_DATABASE | Partially Implemented | Schema, migrations, Drizzle authority |
| fdr-003-tenant-rls | PKG003_DATABASE | Complete | Tenant RLS — **enterprise 9.5 accepted** (29/30) |

### PKG-004 — `@afenda/design-system`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-004-design-authority | — | Partially Implemented | Tokens, recipes — no runtime UI |

### PKG-005 — `@afenda/docs`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-005-docs-app | — | Complete — enterprise 9.5 accepted | Fumadocs delivery surface — DoD #14 closed 2026-06-25 |

### PKG-006 — `@afenda/entitlements`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-006-entitlements | PKG006_ENTITLEMENTS | Partially Implemented | Entitlement evaluation — **26/30 audit-adjusted** · DoD #14 peer review pending |
| fdr-006-feature-manifest | PKG006_FEATURE_MANIFEST | Partially Implemented | Module/capability manifest — **27/30 audit-adjusted** · DoD #14 peer review pending |

### PKG-007 — `@afenda/erp`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-007-system-admin | PKG007_ADMIN | Partially Implemented | System Admin control plane — **29/30 audit-adjusted · ARCH-ADMIN-001 Slices 1–6 delivered · settings observability waiver closed in ARCH (FDR body may cite until separate FDR evidence-sync) · DoD #14 peer review pending** |
| fdr-007-operating-context | PKG007_CONTEXT | Partially Implemented | Operating context resolver pipeline — **27/30 audit · 29/30 ceiling** |
| fdr-007-api-governance | PKG007_CONTEXT | Partially Implemented | API contract registry + envelope — **27/30 audit · 29/30 ceiling** |
| fdr-007-ux-surfaces | — | Partially Implemented | Governed ERP app surfaces (TIP-UI-05) — **26/30 audit · 28/30 ceiling** |
| fdr-007-accounting-readiness | — | Partially Implemented | Phase 9 readiness gate + diagnostics — **28/30 audit · 29/30 ceiling** |

### PKG-008 — `@afenda/execution`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-008-outbox-jobs | PKG008_EXECUTION | Complete | Outbox publish + Trigger.dev worker — **enterprise 9.5 accepted** (29/30) |

### PKG-009 — `@afenda/feature-flags`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-009-rollout-flags | PKG009_FEATURE_FLAGS | Partially Implemented | Rollout evaluation + ERP wiring — **29/30 audit-adjusted** · DoD #14 peer review pending |

### PKG-010 — `@afenda/kernel`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-010-context-contracts | PKG010_KERNEL | Partially Implemented | Operating-context contract barrel (27/30 audit · 29/30 ceiling) |
| fdr-010-platform-authority | PKG010_KERNEL | Partially Implemented | Platform entity authority (TIP-007) (27/30 audit · 29/30 ceiling) |
| fdr-010-master-data-authority | PKG010_KERNEL | Partially Implemented | Business master data wire contracts (TIP-008B) (27/30 audit · 29/30 ceiling) |

### PKG-011 — `@afenda/metadata`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-011-metadata-authority | — | Partially Implemented | Metadata architecture contracts |

### PKG-012 — `@afenda/metadata-ui`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-012-metadata-renderers | — | Partially Implemented | Metadata-driven renderers + ERP routes |

### PKG-013 — `@afenda/observability`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-013-audit-coverage | PKG013_AUDIT | Complete | Governed mutation audit registry — **Complete — enterprise 9.5 accepted** (29/30) |
| fdr-013-logging-tracing | PKG013_LOGGING | Complete | Pino logging, correlation, spine lifecycle — **Complete — enterprise 9.5 accepted** (29/30) |

### PKG-014 — `@afenda/permissions`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-014-rbac | PKG014_PERMISSIONS | Complete | Permission registry + policy engine — **enterprise 9.5 accepted** (29/30) |

### PKG-015 — `@afenda/storage`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-015-tenant-storage | PKG015_STORAGE | Partially Implemented | Tenant-scoped storage abstraction — **29/30 audit-adjusted** · DoD #14 peer review pending |

### PKG-016 — `@afenda/testing`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-016-test-utilities | PKG016_TESTING | Complete | Shared test utilities — **26/30** · pyramid CI attested via ARCH-TEST-001 |

### PKG-017 — `@afenda/typescript-config`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-017-ts-config | PKG017_TS_CONFIG | Partially Implemented | TS compiler presets — **23/30 audit-adjusted** · Slice 3 e2e drift pending |

### PKG-018 — `@afenda/ui`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-018-governed-primitives | PKG018_UI | Partially Implemented | Primitive governance — **21/30 audit-adjusted** · Research Slice 1 ✓ · Slice 2 `ui-test-run-debt` |
| fdr-018-ui-consumption | PKG018_UI | Not started | TIP-004 consumer rules — **24/30 audit-adjusted** |

### PKG-019 — `@afenda/architecture-authority`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-019-architecture-maps | — | Partially Implemented | Architecture validators — **22/30 audit-adjusted** · Research Slice 1 ✓ · Slice 2 `PKG019_*` registry onboard |

### PKG-020 — `@afenda/ai-governance`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-020-ai-governance | — | Not started | AI governance — **22/30 audit-adjusted** (hard cap) · Research Slice 1 ✓ · baseline + scope gates exit 0 |

### PKG-021 — `@afenda/storybook`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-021-storybook | — | Not started | Visual gate — **18/30 audit-adjusted** · Research Slice 1 ✓ · gates: `pnpm --filter @afenda/storybook typecheck`, `pnpm --filter @afenda/storybook test:storybook:run` · Slice 2 `PKG021_*` registry onboard |

### PKG-R01 — `@afenda/accounting`

| FDR ID | Registry | Status | Domain |
| --- | --- | --- | --- |
| fdr-r01-accounting-contracts | PKGR01_ACCOUNTING | Complete (authority only) | Domain contracts — **29/30 audit-adjusted**; no ledger runtime |

---

## §Do not start yet

| Target | Reason |
| --- | --- |
| PKG-R02–R05 domain packages | ADR before filesystem — no FDR rows until registry promotion |
| TIP-015+ ledger/posting | ADR-0010 — no Drizzle COA/journal until new ADR |
| TIP-UI-06 ref-as-prop batch | Blocked on ADR-0008 |
| New FDR IDs outside §FDR register | Add row here first — then author doc via `write-fdr` |

---

## Status vocabulary

| Status | Meaning |
| --- | --- |
| **Not started** | Default for Phase 2 scaffolds; no FDR delivery evidence yet — Research Slice 1 required |
| **Partially Implemented** | Evidence exists; gaps in §Remaining gaps |
| **Complete (authority only)** | Contracts only — by design |
| **Complete** | Evidence + gates pass |
| **Maintain Only** | Green; no upgrade slices scheduled |
| **Blocked** | ADR or black-lane dependency |

---

## TIP quarantine

Do not author new TIP delivery docs. Do not use `tip-status-index` as implementation authority for new work.

---

## Subagent invocation

| Task | Agent |
| --- | --- |
| Author FDR | `write-fdr` skill |
| Author slice | `write-fdr-slice` skill |
| Implement slice | `fdr-slice-implementer` |
| Parallel batch | `fdr-orchestrator` |
| Registry edit | `foundation-registry-owner` |
| Doc sync | `documentation-drift` |

---

*2026-06-25 — Catalog reconciled: 22 active PKG · 33 FDR register rows · 7 multi-FDR packages*
