# Vendor rule index — read on failure only

Do not preload vendor skills. Read the row that matches the failed Afenda ID.

| Afenda ID | Vendor skill | Path |
| --- | --- | --- |
| B1–B8 | typescript-react-reviewer | `~/.claude/skills/typescript-react-reviewer/SKILL.md` |
| A1–A3, A7 | react-best-practices | `vercel-react-best-practices/react-best-practices` |
| A8–A10 | vercel-composition-patterns | `~/.claude/skills/vercel-composition-patterns/SKILL.md` |
| A2, bundle | afenda-shadcn-performance | `.cursor/skills/afenda-shadcn-performance/SKILL.md` |
| C1–C6 | coding-standards | `AGENTS.md` + Biome |
| Y1–Y7 | web-accessibility | `~/.claude/skills/web-accessibility/SKILL.md` (on failure only) |
| T1–T2 | afenda-primitive-contract | SKILL + `reference/mismatch-inspection-frame.md` + `reference/react-testing-patterns-bridge.md` |
| Primitive recipes / boolean modes | vercel-composition-patterns | `~/.claude/skills/vercel-composition-patterns/SKILL.md` → [composition-patterns-bridge.md](../../afenda-primitive-contract/reference/composition-patterns-bridge.md) |
| React testing (T2 behavior) | react-testing-patterns | vendor skill → [react-testing-patterns-bridge.md](../../afenda-primitive-contract/reference/react-testing-patterns-bridge.md) |
| Adapter perf (P1–P8) | react-best-practices | `vercel-react-best-practices/react-best-practices` → [react-best-practices-bridge.md](../../afenda-primitive-contract/reference/react-best-practices-bridge.md) |
| T3–T8 | react-testing-patterns | `AGENTS.md` testing + `@afenda/testing/react` |

**Repo wins:** When vendor conflicts with `AGENTS.md` or Afenda skills, follow Afenda.
