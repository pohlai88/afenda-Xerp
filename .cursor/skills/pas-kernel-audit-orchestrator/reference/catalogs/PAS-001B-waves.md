# PAS-001B audit wave plan

Authority: `docs/PAS/KERNEL/audit/PAS-001B.md` (AUD-01..AUD-30)

Parent PAS: `docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md`

**30 slices · 9 waves + gate wave + final confidence**

---

## Batch type

```text
Batch type: pas-kernel-audit-catalog
Audit catalog: docs/PAS/KERNEL/audit/PAS-001B.md
Authority PAS: docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md
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
| W1 | AUD-01, AUD-02, AUD-03, AUD-04 | docs/PAS, erp-domain boundary | YES (4) | — |
| W2 | AUD-05, AUD-06, AUD-07, AUD-08 | `packages/kernel/src/erp-domain/**`, `package.json` | YES (4) | — |
| W3 | AUD-09, AUD-10, AUD-11, AUD-12 | KV IDs, metadata bridge, classification | YES (4) | — |
| W4 | AUD-13, AUD-14, AUD-15, AUD-16 | identity, permissions, audit actions, wire context | YES (4) | — |
| W5 | AUD-17, AUD-18, AUD-19, AUD-20 | registry, policy, tests, layout gate matrix | YES (4) | `pnpm check:erp-domain-layout` |
| W6 | AUD-21, AUD-22, AUD-23, AUD-24 | domain contract gates, B76–B106 closure | YES (4) | accounting/inventory/procurement contract checks |
| W7 | AUD-25, AUD-26, AUD-27, AUD-28 | wire/meaning split, dependency graph, disposition, doc drift | YES (4) | `pnpm check:documentation-drift` |
| W8 | AUD-29 | required gate compliance | NO (1) | **Full PAS-001B gate bundle** — paste all stdout |
| W9 | AUD-30 | Enterprise Accepted confidence | NO (1) | Requires W1–W8 verdict matrix |

After each wave: merge → cluster → repair (if auto-repair) → checkpoint.

---

## Repair clustering (001B-specific)

| Cluster theme | Typical AUDs | Do not merge with |
| --- | --- | --- |
| Doc/status sync | AUD-01, AUD-28 | Code scaffold fixes |
| Layout/module count | AUD-04, AUD-05, AUD-07 | KV parity |
| KV SSOT | AUD-09, AUD-10 | Export rules |
| Export/subpath | AUD-08 | Layout |
| Scaffold | AUD-06 | Module catalog |
| Boundary/runtime leak | AUD-03, AUD-12 | Doc-only |
| Gate labels | AUD-29 | Registry lane |

---

## Hard blockers (from AUD-30)

Final PASS blocked if any fail:

- Layout contract SSOT (AUD-04)
- 28/28 delivered modules (AUD-05)
- Mandatory scaffold (AUD-06)
- KV ID SSOT and parity (AUD-09)
- Package export rule (AUD-08)
- No runtime under `erp-domain/` (AUD-03)
- Required gates (AUD-29)
- B76–B106 closure (AUD-24)
- Wire-vs-meaning split (AUD-25)

---

## Mandatory reads (audit workers — PAS-001B)

1. Authority PAS §0
2. Assigned AUD section only
3. `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` when AUD touches layout/modules
4. Pasted gate output when wave requires it

Do **not** implement PAS-001B — verify only.
