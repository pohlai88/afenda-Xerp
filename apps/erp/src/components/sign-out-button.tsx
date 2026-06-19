"use client";

import { signOut } from "@afenda/auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignOut() {
    setIsSubmitting(true);

    await signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <button
      disabled={isSubmitting}
      onClick={handleSignOut}
      style={{
        background: "transparent",
        border: "1px solid #cbd5e1",
        borderRadius: "0.375rem",
        color: "#334155",
        cursor: "pointer",
        fontSize: "0.75rem",
        marginTop: "0.375rem",
        padding: "0.25rem 0.5rem",
        width: "100%",
      }}
      type="button"
    >
      {isSubmitting ? "Signing out…" : "Sign out"}
    </button>
  );
}
