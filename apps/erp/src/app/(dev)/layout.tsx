import type { ReactNode } from "react";

import { devHarnessMetadata } from "@/lib/metadata/site-metadata";

export const metadata = devHarnessMetadata;

export default function DevHarnessLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
