import { describe, expect, it } from "vitest";
import {
  assertKebabStem,
  getComponentQualityBarViolations,
  hasFocusVisibleSemantics,
  INTERACTIVE_PRIMITIVES,
  listUiPrimitiveFilesFromDisk,
  readUiPrimitiveSource,
  UI_PRIMITIVE_COUNT,
  UI_PRIMITIVE_FILES,
} from "./helpers/ui-primitive-inventory";

describe("shadcn-studio-v2 primitive inventory coverage (F2)", () => {
  it("matches canonical inventory to on-disk ui stems (40 primitives)", () => {
    const diskFiles = listUiPrimitiveFilesFromDisk();
    expect(diskFiles).toEqual([...UI_PRIMITIVE_FILES].sort());
    expect(UI_PRIMITIVE_COUNT).toBe(40);

    for (const fileName of diskFiles) {
      expect(assertKebabStem(fileName), fileName).toBe(true);
    }
  });

  it("enforces DESIGN-SYSTEM-ARCHITECTURE component quality bar on every primitive", () => {
    for (const fileName of UI_PRIMITIVE_FILES) {
      const source = readUiPrimitiveSource(fileName);
      expect(getComponentQualityBarViolations(source), fileName).toEqual([]);
    }
  });

  it("requires focus-visible or ring semantics on interactive primitives", () => {
    for (const fileName of INTERACTIVE_PRIMITIVES) {
      expect(
        hasFocusVisibleSemantics(fileName),
        `${fileName}: focus-visible, ring-ring, or delegated sibling semantics`
      ).toBe(true);
    }
  });
});
