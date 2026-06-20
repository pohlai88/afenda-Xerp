# Error Handling — Extended Patterns

## Full Result type with unwrap helpers

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

// Unwrap or throw — only for internal code that cannot recover
export function unwrap<T>(result: Result<T>): T {
  if (result.ok) return result.value;
  throw new Error(`unwrap called on Err: ${result.error.code}`);
}

// Map value if ok, pass error through
export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (result.ok) return ok(fn(result.value));
  return result;
}

// Combine multiple Results — fails fast on first error
export function combineResults<T extends readonly Result<unknown>[]>(
  results: T
): Result<{ [K in keyof T]: T[K] extends Result<infer V> ? V : never }> {
  for (const result of results) {
    if (!result.ok) return result as Result<never, AppError>;
  }
  return ok(results.map((r) => (r as Result<unknown> & { ok: true }).value)) as never;
}
```

## Error boundary template with reset and reporting

```tsx
// apps/erp/src/app/(protected)/posts/error.tsx
"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PostsErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    // Report to observability — digest is the server-side error ID
    fetch("/api/report-error", {
      method: "POST",
      body: JSON.stringify({ digest: error.digest }),
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  }, [error]);

  return (
    <section role="alert" aria-live="assertive">
      <h2>Could not load posts</h2>
      <p>Something went wrong while loading this page.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
```

## Chaining Result in a multi-step workflow

```ts
async function publishPost(postId: PostId, userId: UserId): Promise<Result<PublishedPost>> {
  // Step 1 — fetch
  const fetchResult = await postService.getPost(postId);
  if (!fetchResult.ok) return fetchResult;

  const post = fetchResult.value;

  // Step 2 — ownership check (business rule, not a service call)
  if (post.authorId !== userId) {
    return err(AppErrors.forbidden());
  }

  // Step 3 — publish
  const publishResult = await postService.publishPost(postId);
  if (!publishResult.ok) return publishResult;

  // Step 4 — audit
  await writeAuditEvent({
    actor:    { type: "user", id: userId },
    action:   "post.publish",
    resource: { type: "post", id: postId },
    outcome:  "success",
  });

  return ok(publishResult.value);
}
```

## Mapping AppError to HTTP status in route handlers

```ts
const ERROR_STATUS: Record<AppErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED:     401,
  FORBIDDEN:        403,
  NOT_FOUND:        404,
  CONFLICT:         409,
  INTERNAL_ERROR:   500,
};

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await postService.deletePost(params.id as PostId);

  if (!result.ok) {
    return NextResponse.json(
      { code: result.error.code, message: result.error.userMessage },
      { status: ERROR_STATUS[result.error.code] }
    );
  }

  return new NextResponse(null, { status: 204 });
}
```

## Testing error paths

```ts
import { describe, expect, it, vi, afterEach } from "vitest";
import { createPost } from "../post.service.js";

describe("createPost — error paths", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns CONFLICT when title already exists", async () => {
    vi.spyOn(db.post, "findUnique").mockResolvedValue({ id: "existing" } as Post);
    const result = await createPost({ title: "Duplicate", content: "..." });
    expect(result.ok).toBe(false);
    expect(result.error.code).toBe("CONFLICT");
  });

  it("returns INTERNAL_ERROR when DB throws unexpectedly", async () => {
    vi.spyOn(db.post, "create").mockRejectedValue(new Error("DB connection lost"));
    const result = await createPost({ title: "New", content: "..." });
    expect(result.ok).toBe(false);
    expect(result.error.code).toBe("INTERNAL_ERROR");
  });
});
```
