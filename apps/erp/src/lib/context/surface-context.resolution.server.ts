import type { SurfaceContext, SurfaceId } from "@afenda/kernel";

import { normalizeRuntimeModulePath } from "./runtime-module-path.server";

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
