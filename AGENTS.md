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

## Documentation authority (PAS)

**Active (2026-06-27):** Foundation and package implementation is governed by **Package Authority Standards (PAS)** under `docs/PAS/` — not the retired ARCH or delivery roadmap trees.

Read in order:

1. [`docs/PAS/README.md`](docs/PAS/README.md) — PAS index and canonical location rules
2. [`docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md`](docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md) — kernel boundary (first active PAS)
3. [`packages/architecture-authority/src/data/foundation-disposition.registry.ts`](packages/architecture-authority/src/data/foundation-disposition.registry.ts) — machine authority
4. [`docs/architecture/foundation-disposition.md`](docs/architecture/foundation-disposition.md) — lane vocabulary + entries (synced view)
5. [`docs/architecture/afenda-runtime-truth-matrix.md`](docs/architecture/afenda-runtime-truth-matrix.md)
6. [`.cursor/skills/enterprise-erp-standards/SKILL.md`](.cursor/skills/enterprise-erp-standards/SKILL.md) — SAP/Oracle gates (red/amber/blue lanes)
7. Target slice under [`docs/PAS/slice/`](docs/PAS/slice/) — copy one §Handoff block into Phase 0

**Planning:** [`.cursor/skills/pas-slice-planner/SKILL.md`](.cursor/skills/pas-slice-planner/SKILL.md)

**Kernel enforcement:** [`.cursor/skills/kernel-authority/SKILL.md`](.cursor/skills/kernel-authority/SKILL.md)

**Enterprise knowledge (PAS-004):** [`.cursor/skills/enterprise-knowledge/SKILL.md`](.cursor/skills/enterprise-knowledge/SKILL.md) · [`docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md`](docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) · `@afenda/enterprise-knowledge` — accepted business meaning; glossary is a representation only.

**CSS authority (PAS-005):** [`.cursor/skills/css-authority/SKILL.md`](.cursor/skills/css-authority/SKILL.md) · [`docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md`](docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md) · `@afenda/css-authority` — runtime CSS token registry (`CSS-TOKEN-*`); `@afenda/design-system` retains TIP-004 variant/recipe TS + `--afenda-*` token shim (B30 monolith deprecated).

**Accounting Core (`TIP-015+` runtime)** is blocked until ADR-0010 **and** a new ADR amends `PKGR01_ACCOUNTING` prohibited rules.

Verify doc hygiene: `pnpm check:documentation-drift` · `pnpm check:foundation-disposition` · `pnpm check:knowledge-conformance` · `pnpm check:css-visual-regression`

When documentation status, PAS slices, ADR acceptance, registry lanes, or runtime-truth evidence may be stale, delegate to [`.cursor/agents/documentation-drift.md`](.cursor/agents/documentation-drift.md) before planning or coding from docs.

| Task | Agent / skill |
| --- | --- |
| Plan PAS slice execution | `pas-slice-planner` |
| Implement governed work | [`afenda-governed-implementer`](.cursor/agents/afenda-governed-implementer.md) |
| Audit vibe-coding / bundle preflight violations | [`vibe-coding-violation-auditor`](.cursor/agents/vibe-coding-violation-auditor.md) |
| Registry edit | [`foundation-registry-owner`](.cursor/agents/foundation-registry-owner.md) |
| New package filesystem scaffold | [`monorepo-discipline`](.cursor/skills/monorepo-discipline/SKILL.md) — `turbo gen workspace --copy` from `accounting-standards` or `enterprise-knowledge` |
| Enterprise knowledge (PAS-004) | [`.cursor/skills/enterprise-knowledge/SKILL.md`](.cursor/skills/enterprise-knowledge/SKILL.md) |
| CSS authority (PAS-005) | [`.cursor/skills/css-authority/SKILL.md`](.cursor/skills/css-authority/SKILL.md) |
| Any UI / CSS / visual change (docs OR erp OR primitives) | [`.cursor/skills/ui-consistency-bundle/SKILL.md`](.cursor/skills/ui-consistency-bundle/SKILL.md) — fix-first, no permission asking |
| Pre-merge review | [`/afenda-review`](.cursor/skills/afenda-review/SKILL.md) or [`@afenda-code-reviewer`](.cursor/agents/afenda-code-reviewer.md) |
| Ship / go-no-go | [`/afenda-ship`](.cursor/skills/afenda-ship/SKILL.md) |
| PAS parallel batch | [`@fdr-orchestrator`](.cursor/agents/fdr-orchestrator.md) + [`/afenda-fdr-batch`](.cursor/skills/afenda-fdr-batch/SKILL.md) |
| Which skill applies? | [`/using-afenda-skills`](.cursor/skills/using-afenda-skills/SKILL.md) |
| Test / coverage review | [`/afenda-test`](.cursor/skills/afenda-test/SKILL.md) |
| Web performance audit | [`/afenda-webperf`](.cursor/skills/afenda-webperf/SKILL.md) |

### Agent orchestration

Three layers (see [`.cursor/references/orchestration-patterns.md`](.cursor/references/orchestration-patterns.md)):

| Layer | Role | Afenda examples |
| --- | --- | --- |
| **Skill** | How — workflow + exit criteria | `coding-consistency-bundle`, `afenda-coding-session`, domain skills |
| **Persona** | Who — one role, one report | `afenda-code-reviewer`, `fdr-slice-implementer`, `afenda-governed-implementer` |
| **Command** | When — user entry point | `/afenda-review`, `/afenda-ship`, `/afenda-fdr-batch` |

**Rules:** User or slash-command orchestrates. Personas do not call personas. Parallel fan-out only via `/afenda-ship` (or `fdr-orchestrator` for PAS batches). No meta-router agents.

Always-on rule: [`.cursor/rules/agent-orchestration.mdc`](.cursor/rules/agent-orchestration.mdc)

---

## shadcn/studio UI acceleration (ADR-0017)

Constitutional authority: [`docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md`](docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) — approved sources, mandatory promotion pipeline, `_reference/` catalog (gitignored), MCP workflows, adapted blocks registry.

**Agent operational authority:** [`.cursor/skills/afenda-shadcn-components/SKILL.md`](.cursor/skills/afenda-shadcn-components/SKILL.md) — 3-layer CSS token chain, 3-question MCP normalization filter, promotion pipeline, gates A–G.

Operational guide: [`docs/architecture/app-ui-component-adaptation-guide.md`](docs/architecture/app-ui-component-adaptation-guide.md). MCP wiring: [`.cursor/skills/shadcn-studio/SKILL.md`](.cursor/skills/shadcn-studio/SKILL.md).

---

## Governed UI (TIP-004)

Canonical policy: [`docs/governance/tip-004-policy.md`](docs/governance/tip-004-policy.md). Gates: [`docs/governance/ui-guard.md`](docs/governance/ui-guard.md).

Two layers — do not confuse them:

| Layer | Path | className rule |
|-------|------|----------------|
| **Author** | `packages/ui/src/components/` | Layout-only via `resolvePrimitiveGovernance()` — see `.cursor/skills/govern-primitive/SKILL.md` |
| **Consumer** | `packages/appshell/`, `packages/metadata-ui/`, `apps/erp/` | **Zero** `className` on `@afenda/ui` primitives; shell chrome on plain HTML only |

**Consumer imports:** `@afenda/ui` and `@afenda/ui/governance` directly. Use governed `intent`, `emphasis`, `size`, `presentation` props — **`mapStockButtonProps` is sunset**. No `stock-props.ts` wrappers, no re-export barrels, no extra CSS modules when `globals.css` suffices.

**After shadcn-studio blocks:** apply the 3-question decision filter (see `afenda-shadcn-components` skill §2); strip all `className` from governed primitives. Verify with `pnpm ui:guard` (gates A–G) or `pnpm ui:guard:scan` for a sub-2 s local check (Gate D).

**Enforcement:** `.cursor/rules/governed-ui-consumption.mdc`, `scripts/governance/governed-ui-consumption.mjs`, `scripts/governance/react-erp-policy.mjs` (Gate F), Cursor preToolUse hook, stop hook appshell test gate.

---

## Package CSS dist sync

Apps import foundation CSS from package **`dist/`** exports, not from `src/`. After editing `@afenda/appshell`, `@afenda/ui`, or `@afenda/metadata-ui` CSS sources, sync before ERP or Storybook visual verification.

```bash
pnpm sync:package-css-dist                              # fast CSS copy (all packages)
pnpm sync:package-css-dist -- --package @afenda/appshell  # scoped
pnpm check:package-css-dist-sync                        # verification gate
pnpm --filter @afenda/appshell build                    # full TS + CSS build
```

| Layer | Enforcement |
|-------|-------------|
| **pre-commit** | `lint-staged` auto-copies staged `src/` CSS → `dist/` and re-stages output |
| **Cursor postToolUse** | Reminder after agent edits package CSS sources |
| **Cursor stop hook** | Runs `pnpm check:package-css-dist-sync` when scoped CSS sources changed |
| **Agents** | Include sync + check in Phase 0 gates and Completion Report |

**Rule:** `.cursor/rules/package-css-dist-sync.mdc`  
**Skill:** `.cursor/skills/package-css-dist-sync/SKILL.md`  
**Policy:** `scripts/governance/package-css-dist-policy.mjs`

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
**Delivery:** `docs/governance/support/nextjs-csp-nonce-pipeline.md`
