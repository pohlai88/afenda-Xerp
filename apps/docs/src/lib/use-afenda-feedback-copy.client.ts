"use client";

import { useTranslations } from "@fuma-translate/react";

/** Afenda feedback copy via Fumadocs `TranslationProvider` / `@fuma-translate/react`. */
export function useAfendaFeedbackCopy() {
  const t = useTranslations();

  return {
    blockFeedbackLabel: t("Feedback", { note: "feedback block label" }),
    close: t("Close", { note: "feedback dialog" }),
    good: t("Good", { note: "feedback rating" }),
    bad: t("Bad", { note: "feedback rating" }),
    pagePrompt: t("How is this guide?", { note: "feedback page prompt" }),
    placeholder: t("Leave your feedback…", { note: "feedback placeholder" }),
    submit: t("Submit", { note: "feedback form" }),
    submitAgain: t("Submit Again", { note: "feedback form" }),
    thankYou: t("Thank you for your feedback!", {
      note: "feedback confirmation",
    }),
    viewOnGitHub: t("View on GitHub", { note: "feedback link" }),
  };
}

export type AfendaFeedbackCopy = ReturnType<typeof useAfendaFeedbackCopy>;
