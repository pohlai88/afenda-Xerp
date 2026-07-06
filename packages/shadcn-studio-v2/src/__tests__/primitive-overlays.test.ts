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
import {
  getUiLaneSafetyViolations,
  readPackageSrcFile,
  readUiPrimitiveSource,
} from "./helpers/ui-primitive-inventory";

const OVERLAY_PRIMITIVES = [
  "dialog.tsx",
  "alert-dialog.tsx",
  "sheet.tsx",
  "drawer.tsx",
  "popover.tsx",
  "tooltip.tsx",
] as const;

describe("shadcn-studio-v2 overlay primitives", () => {
  it("keeps Lane A-05 overlay primitives in the registered ui lane", () => {
    for (const fileName of OVERLAY_PRIMITIVES) {
      const source = readUiPrimitiveSource(fileName);

      expect(getUiLaneSafetyViolations(source)).toEqual([]);
      expect(source).not.toContain("draggable");
      expect(source).not.toMatch(/\bresize\b/);
    }

    for (const fileName of OVERLAY_PRIMITIVES) {
      if (fileName === "drawer.tsx") {
        continue;
      }

      expect(readUiPrimitiveSource(fileName)).toContain('"use client"');
    }

    const dialogSource = readUiPrimitiveSource("dialog.tsx");
    const alertDialogSource = readUiPrimitiveSource("alert-dialog.tsx");
    const sheetSource = readUiPrimitiveSource("sheet.tsx");

    expect(dialogSource).toContain('from "./button"');
    expect(alertDialogSource).toContain('from "./button"');
    expect(sheetSource).toContain('from "./button"');
    expect(
      getUiLaneSafetyViolations(dialogSource, { forbidClientHooks: true })
    ).toEqual([]);
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
    const dialogSource = readUiPrimitiveSource("dialog.tsx");
    expect(dialogSource).toContain('data-slot="dialog"');
    expect(dialogSource).toContain('data-slot="dialog-content"');
    expect(dialogSource).toContain('data-slot="dialog-title"');
    expect(dialogSource).toContain('data-slot="dialog-description"');
    expect(dialogSource).toContain('data-slot="dialog-close-button"');
    expect(dialogSource).toContain("export function DialogContent");
    expect(dialogSource).toContain("export function dialogOverlayClassName");

    const alertDialogSource = readUiPrimitiveSource("alert-dialog.tsx");
    expect(alertDialogSource).toContain('data-slot="alert-dialog"');
    expect(alertDialogSource).toContain('data-slot="alert-dialog-content"');
    expect(alertDialogSource).toContain('data-slot="alert-dialog-action"');
    expect(alertDialogSource).toContain('data-slot="alert-dialog-cancel"');

    const sheetSource = readUiPrimitiveSource("sheet.tsx");
    expect(sheetSource).toContain('data-slot="sheet"');
    expect(sheetSource).toContain('data-slot="sheet-content"');
    expect(sheetSource).toContain('data-slot="sheet-title"');
    expect(sheetSource).toContain("export function sheetContentClassName");

    const drawerSource = readUiPrimitiveSource("drawer.tsx");
    expect(drawerSource).toContain('from "./sheet"');
    expect(drawerSource).toContain("Sheet as Drawer");

    const popoverSource = readUiPrimitiveSource("popover.tsx");
    expect(popoverSource).toContain('data-slot="popover"');
    expect(popoverSource).toContain('data-slot="popover-content"');
    expect(popoverSource).toContain('data-slot="popover-trigger"');

    const tooltipSource = readUiPrimitiveSource("tooltip.tsx");
    expect(tooltipSource).toContain('data-slot="tooltip"');
    expect(tooltipSource).toContain('data-slot="tooltip-content"');
    expect(tooltipSource).toContain('data-slot="tooltip-provider"');
    expect(tooltipSource).toContain('data-slot="tooltip-arrow"');
  });

  it("keeps overlay exports on neutral index and off server surface", () => {
    const indexSource = readPackageSrcFile("index.ts");
    const serverSource = readPackageSrcFile("server.ts");

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
    const drawerSource = readUiPrimitiveSource("drawer.tsx");

    expect(drawerSource).not.toContain("DrawerPrimitive");
    expect(drawerSource).toContain("SheetContent as DrawerContent");
  });
});
