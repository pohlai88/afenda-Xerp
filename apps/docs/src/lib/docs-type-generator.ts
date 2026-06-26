import {
  createFileSystemGeneratorCache,
  createGenerator,
} from "fumadocs-typescript";

/**
 * Shared TypeScript docgen for MDX — used by `remarkAutoTypeTable` (build-time)
 * and `<AutoTypeTable />` (RSC). Filesystem cache is required for serverless deploys.
 *
 * @see https://fumadocs.dev/docs/ui/components/auto-type-table
 */
export const docsTypeGenerator = createGenerator({
  cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
  tsconfigPath: "./tsconfig.json",
});
