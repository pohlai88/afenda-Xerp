import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));

/** Ordered Storybook codegen steps — add new generators here. */
const GENERATORS = [];

function runStep(scriptName) {
  const scriptPath = join(scriptDir, scriptName);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: join(scriptDir, "../.."),
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("storybook:generate — running codegen steps…");

for (const step of GENERATORS) {
  runStep(step);
}

console.log("storybook:generate — done.");
