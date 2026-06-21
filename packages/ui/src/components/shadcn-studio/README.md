# shadcn-studio install staging (removed)

Raw MCP install output must **not** live in `@afenda/ui`.

## Where blocks belong

1. Install or collect blocks via shadcn-studio MCP.
2. Govern primitives (strip `className` from `@afenda/ui` imports).
3. Move governed blocks to `packages/appshell/src/shadcn-studio/blocks/`.

See `.cursor/skills/shadcn-studio/SKILL.md` and `.cursor/skills/govern-primitive/SKILL.md`.
