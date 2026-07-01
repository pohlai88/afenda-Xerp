# ADR-0038 — @afenda/shadcn-studio Prefixed-Folder Layout

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-07-01 |
| **Owner** | Architecture Authority |
| **Amends** | [ADR-0037](ADR-0037-shadcn-studio-src-layered-structure.md) |
| **Related** | [P06-011](../PAS/PRESENTATION/SLICE/p06-011-src-structure-clarity.md) |

---

## Context

ADR-0037 documented a four-layer model on **unchanged physical paths**. Contributors still confused `contracts/` vs `governance/` and deep `components/shadcn-studio/blocks/` nesting.

MCP-installed UI requires hardening before production use; raw CLI output need not land in production folders.

---

## Decision

1. **One-level prefixed folders** under `src/` — prefix identifies bucket; **file names stay clear** (no file-level prefix).
2. **Rename governance → `meta-gates/`** — CI aggregators only; not wire contracts.
3. **Rename `contracts/` → `meta-contracts/`**, `registry/` → `meta-registry/`**.
4. **Component buckets:** `components-ui/`, `components-layouts/`, `components-auth-shell/`, `components-app-shell/`, `components-assets/`, `components-quarantine/` (MCP inbox).
5. **Split `utils/`** from `lib/`; add `types/` for shared non-wire TS.
6. **Consolidate lab** into `storybook/`; package tests into `gate/`.
7. **`@afenda/shadcn-studio/governance` export path unchanged** — source moves to `meta-gates/`; build maps to `dist/governance/`.
8. **`components.json` aliases** point at `components-quarantine/` for MCP installs only.

---

## Consequences

- Large import-path migration; gates and codegen paths updated in same change train.
- ADR-0037 “frozen MCP paths” relaxed for **production** folders; quarantine retains vendor layout for CLI.
