import { describe, expect, it } from "vitest";
import { fromTranslations } from "@fuma-translate/react";
import {
  AFENDA_FEEDBACK_I18N_KEYS,
  mapAfendaFeedbackCopyToFumadocsLabels,
  resolveAfendaFeedbackTranslationsForLocale,
} from "@/lib/i18n/afenda-feedback-i18n.extension";
import { docsI18nProvider } from "@/lib/docs-ui-translations";

describe("@afenda/docs feedback i18n extension", () => {
  it("registers all feedback keys on the Fumadocs translation extension", () => {
    expect(AFENDA_FEEDBACK_I18N_KEYS).toHaveLength(10);
  });

  it("maps locale JSON feedback copy to Fumadocs label keys", () => {
    const labels = resolveAfendaFeedbackTranslationsForLocale("zh");
    expect(labels["How is this guide?(feedback page prompt)"]).toContain("指南");
  });

  it("exposes feedback labels through docsI18nProvider for non-en locales", () => {
    const provider = docsI18nProvider("vi");
    const expected = resolveAfendaFeedbackTranslationsForLocale("vi");

    expect(provider.translations?.["How is this guide?(feedback page prompt)"]).toBe(
      expected["How is this guide?(feedback page prompt)"]
    );
  });

  it("resolves feedback strings through @fuma-translate/react fromTranslations", () => {
    const t = fromTranslations(
      resolveAfendaFeedbackTranslationsForLocale("en")
    );

    expect(t("How is this guide?", { note: "feedback page prompt" })).toBe(
      "How is this guide?"
    );
  });
});
