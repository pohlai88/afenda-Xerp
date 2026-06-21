import { MetadataPageSurface } from "../surfaces/metadata-page-surface.js";
import { sampleRenderContext } from "./sample-runtime-context.fixture.js";

export const samplePageSurfaceFixture = {
  id: "page.orders",
  title: "Orders",
  description: "Sample metadata page surface.",
  context: sampleRenderContext,
  element: (
    <MetadataPageSurface
      context={sampleRenderContext}
      id="page.orders"
      title="Orders"
      description="Sample metadata page surface."
    >
      <p>Page body</p>
    </MetadataPageSurface>
  ),
} as const;
