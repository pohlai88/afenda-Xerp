# shadcn-studio-v2 Primitive API Consistency

## Document status

| field | Value |
| --- | --- |
| Mode | Internal implementation contract |
| Audience | Engineers editing `src/components/ui/*` or adding primitives |
| Executable SSOT | `primitive-api-consistency.test.ts`, `primitive-baseline.test.ts`, `primitive-extension.test.ts`, `primitive-form-controls.test.ts`, `primitive-overlays.test.ts`, `primitive-nav-data.test.ts` |
| Related | `TAXONOMY.md` (placement), `DESIGN-SYSTEM-GUIDELINE.md` (tokens / gates) |

## Purpose

Define the **stable public API shape** for Phase 3 primitives so layouts, views,
and consumer routes inherit consistent variants, accessibility structure, and
token-safe styling.

## Scope

### In scope (contract-tested today)

| File | Slice | Notes |
| --- | --- | --- |
| `button.tsx` | 3A | Variants, sizes, loading state |
| `badge.tsx` | 3A | Semantic variants |
| `card.tsx` | 3A | Named parts + muted variant |
| `alert.tsx` | 3B | Title, description, variant |
| `field.tsx` | 3B | label, control, message, error, orientation/state |
| `table.tsx` | 3B | Container, head, body, cell class helpers |
| `input.tsx` | A-04 | Native input wrapper + `inputClassName` |
| `label.tsx` | A-04 | Native label + `labelClassName` |
| `textarea.tsx` | A-04 | Native textarea + `textareaClassName` |
| `checkbox.tsx` | A-04 | Base UI checkbox + indicator slot |
| `switch.tsx` | A-04 | Base UI switch + thumb slot |
| `select.tsx` | A-04 | Compound select parts + trigger sizes |
| `dialog.tsx` | A-05 | Modal dialog + close button via `buttonClassName` |
| `alert-dialog.tsx` | A-05 | Destructive confirm pattern + action/cancel slots |
| `sheet.tsx` | A-05 | Drawer primitive side variants (`left`/`right`/…) |
| `drawer.tsx` | A-05 | Sheet alias re-export (no duplicate impl) |
| `popover.tsx` | A-05 | Anchored popup + header/title/description |
| `tooltip.tsx` | A-05 | Provider + arrow slot |
| `tabs.tsx` | A-06 | List variants + keyboard-focusable triggers |
| `breadcrumb.tsx` | A-06 | Semantic nav/ol structure + link/page slots |
| `pagination.tsx` | A-06 | Anchor-based pages (no router coupling) |
| `separator.tsx` | A-06 | Horizontal/vertical orientation |
| `scroll-area.tsx` | A-06 | Viewport + scrollbar + thumb parts |

Additional files under `src/components/ui/` exist for shadcn parity and MCP
promotion; **new contract changes** to the files above require updating this
document and the primitive test suite in the same change.

### Out of scope

- View-layer surfaces (`src/views/**`) — separate composed contracts
- Business logic, data fetching, or routing inside primitives
- v1 `@afenda/shadcn-studio` primitives

---

## API design rules

### 1. Semantic variants over boolean props

- **Do not** add custom `boolean` props to primitive public interfaces.
- **Exception:** `field` may expose `required?: boolean` (label/control association).
- Express visual or behavioral modes with **string union variants** (`buttonVariant`, `badgeVariant`, `alertVariant`, `fieldState`, etc.).

Enforced by: `primitive-api-consistency.test.ts` — `listBooleanProps` scan.

### 2. No render-prop-shaped APIs

- **Do not** expose props named `renderSomething` on primitives.
- Prefer **explicit exported parts** (`cardHeader`, `fieldlabel`, `tableCell`) and **`children`**.

Enforced by: `primitive-api-consistency.test.ts` — `RENDER_PROP_PATTERN`.

### 3. Explicit composition and class helpers

Each primitive family should export:

- Typed **props** interfaces
- **`className` helpers** where variants are generated (`buttonClassName`, `badgeClassName`, `fieldClassName`, `tableHeadClassName`, …)
- **Named subcomponents** for structure (card parts, field parts, table parts)
- **`satisfies Record<Variant, string>`** maps where variant → class mapping is centralized (button, badge)

### 4. Token-safe styling only

- Class helpers must reference **canonical semantic utilities** (`bg-primary`, `border-border`, `text-muted-foreground`, `bg-card`, etc.).
- **No** `window`, `document`, or `localStorage` in primitive source.
- **No** raw hex in primitive TSX.

Enforced by: `primitive-baseline.test.ts`, `primitive-extension.test.ts`, `check:drift`.

### 5. Accessibility and state markers

| Primitive | Requirement |
| --- | --- |
| `button` | `buttonState = "idle" \| "loading"`; loading uses `data-[state=loading]` |
| `field` | `data-slot="field-error"`; `data-state={state}`; prefer `data-invalid` over ad-hoc `aria-invalid` wiring in the root |
| `alert` | Distinct title/description parts; variant-driven tone |
| `table` | Semantic table structure; head/cell class helpers for density alignment |

Prove semantic HTML and ARIA via render tests in baseline/extension suites.

### 6. Runtime coupling

- Primitives are **presentational** unless a slice explicitly proves runtime ownership.
- Do not import theme providers, app config, or server-only modules into `components/ui/*`.

---

## Variant inventories (current baseline)

### button

- **Variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Sizes:** `default`, `sm`, `lg`, `icon`
- **State:** `idle`, `loading`

### badge

- **Variants:** `default`, `secondary`, `destructive`, `outline`

### card

- **Variants:** `default`, `muted`
- **Parts:** `card`, `cardHeader`, `cardTitle`, `cardDescription`, `cardContent`, `cardFooter`

### alert

- **Variants:** per `alertVariant` in source
- **Parts:** `alert`, `alertTitle`, `alertDescription`

### field

- **Orientation:** per `fieldOrientation`
- **State:** per `fieldState` (`invalid`, etc.)
- **Parts:** `field`, `fieldlabel`, `fieldControl`, `fieldDescription`, `fieldMessage`, `fieldError`

### table

- **Parts:** `table`, `tableContainer`, `tableHeader`, `tableBody`, `tableFooter`, `tableRow`, `tableHead`, `tableCell`, `tableCaption`
- **Class helpers:** `tableClassName`, `tableHeadClassName`, `tableCellClassName`, …

### input

- **Class helper:** `inputClassName`
- **Slot:** `input`

### label

- **Class helper:** `labelClassName`
- **Slot:** `label`

### textarea

- **Class helper:** `textareaClassName`
- **Slot:** `textarea`

### checkbox

- **Class helper:** `checkboxClassName`
- **Parts:** `checkbox`, `checkbox-indicator`
- **Runtime:** client-only (`"use client"`)

### switch

- **Class helper:** `switchClassName`
- **Parts:** `switch`, `switch-thumb`
- **Runtime:** client-only (`"use client"`)

### select

- **Trigger sizes:** `default`, `sm`
- **Parts:** `select`, `select-trigger`, `select-content`, `select-item`, `select-label`, `select-separator`, …
- **Class helpers:** `selectTriggerClassName`, `selectContentClassName`, `selectItemClassName`
- **Runtime:** client-only (`"use client"`)

### dialog

- **Class helpers:** `dialogOverlayClassName`, `dialogContentClassName`, `dialogCloseButtonClassName`
- **Parts:** `dialog`, `dialog-trigger`, `dialog-content`, `dialog-header`, `dialog-footer`, `dialog-title`, `dialog-description`, `dialog-close-button`
- **Runtime:** client-only; close button composes contract `button` helper

### alert-dialog

- **Class helpers:** `alertDialogOverlayClassName`, `alertDialogContentClassName`, header/footer/title/description helpers
- **Parts:** `alert-dialog`, `alert-dialog-content`, `alert-dialog-action`, `alert-dialog-cancel`, …
- **Runtime:** client-only

### sheet

- **Side variants:** `bottom`, `left`, `right`, `top`
- **Class helpers:** `sheetOverlayClassName`, `sheetContentClassName`, `sheetCloseButtonClassName`
- **Parts:** `sheet`, `sheet-content`, `sheet-header`, `sheet-title`, …
- **Runtime:** client-only (Base UI drawer primitive)

### drawer

- **Alias of:** `sheet.tsx` exports only — no separate implementation file body

### popover

- **Class helper:** `popoverContentClassName`
- **Parts:** `popover`, `popover-trigger`, `popover-content`, `popover-title`, …
- **Runtime:** client-only

### tooltip

- **Class helper:** `tooltipContentClassName`
- **Parts:** `tooltip`, `tooltip-provider`, `tooltip-trigger`, `tooltip-content`, `tooltip-arrow`
- **Runtime:** client-only

### tabs

- **List variants:** `default`, `underline`
- **Class helpers:** `tabsListClassName`, `tabsTriggerClassName`, `tabsContentClassName`
- **Parts:** `tabs`, `tabs-list`, `tabs-trigger`, `tabs-content`
- **Runtime:** client-only; triggers use `focus-visible:ring-ring`

### breadcrumb

- **Class helpers:** `breadcrumbListClassName`, `breadcrumbLinkClassName`, …
- **Parts:** `breadcrumb`, `breadcrumb-list`, `breadcrumb-item`, `breadcrumb-link`, `breadcrumb-page`, …
- **Runtime:** server-safe markup (`nav` + `ol`)

### pagination

- **Link sizes:** `default`, `icon`
- **Class helpers:** `paginationClassName`, `paginationLinkClassName`, `paginationLinkCurrentClassName`
- **Parts:** `pagination`, `pagination-content`, `pagination-link`, `pagination-link-current`, …
- **Routing:** plain `<a href>` only — consumers own navigation framework

### separator

- **Class helper:** `separatorClassName`
- **Orientation:** `horizontal`, `vertical` (via Base UI prop)
- **Runtime:** client-only

### scroll-area

- **Class helpers:** `scrollAreaClassName`, `scrollAreaViewportClassName`, `scrollBarClassName`, `scrollThumbClassName`
- **Parts:** `scroll-area`, `scroll-area-viewport`, `scroll-area-scrollbar`, `scroll-area-thumb`
- **Runtime:** client-only

---

## Changing the contract

Any of the following requires a **deliberate contract change** in the same PR:

1. New public boolean prop on a contract primitive
2. New variant literal on an exported union type
3. Renamed or removed exported part component
4. Changed `data-slot` or `data-state` semantics used by views/tests
5. New primitive added to the contract-tested set

### Required proof for contract changes

```bash
pnpm --filter @afenda/shadcn-studio-v2 test:primitives
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 check:drift
```

If the change affects consumer-visible surfaces, also run:

```bash
pnpm --filter @afenda/developer verify:v2-proof
```

Update this document when the executable tests change.

---

## Verification commands

```bash
# Full primitive contract subset
pnpm --filter @afenda/shadcn-studio-v2 test:primitives

# Individual suites
pnpm --filter @afenda/shadcn-studio-v2 exec vitest run src/__tests__/primitive-api-consistency.test.ts
pnpm --filter @afenda/shadcn-studio-v2 exec vitest run src/__tests__/primitive-baseline.test.ts
pnpm --filter @afenda/shadcn-studio-v2 exec vitest run src/__tests__/primitive-extension.test.ts
```

---

## Open questions

- Whether additional `components/ui/*` files (dialog, select, …) should enter the contract-tested set in a future slice, or remain promotion-only until views depend on them.
