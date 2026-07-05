# @afenda/shadcn-studio-v2

## Purpose

`@afenda/shadcn-studio-v2` is the greenfield enterprise design-system package
for Afenda.

This package is built through bounded execution slices. It is not a debugging,
migration, or documentation-expansion project.

## Active authority

Use only these documents as active authority for the package:

- `docs/DESIGN-SYSTEM-ARCHITECTURE.md`
- `docs/DEVELOPMENT-ROADMAP.md`
- `docs/TAXONOMY.md`
- `docs/slices/README.md`
- `docs/slices/*`

Other documents may remain on disk, but they are not active execution authority
unless one of the files above explicitly references them.

## Package rule

The package is accepted only through executable proof:

```txt
taxonomy + tokens + components + exports + consumer route + tests
```

## Current workflow

Use the slice sequence in `docs/slices/README.md`.

Each slice must:

- stay inside its own scope
- return proof
- avoid unrelated package or consumer work

## Do not use this package README for

- historical analysis
- previous implementation comparison
- broad migration planning
- doctrine expansion
