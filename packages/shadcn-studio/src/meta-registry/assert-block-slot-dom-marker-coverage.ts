/**
 * PAS-006D P06-008-R2 — block slot DOM marker coverage enforcement.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";

import { AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE } from "../meta-contracts/block-slot-dom-marker.contract.js";
import { getBlockSlotsForBlockId } from "./block-slot.registry.js";
import {
  MCP_SEED_BLOCK_MANIFEST,
  type McpSeedBlockManifestEntry,
} from "./mcp-seed-block-manifest.js";
import { METADATA_BINDING_REGISTRY } from "./metadata-binding.registry.js";
import { isMetadataBindingWaivedBlockId } from "./metadata-binding-waiver.registry.js";

const MARKER_LITERAL_PATTERN = new RegExp(
  `${AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE}=["']([^"']+)["']`,
  "g"
);
const MARKER_HELPER_PATTERN =
  /blockSlotDomMarkerProps\(\s*["']([^"']+)["']\s*\)/g;

export type BlockSlotDomMarkerCoverageRow = {
  readonly blockId: string;
  readonly expectedSlotIds: readonly string[];
  readonly foundSlotIds: readonly string[];
};

export type BlockSlotDomMarkerCoverageResult =
  | { ok: true; rows: readonly BlockSlotDomMarkerCoverageRow[] }
  | { ok: false; violations: readonly string[] };

function collectTsxFiles(absolutePath: string): readonly string[] {
  if (!existsSync(absolutePath)) {
    return [];
  }

  const stat = statSync(absolutePath);

  if (stat.isFile() && absolutePath.endsWith(".tsx")) {
    return [absolutePath];
  }

  if (!stat.isDirectory()) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(absolutePath)) {
    files.push(...collectTsxFiles(join(absolutePath, entry)));
  }

  return files;
}

function extractSlotIdsFromSource(source: string): readonly string[] {
  const slotIds = new Set<string>();

  for (const pattern of [MARKER_LITERAL_PATTERN, MARKER_HELPER_PATTERN]) {
    pattern.lastIndex = 0;

    for (const match of source.matchAll(pattern)) {
      const slotId = match[1];

      if (slotId !== undefined && slotId.length > 0) {
        slotIds.add(slotId);
      }
    }
  }

  return [...slotIds];
}

function resolveManifestAbsolutePath(
  entry: McpSeedBlockManifestEntry,
  repoRoot: string
): string {
  return join(repoRoot, entry.mcpPath);
}

function findManifestEntry(
  blockId: string
): McpSeedBlockManifestEntry | undefined {
  return MCP_SEED_BLOCK_MANIFEST.find((entry) => entry.blockId === blockId);
}

function collectTsxFilesForManifestEntry(
  entry: McpSeedBlockManifestEntry,
  repoRoot: string
): readonly string[] {
  const absolutePath = resolveManifestAbsolutePath(entry, repoRoot);
  const files = new Set(collectTsxFiles(absolutePath));

  if (
    absolutePath.endsWith(".tsx") &&
    entry.mcpPath.includes("components-auth-shell/")
  ) {
    const blockStem = basename(absolutePath, ".tsx");
    const blockDir = dirname(absolutePath);
    const partSuffixPattern = new RegExp(
      `^${blockStem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-.+\\.tsx$`
    );

    for (const fileName of readdirSync(blockDir)) {
      if (partSuffixPattern.test(fileName)) {
        files.add(join(blockDir, fileName));
      }
    }
  }

  return [...files];
}

function collectFoundSlotIdsForBlock(
  blockId: string,
  repoRoot: string
): readonly string[] {
  const manifestEntry = findManifestEntry(blockId);

  if (manifestEntry === undefined) {
    return [];
  }

  const tsxFiles = collectTsxFilesForManifestEntry(manifestEntry, repoRoot);
  const slotIds = new Set<string>();

  for (const filePath of tsxFiles) {
    const source = readFileSync(filePath, "utf8");

    for (const slotId of extractSlotIdsFromSource(source)) {
      slotIds.add(slotId);
    }
  }

  return [...slotIds];
}

export function assertBlockSlotDomMarkerCoverage(
  repoRoot: string
): BlockSlotDomMarkerCoverageResult {
  const violations: string[] = [];
  const rows: BlockSlotDomMarkerCoverageRow[] = [];

  for (const binding of METADATA_BINDING_REGISTRY) {
    const { blockId } = binding;
    const expectedSlots = getBlockSlotsForBlockId(blockId);
    const expectedSlotIds = expectedSlots.map((slot) => slot.slotId);
    const foundSlotIds = collectFoundSlotIdsForBlock(blockId, repoRoot);

    for (const slotId of expectedSlotIds) {
      const occurrences = foundSlotIds.filter(
        (found) => found === slotId
      ).length;

      if (occurrences === 0) {
        violations.push(
          `blockId ${blockId} missing DOM marker for slotId ${slotId}`
        );
      }

      if (occurrences > 1) {
        violations.push(
          `blockId ${blockId} has duplicate DOM markers for slotId ${slotId}`
        );
      }
    }

    for (const foundSlotId of foundSlotIds) {
      if (!expectedSlotIds.includes(foundSlotId)) {
        violations.push(
          `blockId ${blockId} has orphan DOM marker slotId ${foundSlotId}`
        );
      }
    }

    rows.push({ blockId, expectedSlotIds, foundSlotIds });
  }

  for (const entry of MCP_SEED_BLOCK_MANIFEST) {
    if (!isMetadataBindingWaivedBlockId(entry.blockId)) {
      continue;
    }

    const foundSlotIds = collectFoundSlotIdsForBlock(entry.blockId, repoRoot);

    if (foundSlotIds.length > 0) {
      violations.push(
        `waiver blockId ${entry.blockId} must not declare DOM slot markers`
      );
    }
  }

  if (violations.length > 0) {
    return { ok: false, violations };
  }

  return { ok: true, rows };
}

export function summarizeBlockSlotDomMarkerCoverage(repoRoot: string): {
  readonly bindingBlockCount: number;
  readonly totalExpectedMarkers: number;
  readonly totalFoundMarkers: number;
} {
  const result = assertBlockSlotDomMarkerCoverage(repoRoot);

  if (!result.ok) {
    throw new Error(result.violations.join("\n"));
  }

  const totalExpectedMarkers = result.rows.reduce(
    (sum, row) => sum + row.expectedSlotIds.length,
    0
  );
  const totalFoundMarkers = result.rows.reduce(
    (sum, row) => sum + row.foundSlotIds.length,
    0
  );

  return {
    bindingBlockCount: result.rows.length,
    totalExpectedMarkers,
    totalFoundMarkers,
  };
}
