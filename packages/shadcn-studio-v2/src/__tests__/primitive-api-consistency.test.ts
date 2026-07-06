import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const UI_ROOT = path.join(PACKAGE_ROOT, "src", "components", "ui");

const PRIMITIVE_FILES = [
  "alert.tsx",
  "alert-dialog.tsx",
  "badge.tsx",
  "breadcrumb.tsx",
  "button.tsx",
  "card.tsx",
  "checkbox.tsx",
  "dialog.tsx",
  "drawer.tsx",
  "field.tsx",
  "input.tsx",
  "label.tsx",
  "popover.tsx",
  "pagination.tsx",
  "select.tsx",
  "scroll-area.tsx",
  "separator.tsx",
  "sheet.tsx",
  "switch.tsx",
  "table.tsx",
  "tabs.tsx",
  "textarea.tsx",
  "tooltip.tsx",
] as const;

const BOOLEAN_PROP_PATTERN = /readonly\s+([A-Za-z0-9_]+)\??:\s*boolean\b/g;
const RENDER_PROP_PATTERN = /render[A-Z][A-Za-z0-9_]*\??:/g;
const ALLOWED_BOOLEAN_PROPS = new Set(["required"]);

function readPrimitiveSource(
  fileName: (typeof PRIMITIVE_FILES)[number]
): string {
  return readFileSync(path.join(UI_ROOT, fileName), "utf8");
}

function listBooleanProps(source: string): string[] {
  return Array.from(source.matchAll(BOOLEAN_PROP_PATTERN), (match) => match[1]);
}

describe("shadcn-studio-v2 primitive API consistency", () => {
  it("avoids custom boolean props in primitive public interfaces", () => {
    for (const fileName of PRIMITIVE_FILES) {
      expect(
        listBooleanProps(readPrimitiveSource(fileName)).filter(
          (propName) => !ALLOWED_BOOLEAN_PROPS.has(propName)
        )
      ).toEqual([]);
    }
  });

  it("keeps semantic boolean flags narrowly scoped", () => {
    const fieldSource = readPrimitiveSource("field.tsx");

    expect(listBooleanProps(fieldSource)).toEqual(["required"]);
    for (const fileName of PRIMITIVE_FILES) {
      if (fileName === "field.tsx") {
        continue;
      }

      expect(listBooleanProps(readPrimitiveSource(fileName))).toEqual([]);
    }
  });

  it("avoids render-prop shaped primitive APIs", () => {
    for (const fileName of PRIMITIVE_FILES) {
      expect(readPrimitiveSource(fileName)).not.toMatch(RENDER_PROP_PATTERN);
    }
  });

  it("keeps primitive composition explicit through exported parts and variants", () => {
    const cardSource = readPrimitiveSource("card.tsx");
    const fieldSource = readPrimitiveSource("field.tsx");
    const tableSource = readPrimitiveSource("table.tsx");

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
    expect(readPrimitiveSource("button.tsx")).toContain(
      'export type ButtonState = "idle" | "loading"'
    );
    expect(readPrimitiveSource("button.tsx")).toContain(
      "satisfies Record<ButtonVariant, string>"
    );
    expect(readPrimitiveSource("badge.tsx")).toContain(
      "satisfies Record<BadgeVariant, string>"
    );
    expect(readPrimitiveSource("input.tsx")).toContain(
      "export function inputClassName"
    );
    expect(readPrimitiveSource("select.tsx")).toContain(
      "export function SelectTrigger"
    );
    expect(readPrimitiveSource("select.tsx")).toContain(
      "export function SelectItem"
    );
    expect(readPrimitiveSource("checkbox.tsx")).toContain(
      'data-slot="checkbox-indicator"'
    );
    expect(readPrimitiveSource("dialog.tsx")).toContain(
      "export function dialogContentClassName"
    );
    expect(readPrimitiveSource("alert-dialog.tsx")).toContain(
      "export function AlertDialogAction"
    );
    expect(readPrimitiveSource("sheet.tsx")).toContain(
      'data-slot="sheet-content"'
    );
    expect(readPrimitiveSource("tooltip.tsx")).toContain(
      'data-slot="tooltip-content"'
    );
    expect(readPrimitiveSource("tabs.tsx")).toContain(
      "export function TabsTrigger"
    );
    expect(readPrimitiveSource("breadcrumb.tsx")).toContain(
      'data-slot="breadcrumb-list"'
    );
    expect(readPrimitiveSource("pagination.tsx")).toContain(
      "export function paginationLinkClassName"
    );
  });
});
