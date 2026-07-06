"use client";

import { resolveStudioBlockComponent } from "@/lib/metadata/resolve-studio-block-component.client";
import { resolveDashboardWidgetBlockId } from "@/lib/workspace/dashboard-widget-bridge.registry";
import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";
import { useCallback, useEffect, useMemo, useState } from "react";
import GridLayout, {
  type Layout,
  useContainerWidth,
  verticalCompactor,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";

import {
  formatWidgetTitle,
  toDashboardLayoutPreset,
  toGridLayoutItems,
} from "./workspace-board-layout.utils";
import {
  WORKSPACE_BOARD_DRAG_HANDLE_CLASS,
  WorkspaceBoardWidgetFrame,
} from "./workspace-board-widget-frame.client";

export interface WorkspaceBoardCanvasClientProps {
  readonly editable: boolean;
  readonly layout: DashboardLayoutPresetDto;
  readonly onLayoutChange?: (layout: DashboardLayoutPresetDto) => void;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  return prefersReducedMotion;
}

export function WorkspaceBoardCanvasClient({
  editable,
  layout,
  onLayoutChange,
}: WorkspaceBoardCanvasClientProps) {
  const { containerRef, mounted, width } = useContainerWidth();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [gridLayout, setGridLayout] = useState<Layout>(() =>
    toGridLayoutItems(layout)
  );

  useEffect(() => {
    setGridLayout(toGridLayoutItems(layout));
  }, [layout]);

  const handleLayoutChange = useCallback(
    (nextLayout: Layout) => {
      setGridLayout(nextLayout);
      onLayoutChange?.(toDashboardLayoutPreset(layout, nextLayout));
    },
    [layout, onLayoutChange]
  );

  const gridClassName = useMemo(() => {
    const classes = ["workspace-board-grid"];

    if (prefersReducedMotion) {
      classes.push(
        "[&_.react-grid-item]:!transition-none [&_.react-resizable-handle]:!transition-none"
      );
    }

    if (editable) {
      classes.push("workspace-board-grid--editable");
    }

    return classes.join(" ");
  }, [editable, prefersReducedMotion]);

  return (
    <section
      aria-label="Workspace board canvas"
      className={gridClassName}
      data-workspace-board-editable={editable ? "true" : "false"}
      ref={containerRef}
    >
      {mounted ? (
        <GridLayout
          className="layout"
          compactor={verticalCompactor}
          dragConfig={{
            enabled: editable,
            handle: `.${WORKSPACE_BOARD_DRAG_HANDLE_CLASS}`,
          }}
          gridConfig={{
            cols: layout.columns,
            containerPadding: [0, 0],
            margin: [16, 16],
            rowHeight: layout.rowHeight,
          }}
          layout={gridLayout}
          onLayoutChange={handleLayoutChange}
          resizeConfig={{
            enabled: editable,
            handles: editable ? ["se"] : [],
          }}
          width={width}
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
              <div key={item.i}>
                <WorkspaceBoardWidgetFrame
                  editable={editable}
                  title={formatWidgetTitle(item.i)}
                  widgetKey={item.i}
                >
                  <Block />
                </WorkspaceBoardWidgetFrame>
              </div>
            );
          })}
        </GridLayout>
      ) : null}
    </section>
  );
}
