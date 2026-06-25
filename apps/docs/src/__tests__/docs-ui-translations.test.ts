import { readFileSync } from "node:fs";
import { join } from "node:path";
import { i18nProvider, uiTranslations } from "fumadocs-ui/i18n";
import { describe, expect, it } from "vitest";
import {
  docsUiTranslationOverrideKeys,
  docsUiTranslationOverrides,
  docsUiTranslations,
} from "@/lib/docs-ui-translations";

const layoutSource = readFileSync(
  join(process.cwd(), "src/app/layout.tsx"),
  "utf8"
);

describe("@afenda/docs UI translations (singular)", () => {
  it("defines docsUiTranslations extending Fumadocs ui label keys", () => {
    expect(docsUiTranslations).toBeDefined();
    expect(typeof docsUiTranslations.get).toBe("function");

    const payload = docsUiTranslations.get();
    expect(payload).toBeDefined();

    for (const key of uiTranslations().keys) {
      expect(Object.hasOwn(payload, key)).toBe(true);
    }
  });

  it("applies Afenda editorial overrides to search labels", () => {
    const payload = docsUiTranslations.get();

    for (const key of docsUiTranslationOverrideKeys) {
      expect(payload[key]).toBe(docsUiTranslationOverrides[key]);
    }
  });

  it("exposes overrides through i18nProvider for RootProvider", () => {
    const provider = i18nProvider(docsUiTranslations);

    expect(provider.translations).toBeDefined();

    for (const key of docsUiTranslationOverrideKeys) {
      expect(provider.translations?.[key]).toBe(
        docsUiTranslationOverrides[key]
      );
    }
  });

  it("wires RootProvider i18n from docs-ui-translations contract", () => {
    expect(layoutSource).toContain("docsUiTranslations");
    expect(layoutSource).toContain("i18nProvider");
    expect(layoutSource).toMatch(/i18n=\{i18nProvider\(docsUiTranslations\)\}/);
  });

  it("keeps RootProvider search.links from docs-search.contract", () => {
    expect(layoutSource).toContain("docsSearchEmptyLinks");
    expect(layoutSource).toMatch(
      /search=\{\{\s*links:\s*docsSearchEmptyLinks\s*\}\}/
    );
  });
});
