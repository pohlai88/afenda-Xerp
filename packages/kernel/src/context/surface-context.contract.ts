import { normalizeRuntimeModulePath } from "./runtime-module-path.js";

/** Dot-separated module path — runtime metadata scope, not a database entity. */
export type SurfaceId = string;

export interface SurfaceContext {
  readonly surfaceId: SurfaceId;
}

export function parseSurfaceId(
  value: string | null | undefined
): SurfaceId | null {
  return normalizeRuntimeModulePath(value);
}

export function toSurfaceContext(
  surfaceId: SurfaceId | null | undefined
): SurfaceContext | null {
  const parsed = parseSurfaceId(surfaceId);
  return parsed ? { surfaceId: parsed } : null;
}
