import type { Metadata } from "next";

import { ApplicationShell } from "@afenda/appshell";

import { PolicyGateDemoHarness } from "@/components/policy-gate-demo-harness";

export const metadata = {
  title: "Policy gate UX",
  description: "Policy gate inline and dialog surfaces for governed API responses.",
  robots: {
    index: false,
    follow: false,
  },
} satisfies Metadata;

export default function PolicyGateDemoPage() {
  return (
    <ApplicationShell userName="Demo User" welcomeMessage="Policy gate UX">
      <PolicyGateDemoHarness />
    </ApplicationShell>
  );
}
