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
| `APPS` | Runnable applications book (`/docs/apps/**`) | ARCH-APPS-001 |

### Legacy delivery ID (renamed 2026-06-25)

| Retired ID | Canonical ID | Reason |
| --- | --- | --- |
| `ARCH-002` (delivery doc) | **ARCH-ADMIN-001** | Bare `ARCH-<NNN>` collided with layer invariant **ARCH-002**; normalized to `ARCH-<DOMAIN>-<NNN>` |

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
| **→ 1** | **ARCH-USER-001** | **Peer review / AC closure** | Integration tests · DoD #14–20 | Slices 1–7 ✓ | [§DoD](%5BPartially%20Implemented%5D%20ARCH-USER-001-user-settings-self-service.md#11-definition-of-done) |
| 2 | **ARCH-AUTH-001** | Waiver review | Auth completion | — | [ARCH-AUTH-001](%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| 3 | **ARCH-ADMIN-001** | DoD #20 peer review | System admin | Slices 1–7 ✓ | [ARCH-ADMIN-001](%5BPartially%20Implemented%5D%20ARCH-ADMIN-001-system-admin-control-plane.md) |

**Parallel rule:** ARCH-USER-001 **Slices 1–7 delivered** (2026-06-25). Remaining: peer review, integration AC rows (U01/U08/U11–U12), email change UI blocked on ARCH-AUTH-001.

### Delivered slices (do not re-implement)

| ARCH | Slices / phases | Evidence |
| --- | --- | --- |
| ARCH-AUTH-001 | 1–9 + FR-A05.2.1 + FR-A05.2 ERP | Better Auth baseline, mirror sync, MFA policy, invitation gate, Security + Members admin UI, integration tests (106/106), workspace session persistence + `resolveOperatingContext` hint merge + `AUTH_EVENT.workspaceContextSwitched` |
| ARCH-ADMIN-001 | Phase A–D · Slices 1 + 1.5 + 2 + 3 + 4 + 5 + 6 + 7 | `tenant_settings` persistence · General tab · Members · Security MFA · settings audit waiver closed · evidence-sync · RLS · mutation audit |
| ARCH-USER-001 | Slices 1–7 + 4A | `/settings/**` four tabs · `user_preferences` · admin/user split · notifications + preferences persistence · evidence-sync |
| ARCH-APPS-001 | Slices 1–3 | ARCH authority · Fumadocs `/docs/apps/**` · nav contract · 8-test Apps Book suite · fdr-005 Slice 3 evidence-sync |

---

## Quick reference — active ARCH documents

| ARCH ID | Document | PKG | Paired FDR | Status | Next step |
| --- | --- | --- | --- | --- | --- |
| **ARCH-AUTH-001** | [\[Partially Implemented\] ARCH-AUTH-001-enterprise-authentication.md](%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) | PKG-002 · `@afenda/auth` | [fdr-002-auth-disposition](../delivery/FDR/%5BComplete%5D%20fdr-002-auth-disposition.md) | Partially Implemented | Waiver review · `changeEmail` for profile UI |
| **ARCH-ADMIN-001** | [\[Partially Implemented\] ARCH-ADMIN-001-system-admin-control-plane.md](%5BPartially%20Implemented%5D%20ARCH-ADMIN-001-system-admin-control-plane.md) | PKG-007 · `@afenda/erp` | [fdr-007-system-admin](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-system-admin.md) | Partially Implemented | DoD #20 peer review |
| **ARCH-USER-001** | [\[Partially Implemented\] ARCH-USER-001-user-settings-self-service.md](%5BPartially%20Implemented%5D%20ARCH-USER-001-user-settings-self-service.md) | PKG-007 · `@afenda/erp` | [fdr-007-ux-surfaces](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-ux-surfaces.md) | Partially Implemented | Peer review · integration AC closure |
| **ARCH-APPS-001** | [\[Partially Implemented\] ARCH-APPS-001-applications-book.md](%5BPartially%20Implemented%5D%20ARCH-APPS-001-applications-book.md) | PKG-005 · `@afenda/docs` | [fdr-005-docs-app](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-005-docs-app.md) | Partially Implemented | DoD #20 peer review |

---

## §ARCH register (canonical)

Approved for slice execution when handoff + status rules above are satisfied.  
All paths relative to `docs/ARCH/`.

### Domain architecture authorities

| ARCH ID | Document | PKG | Domain | Status | Paired FDR | Evidence / gap |
| --- | --- | --- | --- | --- | --- | --- |
| ARCH-AUTH-001 | [\[Partially Implemented\] ARCH-AUTH-001-enterprise-authentication.md](%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) | PKG-002 | Enterprise authentication | Partially Implemented | [fdr-002-auth-disposition](../delivery/FDR/%5BComplete%5D%20fdr-002-auth-disposition.md) | Slices 1–9 + FR-A05.2.1 + FR-A05.2 ERP ✓; waivers remain |
| ARCH-ADMIN-001 | [\[Partially Implemented\] ARCH-ADMIN-001-system-admin-control-plane.md](%5BPartially%20Implemented%5D%20ARCH-ADMIN-001-system-admin-control-plane.md) | PKG-007 | System Admin control plane | Partially Implemented | [fdr-007-system-admin](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-system-admin.md) · [fdr-007-accounting-readiness](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-accounting-readiness.md) | Slices 1–7 ✓ (2026-06-25); DoD #20 peer review open |
| ARCH-USER-001 | [\[Partially Implemented\] ARCH-USER-001-user-settings-self-service.md](%5BPartially%20Implemented%5D%20ARCH-USER-001-user-settings-self-service.md) | PKG-007 | User settings self-service | Partially Implemented | [fdr-007-ux-surfaces](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-ux-surfaces.md) | Slices 1–7 ✓ (2026-06-25); peer review + integration ACs open |
| ARCH-APPS-001 | [\[Partially Implemented\] ARCH-APPS-001-applications-book.md](%5BPartially%20Implemented%5D%20ARCH-APPS-001-applications-book.md) | PKG-005 | Applications Book (Fumadocs) | Partially Implemented | [fdr-005-docs-app](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-005-docs-app.md) | Slices 1–3 ✓ (2026-06-25); `/docs/apps/**` · 83 tests · DoD #20 peer review open |

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
