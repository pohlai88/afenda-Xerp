import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18n } from "@/lib/i18n";

const i18nMiddleware = createI18nMiddleware(i18n);
const { rewrite: rewriteLlmMarkdown } = rewritePath(
  "/{lang}/docs{/*path}",
  "/llms.mdx/{lang}/docs{/*path}"
);

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (isMarkdownPreferred(request)) {
    const rewritten = rewriteLlmMarkdown(request.nextUrl.pathname);
    if (rewritten) {
      return NextResponse.rewrite(new URL(rewritten, request.nextUrl));
    }
  }

  return i18nMiddleware(request, event);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|llms\\.txt|llms-full\\.txt|llms.mdx|docs/.*\\.svg).*)",
  ],
};
