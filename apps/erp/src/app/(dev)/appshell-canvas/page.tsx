import type { Metadata } from "next";

import { ApplicationShell } from "@afenda/appshell";

import { AppShellCanvasHarness } from "@/components/appshell-canvas-harness";

export const metadata = {
  title: "AppShell dashboard canvas",
  description: "Editable dashboard canvas demo with layout reset.",
  robots: {
    index: false,
    follow: false,
  },
} satisfies Metadata;

export default function AppShellCanvasPage() {
  return (
    <ApplicationShell userName="Demo User" welcomeMessage="Editable dashboard canvas">
      <AppShellCanvasHarness />
    </ApplicationShell>
  );
}
