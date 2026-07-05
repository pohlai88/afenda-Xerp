import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
const greenlightRunner = path.join(
  workspaceRoot,
  "apps/developer/scripts/verify-greenlight.mjs"
);

if (!existsSync(greenlightRunner)) {
  console.error(
    `developer route-lab green-light runner is missing: ${greenlightRunner}`
  );
  process.exit(1);
}

const result = spawnSync(process.execPath, [greenlightRunner], {
  cwd: workspaceRoot,
  env: process.env,
  shell: process.platform === "win32",
  stdio: "inherit",
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
