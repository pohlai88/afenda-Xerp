# PAS-004E — Enterprise Vocabulary Admission and Coverage Standard

> **Derivation:** PAS-004E extends [PAS-004D operational closure](PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md) with **vocabulary admission** (how terms enter the registry) and **coverage enforcement** (how code surfaces prove linkage to accepted meaning). It does **not** amend PAS-004 §1–§4.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-004E |
| **Parent PAS** | PAS-004 · PAS-004A · PAS-004B · PAS-004C · PAS-004D |
| **Package** | `@afenda/enterprise-knowledge` |
| **Runtime stance** | `contracts-only` + derived read-only artifacts |

## Ruling

> **cspell is not vocabulary governance.** It is a derived IDE comfort layer only. Authority remains `concepts.json` / `terms.json` / `atoms.json`. Enforcement is CI. Runtime linkage is ERP module foundation + metadata projection.

## Vocabulary admission states

| State | Meaning | CI |
| --- | --- | --- |
| `registered` | Row in `terms.json` linked to `conceptId` | Pass |
| `accepted` | Linked accepted atom in `atoms.json` | Pass |
| `wire_only` | Implementation allowed; business meaning pending | Warn |
| `unregistered` | User-facing surface with no registry entry | Fail (governed modules) |

## Derived artifacts (read-only)

| Artifact | Generator |
| --- | --- |
| `cspell.enterprise-knowledge.txt` | `pnpm export:knowledge-vocabulary` |
| `packages/enterprise-knowledge/dist/vocabulary.allowlist.json` | same |
| `packages/enterprise-knowledge/dist/vocabulary.coverage.schema.json` | same |

Never edit generated files manually.

## Required gates

| Gate | Purpose |
| --- | --- |
| `pnpm export:knowledge-vocabulary` | Regenerate derived dictionary + allowlist |
| `pnpm spellcheck` | IDE/CLI comfort (non-authoritative) |
| `pnpm check:code-vocabulary-coverage` | Module map + governed surface enforcement |
| `pnpm check:legacy-delivery-terminology` | Retired-term inverse gate (`RETIRED_TERM_USED`) |

## Fail codes

- `UNREGISTERED_TERM_IN_USER_FACING_SURFACE`
- `REGISTERED_TERM_WITHOUT_ACCEPTED_ATOM`
- `RETIRED_TERM_USED`
- `TERM_USED_OUTSIDE_APPLICABLE_MODULE`

## Module linkage

ERP module foundation bundles declare `termId`, `conceptId`, `atomId`, `status`, and optional `appliesTo` per term. See `packages/erp-module-foundation` procurement reference bundle.
