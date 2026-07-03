# Knip workspace templates

Copy the block matching the package layer when running **expand** mode. Adjust `entry` / `project` globs to match package layout.

## Default Platform / Integration package

```jsonc
"packages/<name>": {
  "entry": ["src/**/*.test.ts"],
  "project": ["src/**/*.ts"]
}
```

## Auth (tsx + scripts)

Email templates and React surfaces need `*.tsx` in project globs:

```jsonc
"packages/auth": {
  "entry": ["src/**/*.test.ts", "scripts/**/*.ts"],
  "project": ["src/**/*.{ts,tsx}", "scripts/**/*.ts"]
}
```

## typescript-config

```jsonc
"packages/typescript-config": {
  "entry": ["package.json"],
  "project": ["*.json"]
}
```

## observability (optional dep ignore)

```jsonc
"packages/observability": {
  "entry": ["src/**/*.test.ts"],
  "project": ["src/**/*.ts"],
  "ignoreDependencies": ["pino-pretty"]
}
```

## shadcn-studio (Design — PAS-006 presentation barrel)

Component library + MCP inventory. Gate on **files/deps**, not export count — barrel re-exports primitives, contracts, blocks, and meta-gates consumed by ERP and Storybook outside Knip workspace scope.

```jsonc
"packages/shadcn-studio": {
  "entry": [
    "src/**/index.ts",
    "src/**/*.test.ts",
    "src/**/*.stories.tsx"
  ],
  "project": ["src/**/*.{ts,tsx}"],
  "ignoreDependencies": ["next", "shadcn", "tw-animate-css"],
  "ignoreIssues": {
    "src/**/*.{ts,tsx}": ["exports", "types"]
  }
}
```

**Export/type noise:** presentation barrel + contract SSOT + compound primitive sub-exports are consumed by `apps/erp`, `apps/storybook`, and governance scripts outside this workspace — `ignoreIssues` encodes ci-promotion criterion #5; gate on **files/deps** only.

After expand, run storybook orphan dry-run — blocks may be consumed via layout imports or MCP seed manifest, not `*Block` ERP imports alone.

## apps/erp (Application — governance attestation + workspace scaffold)

Governance scripts under `scripts/governance/check-erp-*` require files that are not yet wired from App Router entry. Register them as Knip **entry** roots (intentional-public), not Slice D deletes:

```jsonc
"apps/erp": {
  "entry": [
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/lib/**/*-ingress.contract.ts",
    "src/lib/**/*registry.ts",
    "src/lib/context/tenant-domain.ts",
    "src/lib/metadata/*-vocabulary.contract.ts",
    "src/lib/observability/create-erp-background-logger.ts",
    "src/lib/utils.ts",
    "src/lib/workspace/**/*.{ts,tsx}",
    "src/server/api/contracts/openapi/index.ts"
  ],
  "project": [
    "src/lib/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "src/app/**/*.{ts,tsx}",
    "src/server/**/*.{ts,tsx}"
  ]
}
```

## Platform last — kernel (vocabulary public API)

`@afenda/kernel` is a **composed vocabulary package** (PAS-001 / PAS-001B). Most symbols exist for cross-package import via subpath exports (`@afenda/kernel/context`, `@afenda/kernel/erp-domain/*`), not for in-package test reachability alone.

Knip runs **per workspace** — it does not trace consumers in `@afenda/database`, `@afenda/permissions`, `apps/erp`, etc. Expect **unused export / type noise** even when the API is live. Classify as **intentional-public**; do **not** Slice D delete vocabulary re-exports.

Register barrel surfaces as entry roots (not every contract file):

```jsonc
"packages/kernel": {
  "entry": ["src/**/index.ts", "src/**/*.test.ts"],
  "project": ["src/**/*.ts"]
}
```

**Promotion / audit gates for kernel:** gate on **unused files** and **unused dependencies** only — not zero unused exports. After index entries, typical baseline is ~70 export findings (assert helpers, wire types, registry integrity types) that are consumed outside the workspace.

Duplicate export aliases (deprecated compat names) → **align** or defer, not bulk delete.

## Platform last — architecture-authority + enterprise-knowledge

Same cross-workspace consumption pattern as kernel — barrel + test entry roots; gate on **files/deps**, not export count.

```jsonc
"packages/architecture-authority": {
  "entry": ["src/**/index.ts", "src/**/*.test.ts"],
  "project": ["src/**/*.ts"]
},
"packages/enterprise-knowledge": {
  "entry": ["src/index.ts", "src/**/*.test.ts"],
  "project": ["src/**/*.ts"],
  "ignoreBinaries": ["tsx"]
}
```

`enterprise-knowledge` scripts call `tsx` for governance exports; binary is hoisted from the monorepo — use `ignoreBinaries` rather than Slice D.

## Foundation stubs (entitlements, accounting-standards, execution)

```jsonc
"packages/entitlements": {
  "entry": ["src/**/*.test.ts", "src/**/*.service.ts", "src/contracts/**/*.ts"],
  "project": ["src/**/*.ts"]
},
"packages/accounting-standards": {
  "entry": ["src/**/*.test.ts", "src/standards/**/*.registry.ts"],
  "project": ["src/**/*.ts"]
},
"packages/execution": {
  "entry": [
    "src/**/*.test.ts",
    "src/trigger/tasks.ts",
    "src/providers/trigger-worker-bootstrap.ts"
  ],
  "project": ["src/**/*.ts"]
}
```

## apps/storybook

```jsonc
"apps/storybook": {
  "entry": ["stories/**/*.stories.tsx", ".storybook/**/*.{ts,tsx}"],
  "project": ["stories/**/*.{ts,tsx}", ".storybook/**/*.{ts,tsx}"]
}
```

## Global knip.jsonc patterns

Always present at root:

```jsonc
"ignore": [
  "**/_retired/**",
  "scripts/governance/_retired/**",
  ".cursor/skills/_retired/**"
],
"tags": ["-internal", "-lintignore"]
```

Use `@internal` JSDoc or `-internal` tag to suppress intentional internal exports without deleting.

## turbo.json inputs (per expand)

For each new package, add to both `//#housekeeping:knip` and `//#housekeeping:knip:advisory`:

```json
"packages/<name>/package.json",
"packages/<name>/src/**"
```

Include `scripts/**` when the workspace entry includes scripts (e.g. auth).
