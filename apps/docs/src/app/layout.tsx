import type { ReactNode } from "react";
import { docsFontClassNames } from "@/lib/docs-fonts";
import { docsDefaultLocale } from "@/lib/i18n";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html
      className={docsFontClassNames}
      lang={docsDefaultLocale}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
