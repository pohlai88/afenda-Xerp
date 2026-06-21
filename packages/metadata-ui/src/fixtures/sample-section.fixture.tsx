import { ListSection } from "../sections/list-section.js";
import { sampleRenderContext } from "./sample-runtime-context.fixture.js";

export const sampleSectionFixture = {
  identity: {
    id: "section.orders.list",
    title: "Orders",
    description: "Recent orders",
  },
  context: sampleRenderContext,
  element: (
    <ListSection
      context={sampleRenderContext}
      identity={{
        id: "section.orders.list",
        title: "Orders",
        description: "Recent orders",
      }}
      slots={{ content: null }}
    />
  ),
} as const;
