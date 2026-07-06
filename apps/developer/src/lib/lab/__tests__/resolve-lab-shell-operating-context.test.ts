import { describe, expect, it } from "vitest";
import { labDemoContextFixture } from "@/lib/lab/lab-demo-context";
import { resolveLabShellOperatingContext } from "@/lib/lab/resolve-lab-shell-operating-context.server";

describe("resolveLabShellOperatingContext", () => {
  it("returns demo-fixture authority with the static operating-context wire", async () => {
    await expect(resolveLabShellOperatingContext()).resolves.toEqual({
      authorityKind: "demo-fixture",
      erpPromotionPath:
        "apps/erp/src/lib/context/to-shell-operating-context-wire.ts",
      operatingContext: labDemoContextFixture,
    });
  });
});
