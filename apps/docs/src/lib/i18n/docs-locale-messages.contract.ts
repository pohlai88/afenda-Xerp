import type { z } from "zod";
import type { docsLocaleMessagesSchema } from "@/lib/i18n/docs-locale-messages.schema";
import type { DocsLocale } from "@/lib/i18n";

/** Afenda-owned message catalog for one docs locale (`locales/{locale}.json`). */
export type DocsLocaleMessages = z.infer<typeof docsLocaleMessagesSchema>;

/** Afenda chrome slice — feedback, home sections, search links, fallback banner. */
export type DocsAfendaLocaleCopy = Omit<DocsLocaleMessages, "featureCopy">;

/** @deprecated Use `DocsAfendaLocaleCopy`. */
export type DocsUiLocaleCopy = DocsAfendaLocaleCopy;

export type DocsLocaleMessagesByLocale = Record<DocsLocale, DocsLocaleMessages>;

export type DocsFeedbackLocaleCopy = DocsLocaleMessages["feedback"];
export type DocsHomeSectionLocaleCopy =
  DocsLocaleMessages["homeSections"][number];
export type DocsSearchLinkLocaleCopy =
  DocsLocaleMessages["searchLinks"][number];
