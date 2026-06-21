import type { MetadataSurfaceProps } from "../contracts/surface-renderer.contract.js";
import { MetadataSurface } from "./metadata-surface.js";

export type MetadataPageSurfaceProps = Omit<MetadataSurfaceProps, "type">;

export function MetadataPageSurface(props: MetadataPageSurfaceProps) {
  return <MetadataSurface {...props} type="page" />;
}

export type MetadataWorkspaceSurfaceProps = Omit<MetadataSurfaceProps, "type">;

export function MetadataWorkspaceSurface(props: MetadataWorkspaceSurfaceProps) {
  return <MetadataSurface {...props} type="workspace" />;
}

export type MetadataModuleSurfaceProps = Omit<MetadataSurfaceProps, "type">;

export function MetadataModuleSurface(props: MetadataModuleSurfaceProps) {
  return <MetadataSurface {...props} type="module" />;
}

export type { MetadataSurfaceProps } from "../contracts/surface-renderer.contract.js";
