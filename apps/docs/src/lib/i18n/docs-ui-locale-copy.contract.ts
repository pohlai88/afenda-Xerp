import type { DocsLocale } from "@/lib/i18n";

/** Serializable UI copy for one docs locale — edit the matching `locales/{locale}.json`. */
export interface DocsUiLocaleCopy {
  readonly displayName: string;
  readonly searchTrigger: string;
  readonly searchDialog: string;
  readonly inlineTocLabel: string;
  readonly feedback: DocsFeedbackLocaleCopy;
  readonly pageActions: DocsPageActionsLocaleCopy;
  readonly homeSections: readonly DocsHomeSectionLocaleCopy[];
  readonly searchLinks: readonly DocsSearchLinkLocaleCopy[];
}

export interface DocsFeedbackLocaleCopy {
  readonly blockFeedbackLabel: string;
  readonly close: string;
  readonly good: string;
  readonly bad: string;
  readonly pagePrompt: string;
  readonly placeholder: string;
  readonly submit: string;
  readonly submitAgain: string;
  readonly thankYou: string;
  readonly viewOnGitHub: string;
}

export interface DocsPageActionsLocaleCopy {
  readonly copyMarkdown: string;
  readonly open: string;
  readonly openInGitHub: string;
  readonly viewAsMarkdown: string;
  readonly openInScira: string;
  readonly openInChatGPT: string;
  readonly openInClaude: string;
  readonly openInCursor: string;
  /** Use `{url}` as the page URL placeholder. */
  readonly readPromptTemplate: string;
}

export interface DocsHomeSectionLocaleCopy {
  readonly title: string;
  readonly description: string;
  /** Docs path without locale prefix, e.g. `/docs/getting-started`. */
  readonly docsPath: string;
}

export interface DocsSearchLinkLocaleCopy {
  readonly label: string;
  /** Docs path without locale prefix, e.g. `/docs/getting-started`. */
  readonly docsPath: string;
}

export type DocsUiLocaleCopyByLocale = Record<DocsLocale, DocsUiLocaleCopy>;
