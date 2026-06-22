import type { Metadata } from "next";

import { GovernanceIntegrationHarness } from "@/components/governance-integration-harness";

export const metadata = {
  title: "Governance integration harness",
  description:
    "Non-production proof of AppShell + Metadata UI downstream composition.",
  robots: {
    index: false,
    follow: false,
  },
} satisfies Metadata;

export default function GovernanceIntegrationPage() {
  return <GovernanceIntegrationHarness />;
}
