# shadcn-studio-v2 Legacy Retirement Plan

## Purpose

This plan records the V2-only retirement decision after the consumer pilot.

Slice 9 does not delete legacy code. It converts retirement into a controlled
release-owner decision backed by V2 evidence.

## Retirement authority

- Source of truth: `docs/MIGRATION-MAP.md`
- Replacement proof: Slice 8 consumer pilot
- Public API proof: Slice 7 boundary tests
- Metadata proof: Slice 6 metadata-lane tests
- Deletion authority: not granted by V2 Slice 9

## Current decision

Legacy `packages/shadcn-studio` remains active until a separate release-owner
cutover decision is made.

V2 has enough package-local proof to classify legacy lanes, but not enough
authority to delete or redirect production consumers.

## Lane disposition

| Legacy lane | Retirement disposition | Evidence |
| --- | --- | --- |
| `components-ui` | `migrated` | Primitive and consumer-pilot tests |
| `components-assets` | `migrated` | `IconMark` and consumer-pilot tests |
| `components-quarantine` | `quarantined` | V2 quarantine README and non-exported boundary |
| `components-app-shell` | `migrated` | Layout and page-surface tests |
| `components-auth-shell` | `migrated` | `AuthShell` and consumer-pilot tests |
| `components-layouts` | `migrated` | Page/widget view tests |
| `theme-config` | `migrated` | Config/runtime boundary tests |
| `theme-runtime` | `migrated` | Theme provider/toggle consumer-pilot test |
| `meta-contracts` | `migrated` | Metadata-lane tests |
| `meta-registry` | `migrated` | Metadata registry serializability test |
| `meta-gates` | `migrated` | Metadata gate validation tests |

## Release-owner gates before deletion

- Confirm production consumer cutover target.
- Confirm package export compatibility or migration codemod.
- Confirm V2 CSS dist and runtime loading in the actual app surface.
- Confirm rollback path to legacy package.
- Run release-level root gates outside this V2-only slice.

## Prohibited actions in Slice 9

- Do not delete legacy package files.
- Do not redirect ERP imports.
- Do not run root-wide repair work.
- Do not treat `migrated` as `retired`.
- Do not remove blocked/quarantined rows from `MIGRATION-MAP.md`.
