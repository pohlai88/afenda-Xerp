# ERP public assets

Static files served from `apps/erp/public/` at the site root.

## Browser and PWA icons (canonical)

| Path | Use |
| --- | --- |
| `/favicon.ico` | Browser tab favicon |
| `/icons/afenda-icon-180-transparent.png` | Apple touch icon |
| `/icons/afenda-icon-192-transparent.png` | PWA / Android |
| `/icons/afenda-icon-512-transparent.png` | PWA splash |
| `/icons/afenda-icon-512-maskable.png` | Maskable PWA |
| `/site.webmanifest` | Web app manifest |

Wired in [`apps/erp/src/app/layout.tsx`](../src/app/layout.tsx) via Next.js `metadata.icons` and `metadata.manifest`.

**Source of truth for PNG exports:** `afenda-brand/icons/` (brand guideline exports). Canonical `/icons/` copies are synced for URL stability.

## Inline SVG (components)

For React surfaces, use `@afenda/shadcn-studio` assets:

- `LogoSvg` — [`packages/shadcn-studio/src/components-assets/icon-logo.tsx`](../../packages/shadcn-studio/src/components-assets/icon-logo.tsx)
- OAuth marks — `icon-google.tsx`, `icon-github.tsx` in `components-assets/`

Do not duplicate SVG paths in ERP when the studio asset already exists.

## Auth ingress preview

| Path | Use |
| --- | --- |
| `/auth/auth-entry-preview.png` | Sign-in branding panel preview in `login-page-04` block |

## Brand marketing archive

`afenda-brand/` holds brand guidelines, landing imagery, and Lynx operator assets. Prefer `/icons/` and `/auth/` for runtime ERP paths — not deep nested `afenda-brand/afenda-brand/` duplicates.

## Related

- [auth-ingress-ecosystem.md](../../packages/shadcn-studio/docs/auth-ingress-ecosystem.md)
- [packages/shadcn-studio/AGENTS.md](../../packages/shadcn-studio/AGENTS.md)
