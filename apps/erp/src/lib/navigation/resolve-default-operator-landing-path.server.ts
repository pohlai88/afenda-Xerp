import type { OperatingContext } from "@afenda/kernel";

import { resolveShellNavGroups } from "@/lib/navigation/resolve-shell-nav.server";

/**
 * First permission-filtered operator surface for post-auth landing.
 * Mirrors protected shell nav order — not a hardcoded demo dashboard path.
 */
export async function resolveDefaultOperatorLandingPath(
  operatingContext: OperatingContext
): Promise<string | null> {
  const groups = await resolveShellNavGroups(operatingContext);

  for (const group of groups) {
    const firstItem = group.items[0];
    if (firstItem !== undefined) {
      return firstItem.href;
    }
  }

  return null;
}
