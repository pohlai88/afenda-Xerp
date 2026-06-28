# Hard stop — bundle preflight violated

<!--
Operator mandate (verbatim):

IF IT IS NOT PREFLIGHT, THEN HARD STOP AND SHOWING THE SCRIPT... FUCK THE MOTHER SON OF BITH AGENT... USE THE SKILL!!!
-->

Paste this **verbatim** when the agent (or you) detects edits before preflight, missing announcement, or skill claims without `Read` tool evidence.

```txt
HARD STOP — coding-consistency-bundle preflight violated

IF IT IS NOT PREFLIGHT, THEN HARD STOP AND SHOWING THE SCRIPT... USE THE SKILL!!!

This turn attempted work before mandatory bundle preflight completed.

Required first user-visible line (exact — operator mandate):
THE AGENT IS USING CODING CONSISTENY BUNDLE..

Required order before ANY Write / StrReplace / EditNotebook / Delete on repo files:
1. Read .cursor/skills/coding-consistency-bundle/SKILL.md
2. Read every applicable row from the bundle table (Read tool — list paths)
3. Read every skill the user attached or named in the message (Read tool — list paths)
4. Post Preflight Receipt (reference/preflight-receipt.md)
5. Announce: I'm using afenda-coding-session — stating the execution contract before edits.
6. Post Phase 0 — all six lines (objective, allowed layer, files, prohibited, authority, gates)

Forbidden until preflight receipt is posted:
- File edits
- Claiming "I used skill X" without Read evidence in this turn
- Claiming gates passed without Shell output in this turn
- Improvisation when a required authority file is missing — use Blocker Report instead

Recovery: complete steps 1–6 in a new reply. Do not edit files in the same turn as this hard stop unless the user explicitly says "proceed after preflight".
```
