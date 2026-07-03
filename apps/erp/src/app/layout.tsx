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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/icons/afenda-icon-192-transparent.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/afenda-icon-180-transparent.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
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
