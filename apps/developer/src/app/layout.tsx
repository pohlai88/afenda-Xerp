import { ErpPresentationProviders } from "@afenda/shadcn-studio/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Afenda Developer Route Lab",
    template: "%s · Afenda Developer Route Lab",
  },
  description:
    "ADR-0039 route lab for ERP-parity frontend composition and promotion-ready page contracts.",
  robots: {
    follow: false,
    index: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErpPresentationProviders>{children}</ErpPresentationProviders>
      </body>
    </html>
  );
}
