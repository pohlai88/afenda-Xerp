# Accounting Standards PAS Family — Composed Governance Layer

| Field | Value |
| --- | --- |
| **Scope** | Accounting Standards Authority — one Blueprint box |
| **Upstream** | [Accounting Standards North Star](../../NORTHSTAR/accounting-standards-north-star.md) · [Accounting Standards Blueprint](../../BLUEPRINT/accounting-standards-blueprint.md) |
| **Slice SSOT** | [`SLICE/`](SLICE/README.md) — individual handoffs B0–B16 |
| **Maturity** | Production Candidate — B0 delivered; B1–B16 not started |
| **Last reviewed** | 2026-06-29 |

> **One sentence:** PAS-003 governs versioned accounting-standard authority metadata, process-routing rules, standards-backed validation contracts, explanation metadata, and evidence snapshots — with slice handoffs in `ACCOUNTING-STANDARDS/SLICE/`.

---

## Constitutional chain

```text
Platform North Star
  → Accounting Standards North Star (docs/NORTHSTAR/)
  → Accounting Standards Blueprint (docs/BLUEPRINT/)
  → PAS-003 (this folder)
  → Slice SSOT (docs/PAS/ACCOUNTING-STANDARDS/SLICE/)   ← individual b*.md handoffs
  → Code (packages/accounting-standards, consumers)
```

**Doctrine:** Accounting Standards owns standards authority and deterministic validation contracts — not journal posting, ledger runtime, tax filing, or UI behavior.

---

## Family index

| PAS ID | Composed document | Blueprint box | Package / path | Maturity | Slices |
| --- | --- | --- | --- | --- | --- |
| **PAS-003** | [PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md](PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) | Accounting standards authority | `@afenda/accounting-standards` | Production Candidate | B0 delivered · B1–B16 queued |

**Agent skill:** `accounting-standards-authority` · `.cursor/skills/accounting-standards-authority/SKILL.md`

**Registry lane:** `PKGR03_ACCOUNTING_STANDARDS` · `foundation-disposition.registry.ts`

---

## Agent read order

```text
1. Accounting Standards North Star §1–§4 (scope dispute only)
2. Accounting Standards Blueprint §3 concept map · §4 boxes · §5 composition
3. This README — confirm PAS-003 is the sole composed PAS for this box
4. PAS-003 §0 (always)
5. PAS-003 §4+ when implementing or auditing contract detail
6. [Accounting slice catalog](SLICE/accounting-slice-catalog.md) — build order
7. Individual handoff: docs/PAS/ACCOUNTING-STANDARDS/SLICE/b<N>-*.md → /afenda-coding-session Phase 0
```

| Work type | Start here |
| --- | --- |
| Standards registry / routing / validation contracts | PAS-003 §0 → next slice in §12 |
| Enterprise acceptance / doc attestation | B12 governance slice |
| Parallel-book ERP-parity extensions | B13–B16 after B1–B11 core |

---

## Hard stops (family-wide)

- Accounting Standards never posts journals, owns ledger rows, or executes tax filings.
- Do not add IFRS/MFRS treatment types or posting logic to `@afenda/kernel`.
- Do not mark PAS-003 Enterprise Accepted without consumer workflow proof (B12 + runtime evidence).
- Business meaning for wire terms lives in Enterprise Knowledge (PAS-004); this package owns standards metadata and validation contracts only.
- Kernel vocabulary disputes → PAS-001 + kernel slice first.

---

## Maintenance

| Event | Update |
| --- | --- |
| New standards capability | Domain NS §4 → Blueprint §4 → PAS-003 §4 → slice handoff |
| Slice close | [SLICE/accounting-slice-catalog.md](SLICE/accounting-slice-catalog.md) · handoff file · PAS-003 §12 · Blueprint §10 |
| SKILL regen | `.cursor/skills/accounting-standards-authority/SKILL.md` from PAS extract map (SYNC intent) |
| Platform inventory | [Platform Blueprint](../../architecture/afenda-architecture-blueprint.md) — Accounting standards authority row links here |

**Redirect tombstone:** [docs/PAS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md](../PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) — backwards-compatible link only.
