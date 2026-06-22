"use client";

import { signOut } from "@afenda/auth/client";
import { Button } from "@afenda/ui";
import { mapStockButtonProps } from "@afenda/ui/governance";
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
    <Button
      {...mapStockButtonProps("outline", "sm")}
      disabled={isSubmitting}
      onClick={handleSignOut}
      type="button"
    >
      {isSubmitting ? "Signing out…" : "Sign out"}
    </Button>
  );
}
