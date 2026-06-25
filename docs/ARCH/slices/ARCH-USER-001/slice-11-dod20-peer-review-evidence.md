# ARCH-USER-001 · Slice 11 — DoD #20 peer review evidence packet

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-USER-001`](../../%5BComplete%5D%20ARCH-USER-001-user-settings-self-service.md) |
| **Slice** | 11 |
| **Status** | Delivered (2026-06-25) — DoD #20 closed Slice 12 · ARCH **Complete** |
| **Prerequisite** | Slices 8–10 delivered ✓ |
| **Slice type** | Evidence-sync |
| **Runtime owner** | `docs/` · gate verification only |
| **Closes** | DoD #20 readiness evidence (sign-off remains human) · §16 gate consolidation |

---

## Design (internal-guide)

- Run full ARCH-USER-001 §10 gate matrix; record exit codes in new §16 **DoD #20 peer review readiness** table (mirror ARCH-ADMIN-001 Slice 10).
- Update `arch-status-index.md` — Slices 8–11 delivered; next step human sign-off.
- Sync runtime matrix User Settings cross-ref for Slices 8–11 evidence paths.
- Add `slice-index.md` under `docs/ARCH/slices/ARCH-USER-001/` listing all slices 8–11.
- **Agent cannot sign DoD #20** — document gate evidence only; no `[Complete]` filename rename.
- Fix stale `arch-status-index` rows that still cite "integration AC open" (closed Slice 8).

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-USER-001/slice-11-dod20-peer-review-evidence.md

1. Objective    — Consolidate §10 gate evidence for Architecture Authority peer review; populate §16 DoD #20 readiness table; sync index + matrix for Slices 8–11 without Complete promotion or fake DoD #20 sign-off.
2. Allowed layer— docs/ · apps/erp (gate runs only — fix only if gate failure is in user-settings scope)
3. Files        — docs/ARCH/[Partially Implemented] ARCH-USER-001-user-settings-self-service.md (Modified — §16 DoD #20 table)
                  docs/ARCH/arch-status-index.md (Modified — Slices 8–11 evidence)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — peer-review readiness note)
                  docs/ARCH/slices/ARCH-USER-001/slice-11-dod20-peer-review-evidence.md (Modified — status)
                  docs/ARCH/slices/ARCH-USER-001/slice-index.md (New)
                  docs/ARCH/README.md (Modified — ARCH-USER-001 slice summary if stale)
4. Prohibited   — packages/ui · foundation-disposition.registry.ts · @afenda/accounting · ARCH [Complete] filename rename · agent DoD #20 sign-off · runtime behavior changes unless gate proves defect in user-settings
5. Authority    — ARCH-USER-001 §16 · ADR-0012 documentation-drift · ARCH-ADMIN-001 Slice 10 pattern
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm --filter @afenda/auth test:run
                  pnpm --filter @afenda/appshell test:run
                  pnpm ui:guard:scan
                  pnpm exec biome check apps/erp/src/lib/user-settings apps/erp/src/components/user-settings
                  pnpm quality:boundaries
                  pnpm check:documentation-drift
                  pnpm check:foundation-disposition
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 20 | Peer review evidence packet | §16 table populated — **sign-off open** |

---

## Known debt

- Human Architecture Authority sign-off required for `[Complete]` promotion
- Profile email change UI — ARCH-AUTH-001 v2 (§15; not Complete blocker per §13)

## Gate evidence (2026-06-25 · refreshed)

| Gate | Exit | Result |
| --- | ---: | --- |
| `pnpm --filter @afenda/erp typecheck` | 0 | Pass |
| `pnpm --filter @afenda/erp test:run` | 0 | Pass — **716** tests (133 files) |
| `pnpm --filter @afenda/auth test:run` | 0 | Pass — **107** tests |
| `pnpm ui:guard:scan` | 0 | Pass — 305 files |
| `pnpm exec biome check apps/erp/src/lib/user-settings apps/erp/src/components/user-settings` | 0 | Pass — 31 files |
| `pnpm quality:boundaries` | 0 | Pass — 22 workspaces |
| `pnpm check:documentation-drift` | 0 | Pass |
| `pnpm check:foundation-disposition` | 0 | Pass (2026-06-25 initial packet) |

### §16 criterion gate mapping (for human reviewer)

| §16 # | Criterion | Verified gate | Exit |
| ---: | --- | --- | ---: |
| 1 | Four v1 tabs + RSC resolvers | ERP test:run | 0 |
| 2 | `user_preferences` persistence | ERP test:run | 0 |
| 3 | Integration AC U01/U02/U03/U08/U11/U12/U14 | `user-settings-acceptance.test.ts` · `user-settings.integration.test.ts` | 0 |
| 4 | Admin/user surface split | `user-admin-settings-split.test.tsx` | 0 |
| 5 | Mutation audit registry | `user-settings-mutation-audit-coverage.test.ts` | 0 |
| 6 | TIP-004 user-settings UI | `ui:guard:scan` | 0 |
| 7 | ARCH-AUTH-001 prerequisite | `@afenda/auth test:run` | 0 |
| 8 | Documentation authorities | `check:documentation-drift` | 0 |

**Human action required:** Complete §16 sign-off template in parent ARCH — agent cannot approve DoD #20 or rename to `[Complete]`.
