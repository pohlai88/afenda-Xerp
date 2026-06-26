import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsDefaultLocale, docsLocales, i18n } from "@/lib/i18n";

describe("@afenda/docs i18n charter", () => {
  it("defines supported locales with dir parser", () => {
    expect(docsDefaultLocale).toBe("en");
    expect(docsLocales).toEqual(["en", "zh", "vi", "ms", "id", "th", "fil"]);
    expect(i18n.defaultLanguage).toBe("en");
    expect(i18n.languages).toEqual([
      "en",
      "zh",
      "vi",
      "ms",
      "id",
      "th",
      "fil",
    ]);
    expect(i18n.parser).toBe("dir");
  });

  it("ships i18n middleware with locale-aware matcher", () => {
    const middlewarePath = join(process.cwd(), "src/middleware.ts");
    expect(existsSync(middlewarePath)).toBe(true);

    const sourceText = readFileSync(middlewarePath, "utf8");
    expect(sourceText).toContain("createI18nMiddleware");
    expect(sourceText).toContain("favicon.ico");
    // Raw source uses `\\.` inside the matcher string literal (regex: docs/*.svg).
    expect(sourceText).toMatch(/docs\/\.\*\\+\.svg/);
  });

  it("wires i18n into the Fumadocs source loader", () => {
    const sourceText = readFileSync(
      join(process.cwd(), "src/lib/source.ts"),
      "utf8"
    );

    expect(sourceText).toContain('from "@/lib/i18n"');
    expect(sourceText).toMatch(/loader\(\{[\s\S]*i18n,/);
  });

  it("uses per-locale page trees and lang in docs routes", () => {
    const docsLayout = readFileSync(
      join(process.cwd(), "src/app/[lang]/docs/layout.tsx"),
      "utf8"
    );
    const docsPage = readFileSync(
      join(process.cwd(), "src/app/[lang]/docs/[[...slug]]/page.tsx"),
      "utf8"
    );

    expect(docsLayout).toContain("source.pageTree[lang]");
    expect(docsPage).toContain("source.generateParams()");
    expect(docsPage).toContain("resolveDocsPage(slug, lang)");
  });

  it("organizes content under content/docs/{locale}", () => {
    for (const locale of docsLocales) {
      const localeRoot = join(process.cwd(), "content/docs", locale);
      expect(existsSync(join(localeRoot, "meta.json"))).toBe(true);
      expect(existsSync(join(localeRoot, "index.mdx"))).toBe(true);
    }

    const flatMeta = join(process.cwd(), "content/docs/meta.json");
    expect(existsSync(flatMeta)).toBe(false);
  });
});
