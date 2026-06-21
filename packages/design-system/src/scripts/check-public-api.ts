/**
 * Governance script: verify that every symbol listed in
 * `publicExportContract.stableExports` is actually exported from the package
 * root (`src/index.ts` compiled output).
 *
 * Exit code 0 = pass, exit code 1 = fail.
 *
 * This script runs against the compiled `dist/index.js` to validate the real
 * public surface.  Run `pnpm build` before executing this check.
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const distIndex = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../dist/index.js"
);

if (!existsSync(distIndex)) {
  process.stderr.write(
    `check:public-api FAILED — dist/index.js not found. Run 'pnpm --filter @afenda/design-system build' first.\n`
  );
  process.exit(1);
}

const distIndexUrl = pathToFileURL(distIndex).href;

const { publicExportContract } = (await import(distIndexUrl)) as {
  publicExportContract: { stableExports: readonly string[] };
};

const distExports = (await import(distIndexUrl)) as Record<string, unknown>;
const errors: string[] = [];

for (const name of publicExportContract.stableExports) {
  if (!(name in distExports)) {
    errors.push(
      `  ✗ Stable export "${name}" is not exported from dist/index.js`
    );
  }
}

if (errors.length > 0) {
  process.stderr.write(
    `check:public-api FAILED — ${errors.length} missing export(s):\n${errors.join("\n")}\n`
  );
  process.exit(1);
} else {
  process.stdout.write(
    `check:public-api PASSED — all ${publicExportContract.stableExports.length} stable exports are present.\n`
  );
}
