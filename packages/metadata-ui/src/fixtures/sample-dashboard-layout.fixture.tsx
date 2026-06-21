import { DashboardLayout } from "../layouts/dashboard-layout.js";
import { sampleRenderContext } from "./sample-runtime-context.fixture.js";

export const sampleDashboardLayoutFixture = {
  id: "dashboard.main",
  context: sampleRenderContext,
  element: (
    <DashboardLayout context={sampleRenderContext} id="dashboard.main">
      <p>Dashboard content</p>
    </DashboardLayout>
  ),
} as const;
