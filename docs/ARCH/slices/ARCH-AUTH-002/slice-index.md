# ARCH-AUTH-002 · Slice index

> **Historical delivery artifact:** Slice handoffs describe the parallel `(auth-v2)` / `/v2/*` delivery phase. **Current runtime (2026-06-26):** consolidated single `(auth)` + `@afenda/appshell/auth-shell` — see parent ARCH consolidation banner.

| Slice | Title | Priority | Status |
| ---: | --- | --- | --- |
| 1 | Inventory and boundary map | P0 | **Delivered** (2026-06-26) |
| 2 | Package contracts and components | P0 | **Delivered** |
| 3 | Dedicated auth visual system (CSS) | P1 | **Delivered** |
| 4 | App route consumption | P0 | **Delivered** — forms + verify/recover routes (historical `/v2/*` paths; now canonical `/sign-in`, …) |
| 5 | Tests and governance guard | P1 | **Delivered** — `check:auth-shell-boundary` + package tests |
| 6 | Visual QA and Storybook | P1 | **Delivered** — `auth-shell.stories.tsx` |
| 7 | Complete promotion + matrix sync | P1 | **Delivered** (2026-06-26) · **Consolidated** — legacy v1 decommissioned; V2 promoted to canonical naming |

**Status:** **Complete — enterprise 9.5 accepted** (29/30) · **Consolidated 2026-06-26**

**Post-Complete backlog (P2):** auth shell i18n — separate ARCH/FDR approval required. (Per-tenant auth branding delivered via ARCH-AUTH-003.)
