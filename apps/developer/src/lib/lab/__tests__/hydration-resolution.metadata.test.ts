import { describe, expect, it } from "vitest";
import {
  developerThemeStorageKey,
  hydrationResolutionMethodIds,
  hydrationResolutionMethods,
  mountedGateHookName,
  mountedGateImportPath,
  runtimeSensitiveClientHooks,
} from "@/lib/lab/hydration-resolution.metadata";

describe("hydration resolution metadata", () => {
  it("declares the four governed resolution methods", () => {
    expect(hydrationResolutionMethodIds).toEqual([
      "layout-html-suppress",
      "theme-script-prehydrate",
      "mounted-gate",
      "element-suppress-hydration-warning",
    ]);
    expect(hydrationResolutionMethods).toHaveLength(4);
  });

  it("names runtime-sensitive hooks and mounted-gate import contract", () => {
    expect(runtimeSensitiveClientHooks).toContain("useTheme");
    expect(runtimeSensitiveClientHooks).toContain("useSettings");
    expect(mountedGateImportPath).toBe("@/lib/lab/use-mounted.client");
    expect(mountedGateHookName).toBe("useMounted");
    expect(developerThemeStorageKey).toBe("afenda-studio-v2-theme");
  });
});
