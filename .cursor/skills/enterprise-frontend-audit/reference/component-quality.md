# Component Quality Reference

## Phase 5 — Component Audit

### 5.1 governed-primitive audit (packages/ui — 16-point checklist)

Full checklist: `.cursor/skills/govern-primitive/SKILL.md`

Quick scoring table (score one point per ✅ — target 9.5/10 = 15+/16):

```
[ ] 1.  resolvePrimitiveGovernance() is the ONLY class authority
[ ] 2.  className accepted only as governed extension — Omit<..., "className"> + readonly className?
[ ] 3.  GovernedXxxProps has state?: GovernedState — not state?: string
[ ] 4.  Prop spread order: {...props} → semantic data-* → {...governed.dataAttributes} LAST
[ ] 5.  Root uses forwardRef + displayName
[ ] 6.  Every public slot uses forwardRef + displayName (factory when ≥3 identical slots)
[ ] 7.  Every governance call includes recipeName
[ ] 8.  Slot names and emitted data-slot DOM values match primitive-registry.ts exactly
[ ] 9.  Every static slotKey registered in slotClassNamesByKey AND dataSlotByKey
[ ] 10. No "use client" unless genuinely required
[ ] 11. No raw Tailwind strings in Slot or sub-primitive className
[ ] 12. Accessibility semantics preserved and tested
[ ] 13. Deprecated props bridge into canonical governed props only — canonical wins
[ ] 14. Render tests prove consumer data-* cannot override governed data-*
[ ] 15. Public exports remain stable
[ ] 16. pnpm --filter @afenda/ui check:governance passes
```

**Verification:**
```bash
pnpm --filter @afenda/ui check:governance
pnpm --filter @afenda/ui typecheck
pnpm --filter @afenda/ui test:run
pnpm --filter @afenda/ui build
```

### 5.2 Consumer-layer audit (appshell / metadata-ui / erp — 8-point checklist)

```
[ ] 1.  Import @afenda/ui and @afenda/ui/governance directly — no re-export barrels
[ ] 2.  No CSS modules for shell chrome when globals.css already @source's the package
[ ] 3.  Zero className on any tag in GOVERNED_UI_TAGS (see governed-ui-consumption.mjs)
[ ] 4.  Shell layout chrome on plain HTML wrappers only (div, span, header)
[ ] 5.  shadcn-studio blocks under packages/appshell/src/shadcn-studio/blocks/
[ ] 6.  Governed Button props used directly (mapStockButtonProps is sunset)
[ ] 7.  Integration render test exists (AppShell mounts without Governed UI throw)
[ ] 8.  pnpm --filter @afenda/appshell test:run passes
```

**Common consumer anti-patterns:**

| Anti-pattern | Root cause | Fix |
|--------------|-----------|-----|
| `<Button className="gap-2 bg-primary">` | Governed UI throw | Remove className; use `intent="primary" emphasis="solid"` |
| `<Card className="rounded-xl shadow-lg p-6">` | Governed UI throw | Wrap in `<div className="my-surface-class">` |
| `<SheetContent className="gap-0">` | Governed UI throw | Remove className; use default recipe |
| `<Badge className="bg-green-500">Active</Badge>` | No token usage | Use `tone="success"` |
| `<Button variant="ghost" size="sm">` (stock shadcn) | Sunset API | `intent="quiet" emphasis="ghost" size="sm"` |
| `<Button variant="destructive">` | Sunset API | `intent="destructive" emphasis="solid"` |
| Re-exporting from `packages/appshell/src/governance/` | Indirection | Import at call site |
| `shell-surfaces.module.css` parallel to globals.css | Duplicate token surface | Use globals.css tokens on plain divs |

### 5.3 React component quality (react-erp-quality gates)

Full skill: `.cursor/skills/react-erp-quality/SKILL.md`

#### Hooks discipline

```
[ ] No useEffect that only calls setState from a prop — derive during render instead
[ ] All deps arrays use primitives or stable refs — no object/array literals
[ ] useMemo / useCallback only where measurable (expensive ops or stable callback identity)
[ ] Functional setState for all toggle/increment patterns: setOpen((prev) => !prev)
[ ] All subscriptions / event listeners return cleanup functions
[ ] No useEffect for initial data loading — use RSC or React Query / SWR
```

**The most common ERP hook violation:**

```tsx
// ❌ sync derived state via useEffect
useEffect(() => {
  setLayout(resolvedInitialLayout);
}, [resolvedInitialLayout]);

// ✅ Fix A: derive during render
const layout = resolvedInitialLayout;

// ✅ Fix B: key reset pattern
<DashboardCanvas key={layoutPresetId} layout={layoutProp} />

// ✅ Fix C: store only local divergence
const [userEdits, setUserEdits] = useState<Partial<DashboardLayoutPreset>>({});
const layout = { ...resolvedInitialLayout, ...userEdits };
```

#### Composition patterns (vercel-composition-patterns)

```
[ ] No component with > 3 boolean mode flags — split into explicit variants
[ ] No component functions defined inside other component functions
[ ] renderX props replaced with children or compound-component slots
[ ] No React.forwardRef() — use ref as plain prop (React 19)
[ ] Context interface shape: { state, actions, meta }
[ ] Compound components used for complex shared-state UI (not prop drilling)
```

**Boolean prop explosion fix:**

```tsx
// ❌ accumulates flags
<DashboardCanvas editMode isLoading showEmptyState showReadonlyPreviewLabel />

// ✅ explicit variants
<DashboardCanvasEditMode layout={layout} onLayoutChange={handleChange} />
<DashboardCanvasReadonlyMode layout={layout} previewLabel="Q2 Layout" />

// ✅ children composition
<DashboardCanvas layout={layout}>
  {/* consumer controls content */}
</DashboardCanvas>
```

#### React 19 migration

```
[ ] No React.forwardRef() wrappers — use ref as prop
[ ] No class components
[ ] use() hook replacing useContext() where appropriate
[ ] No async client components
```

### 5.4 Component duplication audit

Steps:

1. Search for identical layout patterns repeated in multiple files:
   ```bash
   rg "className=\"flex flex-col gap-" apps/erp/src --stats
   rg "className=\"grid grid-cols-" apps/erp/src --stats
   ```
2. Search for similar component shapes:
   ```bash
   rg "function.*Card.*\(" apps/ packages/ --type tsx --stats
   rg "function.*Widget.*\(" apps/ packages/ --type tsx --stats
   ```
3. Flag every duplication with file paths, line numbers, and similarity score.
4. For each pair: decide → merge into governed component OR document intentional divergence.

### 5.5 Dead component audit

```bash
# Find components defined but not imported anywhere
rg "export (function|const) [A-Z]" packages/appshell/src --type ts -l | while read f; do
  name=$(rg "export (function|const) ([A-Z]\w+)" "$f" -o -r '$2' | head -1)
  count=$(rg "import.*$name" apps/ packages/ --type ts --type tsx | wc -l)
  echo "$count $name $f"
done | sort -n | head -20
```

Flag every component with 0 external imports for deletion or explicit documentation.

### 5.6 Metadata-driven UI coverage audit (Phase 6)

Metadata-driven rendering is the long-term strategy for reducing imperative UI logic.

**Coverage inventory:**

| UI surface | Metadata-driven? | Gap |
|-----------|-----------------|-----|
| Page layouts | `@afenda/metadata-ui` page renderers | — |
| Form fields | metadata field descriptors | — |
| Table columns | column descriptor objects | — |
| Navigation | route metadata (module catalog) | — |
| Command palette | command registry | — |
| Status badges | status metadata maps | — |
| Empty states | empty state descriptors | — |
| Detail panels | panel layout metadata | — |
| Toolbars / actions | action descriptor registry | — |
| Widget configuration | widget manifest | — |

**For each surface, report:**
- `Metadata-driven`: fully driven by metadata — no hardcoded UI structure
- `Partial`: some metadata, some hardcoded
- `Hardcoded`: no metadata ownership

**Gap metric:**
```
Metadata-driven UI coverage = (metadata-driven + 0.5 × partial) / total surfaces × 100%
Target: ≥ 70% for enterprise maturity score ≥ 8.0
```

**Maximize metadata where feasible:**
```
[ ] Pages declared in modules.catalog.json route map (not hardcoded in layout)
[ ] Form schemas driven by ZodMeta descriptors or @afenda/enterprise-knowledge models
[ ] Table columns driven by column descriptor from module catalog
[ ] Navigation items sourced from module registry, not JSX arrays
[ ] Command palette commands registered in command registry (not hardcoded array)
[ ] Workspace dashboard layout driven by DashboardLayoutPreset metadata
[ ] Widget visibility driven by feature flags and permission metadata
```
