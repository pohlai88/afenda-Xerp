---
name: architecture-authority
description: Enforces the @afenda/architecture-authority boundary: package registry, layer rules, dependency boundaries, ownership, foundation disposition pointers, exception registry, and architecture quality gates. Use when touching packages/architecture-authority, architecture registries, pnpm quality:architecture, foundation disposition, or package/layer boundary questions.
disable-model-invocation: false
---

# @afenda/architecture-authority — Authority Skill (PAS-002)

## PAS rollout status (mirror header — sync on slice close)

| Field | Value |
| --- | --- |
| **Runtime status** | B1–B27 delivered — registries, composite gates, lifecycle enforcement, skill chain synced |
| **Remaining slices** | none |

> **Maturity labels:** PAS-002 = MVP charter; **Enterprise Accepted** on `PKGR02` is attested via [PAS-002A](../../../docs/PAS/PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) B38–B42. `runtime stance: contracts-only` = **permanent** — no ERP hot-path execution even at Enterprise Accepted. See [PAS-002A §1.4](../../../docs/PAS/PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md#14-resolving-the-partial--none-confusion).

> Canonical: [`docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md`](../../../docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md) · Enterprise hardening: [`PAS-002A`](../../../docs/PAS/PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) · Closure: [`pas-status-index.md`](../../../docs/PAS/pas-status-index.md)

---

## Boundary (one sentence)

`@afenda/architecture-authority` **owns architecture registries, package lifecycle truth, layer rules, dependency boundaries, ownership records, drift policy, and architecture quality gates; it never owns product behavior, business master data, Kernel identity primitives, UI behavior, database migrations, auth/session behavior, or ERP module implementation.**

---

## When to use this skill

Apply this skill when touching:

- `packages/architecture-authority/**`
- any `@afenda/architecture-authority` import (root or `/surface` only)
- `src/data/*-registry*.ts`, `foundation-disposition.registry.ts`, `business-master-data-*.policy.ts`
- `src/validators/validate-*.ts`, `src/surface/architecture-authority-surface-registry.ts`
- `pnpm quality:architecture`, `pnpm architecture:cycles`, `pnpm architecture:drift`, `pnpm check:foundation-disposition`
- package registration, layer assignment, dependency edge, or ownership questions
- foundation disposition status (read-only unless delegated to `foundation-registry-owner`)

**Kernel boundary:** Canonical enterprise ID families, parsers, and wire contracts live in `@afenda/kernel` ([PAS-001](../../../docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md)). Do not duplicate ID semantics here.

**Enterprise knowledge boundary:** Knowledge Atoms and accepted business meaning → [PAS-004](../../../docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) / `.cursor/skills/enterprise-knowledge/SKILL.md`. Package listing for `@afenda/enterprise-knowledge` belongs here; atom source files do not.

---

## Decision matrix

> Can this belong in architecture-authority?

| Question | If yes → | In this package? |
| --- | --- | --- |
| Does the change add or rename an Afenda package? | Update package registry and ownership registry. | **Yes** |
| Does the change assign a package to a layer? | Update layer registry. | **Yes** |
| Does the change define allowed dependency direction? | Update layer/boundary rules. | **Yes** |
| Does the change record who owns a package? | Update ownership registry. | **Yes** |
| Does the change record an approved ADR architecture exception? | Update exception registry. | **Yes** |
| Does the change enforce package/layer quality gates? | Update architecture gate code. | **Yes** |
| Does the change define canonical ID format such as `ten_...` or `cus_...`? | Belongs to Kernel. | **No** |
| Does the change define employee/customer/product business master data? | Belongs to business modules. | **No** |
| Does the change define UI component variants or tokens? | Belongs to design-system/ui authority. | **No** |
| Does the change define database schema or RLS policy? | Belongs to database authority. | **No** |
| Does the change define auth sign-in/session behavior? | Belongs to auth authority. | **No** |
| Does the change define AppShell navigation rendering? | Belongs to AppShell authority. | **No** |
| Does the change define ERP business route behavior? | Belongs to Application/module authority. | **No** |
| Does the change define delivery status pointers for foundation packages? | Update foundation disposition registry. | **Yes** |
| Does the change assign a business entity to a domain package (ADR-0020)? | Update business-master-data authority registry. | **Yes** |
| Does the change add Kernel wire/parser behavior for an enterprise ID? | Belongs to `@afenda/kernel`. | **No** |

---

## Hard stops

### Prohibited imports — never add these to architecture-authority

```
apps/erp  apps/email
@afenda/appshell  @afenda/ui  @afenda/design-system  @afenda/metadata-ui
@afenda/database  @afenda/auth  @afenda/execution  @afenda/observability  @afenda/email
HRM  CRM  Inventory  Accounting  Finance  Procurement  Sales  Manufacturing business modules
Next.js  React  browser UI frameworks  auth SDKs  database clients  queue providers  external runtime SDKs
```

### Architecture authority must never own

```
Business master data records (customer, supplier, employee, product, warehouse, document, asset, COA, BOM, price list, payroll)
Kernel canonical identity family semantics or ID parser/generator behavior
Auth/session behavior  RBAC permission evaluation  database schema migrations  RLS implementation
Outbox publishing  audit event writing  UI primitives/tokens/variants/recipes/className policy
AppShell layout/route/navigation rendering  ERP route implementation
Business module workflows (HRM, CRM, Inventory, Accounting, Procurement, Sales, Manufacturing, Finance)
Vendor SDK implementation  environment secrets  feature implementation logic
Long-form ADR/PAS narrative duplication inside source
```

### Foundation disposition registry

```
Do not edit foundation-disposition.registry.ts in ad-hoc slices — delegate to foundation-registry-owner only.
```

### Documentation-only slices

When the task is **explicitly documentation or skill maintenance only**, add:

```
Do not modify packages/architecture-authority/src/**
Do not change package exports
Do not mark any runtime capability complete
```

For implementation slices, the Phase 0 contract governs scope — not this list.

---

## Phase 0 — architecture-authority change contract

Before editing any architecture-authority file, state these six lines:

```
1. Objective       — the exact change, in one sentence
2. Allowed layer   — packages/architecture-authority only (or docs/skill paths for governance slices)
3. Files to change — explicit list
4. Prohibited      — packages/apps that must not be touched
5. Authority       — Architecture Authority (PAS-002)
6. Gates           — pnpm --filter @afenda/architecture-authority typecheck
                     pnpm --filter @afenda/architecture-authority test:run
                     pnpm quality:architecture
                     (+ relevant gates from Required gates below)
```

If a slice handoff exists, paste the 9-field block from `docs/PAS/slice/<file>.md` into Phase 0 first.

---

## Required read order

1. This file (SKILL.md) — boundary, hard stops, Phase 0
2. [reference/authority-surfaces.md](reference/authority-surfaces.md) — registry contracts, surface index
3. [reference/package-structure.md](reference/package-structure.md) — folder tree, exports, forbidden paths
4. [packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md](../../../packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md) — annotated package-local tree (B9)
5. [src/surface/architecture-authority-surface-registry.ts](../../../packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts) — machine-readable surface index (wins over PAS prose drift)
6. [docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md](../../../docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md) — §0 Agent Quick Path; deeper sections when slice cites them
7. Target slice under `docs/PAS/slice/` — 9-field handoff when implementing

**Slice gate:** Runtime for PAS-002 §4.1–§4.12 is delivered. Foundation disposition registry mutations require ADR-0014 acceptance and `foundation-registry-owner`.

**Import rule:** Architecture authority is a governance root. If this package must import a consumer package to validate it, the design is wrong — use registry data and filesystem gates instead.

---

## Authority surface summary

| Surface | Owns | Does not own |
| --- | --- | --- |
| Package registry | Governed package rows, IDs, lifecycle, filesystem expectation | Runtime package behavior |
| Layer registry | Layer assignment, cross-layer dependency matrix | UI layer rendering |
| Ownership registry | Package owner, authority level, audit metadata | HR employee master |
| Dependency registry | Approved runtime dependency edges | Live dependency resolution at request time |
| Lifecycle registry | Closed-union package lifecycle states | Business entity lifecycle |
| Exception registry | ADR-level architecture exceptions with evidence | General tech-debt comments |
| Foundation disposition | PAS status pointers and lanes | Long-form delivery doc bodies |
| Business master data authority | Domain package reservation for entity IDs (ADR-0020) | Kernel `ID_FAMILIES` / wire parsers |
| Boundary validators | Layer, cycle, forbidden dependency, registry parity gates | Permission evaluation |
| Surface registry | Data/validator/doc module index for agents and CI | ERP runtime composition |
| Workspace discovery | Monorepo workspace enumeration for gates | ERP context resolution |

Full TypeScript shapes → [reference/authority-surfaces.md](reference/authority-surfaces.md)

---

## Contract rules (checklist)

Before any architecture-authority contract is merged:

- [ ] TypeScript strict mode
- [ ] No prohibited cross-package imports (see Hard stops)
- [ ] JSON-serializable registry records where exported across boundaries
- [ ] All object properties are `readonly`
- [ ] Closed unions for lifecycle, exception status, layer names — no loose strings
- [ ] No side effects on import
- [ ] No hidden business logic
- [ ] No framework, UI, database client, or auth SDK dependency
- [ ] No package registry row without ownership
- [ ] No active package without layer assignment
- [ ] No exception entry without owner, status, and evidence
- [ ] No long-form authority duplication in source comments
- [ ] Foundation disposition edits only via `foundation-registry-owner`

---

## Surface anti-patterns

The boundary gate may not catch locally defined forbidden behavior. Flag these when found in source.

| Anti-pattern | Example | Violation | Correct home |
| --- | --- | --- | --- |
| **Runtime import of governed package** | `import … from "@afenda/database"` | PAS §3.2 governance root rule | Registry data + filesystem gate |
| **Kernel ID duplication** | Local `ten_` regex or ID family table | PAS-001 §4.1 | `@afenda/kernel` |
| **Business record schema** | Customer row type in `data/` | PAS §5 | Owning business module |
| **Permission evaluation** | Grant check inside validator | PAS §5 | `@afenda/permissions` |
| **Doc drift as exception row** | Missing MDX noted in exception registry | PAS §4.6 | `pnpm architecture:drift` / `check:documentation-drift` |
| **Deep import consumer** | `@afenda/architecture-authority/src/data/...` | §6.2 approved suffixes | Root or `/surface` only |
| **Request-time side effect** | Network call in validator on import | PAS §9 | CI script only |

### Quick decision test

Before adding a function to architecture-authority, pass all three (same as kernel-authority):

```
1. Does it load, fetch, or resolve data?         → No  (filesystem scan in CI gates only)
2. Does it format, render, or compose UI text?   → No
3. Does it make a business decision or fallback? → No
```

Use `/pas-prohibited-surface-scan` or `/cross-boundary-anti-pattern-scan` for blind-spot audits.

---

## Runtime rules

Architecture-authority is **contracts-only**. Approved runtime primitives:

1. Static registry constants and pure validation functions
2. CLI gate execution and filesystem inspection inside gate scripts
3. Test helpers for architecture validation

This package must not run inside ERP request lifecycle, UI rendering, auth handling, database transactions, workers, or business module workflows.

**Currently approved runtime primitive(s):** pure validators + registry readers + workspace discovery for CI; no request-time execution.

---

## Implementation sequence

When adding new architecture authority content, follow PAS §10 order:

```
1. Update ADR/PAS authority if the package boundary changes
2. Update package registry
3. Update layer registry
4. Update ownership registry
5. Update foundation disposition registry (foundation-registry-owner) if delivery status changes
6. Update exception registry if an ADR exception opens/closes/waives
7. Update architecture validators and surface registry
8. Update tests
9. Run required gates
10. Update runtime truth matrix or pas-status-index where applicable
```

**Do not add in this package:** Kernel ID families, business master data runtime, UI tokens, AppShell behavior, auth behavior, database schema, execution/outbox workers, observability logger behavior.

---

## Required gates

```bash
pnpm --filter @afenda/architecture-authority typecheck
pnpm --filter @afenda/architecture-authority test:run
pnpm quality:architecture
pnpm architecture:cycles
pnpm architecture:drift
pnpm quality:boundaries
pnpm check:foundation-disposition
```

Recommended (when slice touches docs or cross-package governance):

```bash
pnpm check:documentation-drift
pnpm check:architecture-authority-surface
```

---

## Acceptance criteria

### Current (must pass today)

| Category | Check | Required |
| --- | --- | --- |
| Architecture | Package/layer/ownership registries align with filesystem | Pass |
| Architecture | Boundary and cycle gates reject illegal edges | Pass |
| Architecture | Zero framework/UI/database/auth runtime dependencies | Pass |
| Type safety | Registry contracts use readonly closed unions | Pass |
| Governance | Foundation disposition integrity gate | Pass |
| Governance | Exception entries have owner + evidence | Pass |
| Governance | Package structure layout contract + acceptance tests | Pass |
| Governance | Canonical architecture doc + snapshot sync | Pass |
| Runtime safety | No request-time side effects in package | Pass |
| ERP readiness | New packages require registry + ownership + layer rows | Pass |
| Documentation | PAS-002 slice handoffs B1–B25 | **Delivered** |
| Documentation | Package-local tree `PAS-002-ARCHITECTURE-TREE.md` | **Delivered** |
| Governance | Surface registry includes all BMD data modules | **Delivered** |
| Agent | Skill + reference chain (this file) | **Delivered** |

---

## Doctrine

`@afenda/architecture-authority` is the package that tells Afenda whether the monorepo is structurally legal. It owns package identity, layer assignment, ownership, lifecycle, dependency direction, architecture exceptions, and architecture gates. It is not a runtime product package, UI package, database package, Kernel identity package, or business module.

> **May belong here:** package registry rows, ownership records, layer boundary rules, architecture exception entries, architecture gate logic.

> **Belongs outside:** business master data, runtime module behavior, UI rendering, database schema, auth sessions, outbox workers, audit writing, ERP route behavior.

Architecture Authority owns **structure**.
Kernel owns **global primitives** ([PAS-001](../../../docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md)).
Business modules own **business meaning**.
Applications own **composition and user-facing behavior**.

When in doubt, apply the kernel-authority three-question test: no data loading, no formatting/UI text, no business decision fallbacks.
