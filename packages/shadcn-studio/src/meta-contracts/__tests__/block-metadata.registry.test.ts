import { describe, expect, it } from "vitest";
import {
  assertBlockMetadataRegistryComplete,
  BLOCK_METADATA_REGISTRY,
  diffBlockMetadataRegistry,
  getBlockMetadataById,
} from "../../meta-gates/block-metadata.registry.js";
import {
  DATATABLE_BLOCK_CONTRACT_IDS,
  GOVERNED_BLOCK_CONTRACT_IDS,
  getBlockSlotsForBlockId,
} from "../../meta-registry/block-slot.registry.js";
import {
  buildBlockMetadata,
  buildSlotMapFromRegistry,
  DATATABLE_BLOCK_FAMILY_PREFIX,
  isDatatableBlockId,
} from "../block-metadata.builders.js";
import { BLOCK_METADATA_VERSION } from "../block-metadata.contract.js";

describe("block metadata registry", () => {
  it("covers every governed block id", () => {
    const diff = diffBlockMetadataRegistry();
    expect(diff.missingBlockIds).toEqual([]);
    expect(diff.extraBlockIds).toEqual([]);
    expect(assertBlockMetadataRegistryComplete()).toBe(true);
    expect(BLOCK_METADATA_REGISTRY).toHaveLength(
      GOVERNED_BLOCK_CONTRACT_IDS.length
    );
  });

  it("exports BLOCK_METADATA_VERSION on every metadata payload", () => {
    for (const entry of BLOCK_METADATA_REGISTRY) {
      expect(entry.version).toBe(BLOCK_METADATA_VERSION);
      expect(getBlockMetadataById(entry.blockId)).toEqual(entry);
    }
  });

  it("aligns slot ids with block-slot.registry for each governed block", () => {
    for (const entry of BLOCK_METADATA_REGISTRY) {
      const registrySlotIds = getBlockSlotsForBlockId(entry.blockId).map(
        (slot) => slot.slotId
      );
      const metadataSlotIds = Object.values(entry.slots);

      expect(metadataSlotIds.sort()).toEqual(registrySlotIds.sort());
    }
  });

  it("covers datatable family blocks from MCP manifest", () => {
    expect(DATATABLE_BLOCK_CONTRACT_IDS).toEqual([
      "datatable-invoice",
      "datatable-user",
      "datatable-product",
    ]);

    for (const blockId of DATATABLE_BLOCK_CONTRACT_IDS) {
      expect(isDatatableBlockId(blockId)).toBe(true);
      expect(blockId.startsWith(DATATABLE_BLOCK_FAMILY_PREFIX)).toBe(true);
      expect(getBlockMetadataById(blockId)?.surfaceTemplateClass).toBe("table");
    }
  });
});

describe("buildBlockMetadata", () => {
  it("derives login-page-04 slots and acceptance from registry", () => {
    const metadata = buildBlockMetadata("login-page-04");

    expect(metadata.blockId).toBe("login-page-04");
    expect(metadata.slots["email"]).toBe("login.email");
    expect(metadata.acceptanceRecordId).toBe("acceptance-record:login-page-04");
    expect(metadata.surfaceTemplateClass).toBe("form");
  });

  it("derives hero-section-01 metric slots", () => {
    const metadata = buildBlockMetadata("hero-section-01");

    expect(metadata.slots["title"]).toBe("hero.title");
    expect(metadata.surfaceTemplateClass).toBe("dashboard");
  });

  it("derives account-settings-01 help slots", () => {
    const metadata = buildBlockMetadata("account-settings-01");

    expect(metadata.slots["save"]).toBe("profile.save");
    expect(metadata.slots["displayNameHelp"]).toBe("profile.displayName.help");
  });

  it("assigns acceptance record id for every governed block contract", () => {
    for (const blockId of GOVERNED_BLOCK_CONTRACT_IDS) {
      expect(buildBlockMetadata(blockId).acceptanceRecordId).toBe(
        `acceptance-record:${blockId}`
      );
    }
  });

  it("buildSlotMapFromRegistry matches buildBlockMetadata slots", () => {
    for (const blockId of GOVERNED_BLOCK_CONTRACT_IDS) {
      expect(buildSlotMapFromRegistry(blockId)).toEqual(
        buildBlockMetadata(blockId).slots
      );
    }
  });
});
