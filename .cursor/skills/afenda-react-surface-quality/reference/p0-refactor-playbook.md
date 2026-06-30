# P0 refactor playbook

Use when **R3** (RSC/client split) is required — A4, A5, A1, or B8 failures.

Effort ladder: [SKILL.md §2](../SKILL.md) — do not R3 a file that only needs R1.

## Server page split (A4 + A5)

```text
page.tsx (RSC)
  ├── loadX.server.ts     — data fetch, Promise.all
  ├── x-page-view.tsx     — presentational (no "use client")
  └── x-page-actions.client.tsx — smallest client island
```

## Parallel loaders (A1)

```typescript
const [users, settings] = await Promise.all([
  loadUsers(context),
  loadSettings(context),
]);
```

## Client boundary (A5)

Move `"use client"` to the **leaf** that needs hooks — never wrap entire route layouts to fix a small interactive child.

**Hard stop:** If the fix requires moving `"use client"` upward, stop and report — redesign the split instead.

## Block merge fixes (B7)

```tsx
<form action={submitAction}>
  <SubmitButton />  {/* useFormStatus lives here */}
</form>
```

## Server truth (B8)

Canonical data from loaders/RSC stays server-side. Client islands hold draft UI, open/close, selection — not a mirror of server query results.
