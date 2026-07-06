import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  alertDialogContentClassName,
  alertDialogOverlayClassName,
} from "../components/ui/alert-dialog";
import {
  dialogCloseButtonClassName,
  dialogContentClassName,
  dialogOverlayClassName,
} from "../components/ui/dialog";
import { popoverContentClassName } from "../components/ui/popover";
import {
  sheetContentClassName,
  sheetOverlayClassName,
} from "../components/ui/sheet";
import { tooltipContentClassName } from "../components/ui/tooltip";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");

const OVERLAY_PRIMITIVES = [
  "dialog.tsx",
  "alert-dialog.tsx",
  "sheet.tsx",
  "drawer.tsx",
  "popover.tsx",
  "tooltip.tsx",
] as const;

function readSource(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

describe("shadcn-studio-v2 overlay primitives", () => {
  it("keeps Lane A-05 overlay primitives in the registered ui lane", () => {
    for (const fileName of OVERLAY_PRIMITIVES) {
      const source = readSource("components", "ui", fileName);

      expect(source).toContain("export ");
      expect(source).not.toContain("window.");
      expect(source).not.toContain("document.");
      expect(source).not.toContain("localStorage");
      expect(source).not.toContain("draggable");
      expect(source).not.toMatch(/\bresize\b/);
    }

    for (const fileName of OVERLAY_PRIMITIVES) {
      if (fileName === "drawer.tsx") {
        continue;
      }

      expect(readSource("components", "ui", fileName)).toContain(
        '"use client"'
      );
    }

    const dialogSource = readSource("components", "ui", "dialog.tsx");
    const alertDialogSource = readSource(
      "components",
      "ui",
      "alert-dialog.tsx"
    );
    const sheetSource = readSource("components", "ui", "sheet.tsx");

    expect(dialogSource).toContain('from "./button"');
    expect(alertDialogSource).toContain('from "./button"');
    expect(sheetSource).toContain('from "./button"');
    expect(dialogSource).not.toContain("useState");
    expect(dialogSource).not.toContain("useEffect");
  });

  it("uses canonical semantic token utilities in overlay class helpers", () => {
    expect(dialogOverlayClassName()).toContain("bg-black/50");
    expect(dialogContentClassName()).toContain("border-border");
    expect(dialogContentClassName()).toContain("bg-background");
    expect(dialogContentClassName()).toContain("text-foreground");
    expect(dialogCloseButtonClassName()).toContain("hover:bg-accent");
    expect(dialogCloseButtonClassName()).toContain("size-10");
    expect(dialogCloseButtonClassName({ className: "extra-close" })).toContain(
      "extra-close"
    );

    expect(alertDialogOverlayClassName()).toContain("bg-black/50");
    expect(alertDialogContentClassName()).toContain("border-border");
    expect(alertDialogContentClassName()).toContain("bg-background");

    expect(sheetOverlayClassName()).toContain("bg-black/50");
    expect(sheetContentClassName()).toContain("bg-background");
    expect(sheetContentClassName({ side: "left" })).toContain("border-r");
    expect(sheetContentClassName({ side: "right" })).toContain("border-l");
    expect(sheetContentClassName({ className: "extra-sheet" })).toContain(
      "extra-sheet"
    );

    expect(popoverContentClassName()).toContain("border-border");
    expect(popoverContentClassName()).toContain("bg-popover");
    expect(popoverContentClassName()).toContain("text-popover-foreground");

    expect(tooltipContentClassName()).toContain("bg-primary");
    expect(tooltipContentClassName()).toContain("text-primary-foreground");
  });

  it("serializes overlay ownership through data-slot markers", () => {
    const dialogSource = readSource("components", "ui", "dialog.tsx");
    expect(dialogSource).toContain('data-slot="dialog"');
    expect(dialogSource).toContain('data-slot="dialog-content"');
    expect(dialogSource).toContain('data-slot="dialog-title"');
    expect(dialogSource).toContain('data-slot="dialog-description"');
    expect(dialogSource).toContain('data-slot="dialog-close-button"');
    expect(dialogSource).toContain("export function DialogContent");
    expect(dialogSource).toContain("export function dialogOverlayClassName");

    const alertDialogSource = readSource(
      "components",
      "ui",
      "alert-dialog.tsx"
    );
    expect(alertDialogSource).toContain('data-slot="alert-dialog"');
    expect(alertDialogSource).toContain('data-slot="alert-dialog-content"');
    expect(alertDialogSource).toContain('data-slot="alert-dialog-action"');
    expect(alertDialogSource).toContain('data-slot="alert-dialog-cancel"');

    const sheetSource = readSource("components", "ui", "sheet.tsx");
    expect(sheetSource).toContain('data-slot="sheet"');
    expect(sheetSource).toContain('data-slot="sheet-content"');
    expect(sheetSource).toContain('data-slot="sheet-title"');
    expect(sheetSource).toContain("export function sheetContentClassName");

    const drawerSource = readSource("components", "ui", "drawer.tsx");
    expect(drawerSource).toContain('from "./sheet"');
    expect(drawerSource).toContain("Sheet as Drawer");

    const popoverSource = readSource("components", "ui", "popover.tsx");
    expect(popoverSource).toContain('data-slot="popover"');
    expect(popoverSource).toContain('data-slot="popover-content"');
    expect(popoverSource).toContain('data-slot="popover-trigger"');

    const tooltipSource = readSource("components", "ui", "tooltip.tsx");
    expect(tooltipSource).toContain('data-slot="tooltip"');
    expect(tooltipSource).toContain('data-slot="tooltip-content"');
    expect(tooltipSource).toContain('data-slot="tooltip-provider"');
    expect(tooltipSource).toContain('data-slot="tooltip-arrow"');
  });

  it("keeps overlay exports on neutral index and off server surface", () => {
    const indexSource = readSource("index.ts");
    const serverSource = readSource("server.ts");

    for (const stem of [
      "dialog",
      "alert-dialog",
      "sheet",
      "drawer",
      "popover",
      "tooltip",
    ]) {
      expect(indexSource).toContain(`./components/ui/${stem}`);
      expect(serverSource).not.toContain(`./components/ui/${stem}`);
    }
  });

  it("keeps drawer as a sheet alias without duplicating implementation", () => {
    const drawerSource = readSource("components", "ui", "drawer.tsx");

    expect(drawerSource).not.toContain("DrawerPrimitive");
    expect(drawerSource).toContain("SheetContent as DrawerContent");
  });
});
