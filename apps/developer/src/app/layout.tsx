import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DemoBanner } from "@/components/demo-banner";
import { LabPresentationProviders } from "@/components/lab-presentation-providers.client";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Afenda Developer Route Lab",
    template: "%s · Afenda Route Lab",
  },
  description:
    "PAS-006E developer presentation sandbox — demo fixtures only (ADR-0039).",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LabPresentationProviders>
          <DemoBanner />
          {children}
        </LabPresentationProviders>
      </body>
    </html>
  );
}
