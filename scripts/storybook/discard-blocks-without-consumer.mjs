/**
 * v2 quarantine orphan scan — files under components/quarantine/ not listed in
 * inventory.baseline.json. Default: dry-run. Pass --apply to delete on disk.
 */
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "../..");
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const dryRun = !apply;

const quarantineRoot = join(
  repoRoot,
  "packages/shadcn-studio-v2/src/components/quarantine"
);
const baselinePath = join(quarantineRoot, "inventory.baseline.json");

const KEEP_NAMES = new Set(["README.md", "inventory.baseline.json"]);

/**
 * @param {unknown} baseline
 * @returns {Set<string>}
 */
function readBaselinePaths(baseline) {
  const files = Array.isArray(baseline?.files) ? baseline.files : [];
  const paths = new Set();

  for (const entry of files) {
    if (typeof entry === "string") {
      paths.add(entry.replace(/\\/g, "/"));
      continue;
    }

    if (entry && typeof entry === "object" && "path" in entry) {
      const pathValue = entry.path;
      if (typeof pathValue === "string") {
        paths.add(pathValue.replace(/\\/g, "/"));
      }
    }
  }

  return paths;
}

/**
 * @param {string} dir
 * @param {string[]} acc
 */
function collectImplementationFiles(dir, acc) {
  if (!existsSync(dir)) {
    return;
  }

  for (const name of readdirSync(dir)) {
    if (KEEP_NAMES.has(name)) {
      continue;
    }

    const absolute = join(dir, name);

    if (statSync(absolute).isDirectory()) {
      collectImplementationFiles(absolute, acc);
      continue;
    }

    if (/\.(tsx?|jsx?|css)$/.test(name)) {
      acc.push(relative(quarantineRoot, absolute).replace(/\\/g, "/"));
    }
  }
}

function main() {
  if (!existsSync(baselinePath)) {
    console.log(
      "discard-blocks-without-consumer — skipped (no v2 quarantine baseline)"
    );
    return;
  }

  const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
  const inventoryPaths = readBaselinePaths(baseline);
  const onDisk = [];
  collectImplementationFiles(quarantineRoot, onDisk);

  const orphans = onDisk.filter((path) => !inventoryPaths.has(path));

  if (orphans.length === 0) {
    console.log(
      `discard-blocks-without-consumer — no orphan quarantine file(s) (${onDisk.length} inventoried on disk)`
    );
    return;
  }

  if (dryRun) {
    console.log(
      "discard-blocks-without-consumer — dry-run (pass --apply to delete)"
    );
  }

  for (const orphan of orphans) {
    const absolute = join(quarantineRoot, orphan);

    if (dryRun) {
      console.log(`discard-blocks-without-consumer — would remove: ${orphan}`);
      continue;
    }

    rmSync(absolute, { force: true, recursive: true });
    console.log(`discard-blocks-without-consumer — removed: ${orphan}`);
  }

  const verb = dryRun ? "would remove" : "removed";
  console.log(
    `discard-blocks-without-consumer — ${verb} ${orphans.length} orphan quarantine file(s)`
  );
}

main();
