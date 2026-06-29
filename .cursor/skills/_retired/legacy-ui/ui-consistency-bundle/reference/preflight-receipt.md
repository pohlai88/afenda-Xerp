# Preflight receipt template

<!--
Operator mandate (verbatim):
u son of bith agent, u shold hvae done the fix ebfore i told u so
-->

Post this block after all `Read` tool calls, before any file edit.

```markdown
## Preflight receipt — ui-consistency-bundle

**Announcement (exact):** THE AGENT IS USING UI CONSISTENCY BUNDLE..

### Surface identified
- [ ] Docs editorial — apps/docs/**
- [ ] ERP app UI — apps/erp/**
- [ ] UI primitives — packages/ui/**
- [ ] AppShell / metadata-ui
- [ ] Cross-surface

### Reads completed (this turn)
| Path | Purpose |
|------|---------|
| `.cursor/skills/ui-consistency-bundle/SKILL.md` | Bundle entry |
| `.cursor/skills/afenda-coding-session/SKILL.md` | Phase 0 + §11 |
| `.cursor/skills/afenda-coding-session/VERIFICATION.md` | Gate matrix |
| `AGENTS.md` | Ultracite standards |
| <surface governing skill> | Visual authority |
| <user-attached/named skills> | ... |

### DOM inspection (library components)
| Component | Dist file read | Real selector confirmed |
|-----------|---------------|------------------------|
| <name> | <path> | <class or data-attr> |

### Fix-first plan
| Violation observed | Will fix in this turn | Approach |
|-------------------|-----------------------|----------|
| <describe> | Yes | <approach> |

### Blockers
- None — OR: <missing authority / handoff → Blocker Report only, no edits>

### Next step
Phase 0 (afenda-coding-session) — then begin fixes immediately without asking permission.
```

Replace `…` with actual paths read. DOM inspection row required for every library component selector written.
