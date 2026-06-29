# PAS Development Lane Boundaries (ADR-0027)

| Field | Value |
| --- | --- |
| **Authority** | [PAS README](README.md) · [ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) |
| **Purpose** | Prevent parallel / crossing development between **Kernel**, **retired CSS**, and **Presentation** lanes |
| **Last reviewed** | 2026-06-30 |

> **One sentence:** Each active PAS family owns one non-overlapping execution lane — agents must not treat retired PAS-005 CSS work as parallel to Kernel or PAS-006 presentation work.

---

## Active lanes (ERP — 2026-06-29)

| Lane | PAS | SSOT | Runtime owner | Agent skill |
| --- | --- | --- | --- | --- |
| **Kernel vocabulary** | PAS-001 · PAS-001B | [`KERNEL/`](KERNEL/README.md) | `@afenda/kernel` | `kernel-authority` |
| **ERP integration spine** | PAS-001A | [`KERNEL/PAS-001A`](KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | `apps/erp/src/lib/context/` | `kernel-authority` + `multi-tenancy-erp` |
| **Presentation / frontend manufacturing** | PAS-006 (006A–006D) | [`PRESENTATION/`](PRESENTATION/README.md) | `@afenda/shadcn-studio` · `apps/erp` (consumer) | `shadcn-studio` |

**Touchpoint (not a fourth lane):** IS-003 metadata bridge — `apps/erp/src/lib/metadata/` consumes PAS-006 binding contracts and kernel-branded context at the ERP trust boundary. Presentation package does **not** import `@afenda/kernel`.

---

## Retired lanes (historical only — do not execute)

| Lane | PAS | Status | Superseded by |
| --- | --- | --- | --- |
| CSS token monolith | PAS-005 | **Retired for ERP** | PAS-006A theme/CSS chain in `@afenda/shadcn-studio` |
| shadcn strangler (legacy PAS id) | PAS-005A | **Retired as separate PAS** | PAS-006 family |
| design-system / Governed UI strangler | PAS-005B | **Retired for ERP** | ADR-0027 stock shadcn/studio cutover |

**Historical slice docs** remain under [`CSS-AUTHORITY/SLICE/`](CSS-AUTHORITY/SLICE/) for audit — they are **not** continuation queues. See [`pas-status-index.md`](pas-status-index.md) sections marked **Historical / archived**.

---

## Hard platform blocks (constitution)

Durable constitutional blocks — agents must not treat these as parallel work queues or infer that one track unblocks another without an explicit ADR amendment.

| Track | Blocker | Active routing while blocked |
| --- | --- | --- |
| Accounting Core runtime | ADR-0010 + new ADR amending `PKGR01_ACCOUNTING` prohibited rules | Procurement E2E via PAS-001C + ERP-PROC-FDN-*; KV-ACCT wire-only; no `@afenda/accounting` ledger/posting |
| PAS-005 CSS | Retired for ERP (ADR-0027) | PAS-006 presentation lane · `@afenda/shadcn-studio` · `shadcn-studio` skill |

**Procurement end-to-end delivery does not require Accounting Core runtime unblock** — cross-domain hooks (3-way match, GR-IR) stay ADR-gated but must not block foundation/operational procurement slices that do not post to ledger.

---

## Non-parallel rules (hard stops)

1. **Do not** run PAS-005 / PAS-005A / PAS-005B slice handoffs for ERP frontend work — use PAS-006 `P06-*` handoffs instead.
2. **Do not** add CSS token authority, `css-authority` consumption gates, or `@afenda/css-authority` ERP wiring in the same session as PAS-001 kernel vocabulary or PAS-001A context spine work unless the user explicitly orchestrates a migration audit (read-only).
3. **Do not** import `@afenda/kernel` into `@afenda/shadcn-studio` — kernel consumption stays in `apps/erp` (PAS-001A IS-002 / IS-003).
4. **Do not** implement presentation block TSX under PAS-001 or PAS-001A slices — blocks are PAS-006B inventory + PAS-006D metadata surfaces.
5. **Do not** duplicate active status in both PAS-005 and PAS-006 sections of [`pas-status-index.md`](pas-status-index.md) — PAS-006 is active; PAS-005 rows are historical.

---

## Confusion matrix (resolved)

| Question | Correct lane | Wrong lane |
| --- | --- | --- |
| Where is ERP `OperatingContext` assembled? | PAS-001A · `apps/erp` | PAS-005 / PAS-006 |
| Where is ERP theme + block CSS? | PAS-006A · `@afenda/shadcn-studio` | PAS-005 · `@afenda/css-authority` |
| Where are metadata binding + DOM slot markers? | PAS-006D · `@afenda/shadcn-studio` registry | Kernel · TSX import enforcement |
| Where are branded tenant/company IDs? | PAS-001 · `@afenda/kernel` | Presentation |
| Where is ERP domain wire vocabulary (`erp-domain/*`)? | PAS-001B · `@afenda/kernel` | PAS-006 |

---

## Dependency direction (downward only)

```text
@afenda/kernel (vocabulary)
        ↓
@afenda/permissions (IS-001 wire ingress)
        ↓
apps/erp (PAS-001A IS-002 assembly · IS-003 metadata bridge)
        ↓
@afenda/shadcn-studio (PAS-006 presentation product)
        ↓
apps/erp routes / Storybook (consumers)
```

**Retired side branches (do not wire):** `@afenda/css-authority`, `@afenda/appshell`, `@afenda/metadata-ui`, `@afenda/ui-composition`, `@afenda/design-system` Governed UI strangler.

---

## Agent routing (quick)

| User intent | Read first | Never treat as active |
| --- | --- | --- |
| Kernel / tenant / operating context | `KERNEL/README.md` → PAS-001A §0 | `CSS-AUTHORITY/PAS-005*` |
| MCP blocks / theme / metadata DOM | `PRESENTATION/README.md` → PAS-006D | `css-authority` skill · PAS-005 B* slices |
| Doc audit / drift | `pas-status-index.md` active sections | PAS-005 slice registry rows as work queue |

---

## Maintenance

When closing any slice that touches more than one lane, update **only** the owning lane's PAS metadata + [`pas-status-index.md`](pas-status-index.md) active section. Cross-lane notes belong here — not duplicated in KERNEL and PRESENTATION READMEs.
