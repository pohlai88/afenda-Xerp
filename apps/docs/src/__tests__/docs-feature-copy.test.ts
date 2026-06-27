import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  listFeatureCopyOverlayLocales,
  mergeFeatureCopyOverlays,
  readFeatureCopyOverlayFile,
  resolveFeatureCopyOverlayFileName,
} from "@/lib/docs-feature-copy";
import type { FeatureCopyOverlayEntry } from "@/lib/docs-feature-manifest.contract";
import { docsDefaultLocale, docsLocales } from "@/lib/i18n";

const appRoot = process.cwd();
const dataDir = join(appRoot, "data");

const overlayEntryFields = [
  "summary",
  "title",
  "whenToUse",
  "adminCallout",
] as const satisfies readonly (keyof FeatureCopyOverlayEntry)[];

describe("@afenda/docs feature copy overlays", () => {
  it("ships one overlay file per docs locale", () => {
    for (const locale of docsLocales) {
      const filePath = join(dataDir, resolveFeatureCopyOverlayFileName(locale));
      expect(existsSync(filePath)).toBe(true);
    }
  });

  it("lists every docs locale for overlay parity checks", () => {
    expect(listFeatureCopyOverlayLocales()).toEqual([...docsLocales]);
  });

  it("uses en.json as the structural template for all locales", () => {
    const en = readFeatureCopyOverlayFile(dataDir, docsDefaultLocale);
    expect(en).toBeDefined();

    const enKeys = Object.keys(en ?? {})
      .filter((key) => !key.startsWith("_"))
      .sort();

    for (const locale of docsLocales) {
      const localeOverlay = readFeatureCopyOverlayFile(dataDir, locale);
      expect(localeOverlay).toBeDefined();

      const localeKeys = Object.keys(localeOverlay ?? {})
        .filter((key) => !key.startsWith("_"))
        .sort();

      expect(localeKeys).toEqual(enKeys);

      for (const manifestId of enKeys) {
        const enEntry = en?.[manifestId];
        const localeEntry = localeOverlay?.[manifestId];
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
    const en = readFeatureCopyOverlayFile(dataDir, "en");
    const zh = readFeatureCopyOverlayFile(dataDir, "zh");

    expect(en?.["inventory"]?.summary).toContain("Track stock levels");
    expect(zh?.["inventory"]?.summary).toContain("库存");
  });
});
