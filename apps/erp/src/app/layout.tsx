import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ErpPresentationProviders } from "@/components/presentation/erp-presentation-providers.client";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Afenda ERP",
    template: "%s · Afenda ERP",
  },
  description: "Afenda enterprise resource planning platform.",
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
