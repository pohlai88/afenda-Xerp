# ADR-0037 — @afenda/shadcn-studio Source Layered Structure

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-07-01 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |
| **Related ADRs** | [ADR-0027](ADR-0027-frontend-presentation-reset.md) · [ADR-0017](ADR-0017-shadcn-studio-ui-delivery-acceleration.md) |
| **Implementation slice** | [P06-011](../PAS/PRESENTATION/SLICE/p06-011-src-structure-clarity.md) |

---

## Context

`packages/shadcn-studio/src` (~714 files) accumulated three overlapping concerns:

1. **MCP / shadcn CLI install targets** — `components/ui/`, `components/shadcn-studio/blocks/` (fixed by `components.json` cwd).
2. **PAS-006 governance pipeline** — `contracts/`, `registry/`, `governance/` (inventory, lifecycle, acceptance, metadata binding).
3. **Legacy PAS-005A lab residue** — `_storybook/`, root-level `*.stories.tsx`, PAS-005A comments, lab exports on the public barrel.

Contributors cannot tell which folder to edit because:

- The word **contract** applies to four different file kinds (primitive, block, wire, acceptance).
- **registry** and **governance** both hold registries with no one-line boundary rule.
- **Verification assets** are mixed into `src/` and exported from `index.ts` alongside production blocks.
- Block files use inconsistent layout (flat `.tsx` vs folder-per-block) with no documented rule.

PAS-006A–006D delivered the *behavior* (inventory, ACPA, metadata binding). They did not deliver a *maintainer-facing structure contract*. OSS flat layouts (shadcn/ui monorepo) omit governance layers; Radix per-package splits do not fit MCP install paths. A third model is required.

---

## Decision

Adopt a **documented four-layer logical model** on top of **unchanged MCP physical paths**.

### 1. Four layers (authoritative vocabulary)

| Layer | ID | Physical paths (keep) | Import zone | Owns |
| --- | --- | --- | --- | --- |
| **Authority** | L1 | `contracts/**`, `registry/**`, `governance/**` | Zone A — relative imports only | Cross-surface wire shapes, inventory graph, gate aggregators |
| **Product** | L2 | `components/ui/**`, `components/shadcn-studio/blocks/**`, `lib/**`, `hooks/**`, `assets/**`, `theme/**`, `styles/**` | Zone B — `@/` for ui/lib/hooks | MCP output, primitives, blocks, theme CSS, **product-local primitive contracts** |
| **Surfaces** | L3 | `components/erp-shell/**` | Zone B + selective L1 wire types | Afenda-composed operator chrome (not MCP `--overwrite`) |
| **Verification** | L4 | `_storybook/**`, `__tests__/**`, `*.stories.tsx` at `src/` root | Internal only | Storybook parameters, gate tests, MDX docs, verification fixtures |

**L4 note:** L4 is not production runtime. Gate tests under L4 remain **authoritative verification artifacts** — not optional lab trash.

**Hard rule:** Do **not** rename `components/ui/` or `components/shadcn-studio/blocks/` — they are MCP cwd targets per ADR-0017 and `packages/shadcn-studio/components.json`.

### 2. Contract vocabulary (disambiguate “contract”)

| Term | Path pattern | Layer | Purpose |
| --- | --- | --- | --- |
| **Primitive contract** | `components/ui/{name}.contract.ts` | **L2** | Slots, cva, primitive id (PAS-006 · afenda-primitive-contract) |
| **Block contract** | `contracts/blocks/{block}.block.contract.ts` | **L1** | Block governance metadata |
| **Wire contract** | `contracts/*.contract.ts` (non-block) | **L1** | Acceptance, lifecycle, metadata binding, surface template |
| **Data contract** | `contracts/block-data.contract.ts` | **L1** | Serializable column/action shapes |

**Critical clarification:** Not all `*.contract.ts` files are L1 authority contracts.

- **Primitive contracts** are **product-local contracts**. They live beside the primitive in L2 because they govern MCP-installed UI adapter behavior (slots, classes, variants, primitive metadata). They are **not** L1 cross-surface inventory contracts.
- **L1 contracts** define cross-surface wire, block governance, lifecycle, acceptance, and metadata-binding truth.

### 3. registry vs governance

| Folder | Rule |
| --- | --- |
| `registry/` | **Source-of-truth inventory** — slots, lifecycle, parity, metadata-binding graphs |
| `governance/` | **Gate-time aggregation only** — metadata registries and assert helpers consumed by `pnpm check:*` |

`governance/` must not introduce parallel inventory truth; it aggregates from `contracts/` + `registry/`.

### 4. Import zone matrix

Enforced by `pnpm check:studio-import-zones` plus the layer rules below.

| From | May import | Must not import |
| --- | --- | --- |
| **L1 Authority** | L1 relative modules, approved pure helpers | L2 Product, L3 Surfaces, L4 Verification, React components |
| **L2 Product** | Local product modules, `@/lib`, `@/hooks`, co-located primitive contracts | L3 Surfaces, L4 Verification, governance aggregators |
| **L3 Surfaces** | L2 Product, selective L1 wire contracts/types | L4 Verification, governance aggregators as runtime dependencies |
| **L4 Verification** | L1, L2, L3 for testing/storying | Must not be exported by main package barrel |

**One-way dependency direction:**

```text
L4 may observe all
L3 may compose L2 + selected L1
L2 may use product-local contracts/helpers
L1 must not depend on product rendering
```

Legacy Zone A/B shorthand (unchanged):

| Zone | Paths |
| --- | --- |
| **A** | `contracts/**`, `registry/**`, `governance/**` — relative imports only |
| **B** | `components/**`, `lib/**`, `hooks/**` — `@/` for ui/lib/hooks OK |
| **C** | `apps/erp`, Storybook — `@afenda/shadcn-studio` barrel only |

### 5. Public barrel policy

`packages/shadcn-studio/src/index.ts` exports **L2 product + L3 surfaces + selective L1 wire types** only.

Verification exports (`_storybook/story-parameters`, story-only helpers) live on `@afenda/shadcn-studio/lab` — **not** the main ERP barrel.

### 6. Block layout convention

| Complexity | Layout |
| --- | --- |
| Single-region block | `blocks/{block-id}.tsx` |
| Multi-tab / multi-step / slotted regions | `blocks/{block-id}/` with root `{block-id}.tsx` export |

Folder name MUST equal MCP `blockId` / registry `mcpBlockId`.

**Migration rule:** Existing blocks are **not** migrated only for layout consistency. Apply the convention to **new blocks** and to **existing blocks when materially refactored**.

### 7. MVC as documentation vocabulary only

For cross-team explanation (not folder names):

| MVC | Maps to |
| --- | --- |
| Model | L1 wire/block/data contracts + L2 primitive contracts |
| View | L2 + L3 React trees |
| Controller | L1 validators, lifecycle mutation, `assert-*-coverage` builders |

### 8. Implementation via PAS slice (not big-bang)

Structural clarity is delivered in phases by [P06-011](../PAS/PRESENTATION/SLICE/p06-011-src-structure-clarity.md):

- **Phase 0** — `ARCHITECTURE.md` + package `README.md` (no moves)
- **Phase 1** — Barrel hygiene + PAS-005A → PAS-006A header relabel + `@afenda/shadcn-studio/lab`
- **Phase 2** — PAS-006A authority surfaces table sync
- **Phase 3** — Optional lab path consolidation (deferred unless approved)

---

## Alternatives considered

### A. Flat OSS layout (shadcn/ui default)

Merge authority into product tree (`src/models/`, `src/components/` only).

- **Rejected:** Loses Zone A/B import enforcement; fights PAS-006B relational inventory model.

### B. Physical rename to match layers

Move blocks to `src/blocks/`, authority to `src/authority/`.

- **Rejected:** Breaks MCP `components.json` aliases and every existing import; high regression risk for ~252 ui files.

### C. Radix-style one-package-per-primitive

Split each primitive into `@afenda/shadcn-studio-button`, etc.

- **Rejected:** Operational overhead; incompatible with shadcn CLI bulk install and Afenda gate suite.

### D. Document-only layered model (chosen)

Keep physical paths; add architecture docs, naming vocabulary, barrel policy, and phased cleanup.

- **Accepted:** Zero MCP breakage; matches existing `check:studio-import-zones` gate.

---

## Consequences

### Positive

- Onboarding: one page (`ARCHITECTURE.md`) explains all ~714 files.
- Agents and implementers share L1–L4 vocabulary in Phase 0 handoffs.
- Barrel policy prevents ERP importing verification-only surfaces.
- Disambiguated “contract” reduces wrong-file edits.

### Negative / trade-offs

- Physical paths remain verbose (`components/shadcn-studio/blocks/`).
- Two README surfaces (package + ARCHITECTURE) must stay synced on slice close.
- Phase 1 barrel change requires Storybook to import `@afenda/shadcn-studio/lab` when using package subpath.

### Migration

- No filesystem moves in Phase 0–1.
- PAS-005A comments relabeled; no PAS-005 slice re-execution.
- Registry disposition unchanged (PKGR05A remains Enterprise Accepted).

---

## Acceptance gate

| # | Criterion | Verification |
| --- | --- | --- |
| 1 | ADR-0037 accepted by Architecture Authority | Review sign-off |
| 2 | P06-011 Phase 0 delivered: `ARCHITECTURE.md` and package README updated | File review |
| 3 | P06-011 Phase 1 delivered: public barrel no longer exports lab-only surfaces | Slice handoff + import check |
| 4 | `packages/shadcn-studio/ARCHITECTURE.md` matches ADR L1–L4 vocabulary | File review |
| 5 | Primitive contracts documented as L2 product-local contracts, not L1 authority contracts | Architecture review |
| 6 | `registry/` vs `governance/` boundary documented with no parallel inventory truth | File review |
| 7 | Import zones unchanged and green | `pnpm check:studio-import-zones` |
| 8 | Package gates green after Phase 1 | `pnpm --filter @afenda/shadcn-studio typecheck` · `test:run` · `build` |
| 9 | PAS-006A §2 authority surfaces reference `ARCHITECTURE.md` | Doc drift check |

---

## References

- [PAS-006](../PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · [PAS-006A](../PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md)
- [P06-011 slice handoff](../PAS/PRESENTATION/SLICE/p06-011-src-structure-clarity.md)
- [shadcn-studio skill](../../.cursor/skills/shadcn-studio/SKILL.md)
- [afenda-primitive-contract skill](../../.cursor/skills/afenda-primitive-contract/SKILL.md)
- Gate: `scripts/governance/check-studio-import-zones.mjs`
- Package architecture: `packages/shadcn-studio/ARCHITECTURE.md`
