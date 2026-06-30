# Kernel PAS Family — Composed Governance Layer

| Field | Value |
| --- | --- |
| **Scope** | Platform Kernel — four Blueprint boxes (vocabulary · catalog · module foundation · integration spine consumer docs) |
| **Upstream** | [Kernel North Star](../../NORTHSTAR/kernel-north-star.md) · [Kernel Blueprint](../../BLUEPRINT/kernel-blueprint.md) |
| **Slice SSOT** | [`SLICE/`](SLICE/README.md) — individual handoffs · deprecated flat [`docs/PAS/slice/`](../slice/README.md) is **not** kernel SSOT |
| **Maturity** | Enterprise Accepted (composed) — integrated with KERNEL/SLICE SSOT |
| **Last reviewed** | 2026-06-30 |

> **One sentence:** Four composed PAS documents govern kernel vocabulary, ERP wire catalog, ERP module foundation, and runtime integration proof — with slice handoffs in `KERNEL/SLICE/` and contract detail in `KERNEL/archive/`.

> **HTTP contract runtime (IS-004):** lives in [`../API-CONTRACT/`](../API-CONTRACT/README.md) — not in this KERNEL folder.

---

## Constitutional chain

```text
Platform North Star
  → Kernel North Star (docs/NORTHSTAR/)
  → Kernel Blueprint (docs/BLUEPRINT/)
  → Kernel PAS family (this folder)
  → Kernel Slice SSOT (docs/PAS/KERNEL/SLICE/)   ← individual b*.md handoffs
  → Code (packages/kernel, apps/erp, …)
```

**Doctrine:** Kernel owns words; owner packages own decisions. Vocabulary ≠ integration proof ≠ ERP wire catalog. **PAS-001A owns the ERP resolver spine** (`apps/erp/src/lib/context/`) — kernel must never implement `resolveOperatingContext`.

| Risk | Mitigation |
| --- | --- |
| Conflating kernel with ERP runtime | PAS-001A §0 + §3 context map; package [README](../../../packages/kernel/README.md) doctrine; `check:kernel-prohibited-ownership` |
| Promoting fiscal IDs without ADR | Drift registry `accounting-id-forbidden-floor-symbols` (quarantine); `check:forbidden-platform-ids` |
| Doc drift after slice close | This README + [packages/kernel/README.md](../../../packages/kernel/README.md) + `kernel-authority` skill mirror; `pnpm check:documentation-drift` |

---

## Family index

| PAS ID | Composed document | Blueprint box | Package / path | Maturity | Slices |
| --- | --- | --- | --- | --- | --- |
| **PAS-001** | [PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) | Kernel Vocabulary | `@afenda/kernel` | Enterprise Accepted | B49–B70 · B107–B113 closed |
| **PAS-001A** | [PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | ERP Integration Spine | `apps/erp` + integration consumers | Production Candidate | B71–B75 · R1a–R1d · R2 · IS-001–IS-004 · [API-BINDING S1–S7](SLICE/pas-001a-api-binding-slice-track.md) **Delivered** |
| **PAS-001B** | [PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md](PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | ERP Wire Vocabulary Catalog | `@afenda/kernel/erp-domain/*` | Enterprise Accepted · `catalog_authority` role | B76–B106 · KV-* |
| **PAS-001C** | [PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md](PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) | ERP Module Foundation | `@afenda/erp-module-foundation` | Delivered (platform foundation) | ERP-MOD-FDN-003 · `check:erp-module-*` |

**Agent skill:** `kernel-authority` · `.cursor/skills/kernel-authority/SKILL.md`

---

## Agent read order

```text
1. Kernel North Star §1–§12 (scope dispute only)
2. Kernel Blueprint §3.3 concept map · §3.4 vocabulary ownership · §4 boxes
3. This README — pick PAS by Blueprint box
4. [packages/kernel/README.md](../../../packages/kernel/README.md) — package agent quick path + gates
5. Composed PAS §0 (always)
6. Archive PAS §4+ only when implementing or auditing contract detail — [`archive/`](archive/README.md)
7. [Kernel Slice catalog](SLICE/kernel-slice-catalog.md) — build order
8. Individual handoff: docs/PAS/KERNEL/SLICE/b<N>-*.md → /afenda-coding-session Phase 0
```

| Work type | Start here |
| --- | --- |
| Kernel vocabulary / identity / context | PAS-001 §0 |
| ERP resolver spine / permissions wire / metadata bridge (IS-003) | PAS-001A §0 |
| ERP domain wire term / catalog module (**KV-***) | PAS-001B §0 |
| ERP module foundation / readiness attestation (platform only) | [PAS-001C §0](PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) · [ERP-MODULES](../ERP-MODULES/README.md) |

---

## Composed vs archive (authority split)

| Layer | Location | Role |
| --- | --- | --- |
| **Composed (governance SSOT)** | `docs/PAS/KERNEL/PAS-001*.md` | Boundary · box mapping · maturity · gates · slice catalog summaries · agent quick path |
| **Implementation archive** | `docs/PAS/KERNEL/archive/` | Exhaustive §4–§16 contract specs · gate scripts slice sections from here |

**Conflict resolution:**

- **Boundary, box name, maturity label, integration spine naming** → composed PAS in this folder wins.
- **Contract field-level implementation detail** → archive + runtime code wins until promoted into composed PAS.
- **Slice Phase 0** → always [`SLICE/b*.md`](SLICE/README.md), never archive prose.

| Archive | Composed SSOT |
| --- | --- |
| [archive/PAS-001-KERNEL-AUTHORITY-STANDARD.md](archive/PAS-001-KERNEL-AUTHORITY-STANDARD.md) | [PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) |
| [archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md](archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md) | [PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| [archive/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md](archive/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md) | [PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md](PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) |

---

## Hard stops (family-wide)

- Kernel never resolves business state — vocabulary and wire-safe shapes only.
- Do not add resolver, database, auth, or permission evaluation logic to `@afenda/kernel`.
- Do not claim Production Candidate integration without PAS-001A attestation (B75).
- Do not reopen PAS-001 vocabulary under PAS-001A or PAS-001B without a PAS-001 amendment slice.
- Business meaning lives in [Enterprise Knowledge (PAS-004)](../ENTERPRISE-KNOWLEDGE/README.md); kernel retains wire shapes only.
- **Presentation / CSS / blocks** are [PAS-006](../PRESENTATION/README.md) — not Kernel, not retired PAS-005. See [Development lane boundaries](../DEVELOPMENT-LANE-BOUNDARIES.md).

---

## Adjacent lanes (do not parallel)

| Topic | Owner | Kernel role |
| --- | --- | --- |
| ERP `OperatingContext` assembly | PAS-001A · `apps/erp` | Vocabulary consumer only |
| Theme · MCP blocks · metadata DOM | PAS-006 · `@afenda/shadcn-studio` | **No import** into presentation package |
| Retired CSS strangler | PAS-005 (historical) | **Do not execute** — not a kernel track |

SSOT: [DEVELOPMENT-LANE-BOUNDARIES.md](../DEVELOPMENT-LANE-BOUNDARIES.md)

---

## Audit artifacts

Kernel audit catalogs (PAS-001 / 001A / 001B wire verification) live under [`audit/`](audit/README.md).

| Artifact | Role |
| --- | --- |
| [audit/PAS-001B.md](audit/PAS-001B.md) | ERP wire vocabulary catalog audit slice catalog (30 slices) |

**Procurement runtime foundation gap report** — relocated to [ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md](../ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md) (ERP-MODULES lane; not a kernel slice series).

---

## Maintenance

| Event | Update |
| --- | --- |
| New kernel capability | Kernel NS §4 → Blueprint §4 → composed PAS → legacy if contract detail needed |
| Slice close | [SLICE/kernel-slice-catalog.md](SLICE/kernel-slice-catalog.md) · legacy handoff · composed PAS §12 · Blueprint §9 · [packages/kernel/README.md](../../../packages/kernel/README.md) |
| Foundation gap re-audit | [`audit/`](audit/README.md) artifact + [pas-status-index.md](../pas-status-index.md) |
| SKILL regen | `.cursor/skills/kernel-authority/SKILL.md` from composed PAS extract map (SYNC intent) · mirror R3/R1 status from composed PAS |
| Platform inventory | [Platform Blueprint](../../BLUEPRINT/kernel-blueprint.md) — Kernel row links here |
