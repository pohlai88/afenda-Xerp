# ADR-0044 — Developer Route Lab Runtime Authority Boundary

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-07 |
| **Owner** | Architecture Authority |
| **Amends** | [ADR-0039](ADR-0039-developer-presentation-sandbox.md) |
| **Supersedes** | Intentional defer language for route-lab `_queries` activation and ERP promotion authorization in route-lab completion docs |
| **Related** | [PAS-006E](../PAS/PRESENTATION/PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md) · [DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md](../architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md) · [ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md](../architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md) |

---

## Context

The developer route lab (`apps/developer`, port 3002) completed the P1–P5 runtime-parity track:

| Slice | Capability |
| --- | --- |
| P1 | Governed Route Handler (`GET /api/lab/v1/health`) |
| P2 | Governed Server Action (appearance review note) |
| P3 | Per-request loader dedupe (`React.cache`) |
| P4 | Request policy (`src/proxy.ts` correlation-id pass-through) |
| P5 | Demo-fixture operating context + empty BFF allowlist |

Remaining route-lab docs labeled two items as **intentionally deferred**:

1. **`_queries/` seam activation** — route-local read shaping reserved as `.gitkeep` only.
2. **ERP promotion** — live auth, kernel operating context, and BFF authority deferred to `apps/erp`.

That defer language blocked forward progress without adding safety: P1–P5 already define the sandbox ceiling, governance scripts enforce import walls, and the route-surface registry records promotion targets.

This ADR closes the defer window and records the terminal authority boundary plus the authorized activation paths.

---

## Decision

### 1. Terminal demo-fixture authority (P5 ceiling)

`apps/developer` **must not** import or simulate:

- `@afenda/auth`, `@afenda/kernel`, `@afenda/database`, `@afenda/server`
- `apps/erp/**` runtime modules
- `src/app/api/internal/**` BFF handlers (allowlist remains empty)

Operating context for the lab shell resolves through `resolveLabShellOperatingContext` using the static demo fixture only (`authorityKind: "demo-fixture"`).

Machine enforcement: `lab-runtime-authority-policy.ts`, `check-route-lab-governance.mjs`, and import-wall guards remain binding.

### 2. Governed `_queries` activation (defer removed)

The `_queries/` seam **may activate** when all of the following hold:

- A concrete route-local read-shaping need exists (no speculative ORM/BFF readers).
- `route-surface-registry.ts` marks `querySeam: "governed-active"` for the route.
- A matching entry exists in `lab-query-route-registry.ts`.
- Runtime files live under the route's `_queries/` folder (`.server.ts` read helpers only — not `"use server"` mutations).
- Governance, Vitest, and Playwright smoke pass in the same change.

**First activation (this ADR):** `/settings/appearance` reads the lab review note through `_queries/read-appearance-review-note.server.ts`, paired with the existing P2 Server Action.

Further query activations require the same registry + governance pattern; placeholder-only routes must keep `.gitkeep` only.

### 3. ERP promotion authorization (defer removed)

Live runtime authority **must not** expand inside `apps/developer`. ERP promotion is the sole authorized path for:

- Better Auth sessions and tenant resolution
- Kernel operating-context spine
- Platform BFF / internal API readers
- Module and document runtime wiring

Registry `promotionTarget: "erp-route"` entries are binding promotion intents. Execution occurs in `apps/erp` under PAS-006E and ADR-0039 layer rules without a new sandbox ADR unless the promotion boundary itself changes.

Superseding the demo-fixture ceiling requires a **new ADR** — not ad hoc lab code.

### 4. Integration Map route posture

`/architecture` is a **lab-only governance mirror** (`promotionTarget: "retire"`). It does not require ERP promotion and does not expand runtime authority.

---

## Consequences

### Positive

- Route-lab completion docs no longer imply unfinished sandbox work for `_queries` or ERP promotion authorization.
- Query activation follows the same allowlist discipline as Server Actions and cache registries.
- ERP engineers have explicit ADR backing to promote registry-marked routes without re-opening sandbox runtime debates.

### Negative / trade-offs

- Each new `_queries` activation adds registry + governance surface area.
- ERP promotion remains multi-slice work; this ADR authorizes it but does not implement ERP routes.

### Verification gates

```bash
node apps/developer/scripts/check-route-lab-governance.mjs
pnpm --filter @afenda/developer typecheck
pnpm --filter @afenda/developer verify:greenlight
```

---

## Related implementation artifacts

| Artifact | Purpose |
| --- | --- |
| `apps/developer/src/lib/lab/lab-query-route-registry.ts` | Query seam allowlist |
| `apps/developer/src/lib/lab/lab-runtime-authority-policy.ts` | ADR-0044 policy citation |
| `apps/developer/src/app/(lab)/settings/appearance/_queries/` | First governed query activation |
| `apps/developer/scripts/check-route-lab-governance.mjs` | Executable enforcement |

---

## Acceptance

ADR-0044 is **Accepted**. Intentional defer language for `_queries` activation and ERP promotion authorization is retired. The route lab preserves demo-fixture authority; live spine work proceeds only through ERP promotion or a future ADR that supersedes this boundary.
