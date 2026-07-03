# Preflight receipt template

<!--
Operator mandate (verbatim):

WHENEVER THE BUNDLE SKILL IS USING, PREFLIGHT SHOWING FIRST COIDNG... THE AGENT IS USING CODING CONSISTENY BUNDLE..
-->

Post this block **after** `Read` tool calls, **before** any file edit.

```markdown
## Preflight receipt — coding-consistency-bundle

**Announcement (exact):** THE AGENT IS USING CODING CONSISTENY BUNDLE..

### Reads completed (this turn)

| Path | Purpose |
| --- | --- |
| `.cursor/skills/coding-consistency-bundle/SKILL.md` | Bundle entry |
| … | Row N from bundle table |
| … | User-named / attached skill |

### Applicable bundle rows

- [ ] 1 afenda-coding-session
- [ ] 2 VERIFICATION.md
- [ ] 3 PATTERNS.md
- [ ] 4 architecture-authority (if applicable)
- [ ] 5 pas-slice-planner (if slice handoff)
- [ ] 6 AGENTS.md
- [ ] 7 kernel-authority (if applicable — includes user-named PAS/kernel boundary work)
- [ ] 8 enterprise-knowledge (if applicable)

### User-named skills (message / attachment)

- …

### Blockers

- None — OR list missing handoff / authority → **Blocker Report only, no edits**

### Next step

- Phase 0 (afenda-coding-session) — then wait for user **proceed** if they required read-only preflight
```

Replace `…` with actual paths read. Uncheck only rows that truly do not apply; do not skip row 1–3 or 6.
