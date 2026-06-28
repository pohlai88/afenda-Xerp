# Kernel PAS Family — Composed Governance Layer

| Field | Value |
| --- | --- |
| **Scope** | Platform Kernel — three Blueprint boxes |
| **Upstream** | [Kernel North Star](../../NORTHSTAR/kernel-north-star.md) · [Kernel Blueprint](../../BLUEPRINT/kernel-blueprint.md) |
| **Slice SSOT** | [`SLICE/`](SLICE/README.md) — individual handoffs · legacy = [`../slice/`](../slice/) archive only |
| **Maturity** | Enterprise Accepted (composed) — reverse-engineered from accepted legacy PAS authority |
| **Last reviewed** | 2026-06-29 |

> **One sentence:** Three composed PAS documents govern kernel vocabulary, ERP wire catalog, and runtime integration proof — without refactoring the legacy implementation archive at `docs/PAS/PAS-001*`.

---

## Constitutional chain

```text
Platform North Star
  → Kernel North Star (docs/NORTHSTAR/)
  → Kernel Blueprint (docs/BLUEPRINT/)
  → Kernel PAS family (this folder)
  → Kernel Slice SSOT (docs/PAS/KERNEL/SLICE/)   ← individual b*.md handoffs
  → Code (packages/kernel, apps/erp, …)

Legacy (read-only archive, not Phase 0): docs/PAS/slice/
```

**Doctrine:** Kernel owns words; owner packages own decisions. Vocabulary ≠ integration proof ≠ ERP wire catalog.

---

## Family index

| PAS ID | Composed document | Blueprint box | Package / path | Maturity | Slices |
| --- | --- | --- | --- | --- | --- |
| **PAS-001** | [PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) | Kernel Vocabulary | `@afenda/kernel` | Enterprise Accepted | B49–B70 closed |
| **PAS-001A** | [PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | ERP Integration Spine | `apps/erp` + integration consumers | Production Candidate | B71–B75 · IS-001–IS-003 |
| **PAS-001B** | [PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md](PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | ERP Wire Vocabulary Catalog | `@afenda/kernel/erp-domain/*` | Enterprise Accepted · `catalog_authority` role | B76–B106 · KV-* |

**Agent skill:** `kernel-authority` · `.cursor/skills/kernel-authority/SKILL.md`

---

## Agent read order

```text
1. Kernel North Star §1–§12 (scope dispute only)
2. Kernel Blueprint §3.3 concept map · §3.4 vocabulary ownership · §4 boxes
3. This README — pick PAS by Blueprint box
4. Composed PAS §0 (always)
5. Legacy PAS §4+ only when implementing or auditing contract detail
6. [Kernel Slice catalog](SLICE/kernel-slice-catalog.md) — build order
7. Individual handoff: docs/PAS/KERNEL/SLICE/b<N>-*.md → /afenda-coding-session Phase 0
```

| Work type | Start here |
| --- | --- |
| Kernel vocabulary / identity / context | PAS-001 §0 |
| ERP resolver spine / permissions wire / AppShell bridge | PAS-001A §0 |
| ERP domain wire term / catalog module (**KV-***) | PAS-001B §0 |

---

## Composed vs legacy (authority split)

| Layer | Location | Role |
| --- | --- | --- |
| **Composed (governance SSOT for chain)** | `docs/PAS/KERNEL/` | Boundary · box mapping · maturity · gates · slice catalog summaries · agent quick path |
| **Legacy (implementation archive)** | `docs/PAS/PAS-001*.md` | Exhaustive §4 contract specs · historical slice detail · runtime paths |

**Conflict resolution:**

- **Boundary, box name, maturity label, integration spine naming** → composed PAS in this folder wins.
- **Contract field-level implementation detail** → legacy PAS + runtime code wins until a composed amendment lands.
- **Do not refactor legacy root files** to match composed docs — link both ways instead.

| Legacy archive | Composed counterpart |
| --- | --- |
| [PAS-001-KERNEL-AUTHORITY-STANDARD.md](../PAS-001-KERNEL-AUTHORITY-STANDARD.md) | [PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) |
| [PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md](../PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md) | [PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| [PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md](../PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md) | [PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md](PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) |

---

## Hard stops (family-wide)

- Kernel never resolves business state — vocabulary and wire-safe shapes only.
- Do not add resolver, database, auth, or permission evaluation logic to `@afenda/kernel`.
- Do not claim Production Candidate integration without PAS-001A attestation (B75).
- Do not reopen PAS-001 vocabulary under PAS-001A or PAS-001B without a PAS-001 amendment slice.
- Business meaning lives in Enterprise Knowledge (PAS-004); kernel retains wire shapes only.

---

## Maintenance

| Event | Update |
| --- | --- |
| New kernel capability | Kernel NS §4 → Blueprint §4 → composed PAS → legacy if contract detail needed |
| Slice close | [SLICE/kernel-slice-catalog.md](SLICE/kernel-slice-catalog.md) · legacy handoff · composed PAS §12 · Blueprint §9 |
| SKILL regen | `.cursor/skills/kernel-authority/SKILL.md` from composed PAS extract map (SYNC intent) |
| Platform inventory | [Platform Blueprint](../../architecture/afenda-architecture-blueprint.md) — Kernel row links here |
