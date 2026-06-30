# ERP operator surface a11y checklist (Y1–Y7)

Operator a11y is **acceptance**, not polish. Map to [SKILL.md §7](../SKILL.md).

| ID | Check |
| --- | --- |
| **Y1** | Primary actions exposed as `button` or `link` roles |
| **Y2** | Form fields have visible labels or `aria-label` |
| **Y3** | Error messages use `role="alert"` or `aria-live="polite"` |
| **Y4** | Loading states announced when content replaces skeleton |
| **Y5** | Dialogs trap focus; Escape closes; focus returns (verify Base UI/Radix default) |
| **Y6** | Data tables: column headers in `<th scope="col">` |
| **Y7** | Charts: `<figure aria-label="...">` + decorative SVG `aria-hidden` |

**Test query priority:** `getByRole` → `getByLabelText` → `getByText` — not `getByTestId`.

**Effort:** Y failures on operator-critical surfaces → **R4** operator hardening (interaction + a11y tests).
