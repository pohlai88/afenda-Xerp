# Preflight receipt template

Post this block **after** `Read` tool calls, **before** any documentation edit.

```markdown
## Preflight receipt — afenda-doc-lifecycle

**Announcement (exact):** THE AGENT IS USING AFENDA DOC LIFECYCLE BUNDLE..

### Intent
- [ ] AUTHOR — write / amend governance doc
- [ ] AUDIT — evidence · boundary · chain alignment · drift
- [ ] SYNC — SKILL regen · vocab · CI gate · inventory sync
- [ ] Read-only context — no edits this turn

### Reads completed (this turn)

| Path | Purpose |
| --- | --- |
| `.cursor/skills/afenda-doc-lifecycle/SKILL.md` | Bundle entry |
| `.cursor/skills/afenda-doc-lifecycle/reference/doc-types.md` | AUTHOR (if applicable) |
| `.cursor/skills/afenda-doc-lifecycle/reference/doc-audit.md` | AUDIT (if applicable) |
| `.cursor/skills/afenda-doc-lifecycle/reference/doc-sync.md` | SYNC (if applicable) |
| … | User-named / wired skill from bundle table |

### Applicable bundle rows

- [ ] 1 afenda-doc-lifecycle (always)
- [ ] 2 doc-types.md (AUTHOR)
- [ ] 3 doc-audit.md (AUDIT)
- [ ] 4 doc-sync.md (SYNC)
- [ ] 5 doc-boundary-contract (AUTHOR or AUDIT)
- [ ] 6 doc-evidence-standard (AUTHOR or AUDIT)
- [ ] 7 pas-codebase-bridge (AUDIT + PAS↔code)
- [ ] 8 pas-prohibited-surface-scan (AUDIT + unclaimed code)
- [ ] 9 enterprise-knowledge (SYNC + vocab)
- [ ] 10 pas-slice-planner (AUTHOR + slice)
- [ ] 11 user-attached / named skill

### Blockers

- None — OR list missing upstream doc / authority → **Blocker Report only, no edits**

### Next step

- Announce: `I'm using afenda-doc-lifecycle — stating the doc execution contract before edits.`
- Phase 0 (six lines) — then edit or audit
```

Replace `…` with actual paths read. Uncheck only rows that truly do not apply; always check row 1.
