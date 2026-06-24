import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  docsEditorialCssVariables,
  docsEditorialPrimitiveNames,
  docsEditorialPrimitiveValues,
  docsLayoutVariables,
  docsProseAccentValues,
  docsShellChromeSelectors,
  docsShellFdBridge,
} from "@/lib/docs-editorial-palette.contract";
import {
  docsFontVariableLiterals,
  docsFontVariables,
} from "@/lib/docs-fonts.constants";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const docsAppRoot = join(testDirectory, "../..");

const rootFdHardcodePattern = /:root\s*\{[^}]*--color-fd-/;
const darkFdHardcodePattern = /\.dark\s*\{[^}]*--color-fd-/;

function readDocsFile(relativePath: string): string {
  return readFileSync(join(docsAppRoot, relativePath), "utf8");
}

function cssVarName(
  primitive: (typeof docsEditorialPrimitiveNames)[number]
): string {
  return `--docs-editorial-${primitive}`;
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

  it("references font variables from globals.css stacks", () => {
    const globalsCss = readDocsFile("src/app/globals.css");

    for (const variable of docsFontVariableLiterals) {
      expect(globalsCss).toContain(`var(${variable})`);
    }
  });

  it("does not import Afenda design-system tokens into globals.css", () => {
    const globalsCss = readDocsFile("src/app/globals.css");

    expect(globalsCss).not.toContain("@afenda/design-system");
    expect(globalsCss).not.toContain("afenda-tokens.css");
  });

  it("sets Fumadocs layout width and editorial prose max-width", () => {
    const globalsCss = readDocsFile("src/app/globals.css");

    expect(globalsCss).toContain(
      `${docsLayoutVariables.layoutWidth}: ${docsLayoutVariables.layoutWidthValue}`
    );
    expect(globalsCss).toContain(
      `max-width: ${docsLayoutVariables.proseMaxWidth}`
    );
  });

  it("wires Fumadocs fd tokens through @theme inline to editorial vars", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    expect(paletteCss).toContain("@theme inline {");

    for (const [fdToken, editorialVar] of Object.entries(docsShellFdBridge)) {
      expect(paletteCss).toContain(`${fdToken}: var(${editorialVar})`);
    }
  });

  it("maps fd-primary to neutral shell text, not brand accent or search surface", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    expect(paletteCss).toContain(
      `--color-fd-primary: var(${docsEditorialCssVariables.text})`
    );
    expect(paletteCss).not.toContain(
      `--color-fd-primary: var(${docsEditorialCssVariables.proseAccent})`
    );
    expect(paletteCss).not.toContain(
      `--color-fd-primary: var(${docsEditorialCssVariables.searchSurface})`
    );
  });

  it("maps fd-card and fd-popover to paper material", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    expect(paletteCss).toContain(
      `--color-fd-card: var(${docsEditorialCssVariables.paper})`
    );
    expect(paletteCss).toContain(
      `--color-fd-popover: var(${docsEditorialCssVariables.paper})`
    );
  });

  it("pins prose brand accent as docs-owned OKLCH without Afenda token aliases", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    expect(paletteCss).toContain(
      `--docs-editorial-prose-accent: ${docsProseAccentValues.light.default}`
    );
    expect(paletteCss).toContain(
      `--docs-editorial-prose-accent-hover: ${docsProseAccentValues.light.hover}`
    );
    expect(paletteCss).not.toContain("--afenda-semantic-brand");
    expect(paletteCss).not.toContain("--afenda-color-primary");
  });

  it("overrides prose accent in dark mode for readable H254 on graphite", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");
    const darkBlock = paletteCss.slice(paletteCss.indexOf(".dark {"));

    expect(darkBlock).toContain(
      `--docs-editorial-prose-accent: ${docsProseAccentValues.dark.default}`
    );
    expect(darkBlock).toContain(
      `--docs-editorial-prose-accent-hover: ${docsProseAccentValues.dark.hover}`
    );
  });

  it("keeps every docsEditorialPrimitiveNames entry present in palette CSS", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    for (const primitive of docsEditorialPrimitiveNames) {
      expect(paletteCss).toContain(cssVarName(primitive));
    }
  });

  it("mirrors light and dark OKLCH literals in contract and CSS", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    for (const [key, value] of Object.entries(
      docsEditorialPrimitiveValues.light
    )) {
      const cssKey = key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
      expect(paletteCss).toContain(`--docs-editorial-${cssKey}: ${value}`);
    }

    for (const [key, value] of Object.entries(
      docsEditorialPrimitiveValues.dark
    )) {
      const cssKey = key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
      const darkBlock = paletteCss.slice(paletteCss.indexOf(".dark {"));
      expect(darkBlock).toContain(`--docs-editorial-${cssKey}: ${value}`);
    }
  });

  it("styles FullSearchTrigger with paper surface and kbd contrast", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    expect(paletteCss).toContain(docsShellChromeSelectors.searchFull);
    expect(paletteCss).toContain(docsShellChromeSelectors.searchKbd);
    expect(paletteCss).toContain(
      `--docs-editorial-search-surface: var(${docsEditorialCssVariables.paper})`
    );
    expect(paletteCss).toContain(
      `--docs-editorial-search-kbd-surface: var(${docsEditorialCssVariables.surfaceMuted})`
    );
    expect(paletteCss).toContain("font-variant-numeric: tabular-nums");
    expect(paletteCss).toContain("button[data-search-full]:hover");
  });

  it("defines porcelain light and layered graphite dark material roles", () => {
    expect(docsEditorialPrimitiveValues.light.canvas).toContain("95)");
    expect(docsEditorialPrimitiveValues.dark.rail).not.toBe(
      docsEditorialPrimitiveValues.dark.canvas
    );
    expect(docsEditorialPrimitiveValues.dark.paper).not.toBe(
      docsEditorialPrimitiveValues.dark.rail
    );
  });

  it("keeps brand accent out of sidebar active chrome", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");
    const sidebarBlock = paletteCss.slice(
      paletteCss.indexOf(docsShellChromeSelectors.sidebarActive)
    );

    expect(sidebarBlock).toContain(
      `background-color: var(${docsEditorialCssVariables.surfaceActive})`
    );
    expect(sidebarBlock).not.toContain(docsEditorialCssVariables.proseAccent);
  });

  it("scopes brand accent to prose via editorial prose tokens in globals.css", () => {
    const globalsCss = readDocsFile("src/app/globals.css");

    expect(globalsCss).toContain("var(--docs-editorial-prose-accent)");
    expect(globalsCss).toContain("var(--docs-editorial-prose-accent-hover)");
    expect(globalsCss).toContain(".nd-page .prose a");
    expect(globalsCss).toContain("var(--docs-editorial-code-surface)");
  });

  it("overrides Fumadocs sidebar scoped fd tokens with rail material", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");
    const sidebarBlock = paletteCss.slice(
      paletteCss.indexOf(`${docsShellChromeSelectors.sidebarRoot} {`)
    );

    expect(sidebarBlock).toContain(
      `--color-fd-muted: var(${docsEditorialCssVariables.rail})`
    );
    expect(sidebarBlock).toContain(
      `background-color: var(${docsEditorialCssVariables.rail})`
    );
  });

  it("exposes ACPA focus-visible ring on shell interactive elements", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");

    expect(paletteCss).toContain(":focus-visible {");
    expect(paletteCss).toContain(
      `outline-color: var(${docsEditorialCssVariables.ring})`
    );
  });

  it("does not hardcode --color-fd-* in :root or .dark", () => {
    const paletteCss = readDocsFile("src/app/docs-editorial-palette.css");
    const rootBlock = paletteCss.slice(0, paletteCss.indexOf("@theme inline"));

    expect(rootBlock).not.toMatch(rootFdHardcodePattern);
    expect(rootBlock).not.toMatch(darkFdHardcodePattern);
  });
});
