# Extended Patterns Reference

Detailed patterns for the Afenda monorepo. Linked from SKILL.md §10.

---

## TypeScript: Complete canonical patterns

### Result type (service layer — no raw throws)

```ts
type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Fallible service functions return Result, not throw
async function findTenant(id: TenantId): Promise<Result<Tenant>> {
  const row = await db.query.tenants.findFirst({ where: eq(tenants.id, id) });
  if (!row) return { ok: false, error: `Tenant ${id} not found` };
  return { ok: true, value: row };
}

// Caller handles both branches
const result = await findTenant(tenantId);
if (!result.ok) return <ErrorView message={result.error} />;
const tenant = result.value;
```

### Exhaustive type narrowing

```ts
function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

function renderStatus(status: TaskStatus): string {
  switch (status.kind) {
    case "idle":    return "Waiting";
    case "loading": return "Processing...";
    case "success": return `Done: ${status.data.label}`;
    case "error":   return `Failed: ${status.message}`;
    default:        return assertNever(status);
  }
}
```

### Mapped type for form field registry

```ts
// Use satisfies to lock config shape at authoring time
type FieldConfig = {
  label: string;
  required: boolean;
  type: "text" | "email" | "number" | "date";
};

const INVOICE_FIELDS = {
  invoiceNumber: { label: "Invoice #", required: true,  type: "text" },
  dueDate:       { label: "Due Date",  required: true,  type: "date" },
  amount:        { label: "Amount",    required: true,  type: "number" },
  notes:         { label: "Notes",     required: false, type: "text" },
} satisfies Record<string, FieldConfig>;

// keyof is now "invoiceNumber" | "dueDate" | "amount" | "notes"
type InvoiceFieldKey = keyof typeof INVOICE_FIELDS;
```

### Template literal types for route safety

```ts
type ApiVersion = "v1" | "v2";
type Resource   = "tenants" | "users" | "invoices" | "permissions";
type ApiRoute   = `/api/${ApiVersion}/${Resource}`;

// ✅ Type-safe route construction
function buildRoute(version: ApiVersion, resource: Resource): ApiRoute {
  return `/api/${version}/${resource}`;
}
```

---

## React: Component patterns

### Pattern: compound component with context

```tsx
interface TableContextValue {
  readonly striped: boolean;
  readonly compact: boolean;
}

const TableContext = React.createContext<TableContextValue | null>(null);

function useTableContext(): TableContextValue {
  const ctx = React.useContext(TableContext);
  if (!ctx) throw new Error("useTableContext must be used inside <Table>");
  return ctx;
}

export function Table({
  striped = false,
  compact = false,
  children,
}: {
  striped?: boolean;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <TableContext.Provider value={{ striped, compact }}>
      <table>{children}</table>
    </TableContext.Provider>
  );
}

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ children, ...props }, ref) => {
    const { striped } = useTableContext();
    return (
      <tr ref={ref} data-striped={striped} {...props}>
        {children}
      </tr>
    );
  }
);
TableRow.displayName = "TableRow";
```

### Pattern: loading state with Suspense

```tsx
// Server Component (parent) — data fetched server-side
export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const [metrics, invoices] = await Promise.all([
    fetchMetrics(),
    fetchRecentInvoices(),
  ]);
  return (
    <>
      <MetricGrid metrics={metrics} />
      <InvoiceTable invoices={invoices} />
    </>
  );
}
```

### Pattern: optimistic UI with useOptimistic (React 19+)

```tsx
"use client";

export function InvoiceStatusToggle({ invoice }: { invoice: Invoice }) {
  const [optimisticStatus, setOptimisticStatus] = React.useOptimistic(invoice.status);

  async function handleToggle() {
    const next = optimisticStatus === "draft" ? "sent" : "draft";
    setOptimisticStatus(next);
    await updateInvoiceStatus(invoice.id, next);
  }

  return (
    <button type="button" onClick={handleToggle}>
      {optimisticStatus === "draft" ? "Send" : "Revert to draft"}
    </button>
  );
}
```

---

## Drizzle ORM: extended patterns

### Typed repository pattern

```ts
// packages/database/src/invoices/invoice-repository.ts
import type { InvoiceId, TenantId } from "@afenda/kernel";
import { db } from "../client";
import { invoices } from "../schema";

export async function findInvoicesByTenant(
  tenantId: TenantId,
  opts: { limit?: number; offset?: number } = {}
): Promise<InvoiceSummary[]> {
  return db
    .select({
      id: invoices.id,
      number: invoices.number,
      status: invoices.status,
      amount: invoices.amount,
      dueDate: invoices.dueDate,
    })
    .from(invoices)
    .where(eq(invoices.tenantId, tenantId))
    .limit(opts.limit ?? 25)
    .offset(opts.offset ?? 0)
    .orderBy(desc(invoices.createdAt));
}
```

### Migration discipline

```bash
# 1. Modify schema in packages/database/src/schema/
# 2. Generate (never hand-write SQL):
pnpm db:generate

# 3. Review generated SQL in packages/database/drizzle/
# 4. Apply locally:
pnpm migrate

# 5. Verify:
pnpm --filter @afenda/database test:run
```

Never edit generated migration SQL files directly. If the generated SQL is wrong, fix the schema.

---

## Testing: Vitest patterns

### Studio primitive contract test

```tsx
// components-ui primitives should honor contract variant axes
it("maps stock button props through the adapter", () => {
  render(<Button variant="destructive">Save</Button>);
  expect(screen.getByRole("button")).toBeInTheDocument();
});
```

### Interaction test (*.interaction.test.tsx)

```tsx
import { render, screen } from "@testing-library/react";
import { openMenu, setupUser } from "@afenda/testing/react";

describe("ProfileDropdown", () => {
  it("shows sign out option when opened", async () => {
    const user = setupUser();
    render(<ProfileDropdown userName="Ada Lovelace" />);

    const menu = await openMenu(user, "Ada Lovelace");
    expect(within(menu).getByRole("menuitem", { name: /sign out/i })).toBeInTheDocument();
  });
});
```

### Server Action test

```ts
// Test server actions with direct function calls
it("createInvoice returns error for invalid tenant", async () => {
  const result = await createInvoice({
    tenantId: "bad-id" as TenantId,
    amount: 100,
  });
  expect(result.ok).toBe(false);
  expect(result.error).toMatch(/tenant/i);
});
```

---

## Better Auth patterns

```ts
// packages/auth — consume via @afenda/auth, never raw better-auth
import { getSession } from "@afenda/auth/server";

// Server Component / Route Handler
export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");
  // session.user is typed
}

// Never: read cookies manually for auth
// Never: import better-auth internals directly in apps/erp
```

---

## Import discipline

| Import source | Allowed in |
|---------------|-----------|
| `@afenda/shadcn-studio` | `apps/erp/`, `apps/storybook/` |
| `@afenda/kernel` | All packages (read operating context) |
| `@afenda/database` | `apps/erp/` server only, `packages/database/` |
| `@afenda/auth` | `apps/erp/` — never in UI packages |
| `@/components/ui/*` (studio internal) | `packages/shadcn-studio/` only — not ERP |
| Local re-export barrels (`index.ts` that re-exports everything) | **Banned** — import directly |

---

## Observability patterns

```ts
// Always use @afenda/observability — no direct console.log in production code
import { logger } from "@afenda/observability";

logger.info({ msg: "Invoice created", invoiceId, tenantId });
logger.error({ msg: "Payment failed", error: err.message, invoiceId });

// Structured log object — not a formatted string
// ❌ logger.info(`Invoice ${invoiceId} created for tenant ${tenantId}`);
```

---

## Code smell quick-reference

| Smell | Fix |
|-------|-----|
| Function > 40 lines | Extract helper functions |
| 4+ levels of nesting | Early returns or extract |
| `setTimeout` for "timing" | Fix the race condition |
| `// TODO` without a ticket | Create issue or fix now |
| `console.log` shipped | Delete or use `logger` |
| `useEffect` fetching data | Move to Server Component |
| Prop drilling > 2 levels | Context or co-location |
| Magic number in condition | Named constant |
| Duplicate logic in 3+ places | Extract shared utility |
| `as unknown as X` | Fix the type definition |
