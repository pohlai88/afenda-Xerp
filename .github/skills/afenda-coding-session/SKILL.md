---
name: afenda-coding-session
description: Encodes the Afenda monorepo's full coding quality standard AND agent execution guardrail for every session. Three layers — (1) Session Discipline: non-drift execution contract, anti-drift hard stops, package authority matrix; (2) Implementation Quality: TypeScript discipline (branded IDs, no any, satisfies, discriminated unions), React/Next.js App Router patterns, Governed UI UI governance, Drizzle ORM, Vitest testing; (3) Completion Evidence: mandatory completion report with pass/fail drift-prevention proof. Invoke with /afenda-coding-session or attach explicitly at the start of any coding task — new feature, new component, refactor, bug fix, or skill/doc maintenance.
disable-model-invocation: true
---

# Afenda Coding Session Standards

**Core principle:** Code must stay inside authority boundaries. This skill proves it with evidence, not just style rules.

**Announce at start:** "I'm using afenda-coding-session — stating the execution contract before edits."

**Always-on gate:** `.cursor/rules/afenda-coding-session.mdc` (Phase 0 + Phase 2 apply even when this skill is not attached).

## When this skill triggers

| Trigger | Source |
|---------|--------|
| User invokes `/afenda-coding-session` | Explicit slash command |
| User attaches skill manually | Composer skill picker |
| Any coding task in this repo | `.cursor/rules/afenda-coding-session.mdc` (compact contract) |
| Skill or doc maintenance | Same contract — meta-work is not exempt |

## Session phases (do not skip)

| Phase | Action | Skill sections |
|-------|--------|----------------|
| **0 · Contract** | State §0 six lines; **paste Handoff from PAS slice if present**; check §0.1 hard stops; search `docs/adr/` + `docs/PAS/` before claiming no pending decision | §0, §0.0, §0.1, §0.2, §1 |
| **1 · Implement** | Edit only allowed files; follow layer order and implementation rules | §2 – §10 |
| **2 · Evidence** | Post §11 Completion Report with pass/fail drift table and gates run | §11 |

---

## 0.0 · Receiving handoff — PAS (active)

When the task touches a foundation or domain package listed in [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts):

1. Read [`foundation-delivery-authority.md`](../../../docs/PAS/README.md) — PAS workflow and authority hierarchy.
2. Read the registry entry: `lane`, `gates`, `prohibited`, `allowedAgents`, `runtimeOwner`.
3. Read [`afenda-runtime-truth-matrix.md`](../../../docs/PAS/pas-status-index.md) for evidence status.
4. Read parent PAS under `docs/PAS/<DOMAIN-FOLDER>/` and target slice under `docs/PAS/KERNEL/SLICE/` (or domain `SLICE/`) — copy one §Handoff block into Phase 0.
5. At session end, §11 Completion Report closes slice gaps + enterprise attestation (enterprise-erp-standards §9).

**Do not author canonical standards outside `docs/PAS/`.** Registry edits → `foundation-registry-owner` only.

**Planning:** [pas-slice-planner](../pas-slice-planner/SKILL.md) · **Kernel:** [kernel-authority](../kernel-authority/SKILL.md)

**Subagent:** [afenda-governed-implementer](../../../.cursor/agents/afenda-governed-implementer.md) for governed ad-hoc work.

---

## 0 · Non-drift execution contract

**Before editing any code, the agent must state the following.** Do not start editing until each line is answered.

```
1. Objective         — the exact change, in one sentence.
2. Allowed layer     — the single package/layer permitted (see §2, §0.2).
3. Files to change    — the explicit list expected to change.
4. Prohibited        — files/packages that must NOT be touched.
5. Authority          — the owning authority being followed (see §0.2):
                          Architecture · Design System · UI Primitive Governance ·
                          Metadata UI · Kernel/Multi-tenancy · Database · Permission
6. Acceptance gates   — the gates required before completion (see §10, §11).
```

> If the task requires upstream contracts that do not exist, **stop and report the
> missing contract.** Do not silently create parallel rules, local registries, local
> constants, local variants, local permissions, or local tenant resolution.

---

## 0.1 · Anti-drift hard stops

**Stop immediately and ask for architectural direction** if any of these are true:

- A consumer package needs to define its own design token, recipe, variant, permission, tenant resolver, or metadata contract.
- A UI request appears to require editing `packages/shadcn-studio/src/components-ui/` when the user only asked for `apps/erp`.
- A feature requires cross-package imports not already allowed by the Architecture Authority.
- A change requires database schema changes but no migration ownership is defined.
- A test requires mocking governance instead of using the canonical resolver.
- The implementation would duplicate an existing registry, contract, route, capability, or policy.
- You would claim "no pending decision" without searching **`docs/adr/`** and **`docs/PAS/`** (PR-only search is insufficient).

Drifting "just to make it work" is never acceptable. A blocked task reported honestly
ranks above a silently completed task that crossed an authority boundary.

---

## 0.2 · Package authority matrix

Each change has exactly **one owning authority**. Consumers may *use* a contract but may
never *redefine* it locally.

| Authority | Owning package(s) | Owns | Consumers may NOT |
|-----------|-------------------|------|-------------------|
| **Architecture** | `packages/architecture-authority` | Allowed dependency directions, package boundaries | Cross-import outside declared boundaries |
| **Presentation (PAS-006)** | `@afenda/shadcn-studio` | Blocks, metadata binding, studio CSS | Fork presentation SSOT in ERP; import removed legacy packages |
| **Metadata UI (ERP consumer)** | `apps/erp/src/lib/metadata/` | IS-003 operator surface hydration | Invent local metadata contracts |
| **Kernel / Multi-tenancy** | `packages/kernel` | Operating-context + tenant resolution | Inline tenant/context lookups |
| **Database** | `packages/database` | Schema, migrations, RLS | Hand-edit migrations; raw cross-tenant queries |
| **Permission** | `packages/permissions`, `packages/entitlements` | Capabilities, policy checks | Define local permission constants |

When a change *needs* something owned elsewhere, the correct move is to **request/extend
the upstream contract**, not to fork it inside the consumer.

---

## 1 · Session start checklist

Before writing any code, confirm:

```
[ ] Stated the §0 execution contract?  (objective, layer, files, prohibited, authority, gates)
[ ] Checked §0.1 anti-drift hard stops? (none triggered, or escalated)
[ ] Which layer am I editing?          (see §2 — layer order)
[ ] Does the change touch ERP presentation?  (see §6 — PAS-006 / shadcn-studio)
[ ] Does it touch apps/erp/**?         (read Next.js docs via MCP before guessing)
[ ] Are existing tests passing?        pnpm typecheck && pnpm test:run
```

---

## 2 · Layer order (never skip upward)

| # | Layer | Path |
|---|-------|------|
| 1 | App wiring | `apps/erp/src/` |
| 2 | Storybook | `apps/storybook/` |
| 3 | Studio blocks / layouts | `packages/shadcn-studio/src/components-layouts/`, `components-auth-shell/` |
| 4 | Studio primitives | `packages/shadcn-studio/src/components-ui/` — **ask before editing** |
| 5 | Shared packages | `packages/kernel/`, `packages/database/`, `packages/permissions/` |

A layout or polish request in `apps/erp` is **not** permission to edit `packages/shadcn-studio/src/components-ui/` without explicit scope.  
Edit one layer at a time; finish it before moving to the next.

---

## 3 · TypeScript — non-negotiable rules

### No `any`
```ts
// ❌ always banned
const handler = (e: any) => {};

// ✅ unknown + narrow, or generic
const handler = (e: unknown) => {
  if (e instanceof Error) console.error(e.message);
};
```

### Branded IDs at trust boundaries
```ts
type Brand<T, B extends string> = T & { readonly _brand: B };
export type TenantId  = Brand<string, "TenantId">;
export type UserId    = Brand<string, "UserId">;
export type OrgId     = Brand<string, "OrgId">;

// Brand once — at the DB row / auth session boundary
const tenantId = row.tenant_id as TenantId;

// Downstream: pass the type, no cast needed
function getTenantContext(id: TenantId): Promise<TenantContext> { ... }
```

### `satisfies` for config objects (not `as const`)
```ts
// ✅ catches missing keys and preserves literals
const ROUTES = {
  home:     "/",
  settings: "/settings",
} satisfies Record<string, string>;

// ❌ no exhaustiveness check
const ROUTES = { home: "/", settings: "/settings" } as const;
```

### Discriminated unions for status/kind
```ts
type TaskStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: TaskData }
  | { kind: "error"; message: string };

// Exhaustive switch — compiler catches new variants
switch (status.kind) {
  case "idle":    return null;
  case "loading": return <Spinner />;
  case "success": return <TaskView data={status.data} />;
  case "error":   return <ErrorAlert message={status.message} />;
}
```

### `catch` blocks: always `unknown`

`catch (err: unknown)` then narrow with `instanceof Error` before reading `.message`
(`useUnknownInCatchVariables` is on). Full pattern → [PATTERNS.md](PATTERNS.md).

### Banned patterns
| Pattern | Fix |
|---------|-----|
| `const x: any` | `unknown` + narrow or generic |
| `value as SomeType` (unsafe) | Add type guard |
| `user!.name` | `user?.name ?? fallback` |
| `state?: string` in interfaces | Discriminated union |
| `@ts-ignore` | `@ts-expect-error // reason` |

---

## 4 · React & Next.js patterns

### Server vs Client boundary (App Router)
```ts
// Default: Server Component — no "use client"
// Only add "use client" when genuinely needed:
// - useState / useReducer / useEffect
// - browser APIs (window, document)
// - event handlers passed as props
// - third-party client-only libs
```

### Component structure
```tsx
// Props interface — explicit, typed
interface MetricCardProps {
  readonly title: string;
  readonly value: number;
  readonly trend?: "up" | "down" | "flat";
}

// Function component — forwardRef when ref is exposed
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, trend = "flat" }, ref) => {
    return <div ref={ref} data-trend={trend}>...</div>;
  }
);
MetricCard.displayName = "MetricCard";
```

> **`forwardRef` vs ref-as-prop — [ADR-0008](../../../docs/adr/ADR-0008-react19-ref-as-prop-ui-author-layer.md) status: Proposed/deferred.** Keep `forwardRef` in `packages/shadcn-studio/src/components-ui/` until a package-wide ADR-0008 batch is Accepted.

### Hooks discipline
```ts
// ✅ Functional state update to avoid stale closure
setCount(prev => prev + 1);

// ✅ Memoize only when profiler proves cost
const sorted = useMemo(() => items.toSorted(...), [items]);

// ✅ Stable callback reference
const handleSearch = useCallback((q: string) => setQuery(q), []);

// ❌ useEffect for derived state
// ❌ hook called conditionally
// ❌ missing dependency array items
```

### Async data: Server Components first
```tsx
// ✅ Server Component — no useEffect
export default async function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = await fetchInvoice(params.id);   // direct DB/fetch
  return <InvoiceView invoice={invoice} />;
}

// ❌ Client Component fetching in useEffect
```

### Early returns over nesting
```ts
if (!user) return null;
if (!user.isAdmin) return <AccessDenied />;
// ... happy path
```

---

## 5 · Drizzle ORM patterns

```ts
// ✅ Select only needed columns
const { data } = await db
  .select({ id: users.id, name: users.name, email: users.email })
  .from(users)
  .where(eq(users.tenantId, tenantId))
  .limit(20);

// ❌ Never select *
const { data } = await db.select().from(users);

// ✅ Transactions for mutations
await db.transaction(async (tx) => {
  const [org] = await tx.insert(organizations).values(orgData).returning();
  await tx.insert(orgMembers).values({ orgId: org.id, userId });
});

// ✅ Schema changes: generate migration, never hand-edit SQL
// pnpm db:generate   →  review  →  pnpm migrate
```

---

## 6 · ERP presentation (PAS-006 · ADR-0027)

**Authority:** [`.cursor/skills/shadcn-studio/SKILL.md`](../shadcn-studio/SKILL.md) · [`docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md`](../../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md)

**Removed for ERP (ADR-0027):** `ui:guard*`, `@afenda/ui`, `@afenda/appshell`, `govern-primitive`, `ui-consistency-bundle` — use PAS-006 skills. Replacement map: [NATIVE-EVALUATION.md](./NATIVE-EVALUATION.md).

| Layer | Files | Rule |
|-------|-------|------|
| **Manufacturing** | `packages/shadcn-studio/src/**` | MCP blocks, metadata binding registries, `data-afenda-slot` markers |
| **ERP consumer** | `apps/erp/src/lib/metadata/**`, route pages | Compose studio blocks via PAS-006D templates — no local presentation SSOT |
| **CSS** | `packages/shadcn-studio/src/styles/**`, `apps/erp/src/app/globals.css` | Phase 1: composition entries = imports + `@source` only; theme in studio CSS; layout via Tailwind `className` — see `afenda-tailwind` |

### After installing a shadcn-studio block
1. Install cwd: `packages/shadcn-studio` (MCP workflow)
2. Register metadata binding + slot markers per PAS-006
3. `pnpm check:studio-metadata-binding` + `pnpm check:studio-block-slot-markers`
4. `pnpm --filter @afenda/shadcn-studio typecheck` + `pnpm --filter @afenda/erp typecheck`

Full reference: `.cursor/skills/shadcn-studio/SKILL.md` · composition: `.cursor/skills/afenda-presentation-quality/SKILL.md` · CSS: `.cursor/skills/afenda-tailwind/SKILL.md`

---

## 7 · Multi-tenancy discipline

Never invent context resolution. Use the canonical resolver pipeline.

```ts
// ✅ Resolve operating context via the ERP resolver (server-only)
import { resolveOperatingContext } from "@/lib/context/resolve-operating-context.server";

// ❌ Inline tenant lookup — never
const tenant = await db.query.tenants.findFirst({ where: eq(tenants.domain, host) });
```

Authority split (verify before editing either side):

| Package | Owns | Surface |
|---------|------|---------|
| `@afenda/kernel` | The operating-context **contract** | `KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES`, context types |
| `apps/erp` | The **resolver implementation** | `resolveOperatingContext()` + `operating-context-resolver-registry.ts` (`OPERATING_CONTEXT_RESOLVER_PIPELINE`) |

Kernel defines *what* a context is; ERP defines *how* it is resolved. Register new
resolution steps in the ERP pipeline — never add an ad-hoc lookup at the call site.  
Architecture docs: `docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md`

---

## 8 · Testing requirements

### Vitest setup
```ts
import { render, screen } from "@testing-library/react";
import { setupUser, openMenu } from "@afenda/testing/react";

// ✅ User-event for interactions (not fireEvent)
const user = setupUser();
await user.click(screen.getByRole("button", { name: "Save" }));

// ❌ fireEvent for interactive components
```

### File naming contract
| Pattern | Runner |
|---------|--------|
| `*.test.tsx` | Default vitest |
| `*.interaction.test.tsx` | `pnpm test:interaction` |
| `*.stories.tsx` | Storybook test runner |

### Test structure (AAA)
```ts
it("returns error when tenant not found", async () => {
  // Arrange
  const missingId = "missing-tenant" as TenantId;

  // Act
  const result = await getTenantContext(missingId);

  // Assert
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.error).toMatch(/not found/i);
});
```

### What to test
- Every new public function: happy path + at least one error path
- Every new React component: render smoke test
- Governance constraints: a test that proves consumer data-* cannot override governed data-*

---

## 9 · Code quality rules

### Comments: WHY only, never WHAT

Write comments that explain a non-obvious constraint or trade-off, not what the code does. Narrating obvious code (`// Increment count`) is always wrong — delete it.

### Correctness over cleverness
- Crash on invalid state rather than silently corrupt data
- No workarounds; handle every error path
- Early returns reduce nesting — max 3 levels deep before refactoring
- Named constants over magic numbers: `const MAX_RETRIES = 3`

### No dead code shipped
- Remove `console.log`, `debugger`, unused imports before PR
- Never comment out code — delete it; git is the history

---

## 10 · Verification commands (run before every PR)

Run the narrowest gate that covers your change. Full matrix → [VERIFICATION.md](VERIFICATION.md).

```bash
pnpm --filter <pkg> typecheck   # narrow gate first
pnpm sync:package-css-dist      # after @afenda/shadcn-studio CSS src edits
pnpm check:package-css-dist-sync
pnpm check:studio-metadata-binding   # when touching studio blocks / metadata binding
pnpm check:erp-metadata-pas006-consumer  # when touching ERP metadata operator routes
pnpm test:run                   # full vitest suite (or --filter <pkg>)
pnpm ci:biome                   # Biome format + lint (CI mode)
pnpm check                      # full pre-PR gate: biome + typecheck + tests
```

**Shell discipline:** Never redirect gate output into the repo (`Out-File`, `>`, `tee`, `Set-Content` to paths like `.cursor-biome-report.json`). Run commands and read shell stdout.

Skill: `.cursor/skills/package-css-dist-sync/SKILL.md` — apps import CSS from package `dist/`, not `src/`.

---

## 11 · Completion report (mandatory)

Every coding session must end with this report. Code without evidence is not done.

````md
## Completion Report

### Objective
- <the change, one sentence>

### Files changed
| File | Reason |
|------|--------|
| ... | ... |

### Architecture authority followed
- <which authority owned this change; how the contract was used, not forked>

### Drift prevention proof
| Rule | Result |
|------|--------|
| No parallel registry | Pass/Fail |
| No unauthorized package boundary crossing | Pass/Fail |
| No raw `any` | Pass/Fail |
| No unsafe casts (cast → type guard) | Pass/Fail |
| No local tenant / context resolution | Pass/Fail |
| No local design token / recipe / variant | Pass/Fail |
| No local permission constant | Pass/Fail |
| No hand-edited migration | Pass/Fail |
| No dead code / commented-out code shipped | Pass/Fail |

### Tests / gates run
```bash
pnpm --filter <pkg> typecheck
pnpm --filter <pkg> test:run
pnpm check:studio-metadata-binding   # if studio/metadata touched
pnpm ci:biome
```

### Known gaps
- None / <list clearly, including any missing upstream contract that blocked work>
````

Any `Fail` row must be resolved or escalated before the session is reported complete.

---

## Extended reference

- TypeScript patterns in depth → [PATTERNS.md](PATTERNS.md)
- All quality gates + changed-files→gate matrix → [VERIFICATION.md](VERIFICATION.md)
- ERP presentation (PAS-006) → `.cursor/skills/shadcn-studio/SKILL.md` · `.cursor/skills/afenda-presentation-quality/SKILL.md`
- Multi-tenancy architecture → `docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md`
- ERP Tailwind / globals.css → `.cursor/skills/afenda-tailwind/SKILL.md`
- Next.js App Router (live docs) → `nextjs-docs://llms-index` via MCP before writing
