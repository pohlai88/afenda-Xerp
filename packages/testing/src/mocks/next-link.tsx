import type { AnchorHTMLAttributes, ReactNode } from "react";

interface NextLinkMockProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
  href: string;
}

/** Vitest stand-in for `next/link` — preserves anchor semantics in unit tests. */
export default function NextLinkMock({
  href,
  children,
  ...props
}: NextLinkMockProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
