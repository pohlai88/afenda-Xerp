"use client";

import { signIn } from "@afenda/auth/client";
import { Button, Input, Label } from "@afenda/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn.email({
      email,
      password,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Sign-in failed.");
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <section className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      <header className="mb-5">
        <h1 className="font-semibold text-foreground text-xl">Sign in</h1>
        <p className="mt-2 text-foreground-muted text-sm">
          Afenda ERP uses Better Auth for application-owned identity.
        </p>
      </header>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          disabled={isSubmitting}
          emphasis="solid"
          intent="primary"
          presentation="default"
          size="md"
          type="submit"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </section>
  );
}
