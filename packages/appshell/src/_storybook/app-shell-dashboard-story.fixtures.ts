import type { ApplicationShellDashboardDemoProps } from "../dashboard";
import { DEFAULT_APP_SHELL_DASHBOARD_LABEL } from "../presentation/data/app-shell.dashboard.data";
import {
  FINANCE_DENIED_BLOCK_STORY_RENDER_CONTEXT,
  PERMISSIVE_BLOCK_STORY_RENDER_CONTEXT,
} from "./dashboard-block-story.fixtures";

export const DASHBOARD_STORY_BASE_ARGS = {
  dashboardLabel: DEFAULT_APP_SHELL_DASHBOARD_LABEL,
  renderContext: PERMISSIVE_BLOCK_STORY_RENDER_CONTEXT,
} satisfies ApplicationShellDashboardDemoProps;

export const MODERN_DASHBOARD_ARGS = {
  ...DASHBOARD_STORY_BASE_ARGS,
} satisfies ApplicationShellDashboardDemoProps;

export const FINANCE_DASHBOARD_ARGS = {
  dashboardLabel: "Finance control tower",
  renderContext: PERMISSIVE_BLOCK_STORY_RENDER_CONTEXT,
} satisfies ApplicationShellDashboardDemoProps;

export const FINANCE_GATED_DASHBOARD_ARGS = {
  ...DASHBOARD_STORY_BASE_ARGS,
  renderContext: FINANCE_DENIED_BLOCK_STORY_RENDER_CONTEXT,
} satisfies ApplicationShellDashboardDemoProps;
