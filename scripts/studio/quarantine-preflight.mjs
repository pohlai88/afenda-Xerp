/**
 * Shared preflight for quarantine promote — sync registry, verify disk, compute verdict.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  productionTargetForBlock,
  QUARANTINE_REGISTRY,
  REPO_ROOT,
  STUDIO_SRC,
} from "./quarantine-paths.mjs";

/** Human-readable verdict labels (stable — use in docs and CI). */
export const PROMOTE_VERDICT = {
  BLOCKED_DUPLICATE: "BLOCKED_DUPLICATE",
  BLOCKED_CHECKLIST: "BLOCKED_CHECKLIST",
  BLOCKED_MISSING: "BLOCKED_MISSING",
  INBOX: "INBOX",
  READY_TO_PROMOTE: "READY_TO_PROMOTE",
};

const CHECKLIST_HARD_FOR_APPLY = ["slotMarkersPresent"];

export function syncRegistry() {
  const result = spawnSync(
    "node",
    ["scripts/studio/sync-quarantine-registry.mjs"],
    {
      cwd: REPO_ROOT,
      stdio: "pipe",
      shell: true,
      encoding: "utf8",
    }
  );

  if ((result.status ?? 1) !== 0) {
    process.stderr.write(
      result.stderr ?? result.stdout ?? "registry sync failed\n"
    );
    process.exit(result.status ?? 1);
  }

  return result.stdout?.trim() ?? "";
}

export function loadRegistry() {
  if (!existsSync(QUARANTINE_REGISTRY)) {
    return null;
  }
  return JSON.parse(readFileSync(QUARANTINE_REGISTRY, "utf8"));
}

export function findEntry(registry, blockId) {
  return registry?.entries?.find((entry) => entry.id === blockId) ?? null;
}

export function quarantineAbsolutePath(entry) {
  return join(STUDIO_SRC, entry.quarantinePath);
}

function checklistBlockers(entry) {
  const blockers = [];
  for (const key of CHECKLIST_HARD_FOR_APPLY) {
    if (!entry.checklist?.[key]) {
      blockers.push(key);
    }
  }

  for (const dep of entry.primitiveDeps ?? []) {
    if (!dep.productionPrimitiveExists) {
      blockers.push(`primitive:${dep.name}:no-production-contract`);
    }
  }

  return blockers;
}

export function computeVerdict(entry) {
  const quarantineAbs = quarantineAbsolutePath(entry);

  if (!existsSync(quarantineAbs)) {
    return {
      verdict: PROMOTE_VERDICT.BLOCKED_MISSING,
      blockers: ["quarantine file missing on disk"],
      canApply: false,
    };
  }

  if (entry.productionExists) {
    return {
      verdict: PROMOTE_VERDICT.BLOCKED_DUPLICATE,
      blockers: ["production file already exists"],
      canApply: false,
    };
  }

  const blockers = checklistBlockers(entry);
  if (blockers.length > 0) {
    return {
      verdict: PROMOTE_VERDICT.BLOCKED_CHECKLIST,
      blockers,
      canApply: false,
    };
  }

  if (entry.promotionStatus === "ready") {
    return {
      verdict: PROMOTE_VERDICT.READY_TO_PROMOTE,
      blockers: [],
      canApply: true,
    };
  }

  return {
    verdict: PROMOTE_VERDICT.INBOX,
    blockers: ["checklist incomplete — normalize in quarantine first"],
    canApply: false,
  };
}

export function nextCommand(blockId, verdict) {
  switch (verdict.verdict) {
    case PROMOTE_VERDICT.BLOCKED_DUPLICATE:
      return `pnpm studio:quarantine discard --block ${blockId}`;
    case PROMOTE_VERDICT.BLOCKED_CHECKLIST:
    case PROMOTE_VERDICT.INBOX:
      return `fix checklist in quarantine, then: pnpm studio:promote --block ${blockId}`;
    case PROMOTE_VERDICT.READY_TO_PROMOTE:
      return `pnpm studio:promote --block ${blockId} --apply`;
    case PROMOTE_VERDICT.BLOCKED_MISSING:
      return "pnpm studio:quarantine sync && pnpm studio:quarantine list";
    default:
      return "pnpm studio:quarantine list";
  }
}

export function runPreflight(blockId) {
  const syncLine = syncRegistry();
  const registry = loadRegistry();
  const entry = findEntry(registry, blockId);

  if (!entry) {
    return {
      syncLine,
      entry: null,
      verdict: {
        verdict: PROMOTE_VERDICT.BLOCKED_MISSING,
        blockers: [`block "${blockId}" not in quarantine registry`],
        canApply: false,
      },
    };
  }

  const verdict = computeVerdict(entry);
  const production = productionTargetForBlock(blockId);

  return {
    syncLine,
    entry,
    verdict,
    paths: {
      quarantine: entry.quarantinePath,
      production: entry.productionTargetPath,
      productionAbs: production.absolutePath,
      quarantineExists: existsSync(quarantineAbsolutePath(entry)),
      productionExists: entry.productionExists,
    },
  };
}

export function formatVerdictBanner(verdict) {
  const labels = {
    [PROMOTE_VERDICT.BLOCKED_DUPLICATE]:
      "BLOCKED_DUPLICATE — production exists (review only; never --apply)",
    [PROMOTE_VERDICT.BLOCKED_CHECKLIST]:
      "BLOCKED_CHECKLIST — fix checklist before promote",
    [PROMOTE_VERDICT.BLOCKED_MISSING]:
      "BLOCKED_MISSING — artifact missing or not registered",
    [PROMOTE_VERDICT.INBOX]: "INBOX — normalize in quarantine before promote",
    [PROMOTE_VERDICT.READY_TO_PROMOTE]:
      "READY_TO_PROMOTE — safe to run with --apply",
  };

  return labels[verdict.verdict] ?? verdict.verdict;
}
