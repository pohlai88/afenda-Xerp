import type { ErrorPageVariant } from "@afenda/shadcn-studio/error-ui";

import {
  type ErrorPageCanonicalPath,
  getErrorPageSurfaceByPath,
} from "./error-page-surface.registry";

export function getErrorPageVariantForPath(
  path: ErrorPageCanonicalPath
): ErrorPageVariant {
  const surface = getErrorPageSurfaceByPath(path);

  if (surface === undefined) {
    throw new Error(`No error page surface registered for path: ${path}`);
  }

  return surface.variant;
}
