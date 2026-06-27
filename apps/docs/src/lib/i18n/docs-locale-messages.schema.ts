import { z } from "zod";
import { featureCopyOverlaySchema } from "@/lib/docs-feature-manifest.contract";

const docsFeedbackLocaleCopySchema = z.object({
  blockFeedbackLabel: z.string().min(1),
  close: z.string().min(1),
  good: z.string().min(1),
  bad: z.string().min(1),
  pagePrompt: z.string().min(1),
  placeholder: z.string().min(1),
  submit: z.string().min(1),
  submitAgain: z.string().min(1),
  thankYou: z.string().min(1),
  viewOnGitHub: z.string().min(1),
});

const docsHomeSectionLocaleCopySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  docsPath: z.string().min(1),
});

const docsSearchLinkLocaleCopySchema = z.object({
  label: z.string().min(1),
  docsPath: z.string().min(1),
});

/** Afenda-owned chrome — Fumadocs UI labels come from `@/lib/docs-ui-translations`. */
export const docsLocaleMessagesSchema = z.object({
  fallbackNotice: z.string().min(1),
  feedback: docsFeedbackLocaleCopySchema,
  homeSections: z.array(docsHomeSectionLocaleCopySchema).min(1),
  searchLinks: z.array(docsSearchLinkLocaleCopySchema).min(1),
  featureCopy: featureCopyOverlaySchema,
});
