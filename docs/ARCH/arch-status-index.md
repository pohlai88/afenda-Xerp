# Architecture (ARCH) Status Index

> **Authority layer:** ADR > **ARCH** > FDR delivery docs > runtime matrix > code.  
> ARCH documents are **domain architecture authorities** — feature requirements, acceptance criteria, slice handoffs, and UI block maps. **FDR** ([`fdr-status-index.md`](../delivery/fdr-status-index.md)) is implementation authority for foundation/package slices (ADR-0014).

| Field | Value |
| --- | --- |
| **As-of** | 2026-06-25 |
| **Implementation authority** | [FDR](../delivery/fdr-status-index.md) (ADR-0014) |
| **ARCH location** | [`docs/ARCH/`](./) — filenames prefixed with `[status]` for targeting |
| **Status source (runtime)** | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) |
| **Template** | [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) |
| **Enforcement** | `pnpm check:documentation-drift` · `pnpm check:foundation-disposition` |

> **AI agents:** Read governing ADR + this index before authoring or executing an ARCH slice.  
> Copy §Handoff blocks from the linked ARCH file. Cross-read the **paired FDR** when foundation gates apply.  
> If ARCH conflicts with ADR, **ADR wins**. If ARCH conflicts with FDR on implementation gates, **FDR wins**.

---

## Catalog invariants

| Rule | Detail |
| --- | --- |
| **ARCH delivery ID** | `ARCH-<DOMAIN>-<NNN>` — domain code + sequence within domain (`001`, `002`, …). Examples: `ARCH-AUTH-001`, `ARCH-ADMIN-001`. |
| **Filename rule** | `[status] ARCH-<DOMAIN>-<NNN>-<slug>.md` — rename `[status]` prefix when delivery status changes (same PR as this index + matrix). |
| **FDR pairing** | Each ARCH maps to one or more FDRs on related PKGS — listed in §ARCH register. FDR owns implementation slice gates. |
| **Not delivery IDs** | **ARCH-001** = package ownership invariant ([`ownership-registry.md`](../architecture/ownership-registry.md)). **ARCH-002** = layer assignment invariant ([`layer-registry.md`](../architecture/layer-registry.md)). |
| **TIP archive** | [`tip-status-index.md`](../delivery/tip-status-index.md) — historical evidence only; do not use for new work. |

### Domain codes (active)

| Domain code | Meaning | Example |
| --- | --- | --- |
| `AUTH` | Identity, mirror, MFA policy, admin auth surfaces | ARCH-AUTH-001 |
| `ADMIN` | System Admin control plane (`/system-admin/**`) | ARCH-ADMIN-001 |
| `USER` | Signed-in user self-service settings (`/settings/**`) | ARCH-USER-001 |
| `DOCS` | Fumadocs site — `/docs/apps/**` application guides | ARCH-DOCS-001 |
| `SUPA` | Supabase platform — Postgres, poolers, env ops (not identity) | ARCH-SUPA-001 |

### Legacy delivery IDs (renamed)

| Retired ID | Canonical ID | Reason |
| --- | --- | --- |
| `ARCH-002` (delivery doc) | **ARCH-ADMIN-001** | Bare `ARCH-<NNN>` collided with layer invariant **ARCH-002**; normalized to `ARCH-<DOMAIN>-<NNN>` |
| **ARCH-APPS-001** · `applications-book` slug | **ARCH-DOCS-001** · `fumadocs-site` | Domain `APPS` + "Book" label retired; aligned with AUTH/ADMIN/USER naming (2026-06-25) |

---

## Implementation workflow

```text
1. Read arch-status-index.md + governing ADR(s)
2. Copy ONE §Handoff block from target ARCH doc
3. Execute via afenda-coding-session / afenda-governed-implementer
4. Update ARCH slice status + runtime matrix + this index (Slice 7 / evidence-sync)
5. Run gates from handoff §6 before claiming delivered
```

**One slice per coding session.**

---

## Runtime implementation sequence (active)

> **Next coding sessions start here.** Copy **one** §Handoff block per session.

| Step | ARCH | Slice | Package / layer | Depends on | Handoff |
| ---: | --- | --- | --- | --- | --- |
| **→ 1** | **ARCH-AUTH-001** | **13a-debt** SSO hardening | DB · Auth · ERP | Slices 13a + 13b ✓ | [slice-13a-debt](slices/ARCH-AUTH-001/slice-13a-debt-tenant-sso-hardening.md) |
| 2 | **ARCH-AUTH-001** | **13c** OAuth allowlist | Auth · ERP | 13a-debt or parallel | [slice-13c](slices/ARCH-AUTH-001/slice-13c-social-oauth-allowlist.md) |
| 3 | **ARCH-AUTH-001** | **13d** Phase 3 evidence-sync | docs only | 13c ✓ | [slice-13d](slices/ARCH-AUTH-001/slice-13d-phase3-evidence-sync.md) |

**Parallel rule:** ARCH-ADMIN-001 **Complete — enterprise 9.5 accepted** (2026-06-25) · Slices 1–11 delivered · DoD #20 closed. ARCH-USER-001 **Complete — enterprise 9.5 accepted** (2026-06-25) · Slices 1–12 delivered · DoD #20 closed. ARCH-SUPA-001 **Complete — enterprise 9.5 accepted** (2026-06-25) · Slices 1–7 delivered · DoD #20 closed. ARCH-AUTH-001 Slice 14 (`changeEmail`) delivered 2026-06-25.

### Delivered slices (do not re-implement)

| ARCH | Slices / phases | Evidence |
| --- | --- | --- |
| ARCH-AUTH-001 | 1–12 + 14 + 13a + 13b + FR-A05.2.1 + FR-A05.2 ERP | Better Auth baseline, mirror sync, MFA policy, durable invitations, invitation gate, Security + Members admin UI, MFA enroll UI, integration tests, workspace session persistence, `changeEmail`, enterprise SSO (13a), passkeys self-service (13b) · Phase 3 amendment accepted |
| ARCH-ADMIN-001 | Phase A–D · Slices 1 + 1.5 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 | `tenant_settings` persistence · General tab · Members · Security MFA · settings audit waiver closed · TS action dedup · evidence-sync · RLS · mutation audit · **Complete** (29/30) |
| ARCH-USER-001 | Slices 1–12 | `/settings/**` four tabs · `user_preferences` · admin/user split · integration AC closure · mutation audit · DoD #20 closed · **Complete** (29/30) |
| ARCH-DOCS-001 | Slices 1–5 | **Complete — enterprise 9.5 accepted** (2026-06-25) · `/docs/apps/**` · 83 tests · fdr-005 `[Complete]` |
| ARCH-SUPA-001 | Slices 1–9 | Connection routing · pool registry wiring · advisor governance gate · **Complete** (29/30) · DoD #20 closed 2026-06-25 |

---

## Quick reference — active ARCH documents

| ARCH ID | Document | PKG | Paired FDR | Status | Next step |
| --- | --- | --- | --- | --- | --- |
| **ARCH-AUTH-001** | [\[Partially Implemented\] ARCH-AUTH-001-enterprise-authentication.md](%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) | PKG-002 · `@afenda/auth` | [fdr-002-auth-disposition](../delivery/FDR/%5BComplete%5D%20fdr-002-auth-disposition.md) | Partially Implemented | **Slice 13a-debt** or **13c** · [amendment accepted](slices/ARCH-AUTH-001/slice-13-phase3-amendment-draft.md) |
| **ARCH-ADMIN-001** | [\[Complete\] ARCH-ADMIN-001-system-admin-control-plane.md](%5BComplete%5D%20ARCH-ADMIN-001-system-admin-control-plane.md) | PKG-007 · `@afenda/erp` | [fdr-007-system-admin](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-system-admin.md) | **Complete** | — |
| **ARCH-USER-001** | [\[Complete\] ARCH-USER-001-user-settings-self-service.md](%5BComplete%5D%20ARCH-USER-001-user-settings-self-service.md) | PKG-007 · `@afenda/erp` | [fdr-007-ux-surfaces](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-ux-surfaces.md) | **Complete** | — |
| **ARCH-DOCS-001** | [\[Complete\] ARCH-DOCS-001-fumadocs-site.md](%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) | PKG-005 · `@afenda/docs` | [fdr-005-docs-app](../delivery/FDR/%5BComplete%5D%20fdr-005-docs-app.md) | **Complete** | — |
| **ARCH-SUPA-001** | [\[Complete\] ARCH-SUPA-001-supabase-platform-architecture.md](%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md) | PKG-003 · `@afenda/database` | [fdr-003-persistence](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-003-persistence.md) · [fdr-003-tenant-rls](../delivery/FDR/%5BComplete%5D%20fdr-003-tenant-rls.md) | **Complete** | — |

---

## §ARCH register (canonical)

Approved for slice execution when handoff + status rules above are satisfied.  
All paths relative to `docs/ARCH/`.

### Domain architecture authorities

| ARCH ID | Document | PKG | Domain | Status | Paired FDR | Evidence / gap |
| --- | --- | --- | --- | --- | --- | --- |
| ARCH-AUTH-001 | [\[Partially Implemented\] ARCH-AUTH-001-enterprise-authentication.md](%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) | PKG-002 | Enterprise authentication | Partially Implemented | [fdr-002-auth-disposition](../delivery/FDR/%5BComplete%5D%20fdr-002-auth-disposition.md) | Slices 1–12 + 14 + 13a + 13b ✓; AUTH-PHASE3-001 **In progress** (13a-debt / 13c next) |
| ARCH-ADMIN-001 | [\[Complete\] ARCH-ADMIN-001-system-admin-control-plane.md](%5BComplete%5D%20ARCH-ADMIN-001-system-admin-control-plane.md) | PKG-007 | System Admin control plane | **Complete** | [fdr-007-system-admin](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-system-admin.md) · [fdr-007-accounting-readiness](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-accounting-readiness.md) | Slices 1–11 ✓ · DoD #20 closed 2026-06-25 · 29/30 accepted |
| ARCH-USER-001 | [\[Complete\] ARCH-USER-001-user-settings-self-service.md](%5BComplete%5D%20ARCH-USER-001-user-settings-self-service.md) | PKG-007 | User settings self-service | **Complete** | [fdr-007-ux-surfaces](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-ux-surfaces.md) | Slices 1–12 ✓ · DoD #20 closed 2026-06-25 · 29/30 accepted |
| ARCH-DOCS-001 | [\[Complete\] ARCH-DOCS-001-fumadocs-site.md](%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) | PKG-005 | Fumadocs site (`/docs/apps/**`) | **Complete** | [fdr-005-docs-app](../delivery/FDR/%5BComplete%5D%20fdr-005-docs-app.md) | Slices 1–5 ✓ · DoD #20 closed 2026-06-25 · 28/30 accepted |
| ARCH-SUPA-001 | [\[Complete\] ARCH-SUPA-001-supabase-platform-architecture.md](%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md) | PKG-003 | Supabase platform (Postgres ops) | **Complete** | [fdr-003-persistence](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-003-persistence.md) · [fdr-003-tenant-rls](../delivery/FDR/%5BComplete%5D%20fdr-003-tenant-rls.md) | Slices 1–9 ✓ · DoD #20 closed · waiver Accepted · `check:supabase-advisors` |

### Templates and tooling

| Item | Document | Purpose |
| --- | --- | --- |
| ARCH-TEMPLATE | [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) | Authoring template for new ARCH docs |
| This index | [`arch-status-index.md`](arch-status-index.md) | Status catalog + slice sequence |

---

## Status vocabulary

Closed set per ADR-0012 / FDR index. **Do not use runtime matrix vocabulary here.**

| Status | Meaning |
| --- | --- |
| **Not started** | No ARCH delivery evidence |
| **Partially Implemented** | Evidence exists; gaps in slice table or §Remaining gaps |
| **Complete (authority only)** | Contracts/governance exist; no runtime implementation expected by design |
| **Complete** | Runtime evidence + all acceptance gates pass |
| **Blocked** | Upstream ADR/ARCH/FDR/contract missing |
| **Superseded** | Replaced by newer ADR/ARCH — evidence retained |
| **Obsolete** | Must not guide future coding |

---

## §Do not start yet

| Target | Reason |
| --- | --- |
| New ARCH without index row | Add §ARCH register row first — then author via `ARCH-TEMPLATE.md` |
| Accounting admin ARCH on PKG-R01 | ADR-0010 — ledger/posting blocked until new ADR + FDR `PKGR01_ACCOUNTING` update |
| Duplicate auth ARCH | Use **ARCH-AUTH-001** only — withdraw duplicate ADRs (see ADR-0018) |
| Email change on profile tab | Blocked on ARCH-AUTH-001 `changeEmail.enabled` |
| Dual-surface demo without Slice 6 | **Slice 6 ✓** — safe for demo |
| **ARCH-APPS-001** or "Applications Book" naming | Retired — use **ARCH-DOCS-001** only |

---

## Hierarchy reminder

```text
ADR  >  ARCH (this index)  >  FDR  >  runtime matrix  >  code
         domain semantics       implementation gates      evidence
```

**TIP archive:** [`tip-status-index.md`](../delivery/tip-status-index.md) — audit trail only; map historical evidence via FDR `legacyTipEvidence` and ARCH cross-ref tables.

---

## Subagent invocation

| Task | Agent / skill |
| --- | --- |
| Author new ARCH domain doc | Start from [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md); add row to §ARCH register |
| Implement ARCH slice | `afenda-governed-implementer` or `fdr-slice-implementer` (when FDR handoff also applies) |
| Implement FDR slice (foundation) | `fdr-slice-implementer` — FDR is gate authority |
| Doc + index sync | `documentation-drift` |
