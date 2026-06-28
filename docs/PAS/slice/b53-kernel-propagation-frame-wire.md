# Slice B53 — Kernel Propagation Frame Wire (PAS-001 §4.11)

**Prerequisite:** PAS-001 §4.10 async context propagation · B15-4.3 execution context · B16 runtime rules

**Status:** Delivered — 2026-06-28

**Type:** Implementation — propagation frame clone safety, fork merge hygiene, wire triad, co-located tests

**Risk class:** Low — kernel propagation boundary only; no ERP or persistence changes

**Clean Core impact:** A→A — hardens ALS frame isolation and telemetry wire egress

## Purpose

Close PAS-001 §4.11 kernel context propagation to **Principal TypeScript Architect 9.5+/10**:

1. **Clone on `run()`** — ALS stores a cloned frame so caller mutation cannot leak into active context.
2. **Safe `fork()` merge** — partial overrides omit explicit `undefined`; `executionContext` deep-merges without poisoning nullable branded ids.
3. **Wire triad** — `kernel-context-frame.{contract,assert,parser}.ts` adds `KernelContextFrameWire` for logging/telemetry egress.
4. **Co-located tests** — `propagation/__tests__/kernel-context.test.ts` owns isolation + serialize coverage; governance gate accepts co-located or legacy root path.

## Handoff block

```
Handoff from: docs/PAS/slice/b53-kernel-propagation-frame-wire.md

1. Objective    — Harden kernel propagation ALS frame clone/fork semantics; add wire serialize/assert triad; co-locate tests; export from propagation + root index; sync governance evidence paths.
2. Allowed layer— packages/kernel/src/propagation/** · packages/kernel/src/index.ts (propagation exports) · packages/kernel/src/contracts/kernel-package-layout.contract.ts · packages/kernel/src/governance/kernel-runtime-rules.contract.ts · scripts/governance/check-kernel-propagation-isolation.mts · docs/PAS/slice/b53-kernel-propagation-frame-wire.md · docs/PAS/pas-status-index.md
3. Files        — propagation triad + kernel-context.ts + co-located tests + index exports + layout/runtime-rules contracts + isolation gate + slice doc + pas-status-index B53 row
4. Prohibited   — npm dependencies · DB/session/request objects in frame · OperatingContext/metadata-ui · foundation-disposition.registry.ts
5. Authority    — PAS-001 §4.11 · kernel-authority · execution-context.policy.contract.ts
6. Gates        — pnpm check:kernel-propagation-isolation · pnpm --filter @afenda/kernel typecheck · pnpm --filter @afenda/kernel test:run -- propagation kernel-context · pnpm check:kernel-package-structure
7. Closes       — PAS-001 §4.11 propagation frame wire + ALS isolation hardening
8. Evidence     — packages/kernel/src/propagation/** · scripts/governance/check-kernel-propagation-isolation.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. `kernelContext.run()` clones frame before ALS storage — same shallow clone strategy as pre-fix `fork()`.
2. `kernelContext.fork()` ignores `undefined` override keys at frame and executionContext levels.
3. Wire egress uses plain strings for branded ids via existing `normalize*ForWire` identity helpers — parser stays dependency-free.
4. Frame contract remains `{ correlationId, executionContext, tenantId }` only — no persistence/request objects.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | `run()` clones frame before ALS storage | unit test |
| 2 | `fork()` safe partial merge — no undefined tenantId/correlationId leak | unit test |
| 3 | `KernelContextFrameWire` + `ExecutionContextWire` types | typecheck |
| 4 | `assertKernelContextFrame` + `assertWireKernelContextFrame` | tests |
| 5 | `serializeKernelContextFrame` / `normalizeKernelContextFrameForWire` JSON round-trip | unit test |
| 6 | propagation/index.ts exports contract + assert + parser symbols | isolation gate |
| 7 | Co-located propagation tests | vitest |
| 8 | Isolation gate accepts co-located test path | `check:kernel-propagation-isolation` |
| 9 | Layout registry TARGET_PATHS updated | `check:kernel-package-structure` |
| 10 | Zero new npm dependencies | package.json unchanged deps |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| ALS frame clone on run | Yes — B53 | `packages/kernel/src/propagation/kernel-context.ts` |
| Safe fork partial merge | Yes — B53 | `packages/kernel/src/propagation/kernel-context.ts` |
| Wire triad (contract/assert/parser) | Yes — B53 | `packages/kernel/src/propagation/kernel-context-frame.*.ts` |
| Co-located propagation tests | Yes — B53 | `packages/kernel/src/propagation/__tests__/kernel-context.test.ts` |
| Governance isolation gate | Yes — B53 | `scripts/governance/check-kernel-propagation-isolation.mts` |

## Related slices

| Slice | Relationship |
| --- | --- |
| B15-4.3 | Execution context baseline |
| B16-10 | Runtime rules — async-context-propagation primitive |
| B49–B52 | Operating-context wire triads — same assert/parser pattern |
