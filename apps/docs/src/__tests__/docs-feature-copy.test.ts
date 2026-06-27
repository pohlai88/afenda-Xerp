import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  listFeatureCopyLocales,
  mergeFeatureCopyOverlays,
  resolveFeatureCopyForLocale,
} from "@/lib/docs-feature-copy";
import type { FeatureCopyOverlayEntry } from "@/lib/docs-feature-manifest.contract";
import type { DocsLocaleMessages } from "@/lib/i18n/docs-locale-messages.contract";
import { docsDefaultLocale, docsLocales } from "@/lib/i18n";
import { resolveDocsLocaleMessages } from "@/lib/i18n/resolve-docs-locale-messages";

const appRoot = process.cwd();
const localesDir = join(appRoot, "src/lib/i18n/locales");

const overlayEntryFields = [
  "summary",
  "title",
  "whenToUse",
  "adminCallout",
] as const satisfies readonly (keyof FeatureCopyOverlayEntry)[];

describe("@afenda/docs feature copy locale catalog", () => {
  it("loads featureCopy for every docs locale from the message catalog", () => {
    for (const locale of docsLocales) {
      const featureCopy = resolveFeatureCopyForLocale(locale);
      expect(Object.keys(featureCopy).length).toBeGreaterThan(0);
    }
  });

  it("lists every docs locale for feature copy parity checks", () => {
    expect(listFeatureCopyLocales()).toEqual([...docsLocales]);
  });

  it("uses en.json as the structural template for all locales", () => {
    const en = resolveFeatureCopyForLocale(docsDefaultLocale);
    const enKeys = Object.keys(en).sort();

    for (const locale of docsLocales) {
      const localeCopy = resolveFeatureCopyForLocale(locale);
      const localeKeys = Object.keys(localeCopy).sort();
      expect(localeKeys).toEqual(enKeys);

      for (const manifestId of enKeys) {
        const enEntry = en[manifestId];
        const localeEntry = localeCopy[manifestId];
        expect(localeEntry).toBeDefined();

        for (const field of overlayEntryFields) {
          if (enEntry?.[field] !== undefined) {
            expect(localeEntry?.[field]).toBeDefined();
          }
        }
      }
    }
  });

  it("merges locale overlays over en defaults", () => {
    const merged = mergeFeatureCopyOverlays(
      { inventory: { summary: "English summary" } },
      { inventory: { whenToUse: "Localized when to use" } }
    );

    expect(merged["inventory"]).toEqual({
      summary: "English summary",
      whenToUse: "Localized when to use",
    });
  });

  it("keeps en and zh inventory summaries distinct", () => {
    const en = resolveFeatureCopyForLocale("en");
    const zh = resolveFeatureCopyForLocale("zh");

    expect(en["inventory"]?.summary).toContain("Track stock levels");
    expect(zh["inventory"]?.summary).toContain("库存");
  });

  it("ships featureCopy inside each locale JSON file", () => {
    for (const locale of docsLocales) {
      const filePath = join(localesDir, `${locale}.json`);
      expect(existsSync(filePath)).toBe(true);

      const payload = JSON.parse(
        readFileSync(filePath, "utf8")
      ) as DocsLocaleMessages;
      expect(payload.featureCopy).toBeDefined();
    }
  });

  it("validates every locale through resolveDocsLocaleMessages", () => {
    for (const locale of docsLocales) {
      const messages = resolveDocsLocaleMessages(locale);
      expect(messages.fallbackNotice.length).toBeGreaterThan(0);
      expect(Object.keys(messages.featureCopy).length).toBeGreaterThan(0);
    }
  });
});
