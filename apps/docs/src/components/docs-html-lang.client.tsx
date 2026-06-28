"use client";

import { useEffect } from "react";

/** Syncs `<html lang>` after locale segment resolves (root layout owns `<html>`). */
export function DocsHtmlLang({ lang }: { readonly lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
