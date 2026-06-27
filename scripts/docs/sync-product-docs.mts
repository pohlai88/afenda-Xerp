import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { exportProductCatalogs } from "./export-product-catalogs.mts";
import { repoRoot } from "./docs-catalog-paths.mts";

const docsAppDir = join(repoRoot, "apps/docs");

function runTsx(relativeScriptPath: string, cwd = repoRoot): void {
  const scriptPath = join(repoRoot, relativeScriptPath);
  const result = spawnSync("pnpm", ["exec", "tsx", scriptPath], {
    cwd,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function exportCatalogs(): Promise<void> {
  await exportProductCatalogs();
}

async function main(): Promise<void> {
  console.log("[sync:product-docs] exporting JSON catalogs…");
  await exportCatalogs();

  console.log("[sync:product-docs] generating reference MDX…");
  runTsx("apps/docs/scripts/generate-reference-pages.mts", docsAppDir);

  console.log("[sync:product-docs] scaffolding reader IA locales…");
  runTsx("apps/docs/scripts/scaffold-reader-ia-locales.mts", docsAppDir);

  console.log("[sync:product-docs] generating OpenAPI docs…");
  runTsx("apps/docs/scripts/generate-openapi-docs.mts", docsAppDir);

  console.log("[sync:product-docs] generating repo evidence inventory…");
  runTsx("apps/docs/scripts/generate-repo-evidence.mts", docsAppDir);

  console.log("[sync:product-docs] generating feature evidence…");
  runTsx("apps/docs/scripts/generate-feature-evidence.mts", docsAppDir);

  console.log(`[sync:product-docs] complete (${docsAppDir})`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
