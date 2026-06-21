import type { AnchorHTMLAttributes, ReactNode } from "react";

interface NextLinkMockProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
  href: string;
  legacyBehavior?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
}

/** Vitest / Storybook stand-in for `next/link` — preserves anchor semantics. */
export default function NextLinkMock({
  href,
  children,
  legacyBehavior: _legacyBehavior,
  passHref: _passHref,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  shallow: _shallow,
  ...props
}: NextLinkMockProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
