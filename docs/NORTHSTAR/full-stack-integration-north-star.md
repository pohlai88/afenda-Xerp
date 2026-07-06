# Full-Stack Integration North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | Full-Stack Integration — frontend, API, domain, and UI configuration alignment |
| **Domain type** | Platform integration domain *(cross-cutting materialization — not a line-of-business)* |
| **Constitutional question** | *How does the platform keep frontend, API, domain, and UI configuration aligned and materialized?* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Cross-domain laws** | [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) — LAW 1 (registry-first) · LAW 6 (evidence-backed status) |
| **Derived document** | [Full-Stack Integration Blueprint](../BLUEPRINT/full-stack-integration-blueprint.md) |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0044](../adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md) |
| **Maturity** | Active — documentation + machine graph (FSI-S10) |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise acceptance boundary |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-07-06 |
| **Next document** | [Full-Stack Integration Blueprint](../BLUEPRINT/full-stack-integration-blueprint.md) |

> **One sentence:** Every routable surface, API operation, module ingress, and presentation binding must be declared in a registry, materialized through governed loaders and components, and attested by mechanical proof — never by filesystem discovery alone or parallel hand-maintained traceability tables.

> **Integration integrity, not business logic:** This domain governs **how the platform keeps layers aligned** — registry discipline, materialization invariants, lab promotion rules, and evolution without drift — independent of procurement rules, ledger posting, or visual token doctrine.

---

# 0. Agent Quick Path

**Read order:** [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → [Platform North Star](../architecture/afenda-platform-north-star.md) → this document §1–§6 → [Full-Stack Integration Blueprint](../BLUEPRINT/full-stack-integration-blueprint.md) → sibling North Stars (API Contract, Presentation, Kernel) → target PAS → Slice → Code.

**This document answers:** why full-stack integration integrity exists, what permanent capabilities the platform must provide for alignment, and how those capabilities relate to sibling domains.

**This document never answers:** registry file paths, gate commands, CCP tables, slice IDs, token tables, or npm package names.

**Chain rule:** Platform North Star → Full-Stack Integration North Star → Blueprint → PAS → Slice → Code → Integration Map (lab mirror)

**Hard stops (business scope):**

- Do not treat integration alignment as a substitute for API contract governance — HTTP exposure remains under Platform API Contract North Star.
- Do not treat integration alignment as a substitute for presentation doctrine — visual identity remains under ERP Presentation North Star.
- Do not ship routable surfaces without registry proof — filesystem presence alone is not authority.
- Do not promote lab fixtures into ERP without attestation — lab parity is intentional, not accidental production wiring.
- Do not hand-maintain parallel traceability matrices — machine graph and dashboard mirror registries.

**Consumer materialization:** When surfacing UI from API or domain contracts, read [Platform API Contract North Star](api-contract-north-star.md) for HTTP exposure doctrine and this document for cross-layer alignment — API governs wire; Full-Stack Integration governs materialization integrity.

**Implement mode rule:** Phase 0 six lines come from the slice handoff and `/afenda-coding-session` — not from re-deriving scope from §1–§6 on every session.

---

# 1. Domain Philosophy

Enterprise platforms fail on **silent integration drift**: a page exists without a loader contract, an API operation ships without registry entry, a module surface renders without spine consumption proof, and teams discover misalignment only after production incidents.

Without governed full-stack integration:

- Frontend routes diverge from declared module surfaces and permission vocabulary.
- API clients bind to shapes that were never registered alongside their UI consumers.
- Lab prototypes promote into ERP without attestation, duplicating authority.
- Traceability matrices rot because they are hand-edited in parallel with code.
- Configuration changes propagate without mechanical proof that all layers still align.

The Full-Stack Integration domain exists because **alignment must be registry-first, materially provable, and mechanically verifiable** — independent of any single transport, presentation package, or line-of-business meaning.

**Source:** Platform NS §2 · ADR-0026 (documentation hierarchy) · ADR-0044 (lab boundary) · LAW 1 · LAW 6

---

# 2. Capability Model

| Capability | Permanent obligation |
| --- | --- |
| **Registry-first surfaces** | Every routable operator surface is declared before filesystem ingress |
| **Materialization chain** | Contract → loader → page → components → presentation package is explicit and typed |
| **API–UI alignment** | Consumer surfaces declare their data source and wire envelope discipline |
| **Spine consumption proof** | Protected routes attest operating-context assembly through governed delegates |
| **Lab promotion discipline** | Route lab proves composition; ERP promotion requires attestation, not copy-paste |
| **Machine traceability** | Integration graph exports from registries — not hand-maintained annex tables |
| **Governance visualization** | Architecture exploration stays lab-safe; operators do not need force graphs |
| **Evolution without drift** | Registry changes trigger export drift detection and documentation sync |

Sibling domains own specialized doctrine — cite, do not duplicate:

| Concern | Authority |
| --- | --- |
| HTTP contracts | [Platform API Contract North Star](api-contract-north-star.md) |
| Presentation / tokens | [ERP Presentation North Star](shadcn-studio-presentation-north-star.md) |
| Kernel / spine vocabulary | [Platform Kernel North Star](kernel-north-star.md) |
| Module foundation delivery | [ERP Module Runtime North Star](erp-module-runtime-north-star.md) |
| Developer route lab | [Developer Sandbox North Star](developer-sandbox-north-star.md) |

---

# 3. Invariants

Three invariants define integration integrity. All other mechanical detail lives in the Blueprint and PAS catalogs.

## 3.1 Triple proof

Every governed configuration entry requires **registry entry + runtime delegate + gate or test**. Orphan configuration — present in code but absent from registry, or present in registry but unmaterialized — is prohibited.

## 3.2 Registry-before-filesystem

A routable surface must exist in a declared contract (`pas006-ui`, API operation registry, or lab allowlist) **before** its `page.tsx` or route handler ships. Filesystem discovery is evidence, not authority.

## 3.3 Lab parity

The Developer Route Lab follows the same Next.js frontend law as ERP for composition, rendering posture, and presentation imports. Auth, integration spine, kernel operating context, and production BFF remain excluded per ADR-0044. Lab proves surfaces; ERP attests runtime authority.

---

# 4. Risks

| Risk | Consequence | Mitigation doctrine |
| --- | --- | --- |
| **Shadow routes** | Unregistered pages bypass permission and audit vocabulary | Registry-before-filesystem invariant |
| **Parallel traceability** | Hand-maintained matrices diverge from runtime | Machine graph export + drift gate |
| **Lab authority bleed** | ERP packages imported into developer app | ADR-0044 terminal demo-fixture model |
| **API–UI envelope drift** | UI parses fields never declared in contract | Consumer envelope discipline (FSI-S1) |
| **Presentation fork** | Local tokens or quarantine imports in ERP | Presentation NS + PAS-006 chain |
| **Promotion without attestation** | Lab fixtures copied as production loaders | Lab→ERP promotion attestation (FSI-S3) |
| **Stale integration graph** | Dashboard shows outdated registry truth | Export drift gate on registry changes |

---

# 5. Evidence Tier

| Tier | Meaning | Examples for this domain |
| --- | --- | --- |
| **T1** | Constitutional doctrine accepted | This North Star · ADR-0026 · LAW 1 · LAW 6 |
| **T2** | Blueprint box map and PAS inventory | Full-Stack Integration Blueprint · FSI slice index |
| **T3** | Registry and contract artifacts | Foundation disposition · API registry · pas006-ui contracts |
| **T4** | Mechanical gates passing | Integration graph drift · route-lab governance · API contract gates |
| **T5** | Runtime proof | ERP module surfaces · lab Integration Map dashboard · MCP route verification |

T5 rows prove maturity — they must not be copied into §1–§4 as permanent doctrine.

---

# 6. Related Authority Index

| Document | Role |
| --- | --- |
| [Full-Stack Integration Blueprint](../BLUEPRINT/full-stack-integration-blueprint.md) | Layer map · CCP appendix · slice index · Next.js ingress |
| [Platform API Contract North Star](api-contract-north-star.md) | HTTP exposure and OpenAPI publication |
| [ERP Presentation North Star](shadcn-studio-presentation-north-star.md) | Visual identity and PAS-006 presentation |
| [Platform Kernel North Star](kernel-north-star.md) | Vocabulary and integration spine consumer doctrine |
| [Developer Sandbox North Star](developer-sandbox-north-star.md) | Route lab scope and promotion boundary |
| [PAS status index](../PAS/pas-status-index.md) | FSI slice track and delivery status |
| [ADR-0044](../adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md) | Lab runtime authority terminal model |
| Integration Map (lab) | Read-only visualization at `/architecture` in Developer Route Lab |

**Read order after this document:** Blueprint → target FSI slice in PAS index → implementer skills (`afenda-nextjs-best-practice`, `afenda-erp-design-system`) → Code.
