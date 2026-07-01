import type { OperatingContext } from "@afenda/kernel";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/navigation/resolve-app-shell-nav.server", () => ({
  resolveAppShellNavGroups: vi.fn(),
}));

import { resolveAppShellNavGroups } from "@/lib/navigation/resolve-app-shell-nav.server";
import { resolveDefaultOperatorLandingPath } from "@/lib/navigation/resolve-default-operator-landing-path.server";

const operatingContext = {} as OperatingContext;

describe("resolveDefaultOperatorLandingPath", () => {
  it("returns the first nav item href across permission-filtered groups", async () => {
    vi.mocked(resolveAppShellNavGroups).mockResolvedValue([
      {
        label: "Platform",
        items: [{ href: "/metadata-workspace", label: "Metadata Workspace" }],
      },
      {
        label: "Procurement",
        items: [
          {
            href: "/modules/procurement/readiness",
            label: "Foundation Readiness",
          },
        ],
      },
    ]);

    await expect(
      resolveDefaultOperatorLandingPath(operatingContext)
    ).resolves.toBe("/metadata-workspace");
  });

  it("returns null when no nav groups remain after permission filtering", async () => {
    vi.mocked(resolveAppShellNavGroups).mockResolvedValue([]);

    await expect(
      resolveDefaultOperatorLandingPath(operatingContext)
    ).resolves.toBeNull();
  });
});
