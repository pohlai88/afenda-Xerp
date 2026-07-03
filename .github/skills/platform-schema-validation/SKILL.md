---
name: platform-schema-validation
description: Enforces Zod schema-first validation discipline for all Server Actions, route handlers, and API boundaries in the @afenda/erp app. Covers safeParse vs parse decision rules, schema co-location, z.infer type inference, DTO mapping, and structured error surfacing. Use when writing or reviewing Server Actions, API route handlers, form validation, or any code that processes external input.
disable-model-invocation: true
paths:
  - apps/erp/**
  - packages/**
---

# platform-schema-validation

Zod is the single source of truth for all external input shapes. No input from a user, form, URL, or external service reaches a DB call or IO operation without a Zod parse.

## Non-negotiable rules

1. **Schema co-location.** Define the Zod schema in the same file as the action or route handler that uses it. Do not maintain a separate `schemas/` barrel — distance between schema and usage causes drift.
2. **`z.infer<>` only.** Never write a TypeScript type manually for validated data. The type comes from the schema: `type CreateUserInput = z.infer<typeof CreateUserSchema>`.
3. **`safeParse` for user input; `parse` for internal invariants.** User-facing failures are expected; internal contract violations are bugs.
4. **Never expose `ZodError` to the client.** Map validation failures to `{ code: "VALIDATION_ERROR", message: string, path: string[] }` before returning.
5. **No raw DB records to the client.** Always transform the DB row to a DTO via `z.transform` or an explicit mapper.
6. **Validate before any IO.** The Zod parse must occur before the first DB query, file write, or email send in every action.

---

## parse vs safeParse decision rule

```
Input from a user (form, URL param, query string, request body)?
  → safeParse — failure is expected; return structured error to caller

Internal contract between packages (config, env, registry)?
  → parse — failure means a bug; throw immediately at startup/import time

Async validation (DB uniqueness check)?
  → safeParseAsync — same rules as safeParse, awaited
```

---

## Canonical Server Action pattern

```ts
"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { createCorrelationId } from "@afenda/observability";

// 1. Schema defined in the same file
const CreatePostSchema = z.object({
  title:   z.string().min(1).max(200).trim(),
  content: z.string().min(1).max(50_000).trim(),
  orgId:   z.string().uuid(),
});

type CreatePostInput = z.infer<typeof CreatePostSchema>;

// 2. Action validates before any IO
export async function createPost(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const result = CreatePostSchema.safeParse(raw);

  if (!result.success) {
    return {
      ok: false as const,
      code: "VALIDATION_ERROR",
      errors: result.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    };
  }

  const input: CreatePostInput = result.data;
  // 3. DB call only after successful parse
  const post = await db.post.create({ data: input });
  return { ok: true as const, data: toPostDTO(post) };
}

// 4. DTO mapper — no raw DB row to client
function toPostDTO(row: typeof post) {
  return { id: row.id, title: row.title, content: row.content };
}
```

---

## Canonical route handler pattern

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CreateUserBodySchema = z.object({
  email: z.string().email(),
  name:  z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const result = CreateUserBodySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
        path: result.error.issues.map((i) => i.path.join(".")),
      },
      { status: 400 }
    );
  }

  const user = await createUser(result.data);
  return NextResponse.json({ data: toUserDTO(user) }, { status: 201 });
}
```

---

## DTO mapper rule

Transform every DB row before it leaves the server boundary:

```ts
// ✅ Explicit mapper — only chosen fields, renamed if needed
function toUserDTO(row: UserRow) {
  return {
    id:    row.id,
    name:  row.display_name,   // rename from DB column
    email: row.email,
    role:  row.role_code,
    // ← no createdAt, updatedAt, password_hash, internal_flags
  };
}

// ✅ z.transform inline (for simple cases)
const UserResponseSchema = UserRowSchema.transform((row) => ({
  id:   row.id,
  name: row.display_name,
}));

// ❌ Raw DB row returned — exposes internal fields, breaks on schema change
return NextResponse.json({ data: row });
```

---

## Error surface format

All validation errors returned to callers use this shape:

```ts
type ValidationFailure = {
  ok:     false;
  code:   "VALIDATION_ERROR";
  errors: Array<{ path: string; message: string }>;
};

// Never return a raw ZodError or call .format() and return it directly
```

---

## Verification

```bash
pnpm --filter @afenda/erp typecheck
pnpm lint
```

Checklist before shipping an action or route:

```
[ ] 1. Schema defined in the same file as the action/handler
[ ] 2. TypeScript type inferred via z.infer<> — no manual duplication
[ ] 3. safeParse used for user input; parse for internal config
[ ] 4. Zod parse occurs before any DB/IO call
[ ] 5. ZodError not exposed — mapped to { code, errors[] }
[ ] 6. Response uses DTO mapper — no raw DB row
[ ] 7. Schema covers all fields actually used downstream
```

See [PATTERNS.md](PATTERNS.md) for extended examples including nested objects, union discrimination, and environment schema.
