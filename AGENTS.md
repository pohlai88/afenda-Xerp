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
- Vitest projects: `createReactProject` in `vitest.shared.ts` wire jsdom + `AFENDA_GOVERNANCE_RUNTIME=strict`
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

1. [`docs/NORTHSTAR/kernel-north-star.md`](docs/NORTHSTAR/kernel-north-star.md) — platform why + capability expectations ([ADR-0026](docs/adr/ADR-0026-platform-north-star-and-architecture-blueprint.md))
2. [`docs/BLUEPRINT/kernel-blueprint.md`](docs/BLUEPRINT/kernel-blueprint.md) — discover packages/domains before PAS
3. [`docs/NORTHSTAR/api-contract-north-star.md`](docs/NORTHSTAR/api-contract-north-star.md) — governed HTTP contract domain ([ADR-0030](docs/adr/ADR-0030-erp-rest-api-contract-standard.md)) · [`api-contract-blueprint.md`](docs/BLUEPRINT/api-contract-blueprint.md)
4. [`docs/PAS/README.md`](docs/PAS/README.md) — PAS index and canonical location rules
5. [`docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md`](docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) — kernel boundary (composed SSOT)
6. [`packages/architecture-authority/src/data/foundation-disposition.registry.ts`](packages/architecture-authority/src/data/foundation-disposition.registry.ts) — machine authority
7. [`packages/architecture-authority/src/data/foundation-disposition.registry.ts`](packages/architecture-authority/src/data/foundation-disposition.registry.ts) — lane vocabulary + entries (synced view)
8. [`docs/PAS/pas-status-index.md`](docs/PAS/pas-status-index.md)
9. [`.cursor/skills/enterprise-erp-standards/SKILL.md`](.cursor/skills/enterprise-erp-standards/SKILL.md) — SAP/Oracle gates (red/amber/blue lanes)
10. Target presentation standard: [`docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md`](docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) — ERP frontend ([ADR-0027](docs/adr/ADR-0027-frontend-presentation-reset.md))
11. Platform API contract: [`docs/NORTHSTAR/api-contract-north-star.md`](docs/NORTHSTAR/api-contract-north-star.md) · [ADR-0030](docs/adr/ADR-0030-erp-rest-api-contract-standard.md) · [`docs/BLUEPRINT/api-contract-blueprint.md`](docs/BLUEPRINT/api-contract-blueprint.md) · [PAS-API-001](docs/PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · [PAS-API-REST-001](docs/PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) · R3a–R3d Planned ([handoff](docs/PAS/API-CONTRACT/REST/SLICE/pas-001a-r3-api-contract-runtime.md)) · [`.cursor/skills/afenda-openapi/SKILL.md`](.cursor/skills/afenda-openapi/SKILL.md)

**Frontend presentation (PAS-006):** [`.cursor/skills/shadcn-studio/SKILL.md`](.cursor/skills/shadcn-studio/SKILL.md) · [`docs/NORTHSTAR/shadcn-studio-presentation-north-star.md`](docs/NORTHSTAR/shadcn-studio-presentation-north-star.md) · [`docs/BLUEPRINT/shadcn-studio-presentation-blueprint.md`](docs/BLUEPRINT/shadcn-studio-presentation-blueprint.md) · `@afenda/shadcn-studio` — stock shadcn/studio via MCP; unprefixed CSS vars; **no** `ui:guard` or PAS-005 slice execution for ERP.

**Retired for ERP frontend:** PAS-005/CSS-AUTHORITY — historical audit only; **do not parallel** with Kernel or PAS-006 work. See [`docs/PAS/DEVELOPMENT-LANE-BOUNDARIES.md`](docs/PAS/DEVELOPMENT-LANE-BOUNDARIES.md) · [`docs/PAS/CSS-AUTHORITY/README.md`](docs/PAS/CSS-AUTHORITY/README.md).

**Planning:** [`.cursor/skills/pas-slice-planner/SKILL.md`](.cursor/skills/pas-slice-planner/SKILL.md)

**Kernel enforcement:** [`.cursor/skills/kernel-authority/SKILL.md`](.cursor/skills/kernel-authority/SKILL.md)

**Enterprise knowledge (PAS-004):** [`.cursor/skills/enterprise-knowledge/SKILL.md`](.cursor/skills/enterprise-knowledge/SKILL.md) · [`docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md`](docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) · `@afenda/enterprise-knowledge` — accepted business meaning; glossary is a representation only.

**Accounting Core (`Foundation phase 15+` runtime)** is blocked until ADR-0010 **and** a new ADR amends `PKGR01_ACCOUNTING` prohibited rules.

Verify doc hygiene: `pnpm check:documentation-drift` · `pnpm check:legacy-delivery-terminology` · `pnpm check:foundation-disposition` · `pnpm check:knowledge-conformance`

When documentation status, PAS slices, ADR acceptance, registry lanes, or runtime-truth evidence may be stale, delegate to [`.cursor/agents/documentation-drift.md`](.cursor/agents/documentation-drift.md) before planning or coding from docs.

| Task | Agent / skill |
| --- | --- |
| Plan PAS slice execution | `pas-slice-planner` |
| Implement governed work | [`afenda-governed-implementer`](.cursor/agents/afenda-governed-implementer.md) |
| Audit vibe-coding / bundle preflight violations | [`vibe-coding-violation-auditor`](.cursor/agents/vibe-coding-violation-auditor.md) |
| Studio import/path alias drift diagnosis | [`studio-import-path-auditor`](.cursor/agents/studio-import-path-auditor.md) |
| Registry edit | [`foundation-registry-owner`](.cursor/agents/foundation-registry-owner.md) |
| New package filesystem scaffold | [`monorepo-discipline`](.cursor/skills/monorepo-discipline/SKILL.md) — `pnpm scaffold:package` (non-interactive; `--pas` for real packages; env via `--with-env-scripts` / `--env-sync-target`; template smoke via `--verify`) |
| Enterprise knowledge (PAS-004) | [`.cursor/skills/enterprise-knowledge/SKILL.md`](.cursor/skills/enterprise-knowledge/SKILL.md) |
| ERP frontend UI (PAS-006) | [`.cursor/skills/shadcn-studio/SKILL.md`](.cursor/skills/shadcn-studio/SKILL.md) · MCP `/cui` `/rui` |
| Pre-merge review | [`/afenda-review`](.cursor/skills/afenda-review/SKILL.md) or [`@afenda-code-reviewer`](.cursor/agents/afenda-code-reviewer.md) |
| Ship / go-no-go | [`/afenda-ship`](.cursor/skills/afenda-ship/SKILL.md) |
| PAS parallel batch | [`@afenda-orchestrator`](.cursor/agents/afenda-orchestrator.md) + [`/afenda-batch`](.cursor/skills/afenda-batch/SKILL.md) |
| PAS kernel catalog audit (001 / 001A / 001B) | [`/pas-kernel-audit-orchestrator`](.cursor/skills/pas-kernel-audit-orchestrator/SKILL.md) · [`@pas-kernel-audit-worker`](.cursor/agents/pas-kernel-audit-worker.md) |
| Which skill applies? | [`/using-afenda-skills`](.cursor/skills/using-afenda-skills/SKILL.md) |
| Test / coverage review | [`/afenda-test`](.cursor/skills/afenda-test/SKILL.md) |
| Web performance audit | [`/afenda-webperf`](.cursor/skills/afenda-webperf/SKILL.md) |
| Full platform architecture audit (read-only) | [`enterprise-architecture-audit`](.cursor/skills/enterprise-architecture-audit/SKILL.md) + [`@enterprise-architecture-audit-orchestrator`](.cursor/agents/enterprise-architecture-audit-orchestrator.md) |

### Agent orchestration

Three layers (see [`.cursor/references/orchestration-patterns.md`](.cursor/references/orchestration-patterns.md)):

| Layer | Role | Afenda examples |
| --- | --- | --- |
| **Skill** | How — workflow + exit criteria | `coding-consistency-bundle`, `afenda-coding-session`, domain skills |
| **Persona** | Who — one role, one report | `afenda-code-reviewer`, `afenda-governed-implementer`, `foundation-registry-owner` |
| **Command** | When — user entry point | `/afenda-review`, `/afenda-ship`, `/afenda-batch` |

**Rules:** User or slash-command orchestrates. Personas do not call personas. Parallel fan-out only via `/afenda-ship` (or `@afenda-orchestrator` for PAS batches). No meta-router agents.

Always-on rule: [`.cursor/rules/agent-orchestration.mdc`](.cursor/rules/agent-orchestration.mdc)

---

## shadcn/studio UI (ADR-0027 · PAS-006)

**Constitutional authority:** [`docs/adr/ADR-0027-frontend-presentation-reset.md`](docs/adr/ADR-0027-frontend-presentation-reset.md) — sole ERP frontend presentation chain.

**MCP vendor approval (retained from ADR-0017):** [`docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md`](docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) — Pro license, `_reference/` catalog, MCP servers.

**Agent operational authority:** [`.cursor/skills/shadcn-studio/SKILL.md`](.cursor/skills/shadcn-studio/SKILL.md) — MCP workflows, install cwd `packages/shadcn-studio`, ERP import from `@afenda/shadcn-studio`. MCP raw installs land in `components-quarantine/` first ([promotion pipeline](packages/shadcn-studio/src/components-quarantine/README.md)).

**Removed skills (2026-07-02):** legacy UI bundle tree — replacement map in [`.cursor/skills/NATIVE-EVALUATION.md`](.cursor/skills/NATIVE-EVALUATION.md).

**Creation gates:** `pnpm --filter @afenda/shadcn-studio typecheck` · `pnpm --filter @afenda/erp typecheck` · `pnpm --filter @afenda/erp build`

**Retired for ERP:** Governed UI (`ui:guard*`), appshell promotion pipeline, PAS-005 slice execution.

---

## Retired presentation packages (ADR-0027)

`@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, `@afenda/ui-composition`, and `@afenda/css-authority` were **removed from the filesystem** per [ADR-0027](docs/adr/ADR-0027-frontend-presentation-reset.md). Do not restore without a new ADR. Foundation disposition entries are `archive-lane` only.

**Commit the deleted state** after nuclear resets so git or tooling does not resurrect legacy packages.

---

## Package CSS dist sync

Apps import presentation CSS from package **`dist/`** exports, not from `src/`. After editing `@afenda/shadcn-studio` CSS sources, sync before ERP or Storybook visual verification.

```bash
pnpm sync:package-css-dist                                    # fast CSS copy
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio # scoped
pnpm check:package-css-dist-sync                              # verification gate
pnpm --filter @afenda/shadcn-studio build                     # full TS + CSS build
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

## Dead code / housekeeping

Orchestration: [`.cursor/skills/afenda-repo-housekeeping/SKILL.md`](.cursor/skills/afenda-repo-housekeeping/SKILL.md) (`/afenda-repo-housekeeping`). Removal delegates to [`afenda-monorepo-refactor`](.cursor/skills/afenda-monorepo-refactor/SKILL.md) Slice D.

```bash
pnpm housekeeping:knip:workspace packages/<name>  # preferred scoped scan
pnpm housekeeping:audit    # knip + downstream-integration + legacy terminology
pnpm housekeeping:verify   # audit + quality:boundaries + quality:exports
pnpm housekeeping:knip:turbo # strict knip via turbo root task
pnpm housekeeping:knip:advisory:turbo # non-blocking CI signal (see housekeeping-advisory.yml)
pnpm housekeeping:storybook-orphans           # dry-run orphan MCP layout blocks
pnpm housekeeping:storybook-orphans -- --apply  # delete confirmed orphans only
```

Runbook: [`.cursor/skills/afenda-repo-housekeeping/reference/knip-rollout.md`](.cursor/skills/afenda-repo-housekeeping/reference/knip-rollout.md) · legacy redirect: [`.cursor/references/knip-afenda.md`](.cursor/references/knip-afenda.md).

---

## CSP third-party scripts (ERP)

The ERP skeleton (`apps/erp`) currently runs correlation-id pass-through in `apps/erp/src/proxy.ts` only. **Nonce-based CSP is not wired** until protected routes and third-party scripts return — follow [`.cursor/skills/csp-third-party/SKILL.md`](.cursor/skills/csp-third-party/SKILL.md) and [`.cursor/rules/csp-third-party-scripts.mdc`](.cursor/rules/csp-third-party-scripts.mdc) when reintroducing external scripts.
