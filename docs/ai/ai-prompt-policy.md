# AI Prompt Policy

## Required Prompt Elements

Every AI-assisted change request must declare:

1. **TIP ID** — e.g. `TIP-002`
2. **ADR** — e.g. `ADR-0007`
3. **Scope** — paths in `.tip-scope.json`
4. **Non-goals** — what must not change
5. **Test plan** — verification commands
6. **Definition of Done** — quality gates to pass

## Manifest Attestation

When scope validation runs, `.tip-scope.json` must include non-empty:

- `reason`
- `nonGoals`
- `testPlan`

Empty attestation fields fail CI.

## Suppression Rationale

Changed lines containing suppressions must include TIP or ADR reference in the same line or preceding comment, or the file must appear in `testExemptions` with rationale.

Allowed patterns:

```text
// biome-ignore ... TIP-002 requires barrel export
// ADR-0007: temporary exemption
```

Prohibited:

```text
// @ts-ignore
// biome-ignore lint/...
```

without TIP/ADR rationale on changed lines.

## Non-Goals Template

```text
- No ERP business logic
- No domain package changes
- No architecture registry changes without ADR
```
