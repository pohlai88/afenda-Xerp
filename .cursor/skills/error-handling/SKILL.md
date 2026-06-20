---
name: error-handling
description: Enforces enterprise error handling patterns across @afenda packages and apps — Result<T,E> types in the service layer, AppError discriminated unions, React Error Boundaries per route segment, structured Server Action error returns, and log-before-surface discipline. Use when writing service functions, handling errors in Server Actions, adding error boundaries, or when the user mentions error handling, try-catch, throw, or error types.
disable-model-invocation: true
---

# error-handling

Errors that leak implementation details break trust and violate user privacy. Errors that are swallowed break debuggability. The discipline is: **log fully, surface minimally, never throw across boundaries.**

## Non-negotiable rules

1. **Service layer never throws to callers.** Return `Result<T, AppError>` from all fallible service functions. Exceptions stay inside the function.
2. **AppError is a discriminated union.** Every error kind has a `code` field. Callers switch on `code` — no string comparison, no `instanceof` cascade.
3. **Log before surface.** Every `AppError` is written to `@afenda/observability` with the full technical context (stack trace, correlationId, userId) before the user-facing `userMessage` is returned.
4. **Never surface internal details.** Stack traces, SQL state codes, DB column names, and internal enum values must never reach the client response.
5. **React Error Boundaries per route segment.** One `error.tsx` at the layout root is not enough. Each significant route segment in `apps/erp/src/app/` needs its own boundary.
6. **Server Actions return `{ ok: false, code, userMessage }` — never throw.**

---

## AppError discriminated union

```ts
// packages/kernel/src/errors/app-error.ts (or similar location)

export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type AppError =
  | { code: "VALIDATION_ERROR"; userMessage: string; fields?: Array<{ path: string; message: string }> }
  | { code: "UNAUTHORIZED";     userMessage: string }
  | { code: "FORBIDDEN";        userMessage: string }
  | { code: "NOT_FOUND";        userMessage: string; resource?: string }
  | { code: "CONFLICT";         userMessage: string; conflictOn?: string }
  | { code: "INTERNAL_ERROR";   userMessage: string; cause?: unknown };

// Convenience constructors
export const AppErrors = {
  validation: (fields: AppError & { code: "VALIDATION_ERROR" }["fields"]): AppError =>
    ({ code: "VALIDATION_ERROR", userMessage: "Please check the highlighted fields.", fields }),
  notFound:   (resource: string): AppError =>
    ({ code: "NOT_FOUND", userMessage: `${resource} not found.`, resource }),
  forbidden:  (): AppError =>
    ({ code: "FORBIDDEN", userMessage: "You do not have permission to perform this action." }),
  internal:   (cause?: unknown): AppError =>
    ({ code: "INTERNAL_ERROR", userMessage: "Something went wrong. Please try again.", cause }),
};
```

---

## Result<T, E> type

```ts
// packages/kernel/src/result.ts
export type Result<T, E = AppError> =
  | { ok: true;  value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Usage in service functions
async function createUser(input: CreateUserInput): Promise<Result<User>> {
  try {
    const existing = await db.user.findUnique({ where: { email: input.email } });
    if (existing) return err(AppErrors.conflict("email"));

    const user = await db.user.create({ data: input });
    return ok(user);
  } catch (cause: unknown) {
    logger.error({ msg: "createUser failed", cause });
    return err(AppErrors.internal(cause));
  }
}
```

---

## Log-before-surface pattern

```ts
// In a Server Action — always log, then return safe message
export async function updateProfile(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) return { ok: false, code: "UNAUTHORIZED", userMessage: "Sign in to continue." };

  const result = await userService.updateProfile(session.user.id, parseInput(formData));

  if (!result.ok) {
    // Log the full error internally
    logger.error({
      msg: "updateProfile failed",
      code:          result.error.code,
      userId:        session.user.id,
      correlationId: requestCorrelationId,
      cause:         result.error.code === "INTERNAL_ERROR" ? result.error.cause : undefined,
    });
    // Return only the safe user message
    return { ok: false, code: result.error.code, userMessage: result.error.userMessage };
  }

  return { ok: true, data: toProfileDTO(result.value) };
}
```

---

## React Error Boundary placement

```
apps/erp/src/app/
  error.tsx                        ← root fallback (catches unhandled errors)
  (protected)/
    error.tsx                      ← protected routes boundary
    settings/
      error.tsx                    ← settings-specific boundary
    posts/
      error.tsx                    ← posts-specific boundary
```

```tsx
// apps/erp/src/app/(protected)/error.tsx
"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to client-side observability (no stack trace to UI)
    console.error("Route segment error:", error.digest ?? "no-digest");
  }, [error]);

  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <p>We could not complete your request. Please try again.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Never-expose list

The following must never appear in a response body, toast, or user-visible error message:

- Stack traces (`err.stack`)
- SQL error messages (`violates unique constraint "users_email_key"`)
- DB column names or table names
- Internal enum values or status codes
- File paths (`/var/task/packages/database/src/...`)
- Environment variable names

---

## Checklist before shipping error-handling code

```
[ ] 1. Service function returns Result<T, AppError> — no raw throw to caller
[ ] 2. AppError code is from the defined union — no ad-hoc string codes
[ ] 3. Error logged to @afenda/observability with correlationId before user message returned
[ ] 4. User-facing message is generic — no internal details
[ ] 5. Route segment has an error.tsx boundary
[ ] 6. Server Action returns { ok: false, code, userMessage } — no throw
[ ] 7. Test covers the error path (not just the happy path)
```

See [PATTERNS.md](PATTERNS.md) for the full Result type implementation, unwrap helpers, and Error Boundary template.
