# shadcn-studio-v2 Migration Map

## Purpose

This document records how legacy `packages/shadcn-studio` structure translates into `packages/shadcn-studio-v2`.

Use this file during Slice 8 and Slice 9 work. Do not migrate by memory or by direct folder copying.

## Status Vocabulary

Use only these statuses:

- `pending`
- `migrated`
- `replaced`
- `quarantined`
- `retired`
- `blocked`

## Translation Rule

Legacy names are not valid in V2 by default.

Every migrated unit must:

- map into registered V2 taxonomy
- keep the public export boundary intact
- preserve CSS and runtime boundary rules
- prove the destination slice is ready before movement begins

## Migration Table

| Legacy path | V2 destination | Status | Notes |
| --- | --- | --- | --- |
| `components-ui` | `components/ui` | `migrated` | Pilot proves governed primitive consumption through `clients.ts`. |
| `components-assets` | `assets` or `components/assets` | `migrated` | Pilot proves component-coupled asset consumption through `IconMark`. |
| `components-quarantine` | `components/quarantine` | `quarantined` | Quarantine remains non-public and has V2 README governance. |
| `components-app-shell` | `components/layout` or `views/*` | `migrated` | Pilot proves reusable layout chrome through `PageSurface` and layout components. |
| `components-auth-shell` | `views/auth` | `migrated` | Pilot proves auth composition through `AuthShell`. |
| `components-layouts` | `views/*` | `migrated` | Pilot proves page/widget view composition by shape. |
| `theme-config` | `configs` | `migrated` | Static theme/studio config is available and tested. |
| `theme-runtime` | `contexts` plus `components/shared` plus `hooks` | `migrated` | Pilot proves `ThemeProvider` and `ThemeToggle` through `clients.ts`. |
| `meta-contracts` | `metadata/contracts` | `migrated` | Pilot proves JSON-safe metadata contracts through `metadata.ts`. |
| `meta-registry` | `metadata/registries` | `migrated` | Slice 6 registry remains metadata-only and serializable. |
| `meta-gates` | `metadata/gates` | `migrated` | Slice 6 gates validate metadata shapes without UI coupling. |

## Update Rule

When a row changes status:

- update the status in this file
- keep the destination aligned with `TAXONOMY.md`
- do not remove the legacy row until retirement proof exists

## Related Documents

- `ROADMAP.md`
- `TAXONOMY.md`
- `../AGENTS.md`
