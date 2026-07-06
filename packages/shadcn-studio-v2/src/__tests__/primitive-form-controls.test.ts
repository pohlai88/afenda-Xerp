import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { checkboxClassName } from "../components/ui/checkbox";
import { Input, inputClassName } from "../components/ui/input";
import { Label, labelClassName } from "../components/ui/label";
import {
  selectItemClassName,
  selectTriggerClassName,
} from "../components/ui/select";
import { switchClassName } from "../components/ui/switch";
import { Textarea, textareaClassName } from "../components/ui/textarea";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");

const SERVER_SAFE_FORM_PRIMITIVES = [
  "input.tsx",
  "label.tsx",
  "textarea.tsx",
] as const;

const CLIENT_FORM_PRIMITIVES = [
  "checkbox.tsx",
  "switch.tsx",
  "select.tsx",
] as const;

const FORM_CONTROL_PRIMITIVES = [
  ...SERVER_SAFE_FORM_PRIMITIVES,
  ...CLIENT_FORM_PRIMITIVES,
] as const;

function readSource(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

describe("shadcn-studio-v2 form-control primitives", () => {
  it("keeps Lane A-04 form primitives in the registered ui lane", () => {
    for (const fileName of FORM_CONTROL_PRIMITIVES) {
      const source = readSource("components", "ui", fileName);

      expect(source).toContain("export function");
      expect(source).not.toContain("window.");
      expect(source).not.toContain("document.");
      expect(source).not.toContain("localStorage");
    }

    for (const fileName of CLIENT_FORM_PRIMITIVES) {
      const source = readSource("components", "ui", fileName);

      expect(source).toContain('"use client"');
      expect(source).not.toContain("useState");
      expect(source).not.toContain("useEffect");
    }
  });

  it("uses canonical semantic token utilities in form-control class helpers", () => {
    expect(inputClassName()).toContain("border-input");
    expect(inputClassName()).toContain("bg-background");
    expect(inputClassName()).toContain("text-foreground");
    expect(inputClassName({ className: "extra-input" })).toContain(
      "extra-input"
    );

    expect(labelClassName()).toContain("text-foreground");
    expect(labelClassName({ className: "extra-label" })).toContain(
      "extra-label"
    );

    expect(textareaClassName()).toContain("border-input");
    expect(textareaClassName()).toContain("bg-background");
    expect(textareaClassName({ className: "extra-textarea" })).toContain(
      "extra-textarea"
    );

    expect(checkboxClassName()).toContain("border-primary");
    expect(checkboxClassName({ className: "extra-checkbox" })).toContain(
      "extra-checkbox"
    );

    expect(switchClassName()).toContain("bg-input");
    expect(switchClassName({ className: "extra-switch" })).toContain(
      "extra-switch"
    );

    expect(selectTriggerClassName()).toContain("border-input");
    expect(selectTriggerClassName({ size: "sm" })).toContain("h-9");
    expect(selectTriggerClassName({ className: "extra-trigger" })).toContain(
      "extra-trigger"
    );
    expect(selectItemClassName({ className: "extra-item" })).toContain(
      "extra-item"
    );
  });

  it("serializes form-control ownership through data-slot markers", () => {
    expect(readSource("components", "ui", "input.tsx")).toContain(
      'data-slot="input"'
    );
    expect(readSource("components", "ui", "label.tsx")).toContain(
      'data-slot="label"'
    );
    expect(readSource("components", "ui", "textarea.tsx")).toContain(
      'data-slot="textarea"'
    );

    const checkboxSource = readSource("components", "ui", "checkbox.tsx");
    expect(checkboxSource).toContain('data-slot="checkbox"');
    expect(checkboxSource).toContain('data-slot="checkbox-indicator"');

    const switchSource = readSource("components", "ui", "switch.tsx");
    expect(switchSource).toContain('data-slot="switch"');
    expect(switchSource).toContain('data-slot="switch-thumb"');

    const selectSource = readSource("components", "ui", "select.tsx");
    expect(selectSource).toContain('data-slot="select"');
    expect(selectSource).toContain('data-slot="select-trigger"');
    expect(selectSource).toContain('data-slot="select-content"');
    expect(selectSource).toContain('data-slot="select-item"');
    expect(selectSource).toContain("export function SelectTrigger");
    expect(selectSource).toContain("export function SelectItem");
    expect(selectSource).toContain("satisfies Record");
  });

  it("renders server-safe form primitives with semantic accessible markup", () => {
    const inputMarkup = renderToStaticMarkup(
      createElement(Input, {
        "aria-label": "Record name",
        id: "record-name",
        name: "recordName",
      })
    );
    const labelMarkup = renderToStaticMarkup(
      createElement(Label, { htmlFor: "record-name" }, "Record name")
    );
    const textareaMarkup = renderToStaticMarkup(
      createElement(Textarea, {
        "aria-label": "Notes",
        id: "notes",
        name: "notes",
      })
    );

    expect(inputMarkup).toContain("<input");
    expect(inputMarkup).toContain('data-slot="input"');
    expect(inputMarkup).toContain('id="record-name"');
    expect(inputMarkup).toContain('aria-label="Record name"');

    expect(labelMarkup).toContain("<label");
    expect(labelMarkup).toContain('data-slot="label"');
    expect(labelMarkup).toContain('for="record-name"');
    expect(labelMarkup).toContain("Record name");

    expect(textareaMarkup).toContain("<textarea");
    expect(textareaMarkup).toContain('data-slot="textarea"');
    expect(textareaMarkup).toContain('id="notes"');
  });

  it("keeps form-control exports on neutral index and off server surface", () => {
    const indexSource = readSource("index.ts");
    const serverSource = readSource("server.ts");

    expect(indexSource).toContain("./components/ui/input");
    expect(indexSource).toContain("./components/ui/label");
    expect(indexSource).toContain("./components/ui/textarea");
    expect(indexSource).toContain("./components/ui/checkbox");
    expect(indexSource).toContain("./components/ui/switch");
    expect(indexSource).toContain("./components/ui/select");

    expect(serverSource).not.toContain("./components/ui/input");
    expect(serverSource).not.toContain("./components/ui/label");
    expect(serverSource).not.toContain("./components/ui/textarea");
    expect(serverSource).not.toContain("./components/ui/checkbox");
    expect(serverSource).not.toContain("./components/ui/switch");
    expect(serverSource).not.toContain("./components/ui/select");
  });
});
