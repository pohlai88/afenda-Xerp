import type { TranslationPreset } from "fumadocs-core/i18n";
import { zhCN } from "@fumadocs/language/zh-cn";
import filPack from "@/lib/i18n/fumadocs-packs/fil.json";
import idPack from "@/lib/i18n/fumadocs-packs/id.json";
import msPack from "@/lib/i18n/fumadocs-packs/ms.json";
import thPack from "@/lib/i18n/fumadocs-packs/th.json";
import viPack from "@/lib/i18n/fumadocs-packs/vi.json";
import type { DocsLocale } from "@/lib/i18n";

type RegionalPackLocale = "vi" | "ms" | "id" | "th" | "fil";

const regionalPackPayloadByLocale = {
  vi: viPack,
  ms: msPack,
  id: idPack,
  th: thPack,
  fil: filPack,
} as const satisfies Record<RegionalPackLocale, Record<string, string>>;

export const afendaFumadocsRegionalLocales = Object.keys(
  regionalPackPayloadByLocale
) as RegionalPackLocale[];

export const fumadocsRegionalPackKeyCount = Object.keys(zhCN().value).length;

function filterPackPayload(
  payload: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !key.startsWith("_"))
  );
}

export function isAfendaFumadocsRegionalLocale(
  locale: DocsLocale
): locale is RegionalPackLocale {
  return locale in regionalPackPayloadByLocale;
}

export function afendaFumadocsRegionalPack(
  locale: RegionalPackLocale
): TranslationPreset {
  return {
    name: locale,
    value: filterPackPayload(regionalPackPayloadByLocale[locale]),
  };
}

export function resolveAfendaFumadocsRegionalPackKeys(
  locale: RegionalPackLocale
): readonly string[] {
  return Object.keys(filterPackPayload(regionalPackPayloadByLocale[locale]));
}
