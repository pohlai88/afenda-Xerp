# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code (local)**: `pnpm format` or `pnpm fix` (`ultracite fix`)
- **Check for issues (local)**: `pnpm lint` (`ultracite check`)
- **CI hygiene gate**: `pnpm ci:biome` (`biome ci .`)
- **Diagnose setup**: `pnpm dlx ultracite doctor`

Biome is the underlying engine. Use Ultracite locally for auto-fix; CI runs `biome ci` for format, lint, and import checks.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests — use `async/await` instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat — avoid excessive `describe` nesting

### React component tests (jsdom)

- Shared setup: `packages/testing/src/setup/react.ts` (polyfills for Radix, cmdk, pointer capture)
- Vitest projects: `createUiProject` / `createReactProject` in `vitest.shared.ts` wire jsdom + `AFENDA_GOVERNANCE_RUNTIME=strict`
- **Do not use `fireEvent`** for interactive components — use `@afenda/testing/react`:

```ts
import { render, screen } from "@testing-library/react";
import { openMenu, setupUser } from "@afenda/testing/react";

const user = setupUser();
await user.click(screen.getByRole("button", { name: "Open" }));
const menu = await openMenu(user, "Open");
```

- Name interaction suites `*.interaction.test.tsx` (discovered by `TEST_FILE_PATTERN`)
- Run interaction subset: `pnpm test:interaction`
- Governance/render tests stay in `*.test.tsx`; click-to-open flows go in `*.interaction.test.tsx`

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm format` before committing to ensure compliance.

---

## Coding session contract

Every coding turn in this repo follows `.cursor/rules/afenda-coding-session.mdc`:

1. **Announce** — "I'm using afenda-coding-session — stating the execution contract before edits."
2. **Phase 0** — state objective, allowed layer, files, prohibited paths, authority, gates **before** any edit.
3. **Phase 2** — end with the Completion Report from `.cursor/skills/afenda-coding-session/SKILL.md` §11.

Invoke `/afenda-coding-session` for the full implementation standard (TypeScript, React, Drizzle, tests, gates).

---

## Governed UI (TIP-004)

Canonical policy: [`docs/governance/tip-004-policy.md`](docs/governance/tip-004-policy.md). Gates: [`docs/governance/ui-guard.md`](docs/governance/ui-guard.md).

Two layers — do not confuse them:

| Layer | Path | className rule |
|-------|------|----------------|
| **Author** | `packages/ui/src/components/` | Layout-only via `resolvePrimitiveGovernance()` — see `.cursor/skills/govern-primitive/SKILL.md` |
| **Consumer** | `packages/appshell/`, `packages/metadata-ui/`, `apps/erp/` | **Zero** `className` on `@afenda/ui` primitives; shell chrome on plain HTML only |

**Consumer imports:** `@afenda/ui` and `@afenda/ui/governance` directly (`mapStockButtonProps` at call sites). No `stock-props.ts` wrappers, no re-export barrels, no extra CSS modules when `globals.css` suffices.

**After shadcn-studio blocks:** strip all `className` from governed components before merge. Verify with `pnpm ui:guard` (gates A–F) or `pnpm ui:guard:scan` for a sub-2 s local check (Gate D).

**Enforcement:** `.cursor/rules/governed-ui-consumption.mdc`, `scripts/governance/governed-ui-consumption.mjs`, `scripts/governance/react-erp-policy.mjs` (Gate F), Cursor preToolUse hook, stop hook appshell test gate.

---

## CSP third-party scripts (ERP)

Nonce-based CSP is enforced in `apps/erp/src/proxy.ts`. When adding external scripts:

| Step | Action |
|------|--------|
| 1 | Add explicit `https://` origins to `apps/erp/src/lib/security/csp-allowlist.ts` |
| 2 | Load via `next/script` in a **Server Component** with `nonce={nonce}` from `getCspNonce()` |
| 3 | Never use raw `<script>`, `'unsafe-inline'` in production `script-src`, or wildcard CSP sources |
| 4 | Run `pnpm check:csp-third-party` |

**Skill:** `.cursor/skills/csp-third-party/SKILL.md`  
**Rule:** `.cursor/rules/csp-third-party-scripts.mdc`  
**Delivery:** `docs/delivery/nextjs-csp-nonce-pipeline.md`
