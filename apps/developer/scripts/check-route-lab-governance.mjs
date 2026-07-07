import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const canonicalScript = path.join(
  scriptDir,
  "check-developer-app-governance.mjs"
);

const result = spawnSync(process.execPath, [canonicalScript], {
  cwd: path.resolve(scriptDir, ".."),
  stdio: "inherit",
});

process.exit(result.status ?? 1);
