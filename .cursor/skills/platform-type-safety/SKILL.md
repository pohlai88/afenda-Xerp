---
name: platform-type-safety
description: Audits and hardens TypeScript code across @afenda packages and apps for enterprise type safety. Covers branded ID types, discriminated unions, Result types, satisfies operator, interface vs type policy, catch-block narrowing, and forbidden patterns (any, as-cast, string unions for status). Use when reviewing TypeScript files, adding new types, writing service functions, or when the user mentions type safety, any, type assertions, branded types, or strict mode.
disable-model-invocation: true
paths:
  - packages/**
  - apps/**
---

# platform-type-safety

Enforces the code-level type safety patterns required by the project's already-strict tsconfig (`@afenda/typescript-config/base.json`).

The compiler flags are already correct. This skill governs **how code is written** to respect them.

## Audit checklist (score one point per ✅, target 9/10)

```
[ ] 1.  No any — use unknown + narrowing or explicit generic parameters
[ ] 2.  No as-casts except for provably safe DOM narrowing (as HTMLInputElement)
[ ] 3.  All catch-block errors typed as unknown, narrowed before use
[ ] 4.  IDs are branded types — no plain string passed where an ID is expected
[ ] 5.  Status/kind fields use discriminated unions — no string | "pending" | "done"
[ ] 6.  Config objects use satisfies — not as const or bare type annotation
[ ] 7.  Fallible functions return Result<T, E> — no raw throw in service layer
[ ] 8.  interface for object shapes; type for unions, aliases, mapped types
[ ] 9.  No non-null assertion (!) — use narrowing or Optional chaining with a fallback
[ ] 10. No @ts-ignore or @ts-expect-error without an explanatory comment
```

## Non-negotiable rules

1. **`any` is never acceptable.** Use `unknown` when the type is genuinely unknown and narrow before use. Use generics when the type is known at the call site.
2. **`as`-casts are evidence of a missing type.** The only allowed cast is narrowing a DOM event target (`e.target as HTMLInputElement`) where TypeScript cannot infer the concrete element type.
3. **All `catch (err)` blocks receive `unknown`.** The flag `useUnknownInCatchVariables` is already on. Use `instanceof Error` before accessing `.message`.
4. **IDs are branded.** A function that takes a `UserId` must not accept a raw `string`. Callers must brand the value at the boundary.
5. **`satisfies` over `as const` for config.** `satisfies Record<string, Route>` gives exhaustiveness checking; `as const` does not.
6. **`!` (non-null assertion) is banned** outside generated code. Narrow with `if`, optional chaining, or nullish coalescing.

---

## Canonical patterns

### Branded ID type

```ts
// Define once — in the contract file for the entity
type Brand<T, B extends string> = T & { readonly _brand: B };
export type UserId   = Brand<string, "UserId">;
export type OrgId    = Brand<string, "OrgId">;
export type PostId   = Brand<string, "PostId">;

// Brand at the trust boundary (DB row, auth session, validated input)
const userId = row.id as UserId;  // Only here — the DB is the trust source

// Downstream code receives and passes the branded type — no cast needed
function getUser(id: UserId): Promise<User> { ... }
```

### Discriminated union for status / result

```ts
// Status
type TaskStatus =
  | { kind: "pending" }
  | { kind: "running"; startedAt: Date }
  | { kind: "done"; completedAt: Date; output: string }
  | { kind: "failed"; error: string };

// Result
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Usage — exhaustive switch catches new variants at compile time
function describe(status: TaskStatus): string {
  switch (status.kind) {
    case "pending":  return "Waiting";
    case "running":  return `Running since ${status.startedAt.toISOString()}`;
    case "done":     return `Done: ${status.output}`;
    case "failed":   return `Failed: ${status.error}`;
  }
}
```

### `satisfies` for config objects

```ts
// ✅ satisfies — catches missing keys, preserves literal types
const ROUTES = {
  home:    "/",
  profile: "/profile",
  settings: "/settings",
} satisfies Record<string, string>;

// ❌ as const — no exhaustiveness check against the record shape
const ROUTES = { home: "/", profile: "/profile" } as const;
```

### catch-block narrowing

```ts
try {
  await riskyOp();
} catch (err: unknown) {
  if (err instanceof Error) {
    logger.error({ msg: err.message, stack: err.stack });
  } else {
    logger.error({ msg: "Unknown error", raw: String(err) });
  }
  return { ok: false, error: "Operation failed" };
}
```

### interface vs type policy

```ts
// interface — for object shapes, classes, extend-able contracts
export interface UserProfile {
  id: UserId;
  name: string;
  email: string;
}

// type — for unions, mapped types, aliases, conditional types
export type UserRole = "admin" | "member" | "viewer";
export type Nullable<T> = T | null;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

---

## Common violations table

| Pattern | Violation | Fix |
|---------|-----------|-----|
| `const x: any = ...` | Banned | Use `unknown` + narrow, or a generic |
| `(value as string)` | Unsafe cast | Add a type guard or adjust the upstream type |
| `catch (err) { err.message }` | Implicit any | `catch (err: unknown) { if (err instanceof Error) ... }` |
| `status: string` in an interface | Stringly typed | Discriminated union or `satisfies` literal map |
| `id: string` for an entity ID | No brand | `id: UserId` — brand at the trust boundary |
| `if (!user) throw ...` then `user!.name` | Non-null assertion | The `if` already narrows — remove `!` |
| `@ts-ignore` | Suppression | Add `@ts-expect-error` with a comment explaining why |

---

## Step-by-step workflow

1. Read the file or function under review.
2. Score against the checklist above.
3. Fix violations in this order:
   - `any` → `unknown` or generic (priority: breaks type propagation)
   - `as`-casts → type guards (priority: runtime safety)
   - Missing brands → add brand type, brand at boundary
   - String unions → discriminated unions
   - Non-null assertions → narrowing
4. Run `pnpm typecheck` (or `pnpm --filter <pkg> typecheck`) after each fix.

---

## Verification

```bash
pnpm typecheck           # root — all packages
pnpm --filter @afenda/erp typecheck   # single app
pnpm lint                # biome catches no-explicit-any
```

See [RULES.md](RULES.md) for the full tsconfig flag reference and what each flag prevents.
