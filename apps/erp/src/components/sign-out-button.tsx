"use client";

import { signOut } from "@afenda/auth/client";
import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type SignOutButtonGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

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
      disabled={isSubmitting}
      emphasis="outline"
      intent="primary"
      onClick={handleSignOut}
      presentation="default"
      size="sm"
      type="button"
    >
      {isSubmitting ? "Signing out…" : "Sign out"}
    </Button>
  );
}
