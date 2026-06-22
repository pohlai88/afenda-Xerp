"use client";

import {
  applyDashboardWidgetRenderContextPreview,
  useDashboardWidgetRenderContext,
  type DashboardWidgetRenderContextPreviewMode,
} from "@afenda/appshell";
import { useMemo, useState } from "react";

import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

export type DashboardWidgetRbacPreviewControlsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

export interface DashboardWidgetRbacPreviewControlsProps {
  readonly previewMode: DashboardWidgetRenderContextPreviewMode;
  readonly onPreviewModeChange: (
    mode: DashboardWidgetRenderContextPreviewMode
  ) => void;
}

export function DashboardWidgetRbacPreviewControls({
  previewMode,
  onPreviewModeChange,
}: DashboardWidgetRbacPreviewControlsProps) {
  return (
    <div className="app-shell-page-actions">
      <Button
        emphasis={previewMode === "server" ? "solid" : "outline"}
        intent={previewMode === "server" ? "primary" : "secondary"}
        onClick={() => {
          onPreviewModeChange("server");
        }}
        size="sm"
      >
        Server RBAC
      </Button>
      <Button
        emphasis={previewMode === "full" ? "solid" : "outline"}
        intent={previewMode === "full" ? "primary" : "secondary"}
        onClick={() => {
          onPreviewModeChange("full");
        }}
        size="sm"
      >
        Full access
      </Button>
      <Button
        emphasis={previewMode === "finance-only" ? "solid" : "outline"}
        intent={previewMode === "finance-only" ? "primary" : "secondary"}
        onClick={() => {
          onPreviewModeChange("finance-only");
        }}
        size="sm"
      >
        Finance only
      </Button>
      <Button
        emphasis={previewMode === "restricted" ? "solid" : "outline"}
        intent={previewMode === "restricted" ? "primary" : "secondary"}
        onClick={() => {
          onPreviewModeChange("restricted");
        }}
        size="sm"
      >
        Restricted
      </Button>
    </div>
  );
}

export function useDashboardWidgetRenderContextPreview(
  showPreviewControls: boolean
): {
  readonly previewMode: DashboardWidgetRenderContextPreviewMode;
  readonly renderContext: ReturnType<typeof applyDashboardWidgetRenderContextPreview>;
  readonly setPreviewMode: (mode: DashboardWidgetRenderContextPreviewMode) => void;
} {
  const serverContext = useDashboardWidgetRenderContext();
  const [previewMode, setPreviewMode] =
    useState<DashboardWidgetRenderContextPreviewMode>("server");

  const renderContext = useMemo(() => {
    if (!showPreviewControls) {
      return serverContext;
    }

    return applyDashboardWidgetRenderContextPreview(serverContext, previewMode);
  }, [previewMode, serverContext, showPreviewControls]);

  return {
    previewMode,
    renderContext,
    setPreviewMode,
  };
}
