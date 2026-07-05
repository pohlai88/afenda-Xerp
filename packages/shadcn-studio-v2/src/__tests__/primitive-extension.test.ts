import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  alertClassName,
} from "../components/ui/Alert";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldMessage,
  fieldClassName,
} from "../components/ui/Field";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  tableBodyClassName,
  tableCaptionClassName,
  tableCellClassName,
  tableClassName,
  tableContainerClassName,
  tableFooterClassName,
  tableHeadClassName,
  tableHeaderClassName,
  tableRowClassName,
} from "../components/ui/Table";

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
    expect(alertClassName()).toContain("border-border");
    expect(alertClassName()).toContain("bg-background");
    expect(alertClassName()).toContain("text-foreground");
    expect(alertClassName({ variant: "destructive" })).toContain(
      "text-destructive"
    );
    expect(alertClassName({ className: "extra-alert" })).toContain(
      "extra-alert"
    );
    expect(fieldClassName({ state: "invalid" })).toContain("text-destructive");
    expect(tableContainerClassName()).toContain("overflow-auto");
    expect(tableContainerClassName({ overflow: "visible" })).toContain(
      "overflow-visible"
    );
    expect(tableClassName({ className: "extra-class" })).toContain(
      "extra-class"
    );
    expect(tableHeaderClassName({ className: "extra-header" })).toContain(
      "extra-header"
    );
    expect(tableBodyClassName({ className: "extra-body" })).toContain(
      "extra-body"
    );
    expect(tableFooterClassName({ className: "extra-footer" })).toContain(
      "extra-footer"
    );
    expect(tableRowClassName()).toContain("border-border");
    expect(tableRowClassName({ className: "extra-row" })).toContain(
      "extra-row"
    );
    expect(tableHeadClassName()).toContain("text-muted-foreground");
    expect(tableHeadClassName({ className: "extra-head" })).toContain(
      "extra-head"
    );
    expect(tableCellClassName({ className: "extra-cell" })).toContain(
      "extra-cell"
    );
    expect(tableCaptionClassName({ className: "extra-caption" })).toContain(
      "extra-caption"
    );
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
    expect(fieldSource).toContain('data-slot="field-error"');
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

    expect(alertSource).not.toContain('"destructive" ? "alert" : "status"');
    expect(alertSource).not.toContain("role={role ??");
    expect(fieldSource).not.toContain("ReactNode");
    expect(fieldSource).toContain("readonly requiredIndicator?: string");
    expect(fieldSource).not.toContain(
      'state === "invalid" ? "alert" : undefined'
    );
    expect(fieldSource).toContain(
      'data-invalid={state === "invalid" ? "" : undefined}'
    );
    expect(fieldSource).toContain('data-required={required ? "" : undefined}');
    expect(fieldSource).toContain("data-state={state}");
    expect(fieldSource).toContain("role={role}");
    expect(fieldSource).toContain('role={role ?? "alert"}');
    expect(tableSource).toContain('scope = "col"');
  });

  it("renders extension primitives with semantic accessible markup", () => {
    const alertMarkup = renderToStaticMarkup(
      createElement(
        Alert,
        { variant: "destructive" },
        createElement(AlertTitle, undefined, "Payment failed"),
        createElement(AlertDescription, undefined, "Retry the request.")
      )
    );
    const statusAlertMarkup = renderToStaticMarkup(
      createElement(Alert, { role: "status" }, "Saved successfully.")
    );
    const assertiveAlertMarkup = renderToStaticMarkup(
      createElement(
        Alert,
        { role: "alert", variant: "destructive" },
        "Failed to save record."
      )
    );
    const fieldMarkup = renderToStaticMarkup(
      createElement(
        Field,
        { state: "invalid" },
        createElement(
          FieldLabel,
          { htmlFor: "amount", required: true },
          "Amount"
        ),
        createElement(FieldControl, undefined, "control"),
        createElement(
          FieldDescription,
          { id: "amount-help" },
          "Enter a value."
        ),
        createElement(
          FieldMessage,
          { role: "note", state: "invalid" },
          "Amount is required."
        ),
        createElement(FieldError, undefined, "Use a positive value.")
      )
    );
    const tableMarkup = renderToStaticMarkup(
      createElement(
        TableContainer,
        undefined,
        createElement(
          Table,
          undefined,
          createElement(TableCaption, undefined, "Invoices"),
          createElement(
            TableHeader,
            undefined,
            createElement(
              TableRow,
              undefined,
              createElement(TableHead, undefined, "Invoice"),
              createElement(TableHead, undefined, "Status")
            )
          ),
          createElement(
            TableBody,
            undefined,
            createElement(
              TableRow,
              { "data-state": "selected" },
              createElement(TableHead, { scope: "row" }, "Malaysia"),
              createElement(TableCell, undefined, "Open")
            )
          ),
          createElement(
            TableFooter,
            undefined,
            createElement(
              TableRow,
              undefined,
              createElement(TableCell, undefined, "Total"),
              createElement(TableCell, undefined, "1")
            )
          )
        )
      )
    );

    expect(alertMarkup).not.toContain("role=");
    expect(alertMarkup).toContain('data-slot="alert-title"');
    expect(alertMarkup).toContain("Payment failed");
    expect(statusAlertMarkup).toContain('role="status"');
    expect(statusAlertMarkup).toContain("Saved successfully.");
    expect(assertiveAlertMarkup).toContain('role="alert"');
    expect(assertiveAlertMarkup).toContain("Failed to save record.");
    expect(fieldMarkup).not.toContain('aria-invalid="true"');
    expect(fieldMarkup).toContain('data-state="invalid"');
    expect(fieldMarkup).toContain("data-invalid");
    expect(fieldMarkup).toContain('for="amount"');
    expect(fieldMarkup).toContain("data-required");
    expect(fieldMarkup).toContain('aria-hidden="true"');
    expect(fieldMarkup).toContain('role="note"');
    expect(fieldMarkup).toContain('data-slot="field-error"');
    expect(fieldMarkup).toContain('role="alert"');
    expect(tableMarkup).toContain("<table");
    expect(tableMarkup).toContain("<thead");
    expect(tableMarkup).toContain("<tbody");
    expect(tableMarkup).toContain("<tfoot");
    expect(tableMarkup).toContain("<tr");
    expect(tableMarkup).toContain("<th");
    expect(tableMarkup).toContain('scope="col"');
    expect(tableMarkup).toContain('scope="row"');
    expect(tableMarkup).toContain("Malaysia");
    expect(tableMarkup).toContain("<td");
    expect(tableMarkup).toContain("<caption");
    expect(tableMarkup).toContain('data-state="selected"');
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
