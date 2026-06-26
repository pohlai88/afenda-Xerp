import { connection } from "next/server";
import type { ReactNode } from "react";

import { devHarnessMetadata } from "@/lib/metadata/site-metadata";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";

export const metadata = devHarnessMetadata;

export default async function DevHarnessLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  return children;
}
