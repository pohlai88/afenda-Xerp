# Concept-first landing workflow

Use this reference after `afenda-editorial-landing-builder` triggers.

## Concept brief

The concept must include:

- Surface purpose and audience.
- Required visible copy and navigation, if any.
- Selected Afenda preset: `afenda-brand` for Swiss control-room landings or
  `afenda-verdant` for calm long-hour review surfaces.
- Explicit exclusions, especially auth/session/governance runtime elements for
  `apps/developer`.
- Full first viewport at the target review size, usually desktop `1440x900`.
- Implementation-friendly layout with code-native text and controls.

Reject concepts that are header-only, generic SaaS grids, unreadable, auth-like,
decorative without purpose, or too vague to implement.

## Design inventory before code

Record these items before the first edit:

```txt
Concept source:
Surface:
Preset:
Allowed visible copy:
First viewport composition:
Typography roles:
Palette and contrast:
Signature element:
Proof/review elements:
Container model:
Responsive rules:
Auth exclusions:
Intentional deviations:
```

## Implementation rules

- Build the usable landing surface as the first screen.
- Preserve accepted concept copy, hierarchy, density, spacing, and palette.
- Use route-local `_components/` in `apps/developer`.
- Keep `page.tsx` thin and Server Component by default.
- Use semantic landmarks, headings, lists, and accessible text contrast.
- Do not import auth, kernel, BFF, or protected-route runtime dependencies into
  the developer landing page.
- Do not add new global CSS or noir CSS unless the slice explicitly owns that CSS.

## Verification ledger

Before completion, compare the concept and rendered page:

```txt
Concept evidence:
Rendered evidence:
Viewport:
Copy diff:
Comparison points:
1.
2.
3.
4.
5.
Intentional deviations:
```

If the browser render would receive design-review comments, keep fixing before
handoff.
