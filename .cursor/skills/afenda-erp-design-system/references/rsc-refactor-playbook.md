# RSC / Client Refactor (R3)

For A4, A5, A1, B8 failures. See [surface-quality-scan.md](surface-quality-scan.md).

```text
page.tsx (RSC)
  ├── load-x.server.ts
  ├── x-page-view.tsx
  └── x-page-actions.client.tsx
```

- `Promise.all` for independent fetches
- `"use client"` at leaf only — **stop** if fix requires moving it upward
- Server truth stays server-side (B8)
