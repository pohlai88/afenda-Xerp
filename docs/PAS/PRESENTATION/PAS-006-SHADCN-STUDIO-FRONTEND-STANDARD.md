# PAS-006 — shadcn-studio Frontend Standard

| Field | Value |
|-------|-------|
| **Status** | Active |
| **Domain** | Presentation |
| **Runtime package** | `@afenda/shadcn-studio` |
| **Constitutional ADR** | [ADR-0027](../../adr/ADR-0027-frontend-presentation-reset.md) |

---

## §0 Agent Quick Path

1. Read [ADR-0027](../../adr/ADR-0027-frontend-presentation-reset.md) — no legacy UI packages.
2. Install blocks from `packages/shadcn-studio` cwd (ADR-0017 MCP rules).
3. Export blocks via `@afenda/shadcn-studio` public surface.
4. Wire ERP imports from shadcn-studio only — not `@afenda/ui` or `@afenda/appshell`.
5. Gates: `pnpm --filter @afenda/shadcn-studio typecheck` · `pnpm --filter @afenda/erp build` · `pnpm sync:package-css-dist`

---

## Scope

| In scope | Out of scope |
|----------|--------------|
| Block inventory, theme presets, CSS export | Deleted governed-ui primitives |
| Storybook stories for blocks | metadata-ui workspace (greenfield later) |
| ERP globals.css composition chain | PAS-005 css-authority monolith |

---

## CSS authority

Single sync target per `scripts/governance/package-css-dist-policy.mjs`:

- Source: `packages/shadcn-studio/src/styles/shadcn-studio.css`
- Dist: `packages/shadcn-studio/dist/shadcn-studio.css`

---

## Public contract rules

- Theme presets and block registry entries must be **JSON-serializable** at boundaries.
- No circular imports between shadcn-studio and ERP.
- ERP `proxy.ts` handles correlation-id only; CSP hardening is a follow-up ADR when third-party scripts return.

---

## Evidence paths

Registry entry: `PKGR05A_SHADCN_STUDIO` in `foundation-disposition.registry.ts`

---

## Related

- [North star](../../NORTHSTAR/shadcn-studio-presentation-north-star.md)
- [Blueprint](../../BLUEPRINT/shadcn-studio-presentation-blueprint.md)
- [shadcn-studio SKILL](../../../.cursor/skills/shadcn-studio/SKILL.md)
