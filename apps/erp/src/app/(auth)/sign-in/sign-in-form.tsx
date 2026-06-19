"use client";

import { signIn } from "@afenda/auth/client";
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
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        maxWidth: "24rem",
        padding: "1.5rem",
        width: "100%",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem" }}>Sign in</h1>
      <p style={{ color: "#64748b", margin: "0 0 1.25rem" }}>
        Afenda ERP uses Better Auth for application-owned identity.
      </p>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="email"
          style={{ display: "block", marginBottom: "0.75rem" }}
        >
          Email
          <input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{
              display: "block",
              marginTop: "0.25rem",
              padding: "0.5rem",
              width: "100%",
            }}
            type="email"
            value={email}
          />
        </label>
        <label
          htmlFor="password"
          style={{ display: "block", marginBottom: "0.75rem" }}
        >
          Password
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{
              display: "block",
              marginTop: "0.25rem",
              padding: "0.5rem",
              width: "100%",
            }}
            type="password"
            value={password}
          />
        </label>
        {error ? (
          <p role="alert" style={{ color: "#b91c1c", marginBottom: "0.75rem" }}>
            {error}
          </p>
        ) : null}
        <button
          disabled={isSubmitting}
          style={{
            background: "#0f172a",
            border: 0,
            borderRadius: "0.375rem",
            color: "#f8fafc",
            cursor: "pointer",
            padding: "0.625rem 1rem",
            width: "100%",
          }}
          type="submit"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </section>
  );
}
