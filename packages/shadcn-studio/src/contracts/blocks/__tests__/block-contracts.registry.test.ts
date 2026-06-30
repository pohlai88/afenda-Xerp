import { describe, expect, it } from "vitest";
import {
  assertBlockMetadataRegistryComplete,
  BLOCK_METADATA_REGISTRY,
  getBlockMetadataById,
} from "../../../governance/block-metadata.registry.js";
import {
  DATATABLE_BLOCK_CONTRACT_IDS,
  getBlockSlotsForBlockId,
} from "../../../registry/block-slot.registry.js";
import { BLOCK_CONTRACT_VERSION } from "../../block-governance.contract.js";
import {
  ACCOUNT_SETTINGS_01_BLOCK_ID,
  ACCOUNT_SETTINGS_01_SLOTS,
} from "../account-settings-01.block.contract.js";
import {
  DATATABLE_BLOCK_FAMILY_PREFIX,
  DATATABLE_BLOCK_SLOTS,
} from "../datatable-block.contract.js";
import {
  DATATABLE_INVOICE_BLOCK_ID,
  DATATABLE_INVOICE_SLOTS,
  datatableInvoiceBlockMetadata,
} from "../datatable-invoice.block.contract.js";
import {
  DATATABLE_PRODUCT_BLOCK_ID,
  DATATABLE_PRODUCT_SLOTS,
  datatableProductBlockMetadata,
} from "../datatable-product.block.contract.js";
import {
  DATATABLE_USER_BLOCK_ID,
  DATATABLE_USER_SLOTS,
  datatableUserBlockMetadata,
} from "../datatable-user.block.contract.js";
import {
  DIALOG_ACTIVITY_BLOCK_ID,
  DIALOG_ACTIVITY_SLOTS,
  dialogActivityBlockMetadata,
} from "../dialog-activity.block.contract.js";
import {
  HERO_SECTION_01_BLOCK_ID,
  HERO_SECTION_01_SLOTS,
} from "../hero-section-01.block.contract.js";
import {
  LOGIN_PAGE_04_BLOCK_ID,
  LOGIN_PAGE_04_SLOTS,
  loginPage04BlockMetadata,
} from "../login-page-04.block.contract.js";
import {
  STATISTICS_CARD_01_BLOCK_ID,
  STATISTICS_CARD_01_SLOTS,
} from "../statistics-card-01.block.contract.js";

describe("block contract registry", () => {
  it("covers every metadata-bound block template id", () => {
    expect(assertBlockMetadataRegistryComplete()).toBe(true);
    expect(BLOCK_METADATA_REGISTRY).toHaveLength(8);
  });

  it("covers every datatable family block id from MCP manifest", () => {
    expect(DATATABLE_BLOCK_CONTRACT_IDS).toEqual([
      "datatable-invoice",
      "datatable-user",
      "datatable-product",
    ]);

    for (const blockId of DATATABLE_BLOCK_CONTRACT_IDS) {
      expect(blockId.startsWith(DATATABLE_BLOCK_FAMILY_PREFIX)).toBe(true);
      expect(getBlockMetadataById(blockId)?.slots).toEqual(
        DATATABLE_BLOCK_SLOTS
      );
    }
  });

  it("exports BLOCK_CONTRACT_VERSION on every block metadata payload", () => {
    for (const entry of BLOCK_METADATA_REGISTRY) {
      expect(entry.version).toBe(BLOCK_CONTRACT_VERSION);
      expect(getBlockMetadataById(entry.blockId)).toEqual(entry);
    }
  });

  it("aligns slot ids with block-slot.registry for each governed block", () => {
    for (const entry of BLOCK_METADATA_REGISTRY) {
      const registrySlotIds = getBlockSlotsForBlockId(entry.blockId).map(
        (slot) => slot.slotId
      );
      const contractSlotIds = Object.values(entry.slots);

      expect(contractSlotIds.sort()).toEqual(registrySlotIds.sort());
    }
  });
});

describe("login-page-04 block contract", () => {
  it("exports block id and slots", () => {
    expect(LOGIN_PAGE_04_BLOCK_ID).toBe("login-page-04");
    expect(LOGIN_PAGE_04_SLOTS.email).toBe("login.email");
    expect(loginPage04BlockMetadata().acceptanceRecordId).toBe(
      "acceptance-record:login-page-04"
    );
  });
});

describe("hero-section-01 block contract", () => {
  it("exports block id and slots", () => {
    expect(HERO_SECTION_01_BLOCK_ID).toBe("hero-section-01");
    expect(HERO_SECTION_01_SLOTS.title).toBe("hero.title");
  });
});

describe("statistics-card-01 block contract", () => {
  it("exports block id and slots", () => {
    expect(STATISTICS_CARD_01_BLOCK_ID).toBe("statistics-card-01");
    expect(STATISTICS_CARD_01_SLOTS.value).toBe("metric.value");
  });
});

describe("account-settings-01 block contract", () => {
  it("exports block id and slots", () => {
    expect(ACCOUNT_SETTINGS_01_BLOCK_ID).toBe("account-settings-01");
    expect(ACCOUNT_SETTINGS_01_SLOTS.save).toBe("profile.save");
  });
});

describe("datatable-invoice block contract", () => {
  it("exports block id and shared datatable family slots", () => {
    expect(DATATABLE_INVOICE_BLOCK_ID).toBe("datatable-invoice");
    expect(DATATABLE_INVOICE_SLOTS).toEqual(DATATABLE_BLOCK_SLOTS);
    expect(datatableInvoiceBlockMetadata().acceptanceRecordId).toBe(
      "acceptance-record:datatable-invoice"
    );
  });
});

describe("datatable-user block contract", () => {
  it("exports block id and shared datatable family slots", () => {
    expect(DATATABLE_USER_BLOCK_ID).toBe("datatable-user");
    expect(DATATABLE_USER_SLOTS).toEqual(DATATABLE_BLOCK_SLOTS);
    expect(datatableUserBlockMetadata().acceptanceRecordId).toBeUndefined();
  });
});

describe("datatable-product block contract", () => {
  it("exports block id and shared datatable family slots", () => {
    expect(DATATABLE_PRODUCT_BLOCK_ID).toBe("datatable-product");
    expect(DATATABLE_PRODUCT_SLOTS).toEqual(DATATABLE_BLOCK_SLOTS);
    expect(datatableProductBlockMetadata().acceptanceRecordId).toBeUndefined();
  });
});

describe("dialog-activity block contract", () => {
  it("exports block id and slots", () => {
    expect(DIALOG_ACTIVITY_BLOCK_ID).toBe("dialog-activity");
    expect(DIALOG_ACTIVITY_SLOTS.footer).toBe("dialog.footer");
    expect(dialogActivityBlockMetadata().acceptanceRecordId).toBeUndefined();
  });
});
