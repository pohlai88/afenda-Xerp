import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FDR_CATALOG_TOTAL, fdrCatalogEntries } from "../fdr-catalog.data.mts";
import {
  FDR_REGISTER_VALID_STATUSES,
  filenameStatusPrefix,
  parseFdrRegister,
  statusPrefix,
} from "../fdr-catalog-index.mts";

const REPO_ROOT = path.resolve(import.meta.dirname, "../../..");
const FDR_DIR = path.join(REPO_ROOT, "docs/delivery/FDR");
const INDEX_PATH = path.join(REPO_ROOT, "docs/delivery/fdr-status-index.md");

describe("FDR catalog scaffold lock", () => {
  it("catalog data matches FDR_CATALOG_TOTAL", () => {
    expect(fdrCatalogEntries.length).toBe(FDR_CATALOG_TOTAL);
    expect(FDR_CATALOG_TOTAL).toBe(34);
  });

  it("every register row has an index-linked delivery file on disk", () => {
    const index = readFileSync(INDEX_PATH, "utf8");
    const rows = parseFdrRegister(index);

    expect(rows.length, "§FDR register must contain 33 data rows").toBe(
      FDR_CATALOG_TOTAL
    );

    for (const row of rows) {
      expect(
        FDR_REGISTER_VALID_STATUSES.includes(
          row.status as (typeof FDR_REGISTER_VALID_STATUSES)[number]
        ),
        `invalid status "${row.status}" for ${row.fdrId}`
      ).toBe(true);

      expect(
        row.documentFilename.endsWith(`${row.fdrId}.md`),
        `document link filename must end with ${row.fdrId}.md — got "${row.documentFilename}"`
      ).toBe(true);

      const prefixInFilename = filenameStatusPrefix(row.documentFilename);
      expect(
        prefixInFilename,
        `missing status prefix in filename "${row.documentFilename}"`
      ).toBe(statusPrefix(row.status));

      const filePath = path.join(FDR_DIR, row.documentFilename);
      expect(
        existsSync(filePath),
        `missing docs/delivery/FDR/${row.documentFilename}`
      ).toBe(true);

      expect(index).toContain(row.documentFilename);
    }
  });

  it("fdr-status-index links every fdr-* id without stub pending", () => {
    const index = readFileSync(INDEX_PATH, "utf8");
    const rows = parseFdrRegister(index);
    const registerIds = new Set(rows.map((row) => row.fdrId));

    for (const entry of fdrCatalogEntries) {
      expect(
        registerIds.has(entry.fdrId),
        `missing register row for ${entry.fdrId}`
      ).toBe(true);
      expect(index).toContain(entry.fdrId);
    }

    expect(index).not.toContain("stub pending");
    expect(rows.length).toBe(FDR_CATALOG_TOTAL);
  });

  it("FDR folder has exactly 33 delivery docs plus README", () => {
    const mdFiles = readdirSync(FDR_DIR).filter((name) => name.endsWith(".md"));
    const deliveryDocs = mdFiles.filter((name) => name.startsWith("["));
    expect(deliveryDocs.length).toBe(FDR_CATALOG_TOTAL);
  });
});
