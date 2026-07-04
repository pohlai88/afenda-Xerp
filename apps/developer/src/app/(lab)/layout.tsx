import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <main
      className="min-h-dvh bg-background text-foreground"
      data-lab-segment="home"
    >
      {children}
    </main>
  );
}
