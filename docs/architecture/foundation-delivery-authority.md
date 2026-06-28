# Foundation Delivery Authority (PAS)

| Field | Value |
| --- | --- |
| **Authority** | ADR-0014 (Accepted 2026-06-24) · PAS (2026-06-27) |
| **Registry (machine)** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) |
| **Registry (human view)** | [`foundation-disposition.md`](foundation-disposition.md) |
| **Package standards** | [`docs/PAS/`](../PAS/README.md) |
| **Package inventory** | [`package-registry.md`](package-registry.md) |
| **Runtime evidence** | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) |
| **Platform North Star** | [`afenda-platform-north-star.md`](afenda-platform-north-star.md) |
| **Architecture Blueprint** | [`afenda-architecture-blueprint.md`](afenda-architecture-blueprint.md) |
| **Enforcement** | `pnpm check:foundation-disposition` |

> **PAS** = **P**ackage **A**uthority **S**tandard — the canonical location for long-form package governance and executable slice handoffs after legacy ARCH and delivery roadmap retirement (2026-06-27).

---

## Legacy transition

| Retired | Active |
| --- | --- |
| ARCH domain architecture roadmaps | `docs/PAS/PAS-NNN-*.md` |
| Legacy delivery trees | `docs/PAS/slice/*.md` handoffs |
| Legacy status indexes | [`pas-status-index.md`](../PAS/pas-status-index.md) |
| `/pas-slice-planner`, `/pas-slice-planner`, `/afenda-batch` (retired) | `/pas-slice-planner`, `/afenda-coding-session`, `/afenda-batch`, package authority skills |

Do not recreate parallel markdown delivery registries outside `docs/PAS/`.

---

## Discovery order (2026-06-29 — ADR-0026)

Before PAS or registry work, read:

```text
Platform North Star  →  Architecture Blueprint  →  (ADR if cross-cutting)  →  PAS  →  Code
```

Links: [North Star](afenda-platform-north-star.md) · [Blueprint](afenda-architecture-blueprint.md)

---

## Authority hierarchy (2026-06-27)

When artifacts disagree, resolve in this order:

```text
ADR
  >
Foundation Disposition Registry
  >
docs/PAS/ (Package Authority Standards + slice handoffs)
  >
Package Registry (PKG-* IDs)
  >
Runtime Truth Matrix
  >
pre-accounting-foundation-roadmap (phase narrative — historical)
  >
master plan narrative
```

---

## Subagent workflow

```text
0. Read afenda-platform-north-star.md + afenda-architecture-blueprint.md — confirm package/domain is declared
1. Read foundation-disposition.registry.ts — find entry by packageId or domain
2. Read afenda-runtime-truth-matrix.md — confirm status + evidence
3. Read docs/PAS/ — parent PAS + target slice under docs/PAS/slice/
4. Copy one slice §Handoff block into Phase 0 (afenda-coding-session)
5. Implement; run entry gates; post §11 Completion Report
6. Registry edits → foundation-registry-owner only
```

**Planning:** [`.cursor/skills/pas-slice-planner/SKILL.md`](../../.cursor/skills/pas-slice-planner/SKILL.md)

**Kernel:** [`.cursor/skills/kernel-authority/SKILL.md`](../../.cursor/skills/kernel-authority/SKILL.md) ↔ [PAS-001](../PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md)

---

## Accounting Core gate

Accounting runtime (`PKGR01_ACCOUNTING`) remains blocked until ADR-0010 **and** a new ADR amends registry prohibited rules. Use PAS + runtime matrix for gap truth — not removed legacy delivery docs.

Verify doc hygiene: `pnpm check:documentation-drift` · `pnpm check:foundation-disposition`
