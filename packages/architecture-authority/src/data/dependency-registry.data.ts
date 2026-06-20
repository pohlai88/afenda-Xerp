import type { DependencyContract } from "../contracts/dependency.contract.js";

const RUNTIME_EDGES = [
  ["@afenda/auth", "@afenda/database"],
  ["@afenda/database", "@afenda/observability"],
  ["@afenda/entitlements", "@afenda/database"],
  ["@afenda/erp", "@afenda/appshell"],
  ["@afenda/erp", "@afenda/auth"],
  ["@afenda/erp", "@afenda/database"],
  ["@afenda/erp", "@afenda/observability"],
  ["@afenda/execution", "@afenda/kernel"],
  ["@afenda/execution", "@afenda/observability"],
  ["@afenda/feature-flags", "@afenda/entitlements"],
  ["@afenda/metadata-ui", "@afenda/design-system"],
  ["@afenda/metadata-ui", "@afenda/permissions"],
  ["@afenda/permissions", "@afenda/auth"],
  ["@afenda/permissions", "@afenda/database"],
] as const;

export const dependencyContract: DependencyContract = {
  runtimeEdges: RUNTIME_EDGES.map(([from, to]) => ({
    from,
    to,
    classification: "Approved",
  })),
  approvedRuntimeByPackage: {
    "@afenda/appshell": [],
    "@afenda/auth": ["@afenda/database"],
    "@afenda/database": ["@afenda/observability"],
    "@afenda/design-system": [],
    "@afenda/docs": [],
    "@afenda/entitlements": ["@afenda/database"],
    "@afenda/erp": [
      "@afenda/appshell",
      "@afenda/auth",
      "@afenda/database",
      "@afenda/observability",
    ],
    "@afenda/execution": ["@afenda/kernel", "@afenda/observability"],
    "@afenda/feature-flags": ["@afenda/entitlements"],
    "@afenda/kernel": [],
    "@afenda/metadata-ui": ["@afenda/design-system", "@afenda/permissions"],
    "@afenda/observability": [],
    "@afenda/permissions": ["@afenda/auth", "@afenda/database"],
    "@afenda/storage": [],
    "@afenda/testing": [],
    "@afenda/typescript-config": [],
    "@afenda/ui": [],
    "@afenda/architecture-authority": [],
  },
  devOnlyExempt: [
    {
      from: "@afenda/testing",
      to: "@afenda/execution",
      classification: "Dev-only exempt",
    },
    {
      from: "@afenda/testing",
      to: "@afenda/storage",
      classification: "Dev-only exempt",
    },
  ],
};
