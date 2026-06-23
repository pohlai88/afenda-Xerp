# Ownership Registry

| Field | Value |
|-------|-------|
| **Status** | Baseline — Pending Sign-off |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **TIP** | TIP-001A — Architecture Baseline Discovery |
| **Fingerprint** | `ARCH-BASELINE-2026-06-23-v2` |
| **Invariant** | ARCH-001 — exactly one owner per package |

Validation at baseline is against the **proposed model** pending ADR-0004 acceptance.

Ownership defines **who owns**, **what ownership means**, **what owners may do**, and **how conflicts resolve**. Full rights and restrictions are normative in **ADR-0004** (TIP-001B); this registry is the operational source of truth.

---

## ADR Traceability

| Rule | Future ADR |
|------|------------|
| Layer model | ADR-0002 |
| Dependency governance | ADR-0003 |
| **Ownership governance** | **ADR-0004** — rights, restrictions, escalation |
| Exception governance | ADR-0005 |
| Package lifecycle | ADR-0006 |

---

## Authority Level ≠ Layer

**Authority level** identifies the **governance body** accountable for a package.

**Layer** identifies **architectural position** in the dependency matrix (see [`layer-registry.md`](layer-registry.md)).

They are related but not equivalent.

| Package | Layer | Owner domain | Authority level |
|---------|-------|--------------|-----------------|
| `@afenda/kernel` | Foundation | Platform Authority | `platform` |
| `@afenda/metadata-ui` | Metadata | Metadata Authority | `metadata` |
| `@afenda/appshell` | ERPSpine | ERP Spine Authority | `erp-spine` |

Foundation-layer packages may be owned by Platform Authority. Metadata-layer packages are owned by Metadata Authority, not a generic `shared` label.

---

## Authority Levels

Authority levels align with **governance bodies**, not technical categories.

| Level | Governance body | Scope |
|-------|-----------------|-------|
| `architecture` | Architecture Authority | Maps, ADRs, exceptions, layer moves, constitution |
| `platform` | Platform Authority | Data, identity, permissions, observability, kernel, storage, execution, entitlements, flags, testing, tooling |
| `design` | Design Authority | Tokens, components, styling contracts |
| `metadata` | Metadata Authority | Renderers, schemas, metadata registries |
| `erp-spine` | ERP Spine Authority | Navigation, shell, operating context |
| `domain` | Domain Authority (per domain) | Business truth for one ERP domain |
| `application` | Application Authority | Deployment surfaces and app wiring |

---

## Owner Domains and Responsibilities

| Owner domain | Authority level | Responsibilities |
|--------------|-----------------|------------------|
| **Architecture Authority** | `architecture` | Architecture maps, ADR framework, exception approval, layer evolution, ownership disputes |
| **Platform Authority** | `platform` | Platform contracts, public APIs, dependencies, releases, migrations for platform packages |
| **Design Authority** | `design` | Design tokens, component contracts, variant governance, visual API stability |
| **Metadata Authority** | `metadata` | Renderer contracts, metadata schemas, field registries, metadata UI public API |
| **ERP Spine Authority** | `erp-spine` | App shell, navigation model, command center, layout contracts |
| **Application Authority** | `application` | App deployment surfaces, routing integration, app-level dependency declarations |
| **Domain Authority** | `domain` | Domain business contracts, domain APIs, domain data boundaries (per domain at TIP-013+) |

---

## Ownership Rights

What an owner **may** approve for packages they own (ADR-0004 will codify):

| Right | Description |
|-------|-------------|
| Approve dependency changes | Add, remove, or change runtime `@afenda/*` dependencies within layer rules |
| Approve public API changes | Changes to package `exports` and documented public contracts |
| Approve deprecations | Mark package or export paths deprecated with migration path |
| Propose layer moves | Initiate layer transfer process (Architecture Authority final approval) |
| Approve internal refactors | Implementation changes that do not alter public API or dependencies |

---

## Ownership Restrictions

What an owner **may not** do (ADR-0004 will codify):

| Restriction | Description |
|-------------|-------------|
| Change another package's ownership | Only Architecture Authority may approve ownership transfer |
| Override Architecture Authority | Cannot bypass maps, validators, or ADR requirements |
| Create exceptions without ADR | Runtime dependency or layer exceptions require ADR-0005 |
| Invent owner domains | New governance bodies require Accepted ADR |
| Move packages across layers unilaterally | Requires layer evolution process (see [`layer-registry.md`](layer-registry.md)) |
| Introduce blocked dependency patterns | See [`dependency-registry.md`](dependency-registry.md) |

---

## Escalation Hierarchy

When ownership domains conflict, escalation follows this order (highest authority wins):

```text
Architecture Authority          ← exceptions, disputes, layer moves, new layers
        ↑
Platform Authority              ← cross-cutting platform and foundation packages
        ↑
┌───────┼───────┬───────────┐
Design  Metadata  ERP Spine   ← peer authorities; conflicts escalate up
        ↑
Domain Authorities            ← per-domain (Accounting, HRM, …)
        ↑
Application Authority         ← delivery surfaces; cannot override architecture
```

**Conflict examples**

| Conflict | Resolver |
|----------|----------|
| Design Authority vs Metadata Authority | Architecture Authority |
| Metadata Authority vs Platform Authority | Architecture Authority |
| Application Authority vs any lower authority | Architecture Authority |
| Domain Authority vs Domain Authority | Architecture Authority + ADR-0005 if inter-domain dependency |

Without escalation, ownership conflicts cannot be resolved. All disputes are logged and require Architecture Authority decision before merge.

---

## Active Ownership Map (18)

| Package | Owner domain | Authority level |
|---------|--------------|-----------------|
| `@afenda/architecture-authority` | Architecture Authority | `architecture` |
| `@afenda/ai-governance` | Architecture Authority | `architecture` |
| `@afenda/appshell` | ERP Spine Authority | `erp-spine` |
| `@afenda/auth` | Platform Authority | `platform` |
| `@afenda/database` | Platform Authority | `platform` |
| `@afenda/design-system` | Design Authority | `design` |
| `@afenda/docs` | Application Authority | `application` |
| `@afenda/entitlements` | Platform Authority | `platform` |
| `@afenda/erp` | Application Authority | `application` |
| `@afenda/execution` | Platform Authority | `platform` |
| `@afenda/feature-flags` | Platform Authority | `platform` |
| `@afenda/kernel` | Platform Authority | `platform` |
| `@afenda/metadata-ui` | Metadata Authority | `metadata` |
| `@afenda/observability` | Platform Authority | `platform` |
| `@afenda/permissions` | Platform Authority | `platform` |
| `@afenda/storage` | Platform Authority | `platform` |
| `@afenda/testing` | Platform Authority | `platform` |
| `@afenda/typescript-config` | Platform Authority | `platform` |
| `@afenda/ui` | Design Authority | `design` |

---

## Reserved Domain Ownership (TIP-013+)

| Planned package | Owner domain | Authority level |
|-----------------|--------------|-----------------|
| `@afenda/accounting` | Accounting Authority | `domain` |
| `@afenda/hrm` | HRM Authority | `domain` |
| `@afenda/crm` | CRM Authority | `domain` |
| `@afenda/inventory` | Inventory Authority | `domain` |
| `@afenda/procurement` | Procurement Authority | `domain` |

Inter-domain ownership or dependency disputes escalate to Architecture Authority.

---

## Ownership Audit Questions

For every package, the owner must be able to answer who approves each change class. **Exception approval always escalates to Architecture Authority** (ADR-0005).

| Package | API | Dependency | Deprecation | Exception |
|---------|-----|------------|-------------|-----------|
| `@afenda/appshell` | ERP Spine | ERP Spine | ERP Spine | Architecture |
| `@afenda/auth` | Platform | Platform | Platform | Architecture |
| `@afenda/database` | Platform | Platform | Platform | Architecture |
| `@afenda/design-system` | Design | Design | Design | Architecture |
| `@afenda/docs` | Application | Application | Application | Architecture |
| `@afenda/entitlements` | Platform | Platform | Platform | Architecture |
| `@afenda/erp` | Application | Application | Application | Architecture |
| `@afenda/execution` | Platform | Platform | Platform | Architecture |
| `@afenda/feature-flags` | Platform | Platform | Platform | Architecture |
| `@afenda/kernel` | Platform | Platform | Platform | Architecture |
| `@afenda/metadata-ui` | Metadata | Metadata | Metadata | Architecture |
| `@afenda/observability` | Platform | Platform | Platform | Architecture |
| `@afenda/permissions` | Platform | Platform | Platform | Architecture |
| `@afenda/storage` | Platform | Platform | Platform | Architecture |
| `@afenda/testing` | Platform | Platform | Platform | Architecture |
| `@afenda/typescript-config` | Platform | Platform | Platform | Architecture |
| `@afenda/ui` | Design | Design | Design | Architecture |
| `@afenda/architecture-authority` *(planned)* | Architecture | Architecture | Architecture | Architecture |

This table is the input schema for TIP-001D ownership validation and TIP-001F `ownership-audit.md` generation.

---

## Ownership Transfer Process

Ownership may not change casually. Example triggers: `metadata-ui` governance split, `permissions` moving to a dedicated Security Authority.

**Required for every ownership transfer:**

1. **ADR approval** — documents rationale, consumers, and timeline (ADR-0004 or domain ADR)
2. **Current owner sign-off** — releasing authority confirms handover
3. **New owner sign-off** — accepting authority confirms responsibilities
4. **Architecture Authority approval** — constitutional gate; no transfer without it
5. **Registry updates** — `ownership-registry.md`, `package-registry.md`, machine maps (TIP-001C+)
6. **Fingerprint bump** — baseline report amended if material

**Forbidden patterns:**

- Orphan packages (zero owner)
- Shared ownership (multiple owners per package)
- AI-invented owner domains without ADR
- Domain packages owned by Application or Design authorities
- Transfer without Architecture Authority approval

---

## Ownership Audit Intent (TIP-001F)

This registry generates [`ownership-audit.md`](ownership-audit.md) via:

```text
pnpm architecture:owners
```

Purpose: answer *"Who owns this package, what can they approve, and who resolves disputes?"* without searching the monorepo.

---

## Acceptance

- [x] 100% active packages have exactly one owner (18/18)
- [x] 0 active packages with zero owners
- [x] 0 active packages with multiple owners
- [x] Planned package ownership documented separately
- [x] Authority levels align with governance bodies (not conflated with layers)
- [x] Ownership responsibilities documented
- [x] Ownership rights and restrictions documented
- [x] Escalation hierarchy documented
- [x] Ownership transfer process documented
- [x] Ownership audit questions table complete
- [x] Reserved domain ownership slots documented
- [x] ADR-0004 traceability established
- [ ] Baseline signed off by Architecture Authority
