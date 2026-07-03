# Preflight receipt template

Post this block **after** `Read` tool calls, **before** any editorial file edit.

Requires `coding-consistency-bundle` preflight to complete first when editing repo files.

```markdown
## Preflight receipt — afenda-editorial-bundle

**Announcement (exact):** THE AGENT IS USING AFENDA EDITORIAL BUNDLE.

### Reads completed (this turn)

| Path | Purpose |
| --- | --- |
| `.cursor/skills/afenda-editorial-bundle/SKILL.md` | Bundle entry |
| `.cursor/skills/afenda-editorial-lab/SKILL.md` | Taste constitution |
| `.cursor/skills/afenda-editorial-compose/SKILL.md` | Implementation workflow |
| … | Conditional rows below |

### Applicable bundle rows

- [ ] 1 afenda-editorial-lab
- [ ] 2 afenda-editorial-compose
- [ ] 3 pattern-and-doctrine reference (if pattern selection needed)
- [ ] 4 workflow-templates reference (if implementing)
- [ ] 5 afenda-storybook (if story changes)
- [ ] 6 afenda-presentation-promotion (if promotion terms)
- [ ] 7 package-css-dist-sync (if noir CSS edited)
- [ ] 8 editorial-login-quality reference (if Auth Login Lab / login contract / pattern bridge)

### Editorial Phase 0 extensions (required)

```txt
Surface:
Pattern id:
Preset:
Promotion stage:
Design plan: written yes/no
```

### Blockers

- None — OR missing SSOT / `Design plan: written yes` missing → **stop, no edits**

### Next step

- Post design plan (compose) → then implement → preview evidence in completion report
```

Replace `…` with actual paths read.
