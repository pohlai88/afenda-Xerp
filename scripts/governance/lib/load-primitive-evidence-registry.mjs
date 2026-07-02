/**
 * Load primitive-evidence.registry.ts for .mjs gates via tsx JSON export.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const libDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(libDir, "../../..");
const exportScript = join(libDir, "export-primitive-evidence-registry.mts");

/** @typedef {import("../../../packages/shadcn-studio/src/meta-gates/primitive-evidence.registry.ts").PrimitiveEvidenceSpec} PrimitiveEvidenceSpec */

/** @type {{ registry: PrimitiveEvidenceSpec[]; compoundSlugs: string[] } | null} */
let cached = null;

/**
 * @returns {{ registry: PrimitiveEvidenceSpec[]; compoundSlugs: string[] }}
 */
export function loadPrimitiveEvidenceRegistry() {
  if (cached) {
    return cached;
  }

  const result = spawnSync("pnpm", ["exec", "tsx", exportScript], {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    throw new Error("loadPrimitiveEvidenceRegistry: tsx export failed");
  }

  cached = JSON.parse(result.stdout.trim());
  return cached;
}

/**
 * @param {"gold" | "silver" | "all" | "none"} mode
 * @param {PrimitiveEvidenceSpec} spec
 */
export function shouldEnforceTier(mode, spec) {
  if (mode === "none") {
    return false;
  }
  if (mode === "all") {
    return spec.tier !== "bronze" || spec.requiresRender || spec.requiresPlay;
  }
  if (mode === "silver") {
    return spec.tier === "gold" || spec.tier === "silver";
  }
  return spec.tier === "gold";
}

/**
 * @returns {"gold" | "silver" | "all" | "none"}
 */
export function resolveEnforceMode() {
  const raw = process.env.STORYBOOK_EVIDENCE_ENFORCE?.trim().toLowerCase();
  if (raw === "all" || raw === "silver" || raw === "none") {
    return raw;
  }
  return "gold";
}
