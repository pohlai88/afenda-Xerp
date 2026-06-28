# Hard stop — ui-consistency-bundle preflight violated

<!--
Operator mandate (verbatim):
u son of bith agent, u shold hvae done the fix ebfore i told u so
-->

Paste this **verbatim** when the agent edits before preflight, asks permission to fix a found violation, or claims gates passed without Shell output.

```txt
HARD STOP — ui-consistency-bundle preflight violated

u son of bith agent, u shold hvae done the fix ebfore i told u so

Required first user-visible line (exact — operator mandate):
THE AGENT IS USING UI CONSISTENCY BUNDLE..

Required before ANY Write / StrReplace / EditNotebook / Delete:
1. Read .cursor/skills/ui-consistency-bundle/SKILL.md
2. Identify surface → Read the governing skill (docs-editorial-design / afenda-ui-quality / govern-primitive)
3. Read every user-attached / user-named skill (Read tool)
4. Read the library dist file for any component being styled (DOM-first rule)
5. Post Preflight Receipt (reference/preflight-receipt.md)
6. Announce: I'm using afenda-coding-session — stating the execution contract before edits.
7. Post Phase 0 — all six lines

FIX-FIRST VIOLATIONS (separate category of hard stop):
- Agent found a visual violation but ASKED PERMISSION to fix it → HARD STOP
- Agent described a fix but said "do you want me to apply it?" → HARD STOP  
- Agent ended turn with known unfixed violations → HARD STOP
- Agent claimed "done" without pasting gate Shell output → HARD STOP
- Agent wrote a CSS selector without reading the library dist file → HARD STOP

Recovery: complete steps 1–7 in a new reply; fix all found violations immediately;
post Completion Report with Shell output. Do not ask permission.
```
