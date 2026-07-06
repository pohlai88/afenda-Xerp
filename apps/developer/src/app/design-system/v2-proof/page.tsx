import type { Metadata } from "next";
import { V2ProofRoute } from "./_components/v2-proof-route.client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description:
    "Phase 8 consumer proof route for @afenda/shadcn-studio-v2 public exports.",
  robots: {
    follow: false,
    index: false,
  },
  title: "V2 Design System Proof",
};

export default function V2DesignSystemProofPage() {
  return <V2ProofRoute />;
}
