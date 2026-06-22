"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import {
  hydrateDashboardWidgetRenderContext,
  type SerializableDashboardWidgetRenderContext,
} from "./dashboard-widget-render-context";
import {
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
  type DashboardWidgetRenderContext,
} from "./dashboard-widget.contract";

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
    [value.capabilities, value.featureFlags, value.permissions]
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
