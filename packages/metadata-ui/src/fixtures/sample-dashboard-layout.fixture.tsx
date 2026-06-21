import { DashboardLayout } from "../layouts/dashboard-layout.js";
import { sampleRenderContext } from "./sample-runtime-context.fixture.js";

export const sampleDashboardLayoutFixture = {
  identity: { id: "dashboard.main" },
  context: sampleRenderContext,
  element: (
    <DashboardLayout
      context={sampleRenderContext}
      identity={{ id: "dashboard.main" }}
      slots={{ content: <p>Dashboard content</p> }}
    />
  ),
} as const;
