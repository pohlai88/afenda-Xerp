"use client";

import { resolveStudioBlockComponent } from "@afenda/shadcn-studio";

import { resolveDashboardWidgetBlockId } from "@/lib/workspace/dashboard-widget-bridge.registry";
import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";

export interface DashboardLayoutRendererProps {
  readonly layout: DashboardLayoutPresetDto;
}

export function DashboardLayoutRenderer({
  layout,
}: DashboardLayoutRendererProps) {
  return (
    <section
      aria-label="Workspace dashboard grid"
      className="grid gap-4"
      style={{
        gridAutoRows: `${layout.rowHeight}px`,
        gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
      }}
    >
      {layout.items.map((item) => {
        const blockId = resolveDashboardWidgetBlockId(item.i);

        if (blockId === undefined) {
          return null;
        }

        const Block = resolveStudioBlockComponent(blockId);

        if (Block === undefined) {
          return null;
        }

        return (
          <div
            className="min-h-0"
            key={item.i}
            style={{
              gridColumn: `${item.x + 1} / span ${item.w}`,
              gridRow: `${item.y + 1} / span ${item.h}`,
            }}
          >
            <Block />
          </div>
        );
      })}
    </section>
  );
}
