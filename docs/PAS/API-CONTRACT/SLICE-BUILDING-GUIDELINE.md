# PAS-API Family — Slice-Building Guideline

| Field | Value |
| --- | --- |
| **Audience** | PAS authors · coding agents · `/afenda-coding-session` implementers |
| **Authority** | [PAS-API-001](PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · [api-contract North Star](../../NORTHSTAR/api-contract-north-star.md) |
| **Template** | [pas-slice-template.md](../../../.cursor/skills/kernel-authority/reference/pas-slice-template.md) |
| **Last reviewed** | 2026-06-30 |

---

## 0. Family doctrine

```text
API Contract is the family.
API style is the binding.
Transport is the mechanism.
Publication is the artifact.
Runtime is the implementation.
ERP Integration Spine is the consumer.
```

Every slice must preserve this separation. **No slice may redefine family invariants inside a style binding or ERP consumer doc.**

---

## 1. Mandatory slice handoff format

Every slice uses the **9-field handoff** (paste into Phase 0):

```text
1. Objective    — one verifiable outcome
2. Allowed layer— packages/apps or docs-only
3. Files        — explicit paths
4. Prohibited   — hard stops for this session
5. Authority    — PAS § + ADR + skill
6. Gates        — real pnpm commands
7. Closes       — DoD rows + PAS gap
8. Evidence     — paths after delivery
9. Attestation  — Contract · Test · Governance · …
```

Required sections in every slice file:

| Section | Purpose |
| --- | --- |
| Metadata table | Slice ID · Parent PAS · Status · Maturity target |
| §0 Purpose | One paragraph — session scope only |
| §1 Authority and Traceability | North Star → Blueprint → PAS → Slice → Code |
| §2 Owns / Never Owns | Boundary for this slice |
| §3 Contract Surfaces | Types/files this slice introduces or proves |
| Handoff block | 9 fields (copy-paste for Phase 0) |
| §4 Implementation Steps | Ordered steps for implementer |
| §5 Tests and Gates | DoD table — ≥3 rows for Implementation |
| §6 Evidence Register | T0–T5 tier when Delivered |
| §7 Acceptance Criteria | Maturity exit for this slice |
| §8 Sync Obligations | PAS · catalog · pas-status-index |
| §9 Hard Stops | Session-specific bans |

**No slice is accepted without:** parent PAS · owns/never owns · runtime surfaces · gates · evidence · acceptance · sync obligations.

---

## 2. Universal slice acceptance matrix

| Question | Required answer |
| --- | --- |
| What invariant does this slice implement? | API-001–API-016 or style-binding invariant |
| Which PAS owns the slice? | PAS-API-001 · REST · RPC · GQL · EVENT · AGENT · ERP binding |
| Family doctrine or style binding? | Explicit |
| Active or reserved? | No false Delivered on reserved bindings |
| What runtime surface changes? | Exact file/folder list |
| What gate proves it? | `pnpm` command or named test |
| What document sync is required? | Catalog · PAS §Remaining slices · pas-status-index |
| What must not be touched? | §9 Hard stops |
| What is the evidence? | Field 8 paths |
| Maturity after completion? | MVP / Production Candidate / Production Accepted |

---

## 3. Naming standard

| Kind | Pattern | Example |
| --- | --- | --- |
| PAS root | `PAS-API-001` | Platform API Contract Authority |
| Style binding | `PAS-API-<STYLE>-001` | `PAS-API-REST-001` |
| ERP consumer | `PAS-001A-API-BINDING` | KERNEL consumption doc |
| Slice file | `pas-api-001-s1-<slug>.md` | Family slices under `API-CONTRACT/SLICE/` |
| REST slice | `pas-api-rest-001-s3-<slug>.md` | Under `REST/SLICE/` |
| ERP binding slice | `pas-001a-api-binding-s1-<slug>.md` | Under `KERNEL/SLICE/` |

**Legacy REST track:** `pas-001a-r3a-*` … `r3d` remains valid implementation bundles — see [REST slice track](REST/SLICE/pas-api-rest-001-slice-track.md) for S-series mapping.

---

## 4. Recommended build order

### Phase 1 — Authority and folders (Delivered)

PAS-API-001 · style folders · REST binding active · reserved bindings · ERP consumption doc · family README.

### Phase 2 — Core family contracts (Planned)

PAS-API-001-S1 → S9 — family primitives before style binding attestation closure.

### Phase 3 — Active REST runtime (Planned)

PAS-API-REST-001-S1 → S10 · legacy R3a–R3d implementation bundles.

### Phase 4 — ERP consumption (Planned)

PAS-001A-API-BINDING-S1 → S7 — bridges IS-002/IS-001 to REST binding.

### Phase 5 — Reserved bindings (Planned — activate only on ADR + trigger)

RPC · GraphQL · Event · Agent — no runtime until binding activation.

---

## 5. Final routing rule

```text
If the slice changes API meaning           → update PAS-API-001 (+ North Star if business meaning)
If the slice changes REST mechanics        → update PAS-API-REST-001
If the slice changes Protobuf/gRPC mechanics → update PAS-API-RPC-001
If the slice changes ERP runtime wiring    → update PAS-001A-API-BINDING
If the slice changes business meaning      → North Star §1–§12 first
```

---

## 6. Slice catalog index

| PAS | Catalog | Track index |
| --- | --- | --- |
| PAS-API-001 | [pas-api-001-slice-catalog.md](SLICE/pas-api-001-slice-catalog.md) | [pas-api-001-slice-track.md](SLICE/pas-api-001-slice-track.md) |
| PAS-API-REST-001 | [REST/SLICE/pas-api-rest-001-slice-catalog.md](REST/SLICE/pas-api-rest-001-slice-catalog.md) | [REST/SLICE/pas-api-rest-001-slice-track.md](REST/SLICE/pas-api-rest-001-slice-track.md) |
| PAS-API-RPC-001 | [RPC/SLICE/pas-api-rpc-001-slice-catalog.md](RPC/SLICE/pas-api-rpc-001-slice-catalog.md) | [RPC/SLICE/pas-api-rpc-001-slice-track.md](RPC/SLICE/pas-api-rpc-001-slice-track.md) |
| PAS-API-GQL-001 | [GRAPHQL/SLICE/pas-api-gql-001-slice-catalog.md](GRAPHQL/SLICE/pas-api-gql-001-slice-catalog.md) | [GRAPHQL/SLICE/pas-api-gql-001-slice-track.md](GRAPHQL/SLICE/pas-api-gql-001-slice-track.md) |
| PAS-API-EVENT-001 | [EVENT/SLICE/pas-api-event-001-slice-catalog.md](EVENT/SLICE/pas-api-event-001-slice-catalog.md) | [EVENT/SLICE/pas-api-event-001-slice-track.md](EVENT/SLICE/pas-api-event-001-slice-track.md) |
| PAS-API-AGENT-001 | [AGENT/SLICE/pas-api-agent-001-slice-catalog.md](AGENT/SLICE/pas-api-agent-001-slice-catalog.md) | [AGENT/SLICE/pas-api-agent-001-slice-track.md](AGENT/SLICE/pas-api-agent-001-slice-track.md) |
| PAS-001A-API-BINDING | [KERNEL/SLICE/pas-001a-api-binding-slice-catalog.md](../KERNEL/SLICE/pas-001a-api-binding-slice-catalog.md) | [KERNEL/SLICE/pas-001a-api-binding-slice-track.md](../KERNEL/SLICE/pas-001a-api-binding-slice-track.md) |

**Master rollup:** [pas-api-family-slice-catalog.md](SLICE/pas-api-family-slice-catalog.md)
