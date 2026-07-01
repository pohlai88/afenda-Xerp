# Chromatic — Storybook Lab visual regression

Optional visual regression for `@afenda/storybook`. The workflow job is **off by default** until repository settings are configured.

## Prerequisites

1. [Chromatic](https://www.chromatic.com/) project linked to this repo
2. Project token from Chromatic → **Manage** → **Configure**

## Enable CI

In GitHub repository settings:

| Setting | Name | Value |
| --- | --- | --- |
| **Repository variable** | `CHROMATIC_ENABLED` | `true` |
| **Repository secret** | `CHROMATIC_PROJECT_TOKEN` | your Chromatic project token |

Workflow: `.github/workflows/storybook-lab.yml` — `chromatic` job runs after static build on pull requests when the variable is set.

## Local run

Add to `.env.secret` (synced locally only — never commit real tokens):

```bash
CHROMATIC_PROJECT_TOKEN=your-token-here
```

Then from repo root:

```bash
pnpm storybook:chromatic
```

Or scoped:

```bash
pnpm --filter @afenda/storybook chromatic
```

## Modes

Chromatic modes are defined in `apps/storybook/.storybook/modes.ts` and wired in `preview.tsx`:

- `light` / `dark`
- `mobile-light` / `mobile-dark`

## GitHub CLI (optional)

```bash
gh variable set CHROMATIC_ENABLED --body true
gh secret set CHROMATIC_PROJECT_TOKEN
```

Verify the next PR triggers the **Chromatic visual regression** job in Actions.
