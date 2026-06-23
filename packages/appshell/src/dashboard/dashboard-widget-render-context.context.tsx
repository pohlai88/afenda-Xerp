"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import {
  type DashboardWidgetRenderContext,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
} from "./dashboard-widget.contract";
import {
  hydrateDashboardWidgetRenderContext,
  type SerializableDashboardWidgetRenderContext,
} from "./dashboard-widget-render-context";

const DashboardWidgetRenderContextReactContext =
  createContext<DashboardWidgetRenderContext | null>(null);

export interface DashboardWidgetRenderContextProviderProps {
  readonly children: ReactNode;
  readonly value: SerializableDashboardWidgetRenderContext;
}

export function DashboardWidgetRenderContextProvider({
  children,
  value,
}: DashboardWidgetRenderContextProviderProps) {
  const hydrated = useMemo(
    () => hydrateDashboardWidgetRenderContext(value),
    [value]
  );

  return (
    <DashboardWidgetRenderContextReactContext.Provider value={hydrated}>
      {children}
    </DashboardWidgetRenderContextReactContext.Provider>
  );
}

export function useDashboardWidgetRenderContext(): DashboardWidgetRenderContext {
  const context = useContext(DashboardWidgetRenderContextReactContext);

  if (context === null) {
    return PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT;
  }

  return context;
}

export function useOptionalDashboardWidgetRenderContext(): DashboardWidgetRenderContext | null {
  return useContext(DashboardWidgetRenderContextReactContext);
}
