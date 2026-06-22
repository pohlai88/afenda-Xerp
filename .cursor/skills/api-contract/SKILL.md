---
name: api-contract
description: Enforces consistent API response shapes, HTTP status discipline, DTO mapping, and schema-co-location rules for all Next.js route handlers in @afenda/erp. Covers ApiResponse<T> success shape, ApiError error shape, PaginationMeta, HTTP status codes, and the no-raw-DB-records rule. Use when writing or reviewing route handlers (route.ts files), designing API endpoints, or when the user mentions API responses, HTTP status codes, pagination, or DTO design.
disable-model-invocation: true
---

# api-contract

Every route handler is a public API. Inconsistent shapes break clients; leaking internal fields breaks security.

## Response shape invariant

All route handlers use exactly two shapes:

```ts
// Success
{ data: T, meta?: PaginationMeta }

// Error
{ code: string, message: string, path?: string[] }
```

No other top-level keys. No `result`, `payload`, `body`, `response`, or ad-hoc wrappers.

### Governed ERP internal v1 exception

Routes wired through `createApiHandler` (`apps/erp/src/app/api/internal/v1/**`) use the **governed envelope**:

```ts
// Success
{ ok: true, data: T, meta: { requestId, correlationId, timestamp } }

// Error
{ ok: false, error: { code, message, correlationId?, details? }, meta: { ... } }
```

Always use `createApiHandler` for new internal v1 routes. Parse client responses with `readApiEnvelope` — see `docs/governance/api-contract.md`.

---

## Non-negotiable rules

1. **Consistent shape, always.** Every route returns `{ data }` on success or `{ code, message }` on error. No per-route shape variations.
2. **No raw DB records.** Always map rows to DTOs before serializing to JSON. A DB row may contain password hashes, internal flags, or audit timestamps — none of which belong in an API response.
3. **Zod schema for both request and response** in the same route file. The response schema is the DTO contract.
4. **HTTP status code is the primary signal.** The `code` in the error body is for programmatic handling. The HTTP status is for caching, monitoring, and middleware.
5. **No 200 for errors.** An error that returns `{ error: "not found" }` with status 200 breaks every HTTP monitoring tool and CDN.
6. **4xx for client errors; 5xx for server errors.** Never return 500 for invalid input; never return 400 for a DB crash.

---

## HTTP status code discipline

| Status | Meaning | When to use |
|--------|---------|-------------|
| 200 | OK | Successful GET, successful synchronous PUT/PATCH |
| 201 | Created | Successful POST that creates a resource |
| 204 | No Content | Successful DELETE or action with no return body |
| 400 | Bad Request | Input failed Zod validation |
| 401 | Unauthorized | No session — not authenticated |
| 403 | Forbidden | Authenticated but lacks permission for this resource |
| 404 | Not Found | Resource does not exist (or is hidden from this user) |
| 409 | Conflict | Unique constraint, business rule violation, optimistic lock |
| 422 | Unprocessable | Input is valid JSON but semantically invalid (use sparingly — prefer 400) |
| 500 | Internal Error | Unexpected server-side failure |

---

## Canonical GET handler

```ts
// apps/erp/src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@afenda/auth";
import { postService } from "@/services/post.service";

// Response DTO schema — the public contract
const PostResponseSchema = z.object({
  id:        z.string().uuid(),
  title:     z.string(),
  content:   z.string(),
  updatedAt: z.string().datetime(),
});

type PostResponse = z.infer<typeof PostResponseSchema>;

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Sign in to continue." },
      { status: 401 }
    );
  }

  const result = await postService.getPost(params.id, session.user.id);

  if (!result.ok) {
    const status = ERROR_STATUS[result.error.code] ?? 500;
    return NextResponse.json(
      { code: result.error.code, message: result.error.userMessage },
      { status }
    );
  }

  // Validate output shape — catches accidental internal field leaks
  const dto = PostResponseSchema.parse(toPostDTO(result.value));
  return NextResponse.json({ data: dto }, { status: 200 });
}
```

---

## Canonical POST handler

```ts
const CreatePostBodySchema = z.object({
  title:   z.string().min(1).max(200).trim(),
  content: z.string().min(1).max(50_000).trim(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ code: "UNAUTHORIZED", message: "Sign in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const result = CreatePostBodySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        code:    "VALIDATION_ERROR",
        message: "Invalid request body.",
        path:    result.error.issues.map((i) => i.path.join(".")),
      },
      { status: 400 }
    );
  }

  const createResult = await postService.createPost(result.data, session.user.id);

  if (!createResult.ok) {
    return NextResponse.json(
      { code: createResult.error.code, message: createResult.error.userMessage },
      { status: ERROR_STATUS[createResult.error.code] ?? 500 }
    );
  }

  const dto = PostResponseSchema.parse(toPostDTO(createResult.value));
  return NextResponse.json({ data: dto }, { status: 201 });
}
```

---

## Paginated list response

```ts
const ListPostsResponseSchema = z.object({
  data: z.array(PostResponseSchema),
  meta: z.object({
    total:   z.number().int(),
    page:    z.number().int(),
    perPage: z.number().int(),
    pages:   z.number().int(),
  }),
});

// Usage
return NextResponse.json({
  data: posts.map(toPostDTO),
  meta: { total, page, perPage, pages: Math.ceil(total / perPage) },
}, { status: 200 });
```

---

## DTO mapper rule

```ts
// ✅ Explicit mapper — only chosen fields
function toPostDTO(row: PostRow) {
  return {
    id:        row.id,
    title:     row.title,
    content:   row.content,
    updatedAt: row.updated_at.toISOString(),
    // ← no author_id, no deleted_at, no internal_status
  };
}

// ❌ Raw DB row — leaks internal fields
return NextResponse.json({ data: row }, { status: 200 });
```

---

## Error status map

```ts
const ERROR_STATUS: Record<string, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED:     401,
  FORBIDDEN:        403,
  NOT_FOUND:        404,
  CONFLICT:         409,
  INTERNAL_ERROR:   500,
};
```

---

## Checklist before shipping a route handler

```
[ ] 1. Request body validated with Zod before any service call
[ ] 2. Session verified — unauthenticated returns 401 immediately
[ ] 3. Response uses { data } or { code, message } — no other shape
[ ] 4. HTTP status matches the semantic: 201 for POST create, 204 for DELETE, 4xx/5xx for errors
[ ] 5. DTO mapper used — no raw DB row in response
[ ] 6. Response DTO validated with Zod schema before returning (catches field leaks)
[ ] 7. Paginated responses include meta: { total, page, perPage, pages }
```

See [SHAPES.md](SHAPES.md) for the canonical TypeScript types and Zod schemas ready to copy into `lib/api.ts`.
