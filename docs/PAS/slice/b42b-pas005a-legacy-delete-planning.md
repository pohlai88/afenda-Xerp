# Slice B42b — Appshell Legacy Parity Inventory & Delete Planning (PAS-005A §11.1 · §11.4)

**Prerequisite:** B42 delivered (partial) — ERP CSS chain, metadata-ui theme hook, ADR-0017 retarget, `PKGR05A_SHADCN_STUDIO` promoted (`amber-lane`)

**Status:** Planning delivered (2026-06-28) — **delete blocked** until block parity + MCP re-seed

**Type:** Research + Planning (implementation slice follows parity proof)

**Risk class:** Critical — deleting `packages/appshell/src/shadcn-studio/` without parity breaks `@afenda/appshell` public API (~60 block exports)

**Clean Core impact:** A→B — strangler cutover; re-seed via MCP only; never migrate legacy TSX

## Purpose

Inventory legacy appshell shadcn/studio block surface, compare against `@afenda/shadcn-studio` seed inventory, define parity gates, and produce a deterministic delete sequence. **No filesystem delete in this slice.**

## Handoff block

```
Handoff from: docs/PAS/slice/b42b-pas005a-legacy-delete-planning.md

1. Objective    — Document block parity inventory, classify legacy appshell studio exports, and define MCP re-seed + delete gates; prove delete is blocked until parity.
2. Allowed layer— docs/PAS/slice/b42b-pas005a-legacy-delete-planning.md · docs/PAS/pas-status-index.md · docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (§14 sequence only)
3. Files        —
   docs/PAS/slice/b42b-pas005a-legacy-delete-planning.md
   docs/PAS/pas-status-index.md
   docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md
4. Prohibited   — DELETE packages/appshell/src/shadcn-studio/** · Edit foundation-disposition.registry.ts · Migrate/copy legacy TSX · Edit packages/appshell/src/index.ts re-exports (follow-on slice)
5. Authority    — PAS-005A §11.1 · §11.4 · ADR-0017 · PKGR05A prohibited `do-not-migrate-appshell-studio-tsx`
6. Gates        —
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Unstructured delete risk; missing parity evidence for legacy tree
8. Evidence     —
   docs/PAS/slice/b42b-pas005a-legacy-delete-planning.md (inventory tables)
   packages/appshell/src/shadcn-studio/STUDIO-PATTERN-MAP.md (legacy catalog)
9. Attestation  — Planning · Documentation
```

## Parity snapshot (2026-06-28)

| Surface | Legacy (`packages/appshell/src/shadcn-studio`) | Target (`packages/shadcn-studio`) | Parity |
| --- | ---: | ---: | --- |
| Production block TSX (excl. stories) | **63** | **2** (placeholder-hero, placeholder-form) | **3%** |
| UI primitives (`src/components/ui/`) | 0 (uses `@afenda/ui` in blocks) | **5** (button, card, input, label, select) | B40 minimum met |
| Theme presets | N/A (css-authority + appshell CSS) | **12 + default** | Target owns presets |
| Data fixtures | 6 files under `data/` | 0 | Not ported — re-seed or drop with block |
| Assets | 1 illustration | 0 | Follow block re-seed |
| Storybook stories (legacy tree) | ~25 `.stories.tsx` in appshell | 3 lab stories in `apps/storybook/stories/shadcn-studio-*.stories.tsx` | Lab only on target |

**Verdict:** **DELETE BLOCKED.** Parity rule from B42/B42b requires functional block inventory in `@afenda/shadcn-studio` before removing legacy tree.

## Legacy block inventory (production TSX)

### Account settings (7 shells + 19 content panels)

| Legacy path | Category | MCP re-seed target |
| --- | --- | --- |
| `blocks/app-shell-account-settings-01.tsx` | Shell | `/cui` account-settings-01 |
| `blocks/account-settings-01/content/*` (5) | Content | `/cui` |
| `blocks/app-shell-account-settings-02.tsx` | Shell | `/cui` account-settings-02 |
| `blocks/account-settings-02/content/*` (4) | Content | `/cui` |
| `blocks/app-shell-account-settings-03.tsx` | Shell | `/cui` account-settings-03 |
| `blocks/account-settings-03/content/*` (5) | Content | `/cui` |
| `blocks/app-shell-account-settings-04.tsx` | Shell | `/cui` account-settings-04 |
| `blocks/account-settings-04/content/*` (1) | Content | `/cui` |
| `blocks/app-shell-account-settings-05.tsx` | Shell | `/cui` account-settings-05 |
| `blocks/app-shell-account-settings-06.tsx` | Shell | `/cui` account-settings-06 |
| `blocks/app-shell-account-settings-06-policy.tsx` | Content | `/cui` |
| `blocks/app-shell-account-settings-06-user.tsx` | Content | `/cui` |
| `blocks/app-shell-account-settings-07.tsx` | Shell | `/cui` account-settings-07 |
| `blocks/account-settings-07/content/*` (5) | Content | `/cui` |
| `blocks/app-shell-account-settings-panel-section.tsx` | Shared | `/rui` or local primitive |

### Application shell chrome (16)

| Legacy path | Category |
| --- | --- |
| `blocks/app-shell-application-shell-02.tsx` | Shell layout |
| `blocks/app-shell-module-workspace-chrome.tsx` | Module chrome |
| `blocks/app-shell-context-switcher.tsx` | Context |
| `blocks/app-shell-menu-trigger.tsx` | Nav |
| `blocks/app-shell-search-dialog.tsx` | Command |
| `blocks/app-shell-activity-dialog.tsx` | Activity |
| `blocks/app-shell-activity-feed.tsx` | Activity |
| `blocks/app-shell-notification-dropdown.tsx` | Header |
| `blocks/app-shell-language-dropdown.tsx` | Header |
| `blocks/app-shell-profile-dropdown.tsx` | Header |
| `blocks/app-shell-sidebar-user-dropdown.tsx` | Sidebar |
| `blocks/app-shell-auth-login-page-04.tsx` | Auth marketing |
| `blocks/app-shell-auth-error-page-02.tsx` | Auth error |
| `assets/app-shell-auth-error-illustration.tsx` | Auth asset |

### Dashboard / statistics (22)

| Legacy path | Category |
| --- | --- |
| `blocks/app-shell-dashboard-*` (14 files) | Dashboard widgets |
| `blocks/statistics-*` (5 files) | Stat cards |
| `blocks/system-admin-readiness-gate-metrics.tsx` | Admin metrics |
| `blocks/app-shell-dashboard-pagination.ts` | Utility |
| `blocks/app-shell-dashboard-breakdown.utils.tsx` | Utility |
| `blocks/app-shell-dashboard-invoice-table.columns.tsx` | Table columns |

## Target seed inventory (`@afenda/shadcn-studio`)

| Path | Source | Status |
| --- | --- | --- |
| `src/blocks/placeholder-hero/` | B40 manual | Replace via `/cui` |
| `src/blocks/placeholder-form/` | B40 manual | Replace via `/cui` |
| `src/components/ui/{button,card,input,label,select}.tsx` | B40 manual | Expand via `/rui` as needed |

## Delete sequence (follow-on slice — **not B42b**)

Execute only when **all** preconditions pass:

1. **MCP re-seed** — From `packages/shadcn-studio` with credentials in `.env.secret`:
   - `/cui` collect-all-then-install for each production block category above
   - `/rui` for any missing primitives referenced by promoted blocks
   - Replace B40 placeholders; document provenance headers per B40 slice
2. **Storybook parity** — Lab stories cover each promoted block category OR ERP spot-check sign-off documented
3. **Appshell re-export bridge** — Update `packages/appshell/src/index.ts` to re-export from `@afenda/shadcn-studio` (or thin wrappers) **before** delete
4. **Consumer scan** — `rg '@afenda/appshell.*[Ss]tudio|shadcn-studio'` across monorepo; zero direct legacy path imports
5. **Gates** — `pnpm ui:guard`, `pnpm --filter @afenda/appshell test:run`, `pnpm --filter @afenda/erp typecheck`, `pnpm quality:boundaries`
6. **Delete** — `git rm -r packages/appshell/src/shadcn-studio/` + remove `afenda-appshell-studio.css` bridge if superseded
7. **Registry** — `foundation-registry-owner` may promote `PKGR05A` to `green-lane` when B42b implementation slice closes

## MCP re-seed operator checklist

```bash
# cwd MUST be packages/shadcn-studio (shadcn-studio.config.json)
cd packages/shadcn-studio
# Credentials: repo root .env.secret (shadcn-studio MCP)
# Workflow: /cui and /rui — collect ALL blocks before ANY install (ADR-0017)
```

Agent environment note: MCP shadcn-studio server was unavailable during B40; manual seed satisfied minimum DoD. Live re-seed is **operator-owned** until MCP session is available.

## Rules frozen

1. **Parity before delete** — This slice proves parity is **not** met (3% blocks)
2. **Re-seed, never migrate** — No copy from `packages/appshell/src/shadcn-studio/`
3. **Registry** — Lane promotion after delete is registry-owner only
4. **ERP auth ui:guard** — Separate slice (3 files fixed 2026-06-28)

## DoD (B42b planning)

- [x] Parity inventory table with counts
- [x] Legacy block manifest by category
- [x] Delete preconditions documented
- [x] MCP operator checklist
- [x] Explicit **delete blocked** attestation
- [ ] Filesystem delete (deferred — follow-on slice)
- [ ] MCP live re-seed (deferred — operator)

## Related slices

| Slice | Scope |
| --- | --- |
| B40 | MCP seed minimum (manual equivalent delivered) |
| B42 | Afenda integration bridge (partial) |
| B42c (proposed) | MCP live re-seed + block promotion |
| B42d (proposed) | Appshell re-export bridge + legacy delete |
