import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { alertClassName } from "../components/ui/Alert";
import { fieldClassName } from "../components/ui/Field";
import { tableContainerClassName } from "../components/ui/Table";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");

const REQUIRED_EXTENSION_PRIMITIVES = [
  "Alert.tsx",
  "Field.tsx",
  "Table.tsx",
] as const;

function readSource(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

describe("shadcn-studio-v2 primitive extension", () => {
  it("keeps Slice 3B primitives in the registered ui lane", () => {
    for (const fileName of REQUIRED_EXTENSION_PRIMITIVES) {
      const source = readSource("components", "ui", fileName);

      expect(source).toContain("export function");
      expect(source).not.toContain("window.");
      expect(source).not.toContain("document.");
      expect(source).not.toContain("localStorage");
      expect(source).not.toContain("useState");
      expect(source).not.toContain("useEffect");
    }
  });

  it("uses canonical semantic token utilities in primitive variants", () => {
    expect(alertClassName({ variant: "destructive" })).toContain(
      "text-destructive"
    );
    expect(fieldClassName({ state: "invalid" })).toContain("text-destructive");
    expect(tableContainerClassName()).toContain("overflow-auto");
  });

  it("serializes extension primitive ownership through data-slot markers", () => {
    const alertSource = readSource("components", "ui", "Alert.tsx");
    const fieldSource = readSource("components", "ui", "Field.tsx");
    const tableSource = readSource("components", "ui", "Table.tsx");

    expect(alertSource).toContain('data-slot="alert"');
    expect(alertSource).toContain('data-slot="alert-title"');
    expect(alertSource).toContain('data-slot="alert-description"');
    expect(fieldSource).toContain('data-slot="field"');
    expect(fieldSource).toContain('data-slot="field-label"');
    expect(fieldSource).toContain('data-slot="field-control"');
    expect(fieldSource).toContain('data-slot="field-description"');
    expect(fieldSource).toContain('data-slot="field-message"');
    expect(tableSource).toContain('data-slot="table-container"');
    expect(tableSource).toContain('data-slot="table"');
    expect(tableSource).toContain('data-slot="table-header"');
    expect(tableSource).toContain('data-slot="table-body"');
    expect(tableSource).toContain('data-slot="table-footer"');
    expect(tableSource).toContain('data-slot="table-row"');
    expect(tableSource).toContain('data-slot="table-head"');
    expect(tableSource).toContain('data-slot="table-cell"');
    expect(tableSource).toContain('data-slot="table-caption"');
  });

  it("keeps extension primitive contracts simple and boundary-safe", () => {
    const alertSource = readSource("components", "ui", "Alert.tsx");
    const fieldSource = readSource("components", "ui", "Field.tsx");
    const tableSource = readSource("components", "ui", "Table.tsx");

    expect(alertSource).toContain('"destructive" ? "alert" : "status"');
    expect(fieldSource).not.toContain("ReactNode");
    expect(fieldSource).toContain("readonly requiredIndicator?: string");
    expect(fieldSource).toContain('state === "invalid" ? "alert" : undefined');
    expect(tableSource).toContain('scope = "col"');
  });

  it("keeps extension primitives out of the server public surface", () => {
    expect(readSource("index.ts")).toContain("./components/ui/Alert");
    expect(readSource("index.ts")).toContain("./components/ui/Field");
    expect(readSource("index.ts")).toContain("./components/ui/Table");
    expect(readSource("clients.ts")).toContain("Alert");
    expect(readSource("clients.ts")).toContain("Field");
    expect(readSource("clients.ts")).toContain("Table");
    expect(readSource("server.ts")).not.toContain("./components/ui/Alert");
    expect(readSource("server.ts")).not.toContain("./components/ui/Field");
    expect(readSource("server.ts")).not.toContain("./components/ui/Table");
  });
});
