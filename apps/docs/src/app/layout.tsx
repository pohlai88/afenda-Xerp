import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { docsFontClassNames } from "@/lib/docs-fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Afenda Docs",
    template: "%s | Afenda Docs",
  },
  description: "Afenda ERP implementation documentation",
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html className={docsFontClassNames} lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
