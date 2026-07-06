// @vitest-environment jsdom

import { StudioPresentationProviders } from "@afenda/shadcn-studio-v2/clients";
import { render } from "@afenda/testing/react";
import { describe, expect, it } from "vitest";
import type { SurfaceTemplateClass } from "../metadata-studio.contract";
import { SURFACE_TEMPLATE_REGISTRY } from "../metadata-surface-template.registry";
import {
  getStudioBlockViewKind,
  resolveStudioBlockComponent,
  type StudioBlockViewKind,
} from "../resolve-studio-block-component.client";

const VIEW_KIND_ROOT_SLOT: Record<StudioBlockViewKind, string> = {
  "auth-shell": "auth-shell",
  "confirm-dialog": "confirm-dialog-surface",
  datatable: "data-table-surface",
  "evidence-widget": "evidence-widget",
  form: "form-surface",
  "metric-widget": "metric-widget",
  page: "page-surface",
  settings: "settings-surface",
};

function collectSurfaceTemplateBlockIds(): string[] {
  const blockIds = new Set<string>();

  for (const template of SURFACE_TEMPLATE_REGISTRY) {
    for (const binding of template.blockBindings) {
      blockIds.add(binding.blockId);
    }
  }

  return [...blockIds].sort();
}

function expectedViewKindForSurfaceTemplate(input: {
  readonly blockId: string;
  readonly templateClass: SurfaceTemplateClass;
}): StudioBlockViewKind {
  if (input.blockId === "dialog-activity") {
    return "confirm-dialog";
  }

  switch (input.templateClass) {
    case "settings":
      return "settings";
    case "table":
      return "datatable";
    case "dashboard": {
      if (
        input.blockId.startsWith("statistics-") ||
        input.blockId.startsWith("chart-")
      ) {
        return "metric-widget";
      }

      if (input.blockId.startsWith("widget-")) {
        return "evidence-widget";
      }

      return "page";
    }
    case "form":
      return "auth-shell";
    default:
      return input.templateClass satisfies never;
  }
}

describe("resolve-studio-block-component registry parity (F5)", () => {
  it("resolves every SURFACE_TEMPLATE_REGISTRY blockId", () => {
    for (const blockId of collectSurfaceTemplateBlockIds()) {
      expect(resolveStudioBlockComponent(blockId)).toBeDefined();
    }
  });

  it("maps every surface template blockId to the expected v2 view kind", () => {
    for (const template of SURFACE_TEMPLATE_REGISTRY) {
      for (const binding of template.blockBindings) {
        expect(getStudioBlockViewKind(binding.blockId)).toBe(
          expectedViewKindForSurfaceTemplate({
            blockId: binding.blockId,
            templateClass: template.templateClass,
          })
        );
      }
    }
  });

  it("renders v2 root data-slot markers for representative surface classes", () => {
    const samples: Array<{
      readonly blockId: string;
      readonly viewKind: StudioBlockViewKind;
    }> = [
      { blockId: "account-settings-01", viewKind: "settings" },
      { blockId: "datatable-invoice", viewKind: "datatable" },
      { blockId: "dialog-activity", viewKind: "confirm-dialog" },
      { blockId: "login-page-04", viewKind: "auth-shell" },
      { blockId: "statistics-card-01", viewKind: "metric-widget" },
      { blockId: "hero-section-01", viewKind: "page" },
    ];

    for (const sample of samples) {
      const Component = resolveStudioBlockComponent(sample.blockId);

      if (Component === undefined) {
        throw new Error(`${sample.blockId} must resolve`);
      }

      const { container } = render(
        <StudioPresentationProviders>
          <Component />
        </StudioPresentationProviders>
      );
      const rootSlot = VIEW_KIND_ROOT_SLOT[sample.viewKind];

      expect(
        container.querySelector(`[data-slot='${rootSlot}']`)
      ).not.toBeNull();
      expect(getStudioBlockViewKind(sample.blockId)).toBe(sample.viewKind);
    }
  });
});

describe("surface template registry gap table (F5 inventory)", () => {
  it("documents registry block coverage", () => {
    const rows = SURFACE_TEMPLATE_REGISTRY.flatMap((template) =>
      template.blockBindings.map((binding) => ({
        blockId: binding.blockId,
        resolved: resolveStudioBlockComponent(binding.blockId) !== undefined,
        templateClass: template.templateClass,
        viewKind: getStudioBlockViewKind(binding.blockId),
      }))
    );

    expect(rows.every((row) => row.resolved)).toBe(true);
    expect(rows).toHaveLength(collectSurfaceTemplateBlockIds().length);
  });
});
