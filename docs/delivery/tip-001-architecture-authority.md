# TIP-001 — Architecture Authority

**Status:** Complete  
**Authority:** Constitutional governance layer — all future TIPs inherit TIP-001 enforcement  
**Date:** 2026-06-20  
**Fingerprint:** `ARCH-BASELINE-2026-06-20-v1`  
**Package version:** `1.0.0` (`@afenda/architecture-authority`)

---

## Purpose

TIP-001 establishes Afenda's **Architecture Authority** — the constitution-first governance layer that prevents architectural drift in an AI-assisted monorepo.

Hierarchy:

```text
ADR  >  Registry  >  Machine Contract  >  Validator  >  CI Gate
```

No package, dependency, layer assignment, ownership change, or exception may bypass this chain.

---

## Scope Delivered

### TIP-001A — Architecture Baseline Discovery

Human registries under `docs/architecture/`:

| Artifact | Purpose |
|----------|---------|
| `architecture-authority-baseline.md` | Baseline report and fingerprint |
| `package-registry.md` | PKG-001–018 active, PKG-R01–R05 reserved |
| `ownership-registry.md` | Single owner per package, escalation |
| `layer-registry.md` | Eight layers, matrix, same-layer rules |
| `dependency-registry.md` | 14 approved runtime edges |
| `package-lifecycle.md` | Birth/merge/split/deprecate/retire/restore |
| `dependency-snapshot.json` | Machine drift baseline |
| `README.md` | Constitution entry point |

**Discovery:** 18 active workspaces, 0 filesystem-planned, 14 runtime edges, 0 violations against Accepted model.

### TIP-001B — ADR Constitution

| ADR | Title |
|-----|-------|
| ADR-0000 | Architecture Constitution |
| ADR-0001 | Phase 1 Foundation Redefinition |
| ADR-0002 | Layer Governance |
| ADR-0003 | Dependency Governance |
| ADR-0004 | Ownership Governance |
| ADR-0005 | Exception Governance |
| ADR-0006 | Package Lifecycle Governance |

All **Accepted** as of 2026-06-20.

### TIP-001C — Authority Package

`packages/architecture-authority/` — six first-class contracts (not one monolithic map):

```text
PackageContract
OwnershipContract
LayerContract
DependencyContract
LifecycleContract
ExceptionContract
```

### TIP-001D — Validation Engine

| Validator | Gate |
|-----------|------|
| `validateRegistry()` | Unlisted packages |
| `validateOwnership()` | Missing / duplicate owners |
| `validateLayers()` | Layer assignment drift |
| `validateDependencies()` | Unapproved or missing declared edges |
| `validateForbiddenDependencies()` | Cross-layer and same-layer matrix |
| `validateCycles()` | Circular runtime dependencies |
| `validateExceptions()` | Expired or invalid exceptions |
| `validateArchitecture()` | Composed orchestrator |

### TIP-001E — CI Integration

| Gate | Command |
|------|---------|
| Architecture authority | `pnpm quality:architecture` |
| Dependency drift | `pnpm quality:architecture-drift` |

Wired in `.github/workflows/ci.yml`, `preview.yml`, `release-verification.yml`, and `scripts/quality/check-release-gates.mjs`.

### TIP-001F — Reporting & Drift

| Command | Output |
|---------|--------|
| `pnpm architecture:report` | Architecture report JSON |
| `pnpm architecture:owners` | Ownership audit markdown |
| `pnpm architecture:dependencies` | Regenerates `dependency-snapshot.json` |
| `pnpm architecture:cycles` | Cycle detection report |
| `pnpm architecture:drift` | Live graph vs snapshot |

### TIP-001G — Package Lifecycle Governance

Documented in `package-lifecycle.md` and `LifecycleContract`; `experimental` state, 12-month deprecation max, restore policy.

---

## Commands Passed (Closeout Verification)

Run from repo root. Use `pnpm run ci` (not bare `pnpm ci` — pnpm reserves `ci`).

| Command | Result (2026-06-20 closeout) |
|---------|------------------------------|
| `pnpm --filter @afenda/architecture-authority build` | PASS |
| `pnpm --filter @afenda/architecture-authority test:run` | PASS (3/3) |
| `pnpm quality` | PASS |
| `pnpm exec biome check packages/architecture-authority scripts/architecture docs/architecture docs/adr` | PASS |
| `pnpm run ci` | **FAIL at `ci:biome`** — 64 pre-existing repo-wide Biome issues outside TIP-001 scope (unrelated packages). TIP-001 artifacts are clean. |

**TIP-001 enforcement gates** (`quality:architecture`, `quality:architecture-drift`, boundaries, exports, release-gate) are green.

---

## Validators Enforced in CI

```text
validateRegistry          → every workspace package is PKG-registered
validateOwnership         → exactly one owner per active package
validateLayers            → registry layer matches assignment map
validateDependencies      → runtime edges match approved registry
validateForbiddenDependencies → layer matrix + sameLayerAllowed
validateCycles            → no circular @afenda/* runtime graph
validateExceptions        → no exception without expiry (ADR-0005)
```

Live enforcement: **18 workspaces**, fingerprint `ARCH-BASELINE-2026-06-20-v1`.

---

## Known Non-Goals

- **Human sign-off** on baseline report (Architecture Authority / Platform Authority) — process, not code
- **Expanded validator test matrix** — only 3 integration tests today; deferred hardening:
  - registry negative test
  - ownership missing-owner test
  - forbidden dependency test
  - cycle test (partially covered)
  - expired exception test
  - drift snapshot test
- **Full-repo `pnpm run ci` biome green** — requires separate hygiene pass on legacy packages
- **Business domain packages** — reserved slots only (TIP-013+)
- **AI development rules** — TIP-002 scope

---

## Artifacts to Commit

```text
packages/architecture-authority/**
scripts/architecture/**
scripts/quality/check-architecture.mjs
scripts/quality/check-release-gates.mjs   (Gate 8 entries)
docs/architecture/**
docs/adr/**
docs/delivery/tip-001-architecture-authority.md
package.json                            (quality + architecture:* scripts)
.github/workflows/ci.yml
.github/workflows/preview.yml
.github/workflows/release-verification.yml
pnpm-lock.yaml
```

Note: ADR files use descriptive names (`ADR-0000-architecture-constitution.md`, not `ADR-0000.md`).

---

## Next TIP

**TIP-002 — AI Development Governance**

Govern:

- AI prompt rules
- AI change boundaries
- File creation rules
- Forbidden shortcuts
- Drift detection for AI-generated changes
- Review checklist
- Definition of Done for AI-generated code

TIP-001 must not be reopened unless architecture gates regress or registry fingerprint changes without ADR.

---

## References

- [`docs/architecture/README.md`](../architecture/README.md)
- [`docs/adr/README.md`](../adr/README.md)
- [`ADR-0001`](../adr/ADR-0001-phase-1-foundation-redefinition.md)
