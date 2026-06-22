import type { ReactNode } from "react";

import { authMetadata } from "@/lib/metadata/site-metadata";

export const metadata = authMetadata;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      {children}
    </main>
  );
}
