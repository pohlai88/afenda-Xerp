import type { ReactNode } from "react";

import { authMetadata } from "@/lib/metadata/site-metadata";

export const metadata = authMetadata;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
