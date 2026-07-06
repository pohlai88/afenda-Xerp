# Operator A11y (Y1–Y7)

| ID | Check |
| --- | --- |
| Y1 | Primary actions: `button` or `link` |
| Y2 | Labels or `aria-label` on fields |
| Y3 | Errors: `role="alert"` or `aria-live` |
| Y4 | Loading transitions announced |
| Y5 | Dialog focus trap, Escape, return focus |
| Y6 | `<th scope="col">` |
| Y7 | Chart `figure aria-label`; decorative SVG hidden |

Tests: `getByRole` → `getByLabelText` → `getByText`. No `fireEvent`.
