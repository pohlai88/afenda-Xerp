import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROOF_ROOT = path.resolve(TEST_DIR, "..");
const FIXTURE_ROOT = path.resolve(
  TEST_DIR,
  "..",
  "..",
  "..",
  "..",
  "lib",
  "v2-proof"
);

const V2_INTERNAL_IMPORT_PATTERN =
  /@afenda\/shadcn-studio-v2\/(?:components|views|contexts|styles|src)(?:\/|["'])/u;
const V2_SOURCE_STYLE_IMPORT_PATTERN =
  /packages\/shadcn-studio-v2\/src\/styles/u;
const FORBIDDEN_V1_PROOF_IMPORT_PATTERN =
  /from\s+["']@afenda\/shadcn-studio(?:\/(?!v2)|["'])/u;

function collectProofSourceFiles(directory: string): string[] {
  const files: string[] = [];

  for (const name of readdirSync(directory)) {
    const filePath = path.join(directory, name);

    if (statSync(filePath).isDirectory()) {
      files.push(...collectProofSourceFiles(filePath));
      continue;
    }

    if (
      /\.(ts|tsx)$/.test(name) &&
      !name.endsWith(".test.ts") &&
      !name.endsWith(".test.tsx")
    ) {
      files.push(filePath);
    }
  }

  return files;
}

describe("Phase 8 V2 proof route import boundary", () => {
  it("keeps proof route sources on public package entrypoints only", () => {
    const proofFiles = [
      ...collectProofSourceFiles(PROOF_ROOT),
      ...collectProofSourceFiles(FIXTURE_ROOT),
    ];
    const violations: string[] = [];

    for (const filePath of proofFiles) {
      const source = readFileSync(filePath, "utf8");
      const relativePath = path.relative(process.cwd(), filePath);

      if (V2_INTERNAL_IMPORT_PATTERN.test(source)) {
        violations.push(`${relativePath}: forbidden V2 internal import`);
      }

      if (V2_SOURCE_STYLE_IMPORT_PATTERN.test(source)) {
        violations.push(`${relativePath}: forbidden V2 source style path`);
      }

      if (FORBIDDEN_V1_PROOF_IMPORT_PATTERN.test(source)) {
        violations.push(`${relativePath}: forbidden legacy v1 import in proof`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("uses package CSS exports in app globals rather than proof TS imports", () => {
    const globalsPath = path.resolve(TEST_DIR, "..", "..", "..", "globals.css");
    const globals = readFileSync(globalsPath, "utf8");

    expect(globals).toContain("@afenda/shadcn-studio-v2/shadcn-default.css");
    expect(globals).toContain(
      "@afenda/shadcn-studio-v2/themes/afenda-brand.css"
    );
    expect(globals).not.toContain("packages/shadcn-studio-v2/src/styles");
  });
});
