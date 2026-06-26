import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

export const docsDataDir = join(repoRoot, "apps/docs/data");

export function catalogOutputPath(catalogId: string): string {
  const cliOutputDir = process.argv
    .find((argument) => argument.startsWith("--output-dir="))
    ?.slice("--output-dir=".length);
  const baseDir =
    cliOutputDir ??
    process.env.AFENDA_DOCS_CATALOG_OUTPUT_DIR ??
    docsDataDir;
  return join(baseDir, `${catalogId}.catalog.json`);
}
