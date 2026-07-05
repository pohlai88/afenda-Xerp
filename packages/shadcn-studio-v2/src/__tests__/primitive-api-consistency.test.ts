import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const UI_ROOT = path.join(PACKAGE_ROOT, "src", "components", "ui");

const PRIMITIVE_FILES = [
  "Alert.tsx",
  "Badge.tsx",
  "Button.tsx",
  "Card.tsx",
  "Field.tsx",
  "Table.tsx",
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
    const fieldSource = readPrimitiveSource("Field.tsx");

    expect(listBooleanProps(fieldSource)).toEqual(["required"]);
    for (const fileName of PRIMITIVE_FILES) {
      if (fileName === "Field.tsx") {
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
    const cardSource = readPrimitiveSource("Card.tsx");
    const fieldSource = readPrimitiveSource("Field.tsx");
    const tableSource = readPrimitiveSource("Table.tsx");

    expect(cardSource).toContain("export function CardHeader");
    expect(cardSource).toContain("export function CardTitle");
    expect(fieldSource).toContain("export function FieldLabel");
    expect(fieldSource).toContain("export function FieldMessage");
    expect(tableSource).toContain("export function TableHead");
    expect(tableSource).toContain("export function TableCell");
    expect(readPrimitiveSource("Button.tsx")).toContain(
      "satisfies Record<ButtonVariant, string>"
    );
    expect(readPrimitiveSource("Badge.tsx")).toContain(
      "satisfies Record<BadgeVariant, string>"
    );
  });
});
