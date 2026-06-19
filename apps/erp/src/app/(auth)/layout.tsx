import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main
      style={{
        alignItems: "center",
        background: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1.5rem",
      }}
    >
      {children}
    </main>
  );
}
