import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsReaderSections } from "@/lib/docs-nav.contract";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { docsDefaultLocale, docsLocales } from "@/lib/i18n";

const readerLocales = docsLocales.filter((locale) => locale !== docsDefaultLocale);

const expectedRootReaderSections = [
  "use-erp",
  "configure-tenant",
  "operate-tenant",
  "integrate",
] as const;

describe("@afenda/docs reader IA locales", () => {
  for (const locale of readerLocales) {
    it(`${locale} has use-erp/sign-in.mdx after scaffold`, () => {
      const signInPath = join(
        docsLocaleContentRoot(locale),
        "use-erp/sign-in.mdx"
      );

      expect(existsSync(signInPath)).toBe(true);
    });

    it(`${locale} root meta.json lists reader sections`, () => {
      const meta = JSON.parse(
        readFileSync(join(docsLocaleContentRoot(locale), "meta.json"), "utf8")
      ) as { pages: string[] };

      for (const section of expectedRootReaderSections) {
        expect(meta.pages).toContain(section);
      }

      expect(meta.pages).not.toContain("build-afenda");
    });

    it(`${locale} reader section meta aligns with docsReaderSections contract`, () => {
      for (const section of docsReaderSections) {
        if (section === "build-afenda") {
          continue;
        }

        const sectionMetaPath = join(
          docsLocaleContentRoot(locale),
          section,
          "meta.json"
        );

        expect(existsSync(sectionMetaPath)).toBe(true);
      }
    });
  }
});
