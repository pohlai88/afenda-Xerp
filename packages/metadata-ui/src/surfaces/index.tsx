import type { SurfaceType } from "@afenda/ui-composition";

import type { MetadataSpecificSurfaceProps } from "../contracts/surface.contract.js";
import { MetadataSurface } from "./metadata-surface.js";

export type {
  MetadataModuleSurfaceProps,
  MetadataPageSurfaceProps,
  MetadataSpecificSurfaceProps,
  MetadataSurfaceProps,
  MetadataWorkspaceSurfaceProps,
} from "../contracts/surface.contract.js";
export { MetadataSurface } from "./metadata-surface.js";

const PAGE_SURFACE_TYPE = "page" satisfies SurfaceType;
const WORKSPACE_SURFACE_TYPE = "workspace" satisfies SurfaceType;
const MODULE_SURFACE_TYPE = "module" satisfies SurfaceType;

export function MetadataPageSurface(props: MetadataSpecificSurfaceProps) {
  return <MetadataSurface {...props} type={PAGE_SURFACE_TYPE} />;
}

export function MetadataWorkspaceSurface(props: MetadataSpecificSurfaceProps) {
  return <MetadataSurface {...props} type={WORKSPACE_SURFACE_TYPE} />;
}

export function MetadataModuleSurface(props: MetadataSpecificSurfaceProps) {
  return <MetadataSurface {...props} type={MODULE_SURFACE_TYPE} />;
}
