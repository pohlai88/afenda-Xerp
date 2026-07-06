import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, expectTypeOf, it } from "vitest";
import { studioPackageConfig } from "../configs/studio-config";
import { studioThemeConfig } from "../configs/theme-config";
import type { StudioContextValue } from "../contexts/studio-provider";
import { StudioProvider, useStudioContext } from "../contexts/studio-provider";
import type { StudioRuntimeState } from "../types/studio";
import type { StudioThemeConfig } from "../types/theme";

function StudioProbe() {
  const studio = useStudioContext();

  return (
    <output
      data-package={studio.packageConfig.packageName}
      data-theme={studio.themeConfig.defaultThemeId}
    >
      {studio.packageConfig.taxonomyVersion}
    </output>
  );
}

describe("StudioProvider", () => {
  it("renders children", () => {
    const markup = renderToStaticMarkup(
      <StudioProvider>
        <section data-testid="studio-child">Studio child</section>
      </StudioProvider>
    );

    expect(markup).toContain("Studio child");
    expect(markup).toContain('data-testid="studio-child"');
  });

  it("exposes default packageConfig", () => {
    const markup = renderToStaticMarkup(
      <StudioProvider>
        <StudioProbe />
      </StudioProvider>
    );

    expect(markup).toContain(
      `data-package="${studioPackageConfig.packageName}"`
    );
    expect(markup).toContain(studioPackageConfig.taxonomyVersion);
  });

  it("exposes default themeConfig", () => {
    const markup = renderToStaticMarkup(
      <StudioProvider>
        <StudioProbe />
      </StudioProvider>
    );

    expect(markup).toContain(
      `data-theme="${studioThemeConfig.defaultThemeId}"`
    );
  });

  it("accepts packageConfig override", () => {
    const packageConfig = {
      ...studioPackageConfig,
      defaultExportSurface: studioPackageConfig.defaultExportSurface,
    } satisfies typeof studioPackageConfig;
    const markup = renderToStaticMarkup(
      <StudioProvider packageConfig={packageConfig}>
        <StudioProbe />
      </StudioProvider>
    );

    expect(markup).toContain(`data-package="${packageConfig.packageName}"`);
  });

  it("accepts themeConfig override", () => {
    const themeConfig = {
      ...studioThemeConfig,
      defaultThemeId: "verdant-noir",
    } satisfies StudioThemeConfig;
    const markup = renderToStaticMarkup(
      <StudioProvider themeConfig={themeConfig}>
        <StudioProbe />
      </StudioProvider>
    );

    expect(markup).toContain('data-theme="verdant-noir"');
  });

  it("throws outside StudioProvider", () => {
    expect(() => renderToStaticMarkup(<StudioProbe />)).toThrow(
      "useStudioContext must be used within StudioProvider."
    );
  });

  it("returns context inside StudioProvider", () => {
    const markup = renderToStaticMarkup(
      <StudioProvider>
        <StudioProbe />
      </StudioProvider>
    );

    expect(markup).toContain('data-package="@afenda/shadcn-studio-v2"');
  });

  it("keeps StudioContextValue as the runtime state contract", () => {
    expectTypeOf<StudioContextValue>().toEqualTypeOf<StudioRuntimeState>();
  });
});
