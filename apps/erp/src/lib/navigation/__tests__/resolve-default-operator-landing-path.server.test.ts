import type { OperatingContext } from "@afenda/kernel";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/navigation/resolve-shell-nav.server", () => ({
  resolveShellNavGroups: vi.fn(),
}));

import { resolveDefaultOperatorLandingPath } from "@/lib/navigation/resolve-default-operator-landing-path.server";
import { resolveShellNavGroups } from "@/lib/navigation/resolve-shell-nav.server";

const operatingContext = {} as OperatingContext;

describe("resolveDefaultOperatorLandingPath", () => {
  it("returns the first nav item href across permission-filtered groups", async () => {
    vi.mocked(resolveShellNavGroups).mockResolvedValue([
      {
        id: "platform",
        label: "Platform",
        items: [
          {
            href: "/metadata-workspace",
            id: "metadata-workspace",
            label: "Metadata Workspace",
          },
        ],
      },
      {
        id: "procurement",
        label: "Procurement",
        items: [
          {
            href: "/modules/procurement/readiness",
            id: "modules.procurement.readiness",
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
    vi.mocked(resolveShellNavGroups).mockResolvedValue([]);

    await expect(
      resolveDefaultOperatorLandingPath(operatingContext)
    ).resolves.toBeNull();
  });
});
