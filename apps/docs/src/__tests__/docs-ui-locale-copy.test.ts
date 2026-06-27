import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { DocsLocaleMessages } from "@/lib/i18n/docs-locale-messages.contract";
import { docsDefaultLocale, docsLocales } from "@/lib/i18n";
import {
  resolveDocsAfendaLocaleCopy,
  resolveDocsLocaleMessages,
} from "@/lib/i18n/resolve-docs-locale-messages";

const appRoot = process.cwd();
const localesDir = join(appRoot, "src/lib/i18n/locales");

const requiredAfendaKeys = [
  "fallbackNotice",
  "feedback",
  "homeSections",
  "searchLinks",
  "featureCopy",
] as const satisfies readonly (keyof DocsLocaleMessages)[];

describe("@afenda/docs Afenda locale message catalog", () => {
  it("ships one JSON file per docs locale", () => {
    for (const locale of docsLocales) {
      const filePath = join(localesDir, `${locale}.json`);
      expect(existsSync(filePath)).toBe(true);
    }
  });

  it("loads every locale through resolveDocsLocaleMessages", () => {
    for (const locale of docsLocales) {
      const messages = resolveDocsLocaleMessages(locale);

      for (const key of requiredAfendaKeys) {
        expect(messages[key]).toBeDefined();
      }

      expect(messages.homeSections).toHaveLength(4);
      expect(messages.searchLinks).toHaveLength(4);
      expect(Object.keys(messages.featureCopy).length).toBeGreaterThan(0);
    }
  });

  it("loads Afenda chrome through resolveDocsAfendaLocaleCopy", () => {
    for (const locale of docsLocales) {
      const copy = resolveDocsAfendaLocaleCopy(locale);
      expect(copy.fallbackNotice.length).toBeGreaterThan(0);
      expect(copy.feedback.pagePrompt.length).toBeGreaterThan(0);
    }
  });

  it("keeps en and zh feedback prompts distinct", () => {
    const en = resolveDocsAfendaLocaleCopy("en");
    const zh = resolveDocsAfendaLocaleCopy("zh");

    expect(en.feedback.pagePrompt).toBe("How is this guide?");
    expect(zh.feedback.pagePrompt).toBe("这篇指南对您有帮助吗？");
  });

  it("uses en.json as the structural template for all locales", () => {
    const en = JSON.parse(
      readFileSync(join(localesDir, "en.json"), "utf8")
    ) as DocsLocaleMessages;

    for (const locale of docsLocales) {
      if (locale === docsDefaultLocale) {
        continue;
      }

      const localeCopy = JSON.parse(
        readFileSync(join(localesDir, `${locale}.json`), "utf8")
      ) as DocsLocaleMessages;

      expect(Object.keys(localeCopy).sort()).toEqual(Object.keys(en).sort());
      expect(Object.keys(localeCopy.feedback).sort()).toEqual(
        Object.keys(en.feedback).sort()
      );
      expect(localeCopy.homeSections.map((section) => section.docsPath)).toEqual(
        en.homeSections.map((section) => section.docsPath)
      );
      expect(localeCopy.searchLinks).toHaveLength(en.searchLinks.length);
      expect(Object.keys(localeCopy.featureCopy).sort()).toEqual(
        Object.keys(en.featureCopy).sort()
      );
    }
  });

  it("does not store Fumadocs UI labels in Afenda locale JSON", () => {
    for (const locale of docsLocales) {
      const payload = JSON.parse(
        readFileSync(join(localesDir, `${locale}.json`), "utf8")
      ) as Record<string, unknown>;

      expect(payload["displayName"]).toBeUndefined();
      expect(payload["searchTrigger"]).toBeUndefined();
      expect(payload["searchDialog"]).toBeUndefined();
      expect(payload["inlineTocLabel"]).toBeUndefined();
      expect(payload["pageActions"]).toBeUndefined();
    }
  });
});
