# PAS-006C — Surface Acceptance & ACPA Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-006C |
| **Document class** | `package_authority_standard` |
| **Document role** | `surface_acceptance_acpa_governance` |
| **Parent charter** | [PAS-006](PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) |
| **Package** | `@afenda/shadcn-studio-v2` (+ Storybook lab + ERP auth routes consumer proof) |
| **Blueprint box** | shadcn/studio Presentation |
| **Maturity** | Production Candidate |
| **Runtime status** | P06-005–P06-007 delivered — Acceptance Record schema, ACPA gate suite, auth WCAG AA pack live |
| **Remaining slices** | none |
| **Depends on** | [PAS-006B](PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md) lifecycle |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/shadcn-studio-v2 test:run` |
| 2 | `pnpm check:studio-block-acpa-acceptance` |
| 3 | `pnpm check:studio-auth-surface-wcag-aa` |
| 4 | `pnpm test:interaction` *(auth + block interaction subsets)* |

> **Maturity is part of authority.** ACPA is the **primary** operator-surface profile. WCAG 2.2 AA is an **additional mandatory floor** on Authorization-adjacent surfaces only — not a replacement for ACPA elsewhere.

---

# 0. Agent Quick Path

**Boundary:** PAS-006C **owns** Acceptance Record wire schema, NS §3.7 lifecycle criteria as enforceable gates, ACPA verification profile, auth-adjacent WCAG 2.2 AA pack, and presentation-lab proof requirements; **never owns** theme/CSS (006A), inventory structure (006B), or metadata schema (006D).

**Hard stops:**

- Block cannot enter **Accepted** without sealed Acceptance Record.
- Auth surfaces (sign-in, MFA, recovery, session expiry, access denied) require **both** ACPA (where applicable) **and** WCAG 2.2 AA.
- Principles alone are not gates — every criterion maps to test or check command.

---

# 1. Acceptance Record (wire contract — target)

JSON-serializable record sealed at accept time:

| Field | Purpose |
| --- | --- |
| `acceptanceRecordId` | Stable id |
| `blockId` | Target block |
| `lifecycleStateAtSeal` | Must be Metadata-bound or later |
| `presentationLabProof` | Story id / lab artifact ref |
| `acpaProfileVersion` | ACPA profile revision |
| `wcagAaAuthAdjacent` | `true` when block class is auth-adjacent |
| `criteriaResults` | Map of NS §3.7 row → pass/fail |
| `sealedAt` | ISO timestamp |
| `sealedBy` | Steward role id (not PII) |

Lifecycle: NS §8.2 — Open → Evidence attached → Profile verified → Sealed.

---

# 2. NS §3.7 Criteria → Enforcement Map

| # | Criterion | Enforcement (target) |
| --- | --- | --- |
| 1 | Presentation lab story exists | Registry + story file gate |
| 2 | Keyboard navigation verified | interaction test |
| 3 | Screen reader labels verified | a11y contract test |
| 4 | **ACPA** contrast satisfied | `check:studio-block-acpa-acceptance` |
| 5 | Responsive / density verified | story + viewport test |
| 6 | Empty/loading/error/forbidden states | story variants |
| 7 | No embedded business logic | static scan + review |
| 8 | No route-local primitive fork | boundary check |
| 9 | Metadata contract binding | 006D gate when applicable |
| 10 | **WCAG 2.2 AA** on auth-adjacent | `check:studio-auth-surface-wcag-aa` |

---

# 3. ACPA Profile (primary)

Afenda Contrast and Presentation Accessibility — operator-surface profile:

| Dimension | Business rule |
| --- | --- |
| Body text contrast | ≥ 7:1 (OKLCH-estimated) |
| Muted text contrast | ≥ 4.5:1 |
| Accent / prose accent | ≥ 4.5:1 |
| Chart / KPI / threshold viz | Governed token semantics — no raw hex in blocks |
| Focus visibility | Visible focus ring on all interactive controls |
| Motion | Respects `prefers-reduced-motion` theme dimension |

Reference: legacy `statistics-metric-a11y.contract.test.tsx` pattern · docs-editorial-design ACPA thresholds.

---

# 4. WCAG 2.2 AA Floor (Authorization-adjacent only)

Applies to block classes:

- Sign-in · MFA · recovery · session expiry · access denied · security review

**Rule:** WCAG AA does not replace ACPA on these surfaces — **both** apply.

ERP consumer routes under `apps/erp/src/app/(auth)/` wire only **Accepted** auth blocks.

---

# 5. Block Classes

| Class | ACPA | WCAG 2.2 AA |
| --- | ---: | ---: |
| General operator (dashboard, admin, LoB) | Required | — |
| Authorization-adjacent | Required | **Required** |
| Metadata-capable form/table | Required + metadata criterion #9 | — |

---

# 12. Slice Catalog

| Slice | Title | Status |
| --- | --- | --- |
| P06-005 | Acceptance Record wire contract | Proposed |
| P06-006 | ACPA block acceptance gate suite | Proposed |
| P06-007 | Auth-adjacent WCAG 2.2 AA acceptance pack | Proposed |

Partial legacy evidence: B42k statistics ACPA article pattern (archived path — reference only).

---

# Related

- [PAS-006B](PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md) · [afenda-accessibility SKILL](../../../.cursor/skills/afenda-accessibility/SKILL.md)
- [Presentation NS §3.7 · §8.2](../../NORTHSTAR/shadcn-studio-presentation-north-star.md)
