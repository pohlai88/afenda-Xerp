# ARCH-EMAIL-001 · Slice 15 — `apps/email` React Email preview

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-EMAIL-001`](../../%5BComplete%5D%20ARCH-EMAIL-001-resend-transactional-email.md) |
| **Slice** | 15 |
| **Status** | **Delivered** (2026-06-26) |
| **Prerequisite** | Slices 1–14 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/email/` |
| **Closes** | EMAIL-P3-PREVIEW · ARCH §5.4 P3 preview |

---

## Design (internal-guide)

- Thin dev-only app `@afenda/email` — no production deploy, no duplicate templates.
- `react-email dev --dir packages/auth/src/emails/templates --port 3003` (next-forge pattern).
- Templates remain owned by `@afenda/auth`; preview app is a path consumer only.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-EMAIL-001/slice-15-email-preview-app.md

1. Objective    — Add apps/email React Email preview server on port 3003 for @afenda/auth transactional templates.
2. Allowed layer— apps/email/
3. Files        —
   apps/email/package.json (New)
   apps/email/tsconfig.json (New)
   apps/email/.gitignore (New)
   docs/ARCH/slices/ARCH-EMAIL-001/slice-15-email-preview-app.md (New)
   docs/ARCH/slices/ARCH-EMAIL-001/slice-index.md (Modified)
   docs/ARCH/[Complete] ARCH-EMAIL-001-resend-transactional-email.md (Modified)
   docs/delivery/FDR/[Complete] fdr-002-email-delivery.md (Modified)
   docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — Duplicate templates in apps/email; production Vercel deploy; @afenda/notifications; registry edits
5. Authority    — ARCH-EMAIL-001 §5.4 P3 · PKG002_AUTH templates in packages/auth
6. Gates        —
   pnpm --filter @afenda/email typecheck
   pnpm check:documentation-drift
7. Closes       — EMAIL-P3-PREVIEW
8. Evidence     — apps/email/package.json · pnpm --filter @afenda/email dev (port 3003)
9. Attestation  — Documentation; Maintainability (DX)
```

---

## Usage

```bash
pnpm --filter @afenda/email dev
# → http://localhost:3003
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| — | React Email preview for auth templates | `pnpm --filter @afenda/email typecheck` |
