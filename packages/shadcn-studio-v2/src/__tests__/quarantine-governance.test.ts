import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");
const QUARANTINE_ROOT = path.join(SRC_ROOT, "components", "quarantine");
const INVENTORY_BASELINE_PATH = path.join(
  QUARANTINE_ROOT,
  "inventory.baseline.json"
);

const PUBLIC_ENTRYPOINTS = [
  "index.ts",
  "clients.ts",
  "server.ts",
  "metadata.ts",
] as const;

const IMPLEMENTATION_FILE_PATTERN = /\.(ts|tsx)$/u;
const KEBAB_STEM_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*\.tsx$/u;

function readSource(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

function listQuarantineImplementationFiles(): string[] {
  if (!existsSync(QUARANTINE_ROOT)) {
    return [];
  }

  return readdirSync(QUARANTINE_ROOT)
    .filter((entry) => IMPLEMENTATION_FILE_PATTERN.test(entry))
    .map((entry) => `components/quarantine/${entry}`)
    .sort();
}

describe("shadcn-studio-v2 quarantine governance", () => {
  it("documents the Lane A-07 promotion checklist in quarantine README", () => {
    const readme = readFileSync(
      path.join(QUARANTINE_ROOT, "README.md"),
      "utf8"
    );

    expect(readme).toContain("Promotion checklist");
    expect(readme).toContain("inventory.baseline.json");
    expect(readme).toContain("normalize:kebab-stems");
    expect(readme).toContain("test:primitives");
  });

  it("keeps public entrypoints free of quarantine exports", () => {
    for (const entrypoint of PUBLIC_ENTRYPOINTS) {
      const source = readSource(entrypoint);

      expect(source).not.toContain("components/quarantine");
      expect(source).not.toContain("/quarantine/");
    }
  });

  it("records an empty quarantine implementation baseline", () => {
    const baseline = JSON.parse(
      readFileSync(INVENTORY_BASELINE_PATH, "utf8")
    ) as {
      readonly files: ReadonlyArray<{ readonly path: string } | string>;
    };

    const normalizedPaths = baseline.files.map((entry) =>
      typeof entry === "string" ? entry : entry.path
    );

    expect(normalizedPaths).toEqual([]);
    expect(listQuarantineImplementationFiles()).toEqual([]);
  });

  it("requires kebab-case stems for any future quarantine tsx files", () => {
    if (!existsSync(QUARANTINE_ROOT)) {
      return;
    }

    const tsxFiles = readdirSync(QUARANTINE_ROOT).filter((name) =>
      name.endsWith(".tsx")
    );

    for (const fileName of tsxFiles) {
      expect(fileName).toMatch(KEBAB_STEM_PATTERN);
    }
  });
});
