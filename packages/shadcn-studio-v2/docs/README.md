# shadcn Studio V2 Documentation Index

This directory is the documentation entry point for `@afenda/shadcn-studio-v2`.
It links the roadmap, taxonomy, slice implementation details, handoff evidence,
and migration references used to keep V2 synchronized before the next slice.

## Core documents

- [Roadmap](ROADMAP.md)
- [Taxonomy](TAXONOMY.md)
- [Migration map](MIGRATION-MAP.md)
- [Component pre-migration guide](COMPONENT-PRE-MIGRATION.md)
- [Primitive API consistency](PRIMITIVE-API-CONSISTENCY.md)
- [Bridging-R phase R readiness](BRIDGING-R-PHASE-R-READINESS.md)
- [Bridging-R implementation index](bridging-r/README.md)
- [Bridging-R preflight consistency](bridging-r/BR-0-PREFLIGHT-CONSISTENCY.md)
- [Bridging-R synchronization and gap analysis](bridging-r/BR-0-1-SYNCHRONIZATION-AND-GAP-ANALYSIS.md)
- [Phase R consumer cutover guide](PHASE-R-CONSUMER-CUTOVER-GUIDE.md)
- [Legacy retirement plan](LEGACY-RETIREMENT-PLAN.md)

## Slice implementation tracking

- [Slice implementation index](slices/SLICE-IMPLEMENTATION-INDEX.md)
- [Slice implementation detail template](SLICE-IMPLEMENTATION-DETAIL-TEMPLATE.md)
- [Finishing evaluation and audit handoff template](SLICE-FINISHING-EVALUATION-AUDIT-HANDOFF.md)
- [Component pre-migration phase index](component-pre-migration/README.md)

## Slice evidence

- [Slice handoff directory](handoffs/)
- [Slice 0.5 finishing evaluation audit handoff](handoffs/SLICE-0-5-FINISHING-EVALUATION-AUDIT-HANDOFF.md)
- [Slice 9 legacy retirement handoff](handoffs/SLICE-9-LEGACY-RETIREMENT-HANDOFF.md)

## Synchronization rules

- Roadmap slice names must match implementation files in `slices/`.
- Every planned slice must have a corresponding handoff in `handoffs/`.
- Taxonomy examples must point to implemented V2 files, not placeholders.
- Component migration must pass `COMPONENT-PRE-MIGRATION.md` before code movement.
- Handoff links in the slice index must use `../handoffs/` from the `slices/` directory.
- V2 documentation changes must stay scoped to `packages/shadcn-studio-v2`.

## Local verification

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```
