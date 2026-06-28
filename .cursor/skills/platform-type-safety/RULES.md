# TypeScript Compiler Flag Reference

Active flags in `packages/typescript-config/base.json` and what each prevents.

## Flags already enabled (do not disable)

| Flag | What it prevents | Common surprise |
|------|-----------------|-----------------|
| `strict` | Implicit any, no strict null checks, loose function types | Umbrella for the 6 sub-flags below |
| `noUncheckedIndexedAccess` | `arr[0]` returning `T` when it may be `undefined` | Array/object index access returns `T \| undefined` — guard before use |
| `exactOptionalPropertyTypes` | Assigning `undefined` to an optional property explicitly | `{ x?: string }` means absent, not `{ x: undefined }` |
| `noImplicitOverride` | Forgetting `override` keyword when overriding a base method | Add `override` keyword |
| `useUnknownInCatchVariables` | `catch (err)` being implicitly typed as `any` | `err` is `unknown` — narrow before `.message` |
| `noPropertyAccessFromIndexSignature` | `obj.arbitraryKey` on an index-signature type | Use `obj["key"]` bracket access instead |
| `verbatimModuleSyntax` | Mixed type and value imports | Use `import type` for type-only imports |
| `noImplicitAny` | Implicit any on unannotated parameters | Annotate all parameters explicitly |
| `strictNullChecks` | Unchecked null/undefined access | Guard with `if (x !== null)` or `?.` |
| `strictFunctionTypes` | Unsound function parameter variance | Affects callback parameter compatibility |

## Patterns that still compile but violate enterprise standards

These are legal TypeScript but banned by this skill:

| Pattern | Why banned | Correct alternative |
|---------|-----------|---------------------|
| `as any` | Defeats the entire type system | `unknown` + narrowing |
| `as T` (unsafe) | Hides real type mismatches | Type guard or fix upstream type |
| `!` non-null assertion | Runtime crash if assumption is wrong | `if`, `??`, `?.` |
| `@ts-ignore` | Silences errors without tracking them | `@ts-expect-error` with comment |
| `string` for entity IDs | IDs are interchangeable without branding | Branded type |
| `"pending" \| "done"` inline | No exhaustiveness check, coupling | Named discriminated union type |

## Flags NOT yet enabled (evaluate before adding)

| Flag | Why not enabled | Risk if added |
|------|----------------|---------------|
| `noImplicitReturns` | Requires explicit return on all code paths | Many utility functions need updating |
| `allowUnreachableCode: false` | Flags dead code | Low risk — consider enabling |
| `noFallthroughCasesInSwitch` | Disallows switch fallthrough | Useful — consider enabling |

## Adding a new strict flag

1. Enable it in `packages/typescript-config/base.json`.
2. Run `pnpm typecheck` — fix all errors before committing.
3. Document it in this table.
4. Add a biome rule if a biome equivalent exists.
