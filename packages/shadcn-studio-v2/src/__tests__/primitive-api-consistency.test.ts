import { describe, expect, it } from "vitest";
import {
  readUiPrimitiveSource,
  UI_PRIMITIVE_COUNT,
  UI_PRIMITIVE_FILES,
} from "./helpers/ui-primitive-inventory";

const BOOLEAN_PROP_PATTERN = /readonly\s+([A-Za-z0-9_]+)\??:\s*boolean\b/g;
const RENDER_PROP_PATTERN = /render[A-Z][A-Za-z0-9_]*\??:/g;
/** Radix/shadcn layout flags — not behavior booleans. */
const ALLOWED_BOOLEAN_PROPS = new Set(["required", "inset"]);

function listBooleanProps(source: string): string[] {
  return Array.from(source.matchAll(BOOLEAN_PROP_PATTERN), (match) => match[1]);
}

describe("shadcn-studio-v2 primitive API consistency", () => {
  it("covers every canonical ui primitive in the inventory SSOT", () => {
    expect(UI_PRIMITIVE_COUNT).toBe(40);
  });

  it("avoids custom boolean props in primitive public interfaces", () => {
    for (const fileName of UI_PRIMITIVE_FILES) {
      expect(
        listBooleanProps(readUiPrimitiveSource(fileName)).filter(
          (propName) => !ALLOWED_BOOLEAN_PROPS.has(propName)
        ),
        fileName
      ).toEqual([]);
    }
  });

  it("keeps semantic boolean flags narrowly scoped", () => {
    const fieldSource = readUiPrimitiveSource("field.tsx");

    expect(listBooleanProps(fieldSource)).toEqual(["required"]);
    for (const fileName of UI_PRIMITIVE_FILES) {
      if (fileName === "field.tsx") {
        continue;
      }

      const booleans = listBooleanProps(readUiPrimitiveSource(fileName)).filter(
        (propName) => !ALLOWED_BOOLEAN_PROPS.has(propName)
      );
      expect(booleans, fileName).toEqual([]);
    }
  });

  it("avoids render-prop shaped primitive APIs", () => {
    for (const fileName of UI_PRIMITIVE_FILES) {
      expect(readUiPrimitiveSource(fileName), fileName).not.toMatch(
        RENDER_PROP_PATTERN
      );
    }
  });

  it("keeps primitive composition explicit through exported parts and variants", () => {
    const cardSource = readUiPrimitiveSource("card.tsx");
    const fieldSource = readUiPrimitiveSource("field.tsx");
    const tableSource = readUiPrimitiveSource("table.tsx");

    expect(cardSource).toContain("export function CardHeader");
    expect(cardSource).toContain("export function CardTitle");
    expect(fieldSource).toContain("export function FieldLabel");
    expect(fieldSource).toContain("export function FieldMessage");
    expect(fieldSource).toContain("export function FieldError");
    expect(fieldSource).toContain('data-slot="field-error"');
    expect(fieldSource).toContain(
      'data-invalid={state === "invalid" ? "" : undefined}'
    );
    expect(fieldSource).toContain("data-state={state}");
    expect(fieldSource).not.toContain("aria-invalid={ariaInvalid");
    expect(tableSource).toContain("export function TableHead");
    expect(tableSource).toContain("export function TableCell");
    expect(tableSource).toContain("export function tableClassName");
    expect(tableSource).toContain("export function tableHeadClassName");
    expect(readUiPrimitiveSource("button.tsx")).toContain(
      'export type ButtonState = "idle" | "loading"'
    );
    expect(readUiPrimitiveSource("button.tsx")).toContain(
      "satisfies Record<ButtonVariant, string>"
    );
    expect(readUiPrimitiveSource("badge.tsx")).toContain(
      "satisfies Record<BadgeVariant, string>"
    );
    expect(readUiPrimitiveSource("input.tsx")).toContain(
      "export function inputClassName"
    );
    expect(readUiPrimitiveSource("select.tsx")).toContain(
      "export function SelectTrigger"
    );
    expect(readUiPrimitiveSource("select.tsx")).toContain(
      "export function SelectItem"
    );
    expect(readUiPrimitiveSource("checkbox.tsx")).toContain(
      'data-slot="checkbox-indicator"'
    );
    expect(readUiPrimitiveSource("dialog.tsx")).toContain(
      "export function dialogContentClassName"
    );
    expect(readUiPrimitiveSource("alert-dialog.tsx")).toContain(
      "export function AlertDialogAction"
    );
    expect(readUiPrimitiveSource("sheet.tsx")).toContain(
      'data-slot="sheet-content"'
    );
    expect(readUiPrimitiveSource("tooltip.tsx")).toContain(
      'data-slot="tooltip-content"'
    );
    expect(readUiPrimitiveSource("tabs.tsx")).toContain(
      "export function TabsTrigger"
    );
    expect(readUiPrimitiveSource("breadcrumb.tsx")).toContain(
      'data-slot="breadcrumb-list"'
    );
    expect(readUiPrimitiveSource("pagination.tsx")).toContain(
      "export function paginationLinkClassName"
    );
  });
});
