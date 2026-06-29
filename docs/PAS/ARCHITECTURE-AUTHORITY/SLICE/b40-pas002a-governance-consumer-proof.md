# Slice B40 — PAS-002A Governance Consumer Proof (PAS-002A §4.3)

**Prerequisite:** [B39 Ownership sign-off](b39-pas002a-ownership-signoff.md) delivered

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low — static import analysis in governance scripts

## Handoff block

```
Handoff from: docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b40-pas002a-governance-consumer-proof.md

1. Objective    — Add check:architecture-governance-consumer-proof; verify scripts/governance and scripts/quality import @afenda/architecture-authority root or /surface only.
2. Allowed layer— scripts/governance/** · scripts/quality/** · package.json script registration
3. Files        — scripts/governance/check-architecture-governance-consumer-proof.mts
4. Prohibited   — packages/architecture-authority API shape changes without PAS-002 slice; ERP runtime wiring
5. Authority    — PAS-002A §4.3 · PAS-002 §6.2 · architecture-authority skill
6. Gates        — PAS-002 §13.1 · pnpm check:architecture-governance-consumer-proof · pnpm check:architecture-authority-surface
7. Closes       — Governance consumer import discipline proof
8. Evidence     — gate exit 0; zero deep-path imports in scanned scripts
9. Attestation  — Architecture · Governance
```
