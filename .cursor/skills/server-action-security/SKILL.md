---
name: server-action-security
description: Audits and hardens Next.js Server Actions for enterprise security — session re-verification, IDOR prevention, role-based authorization, input validation gates, and safe return value shaping. Use when writing or reviewing Server Actions ("use server" files), when adding mutations, when the user mentions auth, authorization, session, or security in the context of Next.js actions.
disable-model-invocation: true
---

# server-action-security

Render-time session gating is not a security boundary. Every Server Action is a public API endpoint reachable by any client. Treat each action with the same discipline as a public HTTP route.

## Security audit checklist (score one point per ✅, target 8/8)

```
[ ] 1. Session re-verified inside the action body — not inherited from page render
[ ] 2. Unauthenticated call returns early — not falls through to the DB call
[ ] 3. Resource ownership checked before any mutation (IDOR prevention)
[ ] 4. User role verified before admin/privileged operations
[ ] 5. All inputs validated with Zod before any DB or IO operation
[ ] 6. Return value is shaped — no raw DB row, no internal field names
[ ] 7. Errors returned as { ok: false, code, userMessage } — no throw to client
[ ] 8. FormData and query params treated as untrusted — never read directly as typed
```

**Score 7/8:** conditionally accepted — document the skipped item.
**Score < 7/8:** not accepted — fix all blockers before merge.

---

## Non-negotiable rules

1. **Re-verify session inside every action.** A user authenticated at page-render time may have their session revoked by the time the action runs. Call `auth()` or `verifySession()` at the top of every action body.
2. **Return early on auth failure.** Never fall through to the business logic if the session check fails.
3. **Check resource ownership before mutation.** Fetching a record by ID from user input is an IDOR risk. Always verify `resource.ownerId === session.user.id` (or equivalent) before mutating.
4. **Validate role before privileged operations.** Role claims from the session must be re-read from the DB or a signed token — never trust a role passed in the request body.
5. **Zod parse before any IO.** See `schema-validation` skill for parse patterns.
6. **Never throw to the client.** Uncaught throws surface stack traces in dev and expose error shapes in prod. Always return `{ ok: false, code, userMessage }`.
7. **Shape the return value.** Only return fields the UI actually needs. No internal DB columns, no `createdAt` unless the UI renders it, no status enum internals.

---

## Canonical secure action shape

```ts
"use server";

import { z } from "zod";
import { auth } from "@afenda/auth";
import { db } from "@/lib/db";
import { writeAuditEvent } from "@afenda/observability";

const DeletePostSchema = z.object({ postId: z.string().uuid() });

export async function deletePost(formData: FormData) {
  // 1. Re-verify session — never trust render-time session
  const session = await auth();
  if (!session?.user) {
    return { ok: false, code: "UNAUTHORIZED", userMessage: "Sign in to continue." };
  }

  // 2. Validate input before any DB call
  const result = DeletePostSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      userMessage: "Invalid request.",
      errors: result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    };
  }

  const { postId } = result.data;

  // 3. Fetch resource and verify ownership (IDOR prevention)
  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post) {
    return { ok: false, code: "NOT_FOUND", userMessage: "Post not found." };
  }
  if (post.authorId !== session.user.id) {
    return { ok: false, code: "FORBIDDEN", userMessage: "You do not have permission to delete this post." };
  }

  // 4. Mutate only after all checks pass
  await db.post.delete({ where: { id: postId } });

  // 5. Audit the action
  await writeAuditEvent({
    actor:    { type: "user", id: session.user.id },
    action:   "post.delete",
    resource: { type: "post", id: postId },
    outcome:  "success",
  });

  // 6. Return shaped value — not the raw DB record
  return { ok: true };
}
```

---

## Role-check pattern

```ts
// ✅ Read role from session (signed by auth provider)
const session = await auth();
if (session?.user?.role !== "admin") {
  return { ok: false, code: "FORBIDDEN", userMessage: "Admin access required." };
}

// ❌ Trust role from request body — trivially spoofed
const { role } = Object.fromEntries(formData);
if (role !== "admin") { ... }
```

---

## IDOR risk matrix

| Input | Risk without ownership check | Mitigation |
|-------|----------------------------|------------|
| `postId` from form | Any user can delete any post | `post.authorId === session.user.id` |
| `orgId` from URL | User accesses another org's data | `member.orgId === session.user.orgId` |
| `userId` in path | User edits another user's profile | `targetId === session.user.id` or admin role |
| `fileId` from body | User downloads another's file | `file.ownerId === session.user.id` |

---

## Return value shaping

```ts
// ✅ Only fields the UI renders
return {
  ok: true,
  data: { id: post.id, title: post.title, updatedAt: post.updatedAt.toISOString() },
};

// ❌ Raw DB row — exposes password_hash, internal flags, timestamps not needed
return { ok: true, data: post };
```

---

## Error code vocabulary

| Code | When to use |
|------|-------------|
| `UNAUTHORIZED` | No session — not signed in |
| `FORBIDDEN` | Signed in but lacks permission for this resource |
| `NOT_FOUND` | Resource does not exist (or is hidden from this user) |
| `VALIDATION_ERROR` | Input failed Zod schema |
| `CONFLICT` | Unique constraint or business rule violation |
| `INTERNAL_ERROR` | Unexpected failure — log it, surface generic message |

See [CHECKLIST.md](CHECKLIST.md) for a per-action audit table template.
