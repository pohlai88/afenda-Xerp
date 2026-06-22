import type { Metadata } from "next";

import { ApplicationShell, ApplicationShellDashboardDemo } from "@afenda/appshell";

export const metadata = {
  title: "AppShell dashboard demo",
  description: "Readonly dashboard demo inside ApplicationShell chrome.",
  robots: {
    index: false,
    follow: false,
  },
} satisfies Metadata;

export default function AppShellDemoPage() {
  return (
    <ApplicationShell userName="Demo User" welcomeMessage="Readonly dashboard demo">
      <ApplicationShellDashboardDemo showReadonlyPreviewLabel />
    </ApplicationShell>
  );
}
