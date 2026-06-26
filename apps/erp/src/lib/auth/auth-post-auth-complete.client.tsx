"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchPostAuthEntryPath } from "@/lib/auth/fetch-post-auth-entry-path.client";

export function AuthPostAuthCompleteClient({
  signInPath,
}: {
  readonly signInPath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function complete() {
      try {
        const destination = await fetchPostAuthEntryPath(
          searchParams.get("next")
        );

        if (!cancelled) {
          router.replace(destination);
          router.refresh();
        }
      } catch {
        if (!cancelled) {
          setError(
            "We could not validate your workspace membership. Try signing in again."
          );
        }
      }
    }

    void complete();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  if (error === null) {
    return (
      <p aria-live="polite" role="status">
        Completing sign-in…
      </p>
    );
  }

  return (
    <div>
      <p className="erp-auth-form__error" role="alert">
        {error}
      </p>
      <p>
        <a className="erp-auth-form__link" href={signInPath}>
          Return to sign in
        </a>
      </p>
    </div>
  );
}
