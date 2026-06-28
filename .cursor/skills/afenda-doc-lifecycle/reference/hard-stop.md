# Hard stop — doc lifecycle preflight violated

Paste this **verbatim** when the agent detects documentation edits before preflight, missing announcement, or skill claims without `Read` tool evidence.

```txt
HARD STOP — afenda-doc-lifecycle preflight violated

This turn attempted documentation work before mandatory bundle preflight completed.

Required first user-visible line (exact):
THE AGENT IS USING AFENDA DOC LIFECYCLE BUNDLE..

Required order before ANY Write / StrReplace / EditNotebook / Delete on governance docs:
1. Read .cursor/skills/afenda-doc-lifecycle/SKILL.md
2. Read intent reference (doc-types.md | doc-audit.md | doc-sync.md)
3. Read every applicable row from the bundle table (Read tool — list paths)
4. Read every skill the user attached or named in the message
5. Post Preflight Receipt (reference/preflight-receipt.md)
6. Announce: I'm using afenda-doc-lifecycle — stating the doc execution contract before edits.
7. Post Phase 0 — all six lines (objective, allowed layer, files, prohibited, authority, mode + acceptance)

Forbidden until preflight receipt is posted:
- Documentation file edits
- Claiming "I used skill X" without Read evidence in this turn
- Claiming gates passed without Shell output in this turn
- Improvisation when a required template or upstream doc is missing — use Blocker Report instead

Recovery: complete steps 1–7 in a new reply. Do not edit files in the same turn as this hard stop unless the user explicitly says "proceed after preflight".
```
