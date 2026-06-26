# ARCH-AUTH-002 · Slice 1 — Inventory and boundary map

> **Historical slice handoff** — paths below describe parallel `(auth-v2)` delivery. **Superseded for coding** by consolidation (2026-06-26): `(auth)`, `@afenda/appshell/auth-shell`, canonical URLs.

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-002`](../../%5BComplete%5D%20ARCH-AUTH-002-auth-shell.md) |
| **Prerequisite** | ARCH-AUTH-001 Complete ✓ |
| **Slice** | 1 |
| **Status** | **Delivered** 2026-06-26 |
| **Type** | Evidence / doc-only |
| **Risk** | Low · **Clean Core:** B |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-002/slice-01-inventory-boundary-map.md

1. Objective    — Produce implementation map of existing auth-shell package + ERP consumer;
                  document boundary violations; recommend slice 2–6 modifications. No code edits.
2. Allowed layer— docs/ARCH/** only
3. Files        —
                  docs/ARCH/[Complete] ARCH-AUTH-002-auth-shell.md (§15 inventory)
                  docs/ARCH/slices/ARCH-AUTH-002/slice-index.md
                  docs/ARCH/arch-status-index.md (register row)
4. Prohibited   — packages/** · apps/** · runtime code changes
5. Authority    — ARCH-TEMPLATE · PKG001_APPSHELL · figma-afenda-design-system-rules
6. Gates        —
                  pnpm check:documentation-drift
7. Closes       — Slice 1 inventory gate
8. Evidence     — §15 in parent ARCH doc · this slice doc · index row
9. Attestation  — Documentation · Boundary map
```

---

## Delivery evidence (2026-06-26)

Inventory captured in parent ARCH §15. Key findings:

- Partial `@afenda/appshell/auth-shell` exists (EntryPage, ErrorSurface, brand panel, tests, stories).
- App `AuthEntryPage` adapter already composes package shell; forms remain app-owned.
- Boundary violations: `erp-auth-error-page` wrapper; package default eyebrow contains `/sign-in`; no dedicated `auth-shell.css`; no lane model; no boundary guard.

**Next:** Slice 2 — package contracts and components.
