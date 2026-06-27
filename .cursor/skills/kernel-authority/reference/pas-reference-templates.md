# PAS Reference File Templates

Create under `.cursor/skills/<package-name>-authority/reference/`.

← Index: [pas-template.md](pas-template.md)

---

## quick-ref.md (~80 lines)

Ultra-light fallback when SKILL exceeds token budget. Duplicate only high-signal blocks.

~~~markdown
# <Package Name> — Quick Reference (PAS-NNN)

← Full skill: [SKILL.md](../SKILL.md) · PAS §0: [docs/PAS/PAS-NNN-...md](../../../../docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md)

## Boundary

<Paste §2 one sentence>

## Hard stops

### Prohibited imports

```
<§3.2 condensed>
```

### Must never own

```
<§5 top items>
```

## Decision matrix

| Question | If yes → | In package? |
| --- | --- | --- |
| … | … | **Yes** / **No** |

## Required gates

```bash
pnpm --filter @afenda/<name> typecheck
pnpm --filter @afenda/<name> test:run
```

Full detail → SKILL.md and PAS §0.
~~~

---

## authority-surfaces.md

~~~markdown
# Authority Surfaces Reference

Detailed TypeScript shapes for `@afenda/<name>` authority surfaces.

← Back to [SKILL.md](../SKILL.md) · Canonical: [PAS-NNN](../../../../docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md)

**Status labels:**

| Label | Meaning |
| --- | --- |
| `Status: Current` | Matches source in `packages/<name>/src/` |
| `Status: Target` | Planned — requires a dedicated slice |
| `Status: Deprecated` | Scheduled removal — cite slice or ADR |

---

## <Surface name>

Status: Current — `packages/<name>/src/<path>.ts`

```ts
// Minimal shape — expand in PAS §4, not prose here
export type ExampleId = Brand<string, "ExampleId">;
```

---

## <Next surface>

Status: Target — `packages/<name>/src/<planned-path>/`

```ts
// Planned shape
```
~~~

**Rules:** One section per PAS §4 surface. File path on every section. No narrative beyond one-line description.

---

## package-structure.md

~~~markdown
# Package Structure Reference

← Back to [SKILL.md](../SKILL.md) · Canonical: [PAS-NNN §6](../../../../docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md)

## Current tree

```text
packages/<name>/src/
├── index.ts
└── …
```

## Target tree

```text
packages/<name>/src/
├── index.ts
└── …
```

## package.json exports

### Current

| Export subpath | Resolves to | Status |
| --- | --- | --- |
| `.` | `./dist/index.js` | Current |

### Target

| Export subpath | Resolves to | Slice |
| --- | --- | --- |
| `./<subpath>` | `./dist/<subpath>/index.js` | Bn |
~~~

**Rules:** Refresh Current from repo on each Implementation slice that changes layout. Target matches PAS §6.
