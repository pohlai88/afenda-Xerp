# Architecture documents (ARCH-*)

Domain-specific architecture authorities that extend [`docs/architecture/`](../architecture/README.md) registries and [`docs/adr/`](../adr/README.md) decisions.

**Start here:** [`arch-status-index.md`](arch-status-index.md) — status catalog, slice sequence, and paired FDR links.

| Document | Package / domain | Purpose |
| --- | --- | --- |
| [`arch-status-index.md`](arch-status-index.md) | — | ARCH status index (adopted from delivery index pattern; FDR is implementation authority) |
| [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) | — | Enterprise architecture requirement template for ARCH-* docs and slices |
| [\[Partially Implemented\] ARCH-AUTH-001-enterprise-authentication.md](%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) | PKG-002 · `@afenda/auth` | Enterprise auth features, acceptance criteria, DoD, UI block map |
| [\[Partially Implemented\] ARCH-ADMIN-001-system-admin-control-plane.md](%5BPartially%20Implemented%5D%20ARCH-ADMIN-001-system-admin-control-plane.md) | PKG-007 · `@afenda/erp` · `@afenda/appshell` | System Admin control plane — Phase A–D delivered (Slices 1–6); DoD #20 peer review open |
| [\[Partially Implemented\] ARCH-APPS-001-applications-book.md](%5BPartially%20Implemented%5D%20ARCH-APPS-001-applications-book.md) | PKG-005 · `@afenda/docs` | Fumadocs Applications Book — Slices 1–3 delivered; DoD #20 peer review open |

**Hierarchy:** ADR > ARCH-* > FDR delivery docs > runtime matrix > code.

When authoring or executing a new ARCH domain doc, start from [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) and add a row to [`arch-status-index.md`](arch-status-index.md).
