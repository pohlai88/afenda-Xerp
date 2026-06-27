"use client";

import { SearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger";
import type { FullSearchTriggerProps } from "fumadocs-ui/layouts/shared/slots/search-trigger";

/** Icon-only search at all breakpoints — avoids FullSearchTrigger bar. */
export function DocsSearchTriggerIcon({
  hideIfDisabled,
  className,
}: FullSearchTriggerProps) {
  return (
    <SearchTrigger
      {...(hideIfDisabled === undefined ? {} : { hideIfDisabled })}
      {...(className === undefined ? {} : { className })}
    />
  );
}
