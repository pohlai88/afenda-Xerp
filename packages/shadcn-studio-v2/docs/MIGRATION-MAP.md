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
| `components-ui` | `components/ui` | `pending` | Translate only governed stable primitives. |
| `components-assets` | `assets` or `components/assets` | `pending` | Use package asset role to decide destination. |
| `components-quarantine` | `components/quarantine` | `pending` | Quarantine remains non-public. |
| `components-app-shell` | `components/layout` or `views/*` | `pending` | Reusable chrome stays in layout; composed surfaces move to views. |
| `components-auth-shell` | `views/auth` | `pending` | Auth composition belongs in the V2 view layer. |
| `components-layouts` | `views/*` | `pending` | Translate by composed surface shape, not by legacy folder name. |
| `theme-config` | `configs` | `pending` | Static config only. |
| `theme-runtime` | `contexts` plus `components/shared` plus `hooks` | `pending` | Split provider, helper UI, and runtime access concerns. |
| `meta-contracts` | `metadata/contracts` | `pending` | Metadata-only lane. |
| `meta-registry` | `metadata/registries` | `pending` | Metadata-only lane. |
| `meta-gates` | `metadata/gates` | `pending` | Metadata-only lane. |

## Update Rule

When a row changes status:

- update the status in this file
- keep the destination aligned with `TAXONOMY.md`
- do not remove the legacy row until retirement proof exists

## Related Documents

- `ROADMAP.md`
- `TAXONOMY.md`
- `../AGENTS.md`
