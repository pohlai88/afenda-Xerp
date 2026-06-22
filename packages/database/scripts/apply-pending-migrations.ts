import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const result = spawnSync(
  "drizzle-kit",
  ["migrate", "--config", "drizzle.config.ts"],
  {
    cwd: packageRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      FORCE_COLOR: "0",
      NO_COLOR: "1",
    },
    shell: process.platform === "win32",
  }
);

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.status !== 0) {
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  if (output.length > 0) {
    console.error("\nmigrate: drizzle-kit failed:");
    console.error(output);
  } else if (result.error) {
    console.error("\nmigrate: drizzle-kit failed:", result.error.message);
  } else {
    console.error(
      "\nmigrate: drizzle-kit failed with no output — check database connectivity and pending SQL"
    );
  }
  process.exit(result.status ?? 1);
}

console.log("migrate: applied pending migrations successfully");
