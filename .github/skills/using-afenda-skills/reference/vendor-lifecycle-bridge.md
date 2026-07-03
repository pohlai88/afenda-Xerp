# Vendor `using-agent-skills` → Afenda routing bridge

In **afenda-Xerp**, `/using-afenda-skills` is the **primary meta-skill** for skill discovery. Vendor `using-agent-skills` phase skills still apply for generic engineering workflow; this table maps each vendor phase to Afenda bundles and hard stops.

## Phase overlay

| Vendor phase / skill | Afenda first hop | Notes |
| --- | --- | --- |
| interview-me | same (vendor) | Underspecified editorial → still interview before `afenda-editorial-bundle` |
| idea-refine | same (vendor) | Swiss/Verdant variants → read `afenda-editorial-lab` SSOT after refine |
| spec-driven-development | + PAS slice planner if foundation | Editorial specs cite registry pattern IDs |
| planning-and-task-breakdown | + `@afenda-governed-implementer` scope | Separate lab vs promotion stages in tasks |
| context-engineering | + editorial SSOT read order | See `afenda-editorial-lab` |
| incremental-implementation | **`coding-consistency-bundle`** | Always |
| frontend-ui-engineering | **`afenda-editorial-bundle`** if editorial terms | Else `afenda-presentation-quality` + `shadcn-studio` |
| source-driven-development | Context7 / Next MCP | PAS-006 for presentation |
| doubt-driven-development | vendor | Adversarial pass before Stage C promotion |
| test-driven-development | `/afenda-test` + contract tests | Login: `presentation-lab-login.contract.test.ts` |
| browser-testing-with-devtools | Storybook MCP + ERP next-devtools | Editorial: preview URL required |
| code-review-and-quality | `/afenda-review` | |
| shipping-and-launch | `/afenda-ship` | |

## Editorial lifecycle (Define → Ship)

```
Define:  interview-me / idea-refine
         → name surface + registry pattern ID (not story title alone)

Plan:    spec or design plan (afenda-editorial-compose template)
         → Promotion stage A | B | C | none

Build:   coding-consistency-bundle
         → afenda-editorial-bundle (if editorial)
         → design plan: written yes BEFORE first edit

Verify:  Storybook preview-stories URL
         → presentation-lab contract tests
         → package-css-dist-sync if noir CSS touched

Review:  /afenda-review (+ editorial acceptance checklist)

Ship:    Stage C only → afenda-presentation-promotion + ERP gates
```

## Core behaviors (shared)

Vendor **Core Operating Behaviors** (surface assumptions, manage confusion, push back, simplicity, scope discipline, verify) apply unchanged. Afenda adds:

- **Phase 0** before any edit (`afenda-coding-session`)
- **Bundle preflight** before editorial edits (`afenda-editorial-bundle`)
- **Registry vs contract slug** confusion → stop (`editorial-login-quality.md`)

## When to skip vendor UI skills

| Request | Skip | Route |
| --- | --- | --- |
| Swiss Noir / Verdant / not ordinary | vendor `frontend-design`, shadcn `/iui` | `afenda-editorial-bundle` |
| Stock MCP block install only | editorial bundle | `shadcn-studio` → quarantine |
| PAS kernel / registry | frontend skills | `kernel-authority`, `@foundation-registry-owner` |
