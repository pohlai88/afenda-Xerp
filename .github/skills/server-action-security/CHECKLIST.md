# Server Action Security — Per-Action Audit Table

Copy this template for each action being reviewed. One row per check.

## Audit table template

| Check | Status | Notes |
|-------|--------|-------|
| Session re-verified at action entry | ✅ / ❌ | |
| Unauthenticated → early return (no fallthrough) | ✅ / ❌ | |
| Input validated with Zod before any IO | ✅ / ❌ | |
| Resource fetched by user-supplied ID | ✅ / ❌ | IDOR risk if present without ownership check |
| Ownership verified (resource.ownerId === session.user.id) | ✅ / N/A | N/A if action operates on user's own data only |
| Role check present for privileged operations | ✅ / N/A | N/A if action has no role restriction |
| Return value shaped (no raw DB row) | ✅ / ❌ | |
| No throw to client — uses { ok, code, userMessage } | ✅ / ❌ | |

## Common Next.js Server Action vulnerabilities

### 1. Missing session re-verification

```ts
// ❌ Vulnerable — session from page render may be stale
export default async function Page() {
  const session = await auth();
  // ...
  async function deleteItem() {
    "use server";
    // session is captured from closure — not re-verified
    await db.item.delete({ where: { id: itemId } });
  }
}

// ✅ Correct — session re-verified inside the action
async function deleteItem() {
  "use server";
  const session = await auth();  // fresh check
  if (!session?.user) return { ok: false, code: "UNAUTHORIZED" };
  // ...
}
```

### 2. IDOR via user-supplied ID

```ts
// ❌ Vulnerable — no ownership check
export async function getDocument(docId: string) {
  "use server";
  const session = await auth();
  if (!session) return null;
  return db.document.findUnique({ where: { id: docId } });  // any user's doc!
}

// ✅ Correct
export async function getDocument(docId: string) {
  "use server";
  const session = await auth();
  if (!session?.user) return { ok: false, code: "UNAUTHORIZED" };
  const doc = await db.document.findUnique({ where: { id: docId } });
  if (!doc || doc.ownerId !== session.user.id) {
    return { ok: false, code: "NOT_FOUND" };  // hide existence from unauthorized users
  }
  return { ok: true, data: toDocDTO(doc) };
}
```

### 3. Trusting client-sent role

```ts
// ❌ Vulnerable — attacker sends role: "admin" in FormData
export async function adminAction(formData: FormData) {
  "use server";
  const role = formData.get("role");
  if (role !== "admin") return { ok: false };
  await dangerousAdminOperation();
}

// ✅ Correct — read role from session (server-signed)
export async function adminAction() {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { ok: false, code: "FORBIDDEN", userMessage: "Admin only." };
  }
  await dangerousAdminOperation();
}
```

### 4. Exposing error internals

```ts
// ❌ Leaks implementation details
try {
  await db.user.create({ data });
} catch (err) {
  throw err;  // stack trace may reach client in dev
}

// ✅ Map before return
try {
  await db.user.create({ data });
} catch (err: unknown) {
  logger.error({ msg: "createUser failed", error: err instanceof Error ? err.message : String(err) });
  return { ok: false, code: "INTERNAL_ERROR", userMessage: "Something went wrong. Please try again." };
}
```

## OWASP references

- [A01: Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) — IDOR, missing auth checks
- [A03: Injection](https://owasp.org/Top10/A03_2021-Injection/) — SQL via unvalidated input (mitigated by Zod + ORM)
- [A04: Insecure Design](https://owasp.org/Top10/A04_2021-Insecure_Design/) — Missing rate limiting, no audit trail
- [A07: Auth Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/) — Stale session, missing re-verify
