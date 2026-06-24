# TIP-014 — Accounting Core Contracts

| Field | Value |
| --- | --- |
| **Status** | Complete (authority only) |
| **Authority status** | **Accepted** — ADR-0015 contracts-only activation (all slices delivered) |
| **Runtime evidence** | `@afenda/accounting` contracts-only package; governance gate; PKG-R01 foundation disposition |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Post Phase 9 — Accounting Core Contracts (ADR-0015 boundary) |
| **Remaining gap** | TIP-015+ runtime schemas/posting (separate ADR) |

## Purpose

Freeze Accounting domain **contract vocabulary** — branded IDs, closed enums, wire contexts, permission keys, and audit action constants — before any chart-of-accounts schema, journal posting, or ERP accounting UI (TIP-015+).

ADR-0010 authority: Phase 9 gate passed 2026-06-24; **contracts-only** work is permitted. Ledger posting, Drizzle accounting schemas, and `@afenda/accounting` runtime services remain prohibited until ADR-0015 acceptance **and** a future runtime ADR for TIP-015+.

ADR-0015 authority: PKG-R01 may activate as `contracts-only`; kernel retains readiness contracts only; `@afenda/accounting` owns domain wire vocabulary.

Enterprise benchmark: Oracle FDD contract freeze + SAP namespace governance (`pnpm quality:architecture`, `pnpm check:foundation-disposition`).

## Scope

**In scope**

- ADR-0015 acceptance (contracts-only PKG-R01 activation)
- `@afenda/accounting` package scaffold (`packages/accounting/`) — contracts + tests only
- Domain authority contracts: account types, journal document types, fiscal period states, posting status vocabulary (labels only — no arithmetic)
- Branded ID contracts: `AccountId`, `JournalEntryId`, `FiscalPeriodId`, `LedgerAccountCode` (wire string brands)
- `AccountingDomainWireContext` — serializable slice bridging kernel `AccountingReadinessContext`
- Permission key expansion in `@afenda/permissions` (COA, fiscal period, journal vocabulary aligned to contracts)
- `ACCOUNTING_AUDIT_ACTIONS` constant registry (observability-compatible dot notation)
- Architecture-authority PKG-R01 promotion + dependency registry edge (`@afenda/accounting` → `@afenda/kernel`)
- Governance script `check:accounting-domain-contracts` — prohibits Drizzle, posting services, ERP imports
- Foundation disposition entry for PKG-R01 (green-lane, contracts-only gates)
- Runtime matrix + tip-status-index sync

**Out of scope**

- Drizzle schemas, migrations, SQL, or `@afenda/database` dependency in `@afenda/accounting` (**TIP-015**)
- Chart of accounts CRUD, journal posting, ledger balance calculation (**TIP-015**, **TIP-016**)
- ERP accounting module routes, System Admin accounting pages, or `@afenda/ui` surfaces
- Vietnam localization rules in domain code (**TIP-018**)
- Consolidation elimination arithmetic (kernel consolidation scope remains context-only per ADR-0011)
- `@afenda/inventory` / cross-domain posting (**TIP-019+**)
- Replacing or moving `packages/kernel/src/context/accounting-readiness.contract.ts` (kernel-owned readiness)
- MFA, SSO, i18n, multi-currency runtime

**Sign-off prerequisite:** [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) (2026-06-24)

## Runtime evidence (2026-06-24)

| Artifact | Path | Proven |
| --- | --- | --- |
| Phase 9 gate sign-off | `docs/architecture/phase-9-accounting-readiness-sign-off.md` | Yes — prerequisite |
| Kernel readiness bridge | `packages/kernel/src/context/accounting-readiness.contract.ts` | Yes — upstream |
| Journal permission stubs | `packages/permissions/src/grants/permission.contract.ts` (`accounting.*`) | Yes — Slice 4 |
| Audit action vocabulary | `packages/accounting/src/contracts/accounting-audit-actions.contract.ts` | Yes — Slice 4 |
| Permission vocabulary parity | `packages/accounting/src/contracts/accounting-permission-vocabulary.contract.ts` | Yes — Slice 4 |
| `@afenda/accounting` package | `packages/accounting/` | Yes — Slice 2 |
| Authority contract barrel | `packages/accounting/src/contracts/accounting-authority.contract.ts` | Yes — Slice 2 |
| ADR-0015 | `docs/adr/ADR-0015-accounting-domain-contracts-only-activation.md` | Yes — Slice 1 |
| PKG-R01 registry promotion | `packages/architecture-authority/src/data/package-registry.data.ts` | Yes — Slice 1 |
| Accounting → kernel dependency edge | `packages/architecture-authority/src/data/dependency-registry.data.ts` | Yes — Slice 2 |
| Domain vocabulary + kernel bridge | `packages/accounting/src/contracts/`, `packages/accounting/src/bridge/` | Yes — Slice 3 |
| Accounting domain contracts gate | `scripts/governance/check-accounting-domain-contracts.mts` | Yes — Slice 5 |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/accounting` (PKG-R01) | Accounting domain authority contracts (contracts-only lifecycle) |
| `@afenda/kernel` (PKG-010) | Upstream readiness context — **consume only**, no import of `@afenda/accounting` |
| `@afenda/permissions` (PKG-008) | Permission key registry expansion for accounting vocabulary |
| `@afenda/architecture-authority` (PKG-019) | PKG-R01 registry promotion + dependency edge |
| `@afenda/observability` (PKG-014) | Audit action shape reference — accounting exports constants only |

## Depends on

- TIP-013A — Phase 9 Accounting Readiness Gate **Complete** (signed off 2026-06-24)
- TIP-008A — Consolidation scope + entity hierarchy (**Complete**)
- TIP-008B — Business master data authority map (**Complete**, authority only)
- TIP-007 — Platform authority barrel (**Complete**)
- TIP-010 / TIP-010A — RBAC + API contract governance (**Complete**)
- ADR-0010, ADR-0011, ADR-0014 — binding constraints

## Blocks

- TIP-015 — Chart of accounts (schemas + persistence)
- TIP-016 — General ledger & journals (posting runtime)
- TIP-017 — AP/AR foundation
- TIP-018 — Vietnam localization
- TIP-019–024 — Domain posting integrations and reports

## TypeScript architecture constraints

Principal-architect rules for every slice (enterprise 9.5+ target):

| # | Constraint | Enforcement |
| --- | --- | --- |
| 1 | All public wire types JSON-serializable | `AssertJsonSerializable<T>` compile-time guards (pattern from kernel readiness) |
| 2 | Branded IDs via `brandRequiredId` / `brandOptionalId` — no raw string IDs in public API | Contract tests + `typecheck` |
| 3 | Closed vocabularies as `as const` arrays + derived union types — no string enums | Biome + review |
| 4 | No `any`, no non-null assertions in contracts | `strict` tsconfig |
| 5 | No circular imports: `@afenda/accounting` → `@afenda/kernel` only; kernel never imports accounting | `pnpm quality:boundaries` |
| 6 | No `@afenda/database` in `@afenda/accounting` package.json until TIP-015 ADR | `check:accounting-domain-contracts` |
| 7 | Public API via curated `index.ts` — no deep imports from consumers | architecture surface gate |
| 8 | Permission keys only in `@afenda/permissions`; accounting exports `ACCOUNTING_PERMISSION_DOMAINS` vocabulary constants | parity test |
| 9 | Audit actions as `module.action` dot strings matching observability validators | contract test |
| 10 | Prefer plain interfaces + type aliases over advanced conditional types | maintainability review |

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `docs/adr/ADR-0015-accounting-domain-contracts-only-activation.md` | — | Architecture | **New** → Accepted (Slice 1) | Architecture Authority |
| `docs/adr/README.md` | — | Architecture | Modified | — |
| `docs/architecture/package-registry.md` | — | Architecture | Modified (PKG-R01 active, contracts-only) | Architecture Authority |
| `packages/architecture-authority/src/data/package-registry.data.ts` | `@afenda/architecture-authority` | Platform | Modified | foundation-registry-owner |
| `packages/architecture-authority/src/data/dependency-registry.data.ts` | `@afenda/architecture-authority` | Platform | Modified | foundation-registry-owner |
| `packages/accounting/package.json` | `@afenda/accounting` | Domain | **New** | ADR-0015 |
| `packages/accounting/tsconfig.json` | `@afenda/accounting` | Domain | **New** | — |
| `packages/accounting/vitest.config.ts` | `@afenda/accounting` | Domain | **New** | — |
| `packages/accounting/src/index.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/contracts/accounting-authority.contract.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/contracts/accounting-id.contract.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/contracts/account-type.contract.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/contracts/fiscal-period-state.contract.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/contracts/journal-document-type.contract.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/contracts/posting-status.contract.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/contracts/accounting-domain-wire-context.contract.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/contracts/accounting-audit-actions.contract.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/contracts/accounting-permission-vocabulary.contract.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/bridge/to-accounting-domain-context.ts` | `@afenda/accounting` | Domain | **New** | Accounting Authority |
| `packages/accounting/src/__tests__/accounting-domain-wire-serializable.test.ts` | `@afenda/accounting` | Domain | **New** | — |
| `packages/accounting/src/__tests__/accounting-id-boundary.test.ts` | `@afenda/accounting` | Domain | **New** | — |
| `packages/accounting/src/__tests__/to-accounting-domain-context.test.ts` | `@afenda/accounting` | Domain | **New** | — |
| `packages/permissions/src/grants/permission.contract.ts` | `@afenda/permissions` | Platform | Modified | Permission Authority |
| `packages/permissions/src/__tests__/accounting-permission-registry.test.ts` | `@afenda/permissions` | Platform | **New** | — |
| `scripts/governance/check-accounting-domain-contracts.mts` | repo root | Platform | **New** | Architecture Authority |
| `scripts/governance/accounting-domain-contracts-registry.mts` | repo root | Platform | **New** | — |
| `scripts/governance/__tests__/check-accounting-domain-contracts.test.ts` | repo root | Platform | **New** | — |
| `package.json` (root) | repo root | Platform | Modified (`check:accounting-domain-contracts`) | — |
| `.github/workflows/ci.yml` | repo root | Platform | Modified (Gate 3g) | — |
| `packages/architecture-authority/src/data/foundation-disposition.registry.ts` | `@afenda/architecture-authority` | Platform | Modified (PKG-R01 entry) | foundation-registry-owner |
| `docs/architecture/afenda-runtime-truth-matrix.md` | — | Architecture | Modified | — |
| `docs/delivery/tip-status-index.md` | — | Delivery | Modified | — |
| `pnpm-workspace.yaml` | repo root | Platform | Unchanged (already `packages/*`) | — |

## Acceptance gate

- ADR-0015 status → **Accepted**
- `pnpm --filter @afenda/accounting typecheck`
- `pnpm --filter @afenda/accounting test:run`
- `pnpm --filter @afenda/permissions test:run`
- `pnpm quality:architecture` — PKG-R01 registered, dependency edge valid, no cycles
- `pnpm quality:boundaries` — no kernel → accounting import
- `pnpm check:accounting-domain-contracts` — no Drizzle, no posting services, no `@afenda/database` dep
- `pnpm check:foundation-disposition`
- `pnpm check:documentation-drift`
- `pnpm ci:biome`

## Acceptance criteria

```gherkin
GIVEN Phase 9 Accounting Readiness Gate is signed off (2026-06-24)
AND   ADR-0015 is Accepted
WHEN  the @afenda/accounting contracts-only package is built
THEN  all exported wire types pass JSON serializability compile-time guards
AND   no Drizzle schema files exist under packages/accounting/
AND   @afenda/kernel does not import @afenda/accounting
AND   permission keys for accounting COA, fiscal period, and journal actions are registered in PERMISSION_REGISTRY
AND   ACCOUNTING_AUDIT_ACTIONS uses observability-compatible module.action strings
```

```gherkin
GIVEN a developer has kernel AccountingReadinessContext for Tenant A / Company A
WHEN  toAccountingDomainContext is called
THEN  the result is an AccountingDomainWireContext with matching tenantId and companyId
AND   no journal lines, balances, or posting amounts are present
AND   the output is JSON-serializable at rest
```

```gherkin
GIVEN a user operates under Company A
WHEN  an accounting permission check references PERMISSION_REGISTRY.accounting.coa.read
THEN  the key is a registered {domain}.{action} permission
AND   cross-company permission grants for Company B are not implied by the contract
```

```gherkin
GIVEN an agent attempts to add packages/accounting/src/schema/*.ts
WHEN  check:accounting-domain-contracts runs in CI
THEN  the gate fails with an explicit contracts-only violation
AND   TIP-015 remains the authority for COA schema work
```

## Definition of Done

| # | Criterion | Verification | Status |
| --- | --- | --- | --- |
| 1 | ADR-0015 Accepted with acceptance gate commands | `docs/adr/ADR-0015-*.md` status | [x] |
| 2 | `@afenda/accounting` package exists with contracts-only public API | `packages/accounting/src/index.ts` | [x] |
| 3 | Branded ID + vocabulary contracts exported | `pnpm --filter @afenda/accounting test:run` | [x] |
| 4 | Kernel bridge without reverse import | `pnpm quality:boundaries` | [x] |
| 5 | Permission registry expanded + parity test | `pnpm --filter @afenda/permissions test:run` | [x] |
| 6 | Audit action vocabulary exported | contract test in `@afenda/accounting` | [x] |
| 7 | PKG-R01 promoted in architecture-authority + human registries | `pnpm quality:architecture` | [x] |
| 8 | Foundation disposition PKG-R01 entry green-lane | `pnpm check:foundation-disposition` | [x] |
| 9 | Governance prohibition gate wired in CI | `pnpm check:accounting-domain-contracts` | [x] |
| 10 | TypeScript strict — no `any` | `pnpm --filter @afenda/accounting typecheck` | [x] |
| 11 | Biome clean | `pnpm ci:biome` | [x] |
| 12 | Runtime matrix updated | `afenda-runtime-truth-matrix.md` | [x] |
| 13 | TIP status index updated | `tip-status-index.md` | [x] |
| 14 | Drift guard passes | `pnpm check:documentation-drift` | [x] |
| 15 | Completion Report posted | afenda-coding-session §11 | [x] |

## Handoff to implementation

> **Mandatory before code edits.** One slice per coding session. Dependency order: ADR → registry → package contracts → permissions → governance → docs.

### Slice 1 — ADR-0015 acceptance + PKG-R01 registry promotion

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Phase 9 sign-off Complete (`phase-9-accounting-readiness-sign-off.md`); TIP-013A **Complete** in `tip-status-index.md`; pre-accounting foundation row = `implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Accept ADR-0015 (Proposed → Accepted) after Architecture Authority review.
- Promote PKG-R01 from `RESERVED_PACKAGES` to `ACTIVE_PACKAGES`: `lifecycle: "active"`, `filesystemRequired: false` until Slice 2 creates `packages/accounting/`.
- Dependency edge `@afenda/accounting` → `@afenda/kernel` deferred to **Slice 2** (snapshot gate requires filesystem package before registry edge count matches).
- Do **not** create `packages/accounting/` yet — registry and ADR only.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Not started] tip-014-accounting-core-contracts.md

1. Objective    — Accept ADR-0015 and promote PKG-R01 to active contracts-only in architecture registries without creating the filesystem package yet.
2. Allowed layer— packages/architecture-authority/src/data/ + docs/architecture/ + docs/adr/ + docs/delivery/
3. Files        — docs/adr/ADR-0015-accounting-domain-contracts-only-activation.md (Modified)
                  docs/adr/README.md (Modified)
                  docs/architecture/package-registry.md (Modified)
                  packages/architecture-authority/src/data/package-registry.data.ts (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
                  docs/delivery/tips/[Not started] tip-014-accounting-core-contracts.md (Modified)
4. Prohibited   — packages/accounting/ filesystem, dependency-registry edge (Slice 2), Drizzle schemas, @afenda/database dep, ledger/journal/posting, ERP routes, PERMISSION_REGISTRY expansion (Slice 4), kernel edits importing @afenda/accounting, foundation-disposition.registry.ts (Slice 5)
5. Authority    — ADR-0015 — Architecture Authority + Accounting Authority
6. Gates        — pnpm --filter @afenda/architecture-authority build
                  pnpm quality:architecture
                  pnpm quality:architecture-authority-surface
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | ADR-0015 Accepted | file status |
| 7 | PKG-R01 promoted (partial — data registries) | `pnpm quality:architecture` |

---

### Slice 2 — Package scaffold + authority contract barrel

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 1 delivered — ADR-0015 Accepted; PKG-R01 `lifecycle: active` in `package-registry.data.ts`

#### Design (internal-guide)

- Create `packages/accounting/` with strict-node tsconfig, vitest, build scripts mirroring `@afenda/execution` contract-only subset.
- Dependencies: `@afenda/kernel` workspace only (no database) — declared in `package.json` for architecture edge validation; runtime imports begin Slice 3.
- Declare `@afenda/accounting` → `@afenda/kernel` runtime edge in dependency registry + sync docs/snapshot.
- Set PKG-R01 `filesystemRequired: true` when package lands.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Not started] tip-014-accounting-core-contracts.md

1. Objective    — Scaffold @afenda/accounting package with authority contract barrel and zero runtime services.
2. Allowed layer— packages/accounting/ + packages/architecture-authority/src/data/ (registry sync only)
3. Files        — packages/accounting/package.json (New)
                  packages/accounting/tsconfig.json (New)
                  packages/accounting/tsconfig.vitest.json (New)
                  packages/accounting/vitest.config.ts (New)
                  packages/accounting/src/index.ts (New)
                  packages/accounting/src/contracts/accounting-authority.contract.ts (New)
                  packages/accounting/src/__tests__/index.test.ts (New)
                  packages/architecture-authority/src/data/package-registry.data.ts (Modified)
                  packages/architecture-authority/src/data/dependency-registry.data.ts (Modified)
                  docs/architecture/package-registry.md (Modified)
                  docs/architecture/dependency-registry.md (Modified)
                  docs/architecture/dependency-snapshot.json (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
                  docs/delivery/tips/[Not started] tip-014-accounting-core-contracts.md (Modified)
4. Prohibited   — @afenda/database, Drizzle, services/, schema/, apps/erp, packages/ui, posting logic, PERMISSION_REGISTRY edits, ledger/journal/COA runtime (ADR-0010 posting still blocked)
5. Authority    — ADR-0015 — Accounting Authority
6. Gates        — pnpm --filter @afenda/accounting typecheck
                  pnpm --filter @afenda/accounting test:run
                  pnpm --filter @afenda/architecture-authority build
                  pnpm quality:architecture
                  pnpm architecture:dependencies
                  pnpm quality:architecture-drift
                  pnpm quality:architecture-authority-surface
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 2 | Package exists | file path |
| 10 | TypeScript strict | typecheck |

---

### Slice 3 — Domain vocabulary + branded IDs + kernel bridge

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 2 delivered — `packages/accounting/` row = `partially-implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Branded IDs (`AccountId`, `JournalEntryId`, `FiscalPeriodId`, `LedgerAccountCode`) via kernel `brandRequiredId` — brand at trust boundaries only; wire interfaces use plain strings.
- Closed vocabularies: `ACCOUNT_TYPES`, `FISCAL_PERIOD_STATES`, `JOURNAL_DOCUMENT_TYPES`, `POSTING_STATUSES` — `as const` arrays + derived unions + narrowing guards.
- `AccountingDomainWireContext` — serializable authority slice (tenantId, companyId, currency codes, optional hierarchy refs); **no amounts, balances, or journal lines**.
- `toAccountingDomainContext(readiness)` maps kernel `AccountingReadinessContext` → domain wire context; one-way import (`@afenda/accounting` → `@afenda/kernel` only).
- `AssertJsonSerializable<T>` compile-time guards on wire exports (kernel readiness pattern).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Not started] tip-014-accounting-core-contracts.md

1. Objective    — Freeze accounting domain wire vocabulary and kernel readiness bridge with serializable contracts.
2. Allowed layer— packages/accounting/src/contracts/ + packages/accounting/src/bridge/
3. Files        — packages/accounting/src/contracts/accounting-id.contract.ts (New)
                  packages/accounting/src/contracts/account-type.contract.ts (New)
                  packages/accounting/src/contracts/fiscal-period-state.contract.ts (New)
                  packages/accounting/src/contracts/journal-document-type.contract.ts (New)
                  packages/accounting/src/contracts/posting-status.contract.ts (New)
                  packages/accounting/src/contracts/accounting-domain-wire-context.contract.ts (New)
                  packages/accounting/src/bridge/to-accounting-domain-context.ts (New)
                  packages/accounting/src/index.ts (Modified)
                  packages/accounting/src/__tests__/accounting-domain-wire-serializable.test.ts (New)
                  packages/accounting/src/__tests__/accounting-id-boundary.test.ts (New)
                  packages/accounting/src/__tests__/to-accounting-domain-context.test.ts (New)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
                  docs/delivery/tips/[Not started] tip-014-accounting-core-contracts.md (Modified)
4. Prohibited   — packages/kernel imports of @afenda/accounting, @afenda/database, Drizzle, schema/, services/, numeric posting/balance fields on wire context, PERMISSION_REGISTRY edits (Slice 4), audit-action contracts (Slice 4), ERP routes, ledger/journal/COA runtime (ADR-0010 posting blocked until TIP-015+)
5. Authority    — ADR-0015 + ADR-0011 — Accounting Authority
6. Gates        — pnpm --filter @afenda/accounting typecheck
                  pnpm --filter @afenda/accounting test:run
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 3 | Branded ID + vocabulary contracts exported | `pnpm --filter @afenda/accounting test:run` |
| 4 | Kernel bridge without reverse import | `pnpm quality:boundaries` |

#### Known debt

- Permission keys and audit actions deferred to Slice 4.
- `LedgerAccountCode` is a wire string brand only — COA persistence validation belongs to TIP-015.

---

### Slice 4 — Permission vocabulary + audit actions

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 3 delivered — domain vocabulary + kernel bridge proven in `packages/accounting/`; DoD rows #3–#4 closed

#### Design (internal-guide)

- Expand `PERMISSION_REGISTRY.accounting` with `coa`, `fiscalPeriod`, expanded `journal` keys aligned to Slice 3 vocabulary.
- Mirror new keys in `PLATFORM_PERMISSION_CATALOG` (database seed catalog — required by `seed-catalog-alignment` gate).
- Export `ACCOUNTING_AUDIT_ACTIONS` (observability-compatible `module.action` strings) and `ACCOUNTING_PERMISSION_DOMAINS` from `@afenda/accounting`.
- Parity test in `@afenda/permissions` asserts every vocabulary domain/action resolves to a registered key (no cross-package import — boundary safe).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Not started] tip-014-accounting-core-contracts.md

1. Objective    — Register accounting permission keys and audit action vocabulary aligned to frozen contracts.
2. Allowed layer— packages/permissions/src/grants/ + packages/permissions/src/__tests__/ + packages/accounting/src/contracts/ + packages/database/src/seeds/
3. Files        — packages/permissions/src/grants/permission.contract.ts (Modified)
                  packages/permissions/src/__tests__/accounting-permission-registry.test.ts (New)
                  packages/database/src/seeds/platform-permissions.catalog.ts (Modified)
                  packages/accounting/src/contracts/accounting-audit-actions.contract.ts (New)
                  packages/accounting/src/contracts/accounting-permission-vocabulary.contract.ts (New)
                  packages/accounting/src/__tests__/accounting-audit-actions.test.ts (New)
                  packages/accounting/src/index.ts (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
                  docs/delivery/tips/[Not started] tip-014-accounting-core-contracts.md (Modified)
4. Prohibited   — ERP route wiring, RBAC enforcement beyond registry, Drizzle migrations, apps/erp edits, packages/ui, ledger/posting runtime (ADR-0010 until TIP-015+), foundation-disposition.registry.ts (Slice 5), kernel imports of @afenda/accounting
5. Authority    — ADR-0015 — Permission Authority + Accounting Authority
6. Gates        — pnpm --filter @afenda/permissions typecheck
                  pnpm --filter @afenda/permissions test:run
                  pnpm --filter @afenda/accounting typecheck
                  pnpm --filter @afenda/accounting test:run
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 5 | Permission registry expanded + parity test | `pnpm --filter @afenda/permissions test:run` |
| 6 | Audit action vocabulary exported | `pnpm --filter @afenda/accounting test:run` |

#### Known debt

- Observability `RESERVED_AUDIT_ACTIONS` merge deferred — accounting exports vocabulary only; runtime registration in Slice 5+ if needed.
- ERP manifest `/modules/accounting` still non-functional until TIP-015+.

### Slice 5 — Governance gate + foundation disposition + documentation closeout

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slices 1–4 delivered — permission + audit vocabulary proven; DoD rows #5–#6 closed

#### Design (internal-guide)

- `check:accounting-domain-contracts` scans `packages/accounting` for forbidden dirs (`schema/`, `services/`), `@afenda/database` / Drizzle imports, disallowed runtime deps, and posting `.server.ts` surfaces.
- Registry module holds canonical prohibition list + surface rule for architecture-authority evidence paths.
- PKG-R01 `PKGR01_ACCOUNTING` foundation-disposition entry — green-lane, contracts-only gates (ADR-0015).
- Wire CI Gate 3h + root `package.json` script; sync runtime matrix + tip-status-index; rename TIP doc to `[Complete (authority only)]`.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Not started] tip-014-accounting-core-contracts.md

1. Objective    — Wire accounting contracts-only CI gate, foundation disposition entry, and documentation sync for TIP-014 closeout.
2. Allowed layer— scripts/governance/ + packages/architecture-authority/src/data/ + docs/
3. Files        — scripts/governance/check-accounting-domain-contracts.mts (New)
                  scripts/governance/accounting-domain-contracts-registry.mts (New)
                  scripts/governance/__tests__/check-accounting-domain-contracts.test.ts (New)
                  package.json (Modified)
                  .github/workflows/ci.yml (Modified)
                  packages/architecture-authority/src/data/foundation-disposition.registry.ts (Modified)
                  docs/architecture/foundation-disposition.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
                  docs/delivery/tips/[Not started] tip-014-accounting-core-contracts.md (Modified + rename to [Complete (authority only)])
4. Prohibited   — TIP-015 Drizzle schema work, ERP accounting UI, ledger posting runtime, marking TIP-014 Complete (runtime) — use Complete (authority only); apps/erp edits; packages/ui
5. Authority    — ADR-0014 + ADR-0015 — Architecture Authority (foundation-registry-owner for disposition)
6. Gates        — pnpm check:accounting-domain-contracts
                  pnpm check:foundation-disposition
                  pnpm check:documentation-drift
                  pnpm quality:architecture
                  pnpm ci:biome
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 8 | Foundation disposition PKG-R01 entry green-lane | `pnpm check:foundation-disposition` |
| 9 | Governance prohibition gate wired in CI | `pnpm check:accounting-domain-contracts` |

#### Known debt

- TIP-015 requires separate ADR amendment for Drizzle schema activation.
- ERP manifest `/modules/accounting` remains non-functional until TIP-015+.
- Observability `RESERVED_AUDIT_ACTIONS` merge with `ACCOUNTING_AUDIT_ACTIONS` deferred.

### Slice 6 — Post-closeout risk hardening

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 5 delivered — `check:accounting-domain-contracts` in CI Gate 3h; PKGR01 foundation disposition fingerprint v4 proven

#### Design (internal-guide)

- Wire `check:accounting-domain-contracts` into `quality:release-gate` meta-check and root `quality:` aggregator so TIP-015 Drizzle drift cannot bypass PR-only CI.
- Extract pure posting-surface detectors; add negative contract tests proving Drizzle/schema violations fail and benign `.server.ts` / bridge files do not false-positive.
- Extend gate with ERP accounting UI drift scan: no dedicated `modules/accounting` app routes, no production `@afenda/accounting` imports in `apps/erp/src` until TIP-015+.
- Add release-verification Gate 8g mirroring CI Gate 3h.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Complete (authority only)] tip-014-accounting-core-contracts.md

1. Objective    — Harden TIP-014 post-closeout risks by wiring the accounting contracts gate into release meta-check, adding ERP UI drift detection, and negative contract tests for Drizzle/posting false positives.
2. Allowed layer— scripts/governance/ + scripts/quality/ + docs/ + package.json + .github/workflows/
3. Files        — scripts/governance/accounting-domain-contracts-registry.mts (Modified)
                  scripts/governance/check-accounting-domain-contracts.mts (Modified)
                  scripts/governance/__tests__/check-accounting-domain-contracts.test.ts (Modified)
                  scripts/quality/check-release-gates.mjs (Modified)
                  package.json (Modified)
                  .github/workflows/release-verification.yml (Modified)
                  docs/delivery/tips/[Complete (authority only)] tip-014-accounting-core-contracts.md (Modified)
4. Prohibited   — TIP-015 Drizzle schema work, ERP accounting UI implementation, packages/accounting runtime/posting changes, packages/ui, foundation-disposition.registry.ts fingerprint bump unless evidence paths change, kernel imports of @afenda/accounting
5. Authority    — ADR-0015 — Architecture Authority
6. Gates        — pnpm check:accounting-domain-contracts
                  pnpm quality:release-gate
                  pnpm vitest run scripts/governance/__tests__/check-accounting-domain-contracts.test.ts
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| R1 | Release meta-check includes accounting contracts gate | `pnpm quality:release-gate` | [x] |
| R2 | Negative Drizzle/posting detection + `.server.ts` false-positive regression | `pnpm vitest run scripts/governance/__tests__/check-accounting-domain-contracts.test.ts` | [x] |
| R3 | ERP accounting UI drift blocked at gate | `pnpm check:accounting-domain-contracts` | [x] |

#### Known debt

- ERP `/modules/accounting` remains manifest placeholder only until TIP-015+ — gate enforces absence of premature UI, not delivery of UI.
- TIP-015 still requires separate ADR before Drizzle schema activation.

## Verdict

**Complete (authority only)** — ADR-0015 Accepted; all TIP-014 slices delivered. `@afenda/accounting` contracts-only package, permission vocabulary, audit actions, and `check:accounting-domain-contracts` gate are proven. Ledger posting and COA Drizzle schemas remain prohibited until TIP-015+ ADR.
