# Slice B5 — Forbidden Platform-Floor ID Guardrail (companion)

| Field | Value |
| --- | --- |
| **Status** | **Superseded** — delivered 2026-06-27 via Slice B5 registry normalization (`docs/PAS/slice/b5.md`) |
| **Runtime** | `FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS` in `packages/kernel/src/identity/registry/id-family.registry.ts` |
| **Do not add** | `packages/kernel/src/identity/governance/forbidden-platform-floor-id.policy.ts` — parallel registry; anti-drift violation |

This document records **policy rationale** and the pre-delivery planning spec. Implementation followed the consolidated registry model in `id-family.registry.ts`, not a separate `FORBIDDEN_PLATFORM_FLOOR_ID_FAMILIES` policy object.

---

## Verdict (frozen)

`FiscalCalendarId` and `FiscalPeriodId` should **not** be added to Kernel `ID_FAMILIES`.

They are **Finance / Accounting domain IDs**, because fiscal calendars and fiscal periods depend on accounting policy, statutory reporting, posting periods, close controls, and company-level finance configuration.

Normative prose: [PAS-001 §4.1.6](../PAS-001-KERNEL-AUTHORITY-STANDARD.md).

---

## Why this guardrail matters

Without this guardrail, someone may later think:

```txt
FiscalCalendarId sounds global, so put it in Kernel.
```

That would be wrong at this stage.

Correct rule:

```txt
Kernel owns platform identity (ID_FAMILIES).
Finance / Accounting owns fiscal identity (domain contracts).
Future ADR may promote fiscal IDs into Kernel only if justified.
```

---

## Delivered runtime (2026-06-27)

| Surface | Location |
| --- | --- |
| Forbidden symbols | `FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS` — `id-family.registry.ts` |
| Type guard | `isForbiddenPlatformFloorIdSymbol()` |
| Prohibited pattern | `IDENTITY_PROHIBITED_PATTERNS["forbidden-platform-floor-id-export"]` |
| Promotion checklist | `IDENTITY_PROMOTION_REQUIREMENTS["forbidden-fiscal-ids-off-floor"]` |
| Governance gate | `pnpm check:forbidden-platform-ids` |

**Test evidence (distributed — no dedicated policy test file):**

- `packages/kernel/src/__tests__/kernel-identity-registry.test.ts`
- `packages/kernel/src/__tests__/slice-b-acceptance.test.ts`
- `packages/kernel/src/__tests__/kernel-identity-governance.contract.test.ts`
- `packages/kernel/src/__tests__/kernel-identity.test.ts`

**Accounting subpath:** `FiscalPeriodId` may exist on `@afenda/kernel/erp-domain/accounting` as transitional accounting vocabulary. It is **not** on the main `@afenda/kernel` barrel and is **not** in `ID_FAMILIES`. The forbidden-platform-ids gate scopes platform-floor exports in `identity/families/*` and the main index.

---

## Archived planning spec (not implemented)

The blocks below were a pre-delivery alternative. **Do not implement** — they would duplicate registry authority.

<details>
<summary>Original §4.1.6 drop-in (merged into PAS-001 §4.1.6)</summary>

The following IDs are not approved as Kernel canonical enterprise ID families at this stage:

| Forbidden ID | Current owner | Reason |
| --- | --- | --- |
| `FiscalCalendarId` | Finance / Accounting | Fiscal calendar semantics depend on accounting policy, statutory reporting, company fiscal setup, and close controls. |
| `FiscalPeriodId` | Finance / Accounting | Fiscal period semantics depend on fiscal calendar structure, posting periods, close process, and accounting controls. |

Rule: must not be added to `ID_FAMILIES` unless a future ADR explicitly promotes them into Kernel.

</details>

<details>
<summary>Original proposed policy file (rejected — use registry symbols instead)</summary>

```txt
packages/kernel/src/identity/governance/forbidden-platform-floor-id.policy.ts
FORBIDDEN_PLATFORM_FLOOR_ID_FAMILIES — not shipped
```

</details>

---

## Next slice

After B5, proceed to:

```txt
B6 — Tenant human reference policy
```

That completes the separation between:

```txt
Kernel canonical IDs       → ID_FAMILIES (22)
Primitive references       → PRIMITIVE_REFERENCES (7)
Tenant human references    → tenant-human-reference/
Finance / Accounting IDs   → domain contracts (off platform floor)
```
