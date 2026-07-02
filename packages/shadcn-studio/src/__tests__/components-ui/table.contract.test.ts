import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  TABLE_PRIMITIVE_ID,
  TABLE_SLOTS,
  tablePrimitiveMetadata,
  tableRootClassName,
} from "../../components-ui/table.contract.js";
import type { TableProps, TableSlot } from "../../components-ui/table.js";

describe("table primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports TABLE_PRIMITIVE_ID for metadata registries", () => {
    expect(TABLE_PRIMITIVE_ID).toBe("shadcn-studio.ui.table");
  });

  it("exports TABLE_SLOTS", () => {
    expect(TABLE_SLOTS).toEqual({
      container: "table-container",
      root: "table",
      header: "table-header",
      body: "table-body",
      footer: "table-footer",
      row: "table-row",
      head: "table-head",
      cell: "table-cell",
      caption: "table-caption",
    });
  });

  it("exports governed class constants", () => {
    expect(tableRootClassName).toContain("caption-bottom");
  });

  it("tablePrimitiveMetadata is JSON-serializable", () => {
    const payload = tablePrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("TableSlot is a governed slot literal union", () => {
    expectTypeOf<TableSlot>().toEqualTypeOf<
      | "table-container"
      | "table"
      | "table-header"
      | "table-body"
      | "table-footer"
      | "table-row"
      | "table-head"
      | "table-cell"
      | "table-caption"
    >();
  });

  it("TableProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof TableProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
