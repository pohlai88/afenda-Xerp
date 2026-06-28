# Slice B38 — PAS-002A Kernel Boundary Non-Duplication Gate (PAS-002A §4.1)

**Prerequisite:** PAS-002 B1–B27 delivered · [PAS-002A](../PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) authored

**Status:** Delivered

**Type:** Implementation

**Risk class:** Medium — touches BMD authority adjacency; requires dual kernel-authority + architecture-authority Phase 0

## Handoff block

```
Handoff from: docs/PAS/slice/b38-pas002a-kernel-boundary-gate.md

1. Objective    — Add architecture-kernel-non-duplication policy + check:architecture-kernel-non-duplication gate; reject ID family/parser/assert duplication in @afenda/architecture-authority per PAS-001 §4.1 / ADR-0021.
2. Allowed layer— packages/architecture-authority/src/policy/** · scripts/governance/check-architecture-kernel-non-duplication.mts · package.json script registration · tests
3. Files        —
   packages/architecture-authority/src/policy/architecture-kernel-non-duplication.policy.ts
   packages/architecture-authority/src/__tests__/architecture-kernel-non-duplication.test.ts
   scripts/governance/check-architecture-kernel-non-duplication.mts
   package.json (root check:architecture-kernel-non-duplication script)
4. Prohibited   — @afenda/kernel parser imports into architecture-authority src; foundation-disposition.registry.ts edits; ERP/appshell/ui packages
5. Authority    — PAS-002A §4.1 · PAS-001 §4.1 · ADR-0020 · ADR-0021 · kernel-authority + architecture-authority skills
6. Gates        — pnpm --filter @afenda/architecture-authority typecheck · test:run · pnpm check:architecture-kernel-non-duplication · pnpm quality:boundaries · pnpm check:architecture-authority-surface
7. Closes       — PAS-002A §4.1 kernel non-duplication surface; first PAS-002A implementation slice
8. Evidence     — gate exit 0 output; policy unit tests; no forbidden patterns under packages/architecture-authority/src/
9. Attestation  — Architecture · Kernel boundary
```

## Acceptance criteria

| # | Criterion | Test |
| ---: | --- | --- |
| 1 | Policy module exports forbidden pattern list + scan helper | unit test |
| 2 | Gate fails on synthetic fixture with `parseTenantId` in architecture-authority | gate test |
| 3 | Gate passes on current tree (BMD registry uses authority_only metadata only) | CI |
| 4 | Gate registered as `pnpm check:architecture-kernel-non-duplication` | package.json |
| 5 | Surface registry documents policy module (if exported) or gate script in evidence paths | manual / B42 |

## Kernel-authority checklist (mandatory before implementation)

- [ ] Phase 0 stated for **both** kernel-authority and architecture-authority
- [ ] No new ID families in architecture-authority
- [ ] BMD registry rows remain `runtimeStatus: "authority_only"`
- [ ] Gate script may read kernel paths as **strings** for comparison — not import parsers

## Registry owner follow-up

After gate is green: defer `PKGR02` gate list update to B42 attestation slice (or owner may add gate early if requested).
