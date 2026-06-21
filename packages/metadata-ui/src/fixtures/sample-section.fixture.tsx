import { ListSection } from "../sections/list-section.js";
import { sampleRenderContext } from "./sample-runtime-context.fixture.js";

export const sampleSectionFixture = {
  id: "section.orders.list",
  context: sampleRenderContext,
  element: (
    <ListSection
      context={sampleRenderContext}
      description="Recent orders"
      id="section.orders.list"
      title="Orders"
    />
  ),
} as const;
