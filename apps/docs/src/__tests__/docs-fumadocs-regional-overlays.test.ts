import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { zhCN } from "@fumadocs/language/zh-cn";
import { docsI18nProvider } from "@/lib/docs-ui-translations";
import { afendaFumadocsRegionalLocales } from "@/lib/i18n/afenda-fumadocs-packs";
import { fumadocsLabelKeyToEnglishDefault } from "@/lib/i18n/fumadocs-key-to-english-default";

const overlaysDir = join(process.cwd(), "src/lib/i18n/fumadocs-packs/overlays");

/** Technical labels that may legitimately match English defaults (aligned with zh-cn pack). */
const ALLOWED_ENGLISH_DEFAULT_KEYS = new Set([
  "Basic <token>(security scheme)",
  "Bearer <token>(security scheme)",
  "Client ID(OAuth dialog)",
  "OpenID Connect(security scheme)",
  "OpenID Connect(security scheme)",
  "Copy(TypeScript definitions)",
  "Test(scalar API client)",
  "Bindings",
  "Headers",
  "Payload",
]);

describe("@afenda/docs Fumadocs regional overlays", () => {
  const canonicalKeys = Object.keys(zhCN().value).sort();

  it("ships a 169-key overlay JSON per regional locale", () => {
    for (const locale of afendaFumadocsRegionalLocales) {
      const overlay = JSON.parse(
        readFileSync(join(overlaysDir, `${locale}.json`), "utf8")
      ) as Record<string, string>;

      const keys = Object.keys(overlay)
        .filter((key) => !key.startsWith("_"))
        .sort();

      expect(keys).toEqual(canonicalKeys);
    }
  });

  it("localizes OpenAPI playground labels for regional locales", () => {
    for (const locale of afendaFumadocsRegionalLocales) {
      const provider = docsI18nProvider(locale);

      expect(provider.translations?.["Authorize(playground)"]).not.toBe("Authorize");
      expect(provider.translations?.["Send(playground)"]).not.toBe("Send");
      expect(provider.translations?.["Request Body(operation page)"]).not.toBe(
        "Request Body"
      );
    }
  });

  it("limits English-default labels to technical exceptions", () => {
    for (const locale of afendaFumadocsRegionalLocales) {
      const overlay = JSON.parse(
        readFileSync(join(overlaysDir, `${locale}.json`), "utf8")
      ) as Record<string, string>;

      const englishDefaults = canonicalKeys.filter(
        (key) =>
          overlay[key] === fumadocsLabelKeyToEnglishDefault(key) &&
          !ALLOWED_ENGLISH_DEFAULT_KEYS.has(key)
      );

      expect(englishDefaults).toEqual([]);
    }
  });
});
