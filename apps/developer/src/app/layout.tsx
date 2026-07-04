import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Afenda Developer Route Lab",
    template: "%s · Afenda Route Lab",
  },
  description: "PAS-006E developer route lab baseline (ADR-0039).",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable}`} lang="en">
      <body className={`${GeistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
