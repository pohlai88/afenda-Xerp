# PAS-006 — shadcn/studio Frontend Standard (Charter)

> **Document class vs role:** Registered as **PAS-006** per index convention. **Semantic role:** constitutional **frontend manufacturing charter** for the Presentation domain — technology-free doctrine distilled from [Presentation North Star](../../NORTHSTAR/shadcn-studio-presentation-north-star.md) §1–§5.

> **Constitutional sentence:** shadcn/studio is Afenda's governed frontend manufacturing system — raw vendor blocks enter stabilization, prove ACPA (and WCAG 2.2 AA on Authorization-adjacent surfaces), bind theme and metadata, earn an Acceptance Record, and only then wire or customize operator surfaces.

> **Runtime truth:** P06-001–P06-010 + P06-008-R1/R2 **delivered**. Implementation detail lives in [PAS-006A](PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md)–[PAS-006D](PAS-006D-METADATA-DRIVEN-SURFACES-STANDARD.md). PKGR05A **Enterprise Accepted** per [pas-status-index](../pas-status-index.md).

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-006 |
| **Document class** | `package_authority_standard` |
| **Document role** | `constitutional_charter` |
| **Canonical filename** | `PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md` |
| **Package** | `@afenda/shadcn-studio-v2` |
| **Layer** | Design |
| **Blueprint box** | shadcn/studio Presentation |
| **Registry lane** | `PKGR05C_SHADCN_STUDIO_V2` (active) · `PKGR05A_SHADCN_STUDIO` (v1 archive-lane) |
| **Agent skill** | `shadcn-studio` · `.cursor/skills/shadcn-studio/SKILL.md` |
| **Maturity** | MVP Authority (`mvp_authority`) |
| **Runtime status** | Charter §1–§4 only — implementation in PAS-006A–006D |
| **Remaining slices** | none — superseded by PAS-006A–006D family |
| **Consumers** | `apps/erp`, `apps/storybook` |
| **Change model** | `serialized-slices` via PAS-006A–006D |
| **ADR prerequisites** | [ADR-0027](../../adr/ADR-0027-frontend-presentation-reset.md) · [ADR-0017](../../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) · [ADR-0040](../../adr/ADR-0040-promote-shadcn-studio-v2-and-deprecate-legacy.md) |

#### Required gates (charter hygiene)

| # | Gate command |
| --- | --- |
| 1 | `pnpm check:foundation-disposition` |
| 2 | `pnpm check:documentation-drift` |

> **Maturity is part of authority.** Charter MVP is delivered; Production Candidate rollout lives in PAS-006A–006D. Do not implement slices from this document's prose alone — use family README + slice handoff.

> **Canonical location:** `docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md`
> **Domain North Star:** [`shadcn-studio-presentation-north-star.md`](../../NORTHSTAR/shadcn-studio-presentation-north-star.md)
> **Domain Blueprint:** [`shadcn-studio-presentation-blueprint.md`](../../BLUEPRINT/shadcn-studio-presentation-blueprint.md)
> **Family index:** [`PRESENTATION/README.md`](README.md)

---

# 0. Agent Quick Path

**Boundary:** Presentation **owns governed frontend manufacturing for operator visual truth** — stabilization-first pipeline, relational inventory doctrine, ACPA acceptance, metadata-driven composition path; it **never owns** kernel wire vocabulary, accepted business meaning, permission evaluation, business workflow runtime, or metadata schema authority.

**Hard stops:**

- Raw MCP output is **Imported** — not production UI.
- **Stabilize before customize** (NS P9 · §3.4).
- **ACPA** primary; **WCAG 2.2 AA** mandatory on Authorization-adjacent surfaces only (NS §3.7).
- No `@afenda/kernel` in presentation package.
- No legacy UI package revival without ADR.

**Implementation entry:** [PAS-006A §0](PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) for product work · [PAS-006B–006D](README.md) for pipeline, acceptance, metadata.

**Slice entrypoint:** [`SLICE/presentation-slice-catalog.md`](SLICE/presentation-slice-catalog.md)

---

# 1. Domain Charter (PAS scope)

PAS-006 encodes the **frontend manufacturing doctrine** for Afenda ERP:

1. **One visual owner** — single Design box after ADR-0027.
2. **Governed production chain** — import → normalize → stabilize → theme-bind → metadata-bind → accept → wire → customize (NS §3.3).
3. **Relational inventory** — not a flat block list (NS §3.1).
4. **Acceptance Record** — hard gate before Accepted lifecycle state (NS §3.7 · §8.2).
5. **Metadata scales surfaces** — core path, not optional future (NS §3.5).

---

# 2. One-Sentence Boundary

**@afenda/shadcn-studio-v2 owns governed operator-surface manufacturing** (blocks, theme, inventory, acceptance evidence); **it never owns** kernel vocabulary, enterprise meaning, permission decisions, metadata schema, or domain business runtime.

---

# 3. PAS Family Decomposition

One Blueprint box · one package · **five PAS documents**:

| PAS | Owns |
| --- | --- |
| **PAS-006** (this doc) | Charter · doctrine · family index |
| **PAS-006A** | Product runtime — theme, CSS, MCP cwd, exports, lab |
| **PAS-006B** | Relational inventory · slots · contracts · lifecycle |
| **PAS-006C** | Acceptance Record · ACPA · auth WCAG AA gates |
| **PAS-006D** | Metadata binding · surface templates |

---

# 4. Upstream Traceability

| Presentation NS capability | Family PAS |
| --- | --- |
| Governed frontend production chain | PAS-006 · 006B |
| Relational presentation inventory | PAS-006B |
| Stabilization-first block pipeline | PAS-006B · 006C |
| ACPA surface acceptance | PAS-006C |
| Authorization-adjacent WCAG AA | PAS-006C |
| Theme surface governance | PAS-006A |
| Metadata-driven surface composition | PAS-006D |
| Design delivery acceleration | PAS-006A |
| Visual composition chain | PAS-006A |

---

# 5. Prohibited (family-wide)

- Dual-stack presentation (ui, appshell, metadata-ui, css-authority).
- Kernel imports in `@afenda/shadcn-studio-v2`.
- ERP route wiring without Acceptance Record (once PAS-006C live).
- Customization before stabilization (NS §8.1).
- `pnpm ui:guard*` and legacy PAS-005 ERP gates.

---

# 6. Related

- [PAS family README](README.md)
- [Presentation Blueprint](../../BLUEPRINT/shadcn-studio-presentation-blueprint.md)
- [shadcn-studio SKILL](../../../.cursor/skills/shadcn-studio/SKILL.md)
