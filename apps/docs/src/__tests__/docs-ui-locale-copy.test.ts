import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { DocsUiLocaleCopy } from "@/lib/i18n/docs-ui-locale-copy.contract";
import { docsDefaultLocale, docsLocales } from "@/lib/i18n";
import { resolveDocsUiLocaleCopy } from "@/lib/i18n/resolve-docs-ui-locale-copy";

const appRoot = process.cwd();
const localesDir = join(appRoot, "src/lib/i18n/locales");

const requiredTopLevelKeys = [
  "displayName",
  "searchTrigger",
  "searchDialog",
  "inlineTocLabel",
  "fallbackNotice",
  "feedback",
  "pageActions",
  "homeSections",
  "searchLinks",
] as const satisfies readonly (keyof DocsUiLocaleCopy)[];

describe("@afenda/docs UI locale JSON copy", () => {
  it("ships one JSON file per docs locale", () => {
    for (const locale of docsLocales) {
      const filePath = join(localesDir, `${locale}.json`);
      expect(existsSync(filePath)).toBe(true);
    }
  });

  it("loads every locale through resolveDocsUiLocaleCopy", () => {
    for (const locale of docsLocales) {
      const copy = resolveDocsUiLocaleCopy(locale);

      for (const key of requiredTopLevelKeys) {
        expect(copy[key]).toBeDefined();
      }

      expect(copy.homeSections).toHaveLength(4);
      expect(copy.searchLinks).toHaveLength(4);
      expect(copy.pageActions.readPromptTemplate).toContain("{url}");
    }
  });

  it("keeps en and zh feedback prompts distinct", () => {
    const en = resolveDocsUiLocaleCopy("en");
    const zh = resolveDocsUiLocaleCopy("zh");

    expect(en.feedback.pagePrompt).toBe("How is this guide?");
    expect(zh.feedback.pagePrompt).toBe("这篇指南对您有帮助吗？");
  });

  it("uses en.json as the structural template for all locales", () => {
    const en = JSON.parse(
      readFileSync(join(localesDir, "en.json"), "utf8")
    ) as DocsUiLocaleCopy;

    for (const locale of docsLocales) {
      if (locale === "en") {
        continue;
      }

      const localeCopy = JSON.parse(
        readFileSync(join(localesDir, `${locale}.json`), "utf8")
      ) as DocsUiLocaleCopy;

      expect(Object.keys(localeCopy).sort()).toEqual(Object.keys(en).sort());
      expect(Object.keys(localeCopy.feedback).sort()).toEqual(
        Object.keys(en.feedback).sort()
      );
      expect(Object.keys(localeCopy.pageActions).sort()).toEqual(
        Object.keys(en.pageActions).sort()
      );
      expect(localeCopy.homeSections.map((section) => section.docsPath)).toEqual(
        en.homeSections.map((section) => section.docsPath)
      );
      expect(localeCopy.searchLinks).toHaveLength(en.searchLinks.length);
    }
  });
});
