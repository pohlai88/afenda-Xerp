import type { DocsLocale } from "@/lib/i18n";
import {
  resolveDocsPageActionsReadPrompt,
  resolveDocsUiLocaleCopy,
} from "@/lib/i18n/resolve-docs-ui-locale-copy";

export interface DocsPageActionsCopy {
  readonly copyMarkdown: string;
  readonly open: string;
  readonly openInGitHub: string;
  readonly viewAsMarkdown: string;
  readonly openInScira: string;
  readonly openInChatGPT: string;
  readonly openInClaude: string;
  readonly openInCursor: string;
  readonly readPrompt: (url: string) => string;
}

export function resolveDocsPageActionsCopy(
  locale: DocsLocale
): DocsPageActionsCopy {
  const pageActions = resolveDocsUiLocaleCopy(locale).pageActions;

  return {
    copyMarkdown: pageActions.copyMarkdown,
    open: pageActions.open,
    openInGitHub: pageActions.openInGitHub,
    viewAsMarkdown: pageActions.viewAsMarkdown,
    openInScira: pageActions.openInScira,
    openInChatGPT: pageActions.openInChatGPT,
    openInClaude: pageActions.openInClaude,
    openInCursor: pageActions.openInCursor,
    readPrompt: (url: string) => resolveDocsPageActionsReadPrompt(locale, url),
  };
}
