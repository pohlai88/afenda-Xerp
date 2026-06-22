# @afenda/appshell

Enterprise ERP application shell — Shell-05 layout system.

## CSS

**Authority:** `@afenda/appshell` owns all `.app-shell-*` structural classes.
**Property namespace:** `--app-shell-*` (no `--afenda-*`, `--color-*`, `--spacing-*` definitions).
**No fixture CSS** — this package has no storybook-only CSS file.

### Import

```css
@import "@afenda/appshell/afenda-appshell.css";
```

### Canonical app import order

See [docs/architecture/css-authority.md](../../docs/architecture/css-authority.md#canonical-erp-app-import-order).

### Manifest

`src/styles/css-manifest.ts` — describes every CSS entrypoint, purpose, and allowed importers.
Run `pnpm check:css-governance` to verify.

### Rules

- All production classes use `.app-shell-` prefix.
- Shell-scoped custom properties use `--app-shell-` prefix (e.g. `--app-shell-header-strip-height`).
- `@theme inline` is forbidden — shell does not define Tailwind utilities.
- Do NOT import fixture or storybook CSS in production app globals.
