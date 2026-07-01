import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "../..");

/** Ordered Storybook codegen steps — add new generators here. */
const GENERATORS = [
  "discard-blocks-without-consumer.mjs",
  "generate-block-auto-stories.mjs",
  "generate-flat-block-stories.mjs",
  "generate-primitive-stories.mjs",
  "generate-svg-gallery.mjs",
];

function runStep(scriptName) {
  const scriptPath = join(scriptDir, scriptName);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runStoriesTypecheck() {
  console.log(
    "storybook:generate — verifying @afenda/shadcn-studio typecheck…"
  );
  const result = spawnSync(
    "pnpm",
    ["--filter", "@afenda/shadcn-studio", "typecheck"],
    {
      cwd: repoRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    }
  );

  if (result.status !== 0) {
    console.error(
      "storybook:generate — typecheck failed. Prop-driven flat blocks belong in shadcn-studio-blocks.stories.tsx (curated fixtures), not shadcn-studio-blocks-auto.stories.tsx."
    );
    process.exit(result.status ?? 1);
  }
}

console.log("storybook:generate — running codegen steps…");

for (const step of GENERATORS) {
  runStep(step);
}

const coverageCheck = spawnSync(
  process.execPath,
  [join(scriptDir, "../meta-gates/check-storybook-block-coverage.mjs")],
  { cwd: repoRoot, stdio: "inherit" }
);

if (coverageCheck.status !== 0) {
  process.exit(coverageCheck.status ?? 1);
}

const primitiveCoverageCheck = spawnSync(
  process.execPath,
  [join(scriptDir, "../meta-gates/check-storybook-primitive-coverage.mjs")],
  { cwd: repoRoot, stdio: "inherit" }
);

if (primitiveCoverageCheck.status !== 0) {
  process.exit(primitiveCoverageCheck.status ?? 1);
}

runStoriesTypecheck();

console.log("storybook:generate — done.");
