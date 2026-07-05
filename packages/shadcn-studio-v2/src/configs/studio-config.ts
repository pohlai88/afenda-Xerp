import type { StudioPackageConfig } from "../types/studio";

export const studioPackageConfig = {
  packageName: "@afenda/shadcn-studio-v2",
  taxonomyVersion: "v2",
  defaultExportSurface: "neutral",
  runtimeBoundary: "client-runtime",
} satisfies StudioPackageConfig;
