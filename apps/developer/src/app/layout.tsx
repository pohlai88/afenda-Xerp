import {
  StudioPresentationProviders,
  ThemeScript,
} from "@afenda/shadcn-studio-v2/clients";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { developerThemeConfig } from "@/config/theme-config";
import "./globals.css";

const routeLabSansFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const routeLabMonoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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
        <ThemeScript
          initialThemeId={developerThemeConfig.defaultThemeId}
          storageKey={developerThemeConfig.storageKey}
        />
        <StudioPresentationProviders
          initialThemeId={developerThemeConfig.defaultThemeId}
          storageKey={developerThemeConfig.storageKey}
        >
          {children}
        </StudioPresentationProviders>
      </body>
    </html>
  );
}
