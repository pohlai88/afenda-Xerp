# Architecture documents (ARCH-*)

Domain-specific architecture authorities that extend [`docs/architecture/`](../architecture/README.md) registries and [`docs/adr/`](../adr/README.md) decisions.

**Start here:** [`arch-status-index.md`](arch-status-index.md) — status catalog, slice sequence, and paired FDR links.

| Document | Package / domain | Purpose |
| --- | --- | --- |
| [`arch-status-index.md`](arch-status-index.md) | — | ARCH status index (adopted from delivery index pattern; FDR is implementation authority) |
| [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) | — | Enterprise architecture requirement template for ARCH-* docs and slices |
| [\[Partially Implemented\] ARCH-AUTH-001-enterprise-authentication.md](%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) | PKG-002 · `@afenda/auth` | Enterprise auth — acceptance criteria, DoD, UI block map |
| [\[Complete\] ARCH-ADMIN-001-system-admin-control-plane.md](%5BComplete%5D%20ARCH-ADMIN-001-system-admin-control-plane.md) | PKG-007 · `@afenda/erp` | System Admin (`/system-admin/**`) — **Complete — enterprise 9.5 accepted** (29/30; DoD #20 closed 2026-06-25) |
| [\[Complete\] ARCH-USER-001-user-settings-self-service.md](%5BComplete%5D%20ARCH-USER-001-user-settings-self-service.md) | PKG-007 · `@afenda/erp` | User settings (`/settings/**`) — **Complete — enterprise 9.5 accepted** (29/30; DoD #20 closed 2026-06-25) |
| [\[Complete\] ARCH-DOCS-001-fumadocs-site.md](%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) | PKG-005 · `@afenda/docs` | Fumadocs `/docs/apps/**` — **Complete — enterprise 9.5 accepted** (2026-06-25) |

**Naming:** `ARCH-<DOMAIN>-<NNN>-<slug>.md` — e.g. `ARCH-ADMIN-001-system-admin-control-plane.md`.  
**Retired:** `ARCH-APPS-001-applications-book.md` → **ARCH-DOCS-001-fumadocs-site.md** (2026-06-25).

**Hierarchy:** ADR > ARCH-* > FDR delivery docs > runtime matrix > code.

When authoring or executing a new ARCH domain doc, start from [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) and add a row to [`arch-status-index.md`](arch-status-index.md).
