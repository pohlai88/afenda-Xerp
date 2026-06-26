import {
  createFileSystemGeneratorCache,
  createGenerator,
} from "fumadocs-typescript";

/**
 * Shared TypeScript docgen for Fumadocs — used by `remarkAutoTypeTable` (build-time
 * `<auto-type-table />`) and `<AutoTypeTable />` (RSC). Filesystem cache is required
 * for serverless deploys.
 *
 * MDX `path` values use `./src/...` relative to `apps/docs` (see remark `basePath`).
 *
 * @see https://fumadocs.dev/docs/integrations/typescript
 * @see https://fumadocs.dev/docs/ui/components/auto-type-table
 */
export const docsTypeGenerator = createGenerator({
  cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
  tsconfigPath: "./tsconfig.json",
});

/** Passed to `<AutoTypeTable />` so paths match remark `auto-type-table` resolution. */
export const docsTypeTableOptions = {
  basePath: ".",
} as const;
