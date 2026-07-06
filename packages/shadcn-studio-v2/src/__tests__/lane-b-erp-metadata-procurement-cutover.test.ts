import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { assertNoV1ConsumerImport } from "./helpers/forbidden-v1-import-patterns";
import { assertSliceDocumentComplete } from "./helpers/lane-slice-doc-status";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");

const METADATA_WORKSPACE_PAGE_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/app/(protected)/metadata-workspace/page.tsx"
);
const PURCHASE_ORDERS_PAGE_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/app/(protected)/modules/procurement/purchase-orders/page.tsx"
);
const REQUISITIONS_PAGE_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/app/(protected)/modules/procurement/requisitions/page.tsx"
);
const PROCUREMENT_COMPOSER_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/components/procurement/procurement-purchase-orders-composer.client.tsx"
);
const METADATA_RESOLVER_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/lib/metadata/resolve-studio-block-component.client.tsx"
);
const B08_SLICE_PATH = path.join(
  DOCS_SLICES_ROOT,
  "LANE-B-08-ERP-SURFACE-WAVE-METADATA-PROCUREMENT.md"
);

describe("Lane B-08 ERP metadata and procurement cutover", () => {
  it("routes metadata workspace and procurement pages without v1 imports", () => {
    const metadataPage = readFileSync(METADATA_WORKSPACE_PAGE_PATH, "utf8");
    const purchaseOrdersPage = readFileSync(PURCHASE_ORDERS_PAGE_PATH, "utf8");
    const requisitionsPage = readFileSync(REQUISITIONS_PAGE_PATH, "utf8");

    expect(metadataPage).toContain("@afenda/shadcn-studio-v2");
    assertNoV1ConsumerImport(metadataPage);
    expect(purchaseOrdersPage).toContain("ProcurementPurchaseOrdersComposer");
    assertNoV1ConsumerImport(purchaseOrdersPage);
    expect(requisitionsPage).toContain("ProcurementRequisitionsComposer");
    assertNoV1ConsumerImport(requisitionsPage);
  });

  it("uses ErpDataTableComposer and v2 block resolver for wave-2 surfaces", () => {
    const composer = readFileSync(PROCUREMENT_COMPOSER_PATH, "utf8");
    const resolver = readFileSync(METADATA_RESOLVER_PATH, "utf8");

    expect(composer).toContain("ErpDataTableComposer");
    expect(resolver).toContain("@afenda/shadcn-studio-v2/clients");
    assertNoV1ConsumerImport(resolver);
  });

  it("records B-08 slice completion", () => {
    const slice = readFileSync(B08_SLICE_PATH, "utf8");

    assertSliceDocumentComplete(
      DOCS_SLICES_ROOT,
      "LANE-B-08-ERP-SURFACE-WAVE-METADATA-PROCUREMENT.md"
    );
    expect(slice).toContain("ErpDataTableComposer");
  });
});
