import { ErpPresentationProviders } from "@afenda/shadcn-studio/theme";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const routeLabSansFont = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const routeLabMonoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const routeLabMetadataBase =
  process.env["AFENDA_DEVELOPER_BASE_URL"] ?? "http://127.0.0.1:3002";

export const metadata: Metadata = {
  title: {
    default: "Afenda Developer Route Lab",
    template: "%s · Afenda Developer Route Lab",
  },
  description:
    "ADR-0039 route lab for ERP-parity frontend composition and promotion-ready page contracts.",
  metadataBase: new URL(routeLabMetadataBase),
  robots: {
    follow: false,
    index: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`${routeLabSansFont.variable} ${routeLabMonoFont.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ErpPresentationProviders>{children}</ErpPresentationProviders>
      </body>
    </html>
  );
}
