import type { Metadata } from "next";
import { parseV2ProofSearchParams } from "@/lib/v2-proof/surface-visibility";
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

interface V2DesignSystemProofPageProps {
  readonly searchParams: Promise<{
    readonly verify?: string;
    readonly surfaces?: string;
  }>;
}

export default async function V2DesignSystemProofPage({
  searchParams,
}: V2DesignSystemProofPageProps) {
  const params = await searchParams;
  const initialSurfaceVisibility = parseV2ProofSearchParams(params);

  return <V2ProofRoute initialSurfaceVisibility={initialSurfaceVisibility} />;
}
