# PAS Slice Template

Copy to `docs/PAS/slice/<bN>-<pas-section>-<slug>.md`.

← Index: [pas-template.md](pas-template.md) · Handoff spec: [write-fdr-slice/SKILL.md](../../../write-fdr-slice/SKILL.md) §4

Optional companion: `<same-base>-prohibited.md` for extra prohibitions (read by `pas-slice-planner`).

---

## Copy block — slice document

~~~markdown
# Slice <ID> — <Title> (PAS-NNN §<section>)

**Prerequisite:** <prior slice, ADR acceptance, or runtime evidence row>

**Status:** Not started | Delivered (<YYYY-MM-DD>)

**Type:** Research | Implementation | Registry-sync | Evidence-sync

**Risk class:** Low | Medium | High

**Clean Core impact:** A→A | A→B (justify if drop)

## Purpose

<One paragraph: what this slice proves, changes, or discovers. One package only for Implementation slices.>

## Handoff block

```
Handoff from: docs/PAS/slice/<filename>.md

1. Objective    — <one sentence; no vague language>
2. Allowed layer— <runtimeOwner path or "docs-only" for Research/Evidence-sync>
3. Files        —
   <one path per line; every file the implementer will touch>
4. Prohibited   — <registry prohibited[] + slice-specific>
5. Authority    — <PAS-NNN §X · ADR · skill name>
6. Gates        —
   pnpm --filter @afenda/<name> typecheck
   pnpm --filter @afenda/<name> test:run
   <additional gates — must resolve to real scripts>
7. Closes       — <gap IDs or DoD row references>
8. Evidence     —
   <expected file paths after delivery — not "tests will prove it">
9. Attestation  — <Contract/Test/Governance/Observability/Security/Documentation/Maintainability — which dimensions change>
```

## Rules frozen

1. <Rule that must not drift during implementation>
2. <Rule>
3. …

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | <criterion> | `pnpm ...` |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| <capability> | No — Slice <ID> | `<path after delivery>` |
~~~

---

## Copy block — prohibited companion (optional)

~~~markdown
# Slice <ID> — Prohibited (companion)

**Parent:** [`<filename>.md`](<filename>.md)

## Additional prohibitions

- <prohibition not covered by registry or PAS §5>
- …

## Documentation-only override

When Type is Research or Evidence-sync:

- Do not modify `packages/**` or `apps/**` unless explicitly listed in handoff field 3
~~~

---

## Handoff validation (before commit)

- [ ] Exactly 9 numbered fields inside the Handoff block fence
- [ ] Field 3 lists every file including tests and sync docs
- [ ] Field 6 has at least one resolvable `pnpm` command
- [ ] Field 7 references specific gap IDs or DoD rows — not "various gaps"
- [ ] Field 8 lists file paths — not narrative promises
- [ ] Implementation slice: field 3 has only one `packages/<owner>/` tree (one package per slice)
- [ ] Research / Evidence-sync: no `packages/` or `apps/` paths in field 3 unless waiver documented
