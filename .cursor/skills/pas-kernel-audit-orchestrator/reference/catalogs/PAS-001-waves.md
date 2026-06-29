# PAS-001 audit wave plan

Authority: `docs/PAS/KERNEL/audit/PAS-001.md` (AUD-01..AUD-25)

Parent PAS: `docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md`

**25 slices · kernel vocabulary substrate full-development verification (not PAS-001A spine proof · not PAS-001B wire catalog expansion)**

---

## Batch type

```text
Batch type: pas-kernel-audit-catalog
Audit catalog: docs/PAS/KERNEL/audit/PAS-001.md
Authority PAS: docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md
```

---

## Agent roles

| Phase | Agent | Mode |
| --- | --- | --- |
| Audit (per AUD) | `@pas-kernel-audit-worker` or `explore` | `readonly: true` |
| Repair (clustered) | `@afenda-governed-implementer` | bundle + cluster handoff |
| Doc/index sync | `@documentation-drift` | serialized Evidence-sync |
| Registry | `@foundation-registry-owner` | serialized Registry-sync |

---

## Waves

| Wave | AUD slots | Primary paths | Parallel | Parent gate preflight |
| --- | --- | --- | --- | --- |
| W1 | AUD-01, AUD-02, AUD-03, AUD-04 | docs/PAS, `packages/kernel/**`, foundation disposition | YES (4) | — |
| W2 | AUD-05, AUD-06, AUD-07, AUD-08 | identity, app-error, execution/operating context | YES (4) | — |
| W3 | AUD-09, AUD-10, AUD-11, AUD-12 | multi-scope, effective-dating, tenant lifecycle, actor | YES (4) | — |
| W4 | AUD-13, AUD-14, AUD-15, AUD-16 | localization, platform entity, policy, events | YES (4) | — |
| W5 | AUD-17, AUD-18, AUD-19, AUD-20 | propagation, erp-domain delegation, tenant extension, runtime purity | YES (4) | `pnpm check:kernel-forbidden-runtime-access` (AUD-20) |
| W6 | AUD-21 | required gate compliance | NO (1) | **Full PAS-001 gate bundle** — paste all stdout |
| W7 | AUD-22, AUD-23, AUD-24 | slice closure, consumer attestation, archive parity | YES (3) | — |
| W8 | AUD-25 | doctrine and amendment boundary (final confidence) | NO (1) | Requires W1–W7 verdict matrix |

After each wave: merge → cluster → repair (if auto-repair) → checkpoint.

---

## Repair clustering (001-specific)

| Cluster theme | Typical AUDs | Do not merge with |
| --- | --- | --- |
| Doc/status sync | AUD-01, AUD-24 | Code boundary fixes |
| Boundary/runtime leak | AUD-02, AUD-20 | Doc-only |
| Export/subpath drift | AUD-03 | Identity contracts |
| Identity/vocabulary SSOT | AUD-04, AUD-05, AUD-06 | Context hierarchy |
| Context hierarchy drift | AUD-07, AUD-08, AUD-09 | Tenant lifecycle |
| Tenant/actor attestation | AUD-11, AUD-12, AUD-23 | Wire catalog (001B) |
| Wire catalog delegation | AUD-18 | PAS-001B scaffold work |
| Gate stale/missing | AUD-21 | Registry lane |
| Slice closure drift | AUD-22 | Consumer attestation |
| Doctrine routing | AUD-25 | Implementation clusters |

---

## Hard blockers (from AUD-25)

Final PASS blocked if any fail:

- Authority metadata parity (AUD-01)
- Kernel boundary — no runtime/DB/auth/eval (AUD-02)
- Public export surface matches PAS (AUD-03)
- Required gates green (AUD-21)
- Delivered slice closure honest (AUD-22)
- Consumer attestation present where required (AUD-23)
- ERP wire expansion delegated to PAS-001B — not PAS-001 (AUD-18)
- Doctrine routing: new integration → 001A · new wire catalog → 001B · new vocab → amendment (AUD-25)

---

## Repair implementer reads

Default: `coding-consistency-bundle`, `kernel-authority`, `architecture-authority`

Add `multi-tenancy-erp` when cluster touches operating context, tenant lifecycle, or consumer attestation (AUD-07..AUD-12, AUD-17, AUD-23).

Do **not** route PAS-001 repairs into PAS-001B wire-catalog scaffold unless AUD-18 explicitly finds delegation breach.

---

## Gate bundle (parent — AUD-21 / W6)

```bash
pnpm --filter @afenda/kernel typecheck
pnpm --filter @afenda/kernel test:run
pnpm quality:kernel-context-surface
pnpm check:kernel-context-wire-triad
pnpm check:kernel-identity-governance
pnpm check:kernel-zero-runtime-deps
pnpm check:accounting-domain-contracts
pnpm check:foundation-disposition
pnpm quality:boundaries
pnpm architecture:cycles
pnpm architecture:drift
pnpm check:kernel-effective-dating-consumer-attestation
pnpm check:erp-auth-actor-protected-path-attestation
pnpm check:erp-tenant-lifecycle-extension-consumer-attestation
pnpm check:documentation-drift
```

Gate-heavy waves: W5 (AUD-20 side-effect proof), W6 (AUD-21 full bundle).

---

## Mandatory reads (audit workers — PAS-001)

1. Authority PAS §0 + composed document index
2. Assigned AUD section only
3. Evidence paths listed in the AUD section — Read each relevant file
4. Pasted gate output when wave requires it

Do **not** implement PAS-001 — verify only. Route integration spine gaps to PAS-001A and wire catalog gaps to PAS-001B in findings (do not expand scope).

---

## Checkpoint

`.cursor/audit/checkpoints/PAS-001.json`

Gate evidence artifact (W6): `.cursor/audit/checkpoints/PAS-001-gates-W6.txt`
