# Foundation Delivery Authority (FDR)

| Field | Value |
| --- | --- |
| **Authority** | ADR-0014 (Accepted 2026-06-24) |
| **Registry (machine)** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) |
| **Registry (human view)** | [`foundation-disposition.md`](foundation-disposition.md) |
| **Package inventory** | [`package-registry.md`](package-registry.md) |
| **Runtime evidence** | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) |
| **Enforcement** | `pnpm check:foundation-disposition` |

> **FDR** = **F**oundation **D**isposition **R**egistry — the single source of truth for foundation and package implementation scope after Phase 9 (2026-06-24).

---

## TIP → FDR transition

| Before (stopped) | After (active) |
| --- | --- |
| Author new `docs/delivery/tips/[status] tip-*.md` | Author `docs/delivery/FDR/[status] fdr-*.md` via `write-fdr` |
| `/write-tip` / `/write-tip-slice` for foundation work | `/write-fdr` / `/write-fdr-slice` |
| `tip-status-index.md` as implementation authority | `fdr-status-index.md` + registry |
| TIP §Handoff blocks for coding sessions | FDR §Handoff blocks + registry fields |
| TIP DoD rows | FDR DoD + enterprise-erp-standards gates |

**TIP delivery docs are not retired** — they remain under `docs/delivery/tips/` as `archive-lane` historical evidence (`TIP_ARCHIVE` in FDR). Do not delete them. Do not treat their status prefixes as package authority.

**No TIPE framework** was approved. Do not introduce parallel markdown status registries.

---

## Authority hierarchy (2026-06-24)

When artifacts disagree, resolve in this order:

```text
ADR
  >
Foundation Disposition Registry (FDR)
  >
Package Registry (PKG-* IDs)
  >
Runtime Truth Matrix
  >
pre-accounting-foundation-roadmap (phase narrative — historical)
  >
docs/delivery/tips/ (archive evidence only)
  >
master plan narrative
```

ADR-0013 (TIP roadmap) remains valid for **phase sequencing narrative** and audit trail. **Implementation handoffs** for foundation packages are governed by ADR-0014 / FDR.

---

## Subagent workflow

```text
1. Read foundation-disposition.registry.ts — find entry by packageId or domain
2. Read afenda-runtime-truth-matrix.md — confirm status + evidence
3. Read package-registry.md — confirm PKG-* ID and layer
4. Read governing ADR(s) cited on the entry (e.g. ADR-0015 for PKGR01)
5. If lane is red-lane or amber-lane → read enterprise-erp-standards skill
6. State afenda-coding-session §0 contract from FDR fields (not from TIP markdown)
7. Implement only within allowedAgents + runtimeOwner path
8. Run entry gates + pnpm check:foundation-disposition
9. Post §11 Completion Report; update runtime matrix; sync foundation-disposition.md if lanes/gaps changed
```

**Registry edits:** delegate to `foundation-registry-owner` only. Consumers read FDR; they do not fork local disposition rules.

---

## Lane → action matrix

| Lane | Agent may implement? | Notes |
| --- | --- | --- |
| `green-lane` | Yes — within `prohibited` + ADR bounds | Stable consumable packages |
| `amber-lane` | Yes — bounded scope only | Do not expand beyond `knownGaps` closure plan |
| `blue-lane` | Incubation only | Not `requiredBeforeAccounting`; no production dependency |
| `red-lane` | No — resolve gaps first | Must have gates + evidence before accounting agents |
| `black-lane` | ADR required | Do not touch without Accepted ADR |
| `archive-lane` | Read-only | TIP docs — evidence retrieval only |

---

## Domain packages (post–Phase 9)

Accounting and future domain packages (PKG-R01–R05) follow the same FDR model:

| Package | FDR ID | Current lane | Next unlock |
| --- | --- | --- | --- |
| `@afenda/accounting` | `PKGR01_ACCOUNTING` | `green-lane` (contracts-only) | TIP-015+ runtime requires **new ADR** + FDR `knownGaps` update — not a new TIP doc |

Runtime promotion checklist (example — PKGR01):

1. Architecture Authority publishes ADR (e.g. COA schema activation).
2. `foundation-registry-owner` updates `knownGaps`, `gates`, `prohibited`, fingerprint.
3. Implement in `packages/accounting/` within new ADR bounds.
4. Update runtime matrix row; run `pnpm check:accounting-domain-contracts` (contracts-only gate may be amended by ADR).
5. **Do not** create `tip-015-*.md` unless Architecture Authority explicitly requests archive-style delivery evidence.

---

## Coding session §0 template (FDR-derived)

Replace TIP handoff paste with:

```text
1. Objective         — Close FDR knownGap "<gap-id>" for entry <FDR_ID>
2. Allowed layer     — <runtimeOwner from registry>
3. Files to change   — <evidence paths + planned files>
4. Prohibited        — <prohibited[] from registry> + ADR-0010 until amended
5. Authority         — <authority field from registry>
6. Acceptance gates  — <gates[] from registry> + pnpm check:foundation-disposition
```

---

## Related documents

| Document | Role after FDR |
| --- | --- |
| [`tip-status-index.md`](../delivery/tip-status-index.md) | Archive index — delivered TIP audit trail |
| [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) | Phase 0–9 narrative — complete; maintain only |
| [`foundation-phase-delivery-tip-proposal.md`](foundation-phase-delivery-tip-proposal.md) | Obsolete proposal — do not implement |
| [ADR-0014](../adr/ADR-0014-foundation-disposition-registry.md) | Constitutional decision |
| [ADR-0013](../adr/ADR-0013-tip-roadmap-delivery-authority.md) | Superseded in part by ADR-0014 for handoffs |

---

## Enforcement

```bash
pnpm check:foundation-disposition
pnpm quality:architecture
pnpm check:documentation-drift
```

*foundation-delivery-authority v1 — synced with ADR-0014 — 2026-06-24*
