import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  docsI18nProvider,
  docsUiTranslationOverrideKeys,
  docsUiTranslationOverrides,
} from "@/lib/docs-ui-translations";
import { docsDefaultLocale, docsLocales } from "@/lib/i18n";

const layoutSource = readFileSync(
  join(process.cwd(), "src/app/[lang]/layout.tsx"),
  "utf8"
);

describe("@afenda/docs UI translations (multilingual)", () => {
  it("defines all locales with Afenda search label overrides", () => {
    expect(docsLocales).toEqual(["en", "zh", "vi", "ms", "id", "th", "fil"]);
    expect(docsDefaultLocale).toBe("en");

    for (const locale of docsLocales) {
      for (const key of docsUiTranslationOverrideKeys) {
        expect(docsUiTranslationOverrides[locale][key]).toBeDefined();
      }
    }
  });

  it("exposes locale-specific overrides through docsI18nProvider", () => {
    for (const locale of docsLocales) {
      const provider = docsI18nProvider(locale);

      expect(provider.translations).toBeDefined();

      for (const key of docsUiTranslationOverrideKeys) {
        expect(provider.translations?.[key]).toBe(
          docsUiTranslationOverrides[locale][key]
        );
      }
    }
  });

  it("wires RootProvider i18n from docs-ui-translations contract", () => {
    expect(layoutSource).toContain("docsI18nProvider");
    expect(layoutSource).toMatch(/i18n=\{docsI18nProvider\(lang\)\}/);
  });

  it("disables fumadocs next-themes to avoid React 19 client script warnings", () => {
    expect(layoutSource).toContain("theme={{ enabled: false }}");
    expect(layoutSource).toContain("docsThemeInitScript");
  });

  it("keeps RootProvider search.links from docs-search.contract", () => {
    expect(layoutSource).toContain("docsSearchEmptyLinks");
    expect(layoutSource).toMatch(
      /search=\{\{\s*links:\s*docsSearchEmptyLinks\(lang\)\s*\}\}/
    );
  });
});
