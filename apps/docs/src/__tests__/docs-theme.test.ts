import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  docsFumadocsThemeImports,
  docsLayoutVariables,
  docsProseAccentCssVariables,
  docsProseAccentValues,
  docsSpacingRoles,
  docsSpacingScale,
  docsSpacingStylesheet,
  docsSurfaceVariables,
  docsTypographyRoleClasses,
  docsTypographyScale,
  docsTypographyStylesheet,
  docsTypographyVariables,
} from "@/lib/docs-editorial-palette.contract";
import {
  docsFontVariableLiterals,
  docsFontVariables,
} from "@/lib/docs-fonts.constants";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const docsAppRoot = join(testDirectory, "../..");

function readDocsFile(relativePath: string): string {
  return readFileSync(join(docsAppRoot, relativePath), "utf8");
}

describe("@afenda/docs theme", () => {
  it("exposes editorial font CSS variable contract for the root layout", () => {
    expect(docsFontVariables.body).toBe("--font-docs-body");
    expect(docsFontVariables.display).toBe("--font-docs-display");
  });

  it("keeps docs-fonts.ts loader variable literals aligned with constants", () => {
    const loaderSource = readDocsFile("src/lib/docs-fonts.ts");

    for (const variable of docsFontVariableLiterals) {
      expect(loaderSource).toContain(`variable: "${variable}"`);
    }
  });

  it("references font variables from editorial palette stacks", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    for (const variable of docsFontVariableLiterals) {
      expect(paletteCss).toContain(`var(${variable})`);
    }
  });

  it("does not import Afenda design-system tokens into globals.css", () => {
    const globalsCss = readDocsFile("src/app/globals.css");

    expect(globalsCss).not.toContain("@afenda/design-system");
    expect(globalsCss).not.toContain("afenda-tokens.css");
  });

  it("imports Fumadocs solar theme CSS before Afenda overrides", () => {
    const globalsCss = readDocsFile("src/app/globals.css");
    const paletteImport = globalsCss.indexOf("./docs-editorial-palette.css");

    for (const themeImport of docsFumadocsThemeImports) {
      expect(globalsCss).toContain(themeImport);
      expect(globalsCss.indexOf(themeImport)).toBeLessThan(paletteImport);
    }
  });

  it("sets Fumadocs layout width and UI-first prose typography", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");
    const globalsCss = readDocsFile("src/app/globals.css");

    expect(paletteCss).toContain(
      `${docsLayoutVariables.layoutWidth}: ${docsLayoutVariables.layoutWidthValue}`
    );
    for (const { variable, value } of Object.values(docsTypographyScale)) {
      expect(paletteCss).toContain(`${variable}: ${value}`);
    }
    expect(paletteCss).toContain(
      `${docsTypographyVariables.base}: ${docsTypographyVariables.baseValue}`
    );
    expect(paletteCss).toContain(
      `${docsTypographyVariables.display}: ${docsTypographyVariables.displayValue}`
    );
    expect(globalsCss).toContain("#nd-page .prose");
    expect(globalsCss).toContain(
      `max-width: var(${docsTypographyVariables.proseMaxWidth})`
    );
  });

  it("caps tab panel headings so content never exceeds UI chrome", () => {
    const globalsCss = readDocsFile("src/app/globals.css");

    expect(globalsCss).toContain('[role="tabpanel"]');
    expect(globalsCss).toContain("var(--docs-text-ui)");
  });

  it("normalizes page and prose spacing with enterprise quiet roles", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");
    const spacingCss = readDocsFile(`src/app/${docsSpacingStylesheet.slice(2)}`);
    const globalsCss = readDocsFile("src/app/globals.css");

    for (const { variable, value } of Object.values(docsSpacingScale)) {
      expect(paletteCss).toContain(`${variable}: ${value}`);
    }
    for (const { variable, mapsTo } of Object.values(docsSpacingRoles)) {
      if (mapsTo) {
        expect(paletteCss).toContain(`${variable}: var(${mapsTo})`);
      }
    }
    expect(paletteCss).toContain("--docs-divider:");
    expect(paletteCss).toContain("--docs-callout-surface:");
    expect(paletteCss).toContain("--docs-callout-accent:");
    expect(globalsCss).toContain(docsSpacingStylesheet);
    expect(spacingCss).toContain("gap: var(--docs-gap-chrome)");
    expect(spacingCss).toContain("gap: var(--docs-gap-block)");
    expect(spacingCss).toContain(".docs-page-actions");
    expect(spacingCss).toContain(".docs-feedback-text");
    expect(globalsCss).toContain("scroll-margin-top");
  });

  it("imports editorial typography roles after palette tokens", () => {
    const globalsCss = readDocsFile("src/app/globals.css");
    const typographyCss = readDocsFile(`src/app/${docsTypographyStylesheet.slice(2)}`);
    const paletteImport = globalsCss.indexOf("./docs-editorial-palette.css");
    const typographyImport = globalsCss.indexOf(docsTypographyStylesheet);

    expect(typographyImport).toBeGreaterThan(paletteImport);
    expect(globalsCss).toContain(docsTypographyStylesheet);
    expect(typographyCss).toContain(`.${docsTypographyRoleClasses.display}`);
    expect(typographyCss).toContain(`.${docsTypographyRoleClasses.summary}`);
    expect(typographyCss).toContain(`.${docsTypographyRoleClasses.deck}`);
  });

  it("does not re-bridge the full fd token set in Afenda overrides", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    expect(paletteCss).not.toContain("@theme inline");
    expect(paletteCss).not.toContain("--color-fd-background:");
    expect(paletteCss).not.toContain("--color-fd-primary:");
  });

  it("pins prose brand accent as docs-owned OKLCH without Afenda token aliases", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    expect(paletteCss).toContain(
      `${docsProseAccentCssVariables.default}: ${docsProseAccentValues.light.default}`
    );
    expect(paletteCss).toContain(
      `${docsProseAccentCssVariables.hover}: ${docsProseAccentValues.light.hover}`
    );
    expect(paletteCss).not.toContain("--afenda-semantic-brand");
    expect(paletteCss).not.toContain("--afenda-color-primary");
  });

  it("overrides prose accent in dark mode for readable H254", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");
    const darkBlock = paletteCss.slice(paletteCss.indexOf(".dark {"));

    expect(darkBlock).toContain(
      `${docsProseAccentCssVariables.default}: ${docsProseAccentValues.dark.default}`
    );
    expect(darkBlock).toContain(
      `${docsProseAccentCssVariables.hover}: ${docsProseAccentValues.dark.hover}`
    );
  });

  it("scopes brand accent to prose links in globals.css", () => {
    const globalsCss = readDocsFile("src/app/globals.css");

    expect(globalsCss).toContain(`var(${docsProseAccentCssVariables.default})`);
    expect(globalsCss).toContain(`var(${docsProseAccentCssVariables.hover})`);
    expect(globalsCss).toContain("#nd-page .prose a");
  });

  it("ships editorial noise and illustration surface layers", () => {
    const surfaceCss = readDocsFile("src/app/docs-editorial-surface.css");
    const globalsCss = readDocsFile("src/app/globals.css");

    expect(globalsCss).toContain("./docs-editorial-surface.css");
    expect(globalsCss).toContain("./docs-luxury-shell.css");
    expect(surfaceCss).toContain("body::before");
    expect(surfaceCss).toContain("body::after");
    expect(surfaceCss).toContain(docsSurfaceVariables.noiseOpacity);
    expect(surfaceCss).toContain(docsSurfaceVariables.illustrationOpacity);
    expect(surfaceCss).toContain("feTurbulence");
  });

  it("uses fd tokens for block feedback highlight", () => {
    const globalsCss = readDocsFile("src/app/globals.css");

    expect(globalsCss).toContain("var(--color-fd-primary)");
    expect(globalsCss).toContain("var(--color-fd-primary-foreground)");
  });

  it("maps editorial blocks to fd tokens in docs-editorial-blocks.css", () => {
    const blocksCss = readDocsFile("src/app/docs-editorial-blocks.css");

    expect(blocksCss).toContain(
      "--docs-editorial-block-canvas: var(--color-fd-background)"
    );
    expect(blocksCss).toContain(
      "--docs-editorial-block-accent: var(--docs-prose-accent)"
    );
  });
});
