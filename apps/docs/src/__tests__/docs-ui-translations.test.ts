import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { zhCN } from "@fumadocs/language/zh-cn";
import {
  docsFumadocsSpotCheckLabelKeys,
  docsI18nProvider,
} from "@/lib/docs-ui-translations";
import {
  afendaFumadocsRegionalLocales,
  afendaFumadocsRegionalPack,
  fumadocsRegionalPackKeyCount,
  resolveAfendaFumadocsRegionalPackKeys,
} from "@/lib/i18n/afenda-fumadocs-packs";
import { afendaFumadocsRegionalCopy } from "@/lib/i18n/afenda-fumadocs-packs.data";
import { docsDefaultLocale, docsLocales } from "@/lib/i18n";

const layoutSource = readFileSync(
  join(process.cwd(), "src/app/[lang]/layout.tsx"),
  "utf8"
);

const feedbackClientSource = readFileSync(
  join(process.cwd(), "src/components/feedback/client.tsx"),
  "utf8"
);

const feedbackHookSource = readFileSync(
  join(process.cwd(), "src/lib/use-afenda-feedback-copy.client.ts"),
  "utf8"
);

describe("@afenda/docs Fumadocs UI translations", () => {
  it("defines all locales with full regional presets and feedback labels", () => {
    expect(docsLocales).toEqual(["en", "zh", "vi", "ms", "id", "th", "fil"]);
    expect(docsDefaultLocale).toBe("en");
    expect(fumadocsRegionalPackKeyCount).toBe(Object.keys(zhCN().value).length);

    for (const locale of docsLocales) {
      const provider = docsI18nProvider(locale);
      expect(provider.translations).toBeDefined();

      if (locale === docsDefaultLocale) {
        continue;
      }

      for (const key of docsFumadocsSpotCheckLabelKeys) {
        expect(provider.translations?.[key]).toBeDefined();
      }
    }
  });

  it("ships full regional packs aligned to the zh-cn key inventory", () => {
    const zhKeys = Object.keys(zhCN().value).sort();

    for (const locale of afendaFumadocsRegionalLocales) {
      expect([...resolveAfendaFumadocsRegionalPackKeys(locale)].sort()).toEqual(
        zhKeys
      );
    }
  });

  it("uses the official zh-cn language pack for zh", () => {
    const provider = docsI18nProvider("zh");
    const pack = zhCN();

    expect(provider.translations?.["Search(search trigger)"]).toBe(
      pack.value["Search(search trigger)"]
    );
    expect(provider.translations?.["Authorize(playground)"]).toBe(
      pack.value["Authorize(playground)"]
    );
  });

  it("uses full Afenda regional presets for vi, ms, id, th, and fil", () => {
    for (const locale of afendaFumadocsRegionalLocales) {
      const provider = docsI18nProvider(locale);
      const copy = afendaFumadocsRegionalCopy[locale];

      expect(provider.translations?.["displayName"]).toBe(copy.displayName);
      expect(provider.translations?.["Search(search trigger)"]).toBe(
        copy.searchTrigger
      );
      expect(provider.translations?.["Authorize(playground)"]).toBe(
        afendaFumadocsRegionalPack(locale).value["Authorize(playground)"]
      );
      expect(provider.translations?.["Copy Markdown(page actions)"]).toBe(
        copy.pageActions.copyMarkdown
      );
    }
  });

  it("wires feedback UI through @fuma-translate/react", () => {
    expect(feedbackClientSource).toContain("useAfendaFeedbackCopy");
    expect(feedbackHookSource).toContain("@fuma-translate/react");
    expect(feedbackClientSource).not.toContain("resolveDocsFeedbackCopy");
  });

  it("wires RootProvider i18n from docs-ui-translations contract", () => {
    expect(layoutSource).toContain("docsI18nProvider");
    expect(layoutSource).toMatch(/i18n=\{docsI18nProvider\(lang\)\}/);
  });

  it("keeps RootProvider search.links from docs-search.contract", () => {
    expect(layoutSource).toContain("docsSearchEmptyLinks");
    expect(layoutSource).toMatch(
      /search=\{\{\s*links:\s*docsSearchEmptyLinks\(lang\)\s*\}\}/
    );
  });
});
