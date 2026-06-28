# Vitest Coverage Threshold Reference

## Project shared config pattern

The project uses `createNodeProject` from `vitest.shared.ts`. Add coverage thresholds to the returned config.

## Template A — Contracts-only package (pure types + validators)

Use for: packages that contain only Zod schemas, type contracts, or pure transformation functions.

```ts
// vitest.config.ts
import { createNodeProject } from "../../vitest.shared";
import { mergeConfig } from "vitest/config";

const base = createNodeProject(import.meta.url, "@afenda/my-package");

export default mergeConfig(base, {
  test: {
    coverage: {
      provider: "v8",
      thresholds: {
        functions:  95,
        branches:   90,
        lines:      95,
        statements: 95,
        // Per-file gates for contract files
        "src/contracts/**/*.ts": {
          functions:  100,
          lines:      100,
          perFile:    true,
        },
      },
    },
  },
});
```

## Template B — Service package (functions with IO / DB)

Use for: packages with service functions, DB queries, storage operations, or external API calls.

```ts
// vitest.config.ts
export default mergeConfig(base, {
  test: {
    coverage: {
      provider: "v8",
      thresholds: {
        functions:  90,
        branches:   80,
        lines:      85,
        statements: 85,
        // Stricter gate for service layer
        "src/services/**/*.ts": {
          functions:  90,
          branches:   80,
          perFile:    true,
        },
      },
    },
  },
});
```

## Template C — UI component package (React components)

Use for: packages containing React components (`packages/ui`, `packages/appshell`, etc.).

```ts
// vitest.config.ts
export default mergeConfig(base, {
  test: {
    coverage: {
      provider: "v8",
      thresholds: {
        functions:  85,
        branches:   75,
        lines:      80,
        statements: 80,
      },
      // Exclude stories and style files from coverage
      exclude: [
        "**/*.stories.tsx",
        "**/*.styles.ts",
        "**/index.ts",
      ],
    },
  },
});
```

## Template D — App package (Next.js app)

Use for: `apps/erp` and other Next.js applications.

```ts
// vitest.config.ts — only unit tests, not E2E
export default mergeConfig(base, {
  test: {
    coverage: {
      provider: "v8",
      thresholds: {
        functions:  80,
        branches:   70,
        lines:      80,
        statements: 80,
      },
      // Exclude Next.js app router files from coverage requirement
      exclude: [
        "src/app/**/page.tsx",
        "src/app/**/layout.tsx",
        "src/app/**/error.tsx",
        "src/app/**/loading.tsx",
        "src/middleware.ts",
      ],
    },
  },
});
```

## Coverage reporting in CI

The CI workflow runs coverage on every PR. The threshold check fails the build if any gate is missed:

```bash
pnpm --filter @afenda/observability test:run -- --coverage --reporter=verbose
```

`--coverage` without explicit thresholds in config does not fail the build. Thresholds in `vitest.config.ts` are what causes the failure.

## Adding a new package

1. Copy the appropriate template above.
2. Run `pnpm --filter <pkg> test:run -- --coverage` locally.
3. Raise thresholds if initial coverage is higher than the gate (do not lower gates to match poor coverage).
4. If coverage is below the gate: write the missing tests before the PR.
