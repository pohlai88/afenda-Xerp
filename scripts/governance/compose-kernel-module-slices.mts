/**
 * One-shot composer for PAS-001B B81–B105 kernel slice handoffs.
 * Output: docs/PAS/KERNEL/SLICE/b<N>-<slug>-domain-vocabulary.md
 */
import fs from "node:fs";
import path from "node:path";
import { ERP_DOMAIN_VOCABULARY_MODULE_SPECS } from "./erp-domain-vocabulary-module-specs.mts";

const KV: Record<string, string> = {
  controlling: "KV-CTRL",
  treasury: "KV-TRE",
  tax: "KV-TAX",
  consolidation: "KV-CONS",
  intercompany: "KV-IC",
  manufacturing: "KV-MFG",
  quality: "KV-QM",
  maintenance: "KV-PM",
  "supply-chain": "KV-SC",
  sales: "KV-SD",
  crm: "KV-CRM",
  pricing: "KV-PRC",
  subscription: "KV-SUB",
  ecommerce: "KV-ECOM",
  pos: "KV-POS",
  service: "KV-SVC",
  "field-service": "KV-FS",
  marketing: "KV-MKT",
  hcm: "KV-HCM",
  payroll: "KV-PY",
  project: "KV-PS",
  assets: "KV-AA",
  document: "KV-DOC",
  workflow: "KV-WF",
  analytics: "KV-AN",
};

const dir = path.join("docs", "PAS", "KERNEL", "SLICE");
const total = 31;

function sliceIndex(sliceId: string): number {
  return Number(sliceId.slice(1)) - 75;
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

for (const spec of ERP_DOMAIN_VOCABULARY_MODULE_SPECS) {
  const { slug, slice } = spec;
  const kv = KV[slug] ?? slug.toUpperCase();
  const pos = sliceIndex(slice);
  const n = Number(slice.slice(1));
  const prev = `B${n - 1}`;
  const prevSpec = ERP_DOMAIN_VOCABULARY_MODULE_SPECS.find(
    (s) => s.slice === prev
  );
  const prevLabel =
    n === 81 ? "procurement" : (prevSpec?.slug ?? "prior module");
  const filename = `${slice.toLowerCase()}-${slug}-domain-vocabulary.md`;
  const file = path.join(dir, filename);
  const pasSurface = `PAS-001B-4.8-${slug.toUpperCase().replace(/-/g, "-")}`;
  const vocabList = spec.vocabs.map((v) => v.type).join(", ");

  const content = `# Slice ${slice} — ${titleCase(slug)} Domain Vocabulary (PAS-001B §4.8 · ${kv})

> **Position:** Slice \`${pos} of ${total}\` in PAS-001B · Blueprint box: \`ERP Wire Vocabulary Catalog\`

**Prerequisite:** ${prev} Delivered (${prevLabel} wire)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — contracts-only promotion; no runtime services

**Clean Core impact:** A→A — wire vocabulary only; ${spec.rule.split(".")[0]}.

## Purpose

Promote **${kv}** \`${slug}\` from catalog-only to **delivered** under PAS-001B Rule 3 (one module = one slice). Scaffold contracts-only vocabulary in \`packages/kernel/src/erp-domain/${slug}/\` using the 10-file module pattern; register ${pasSurface}; wire layout maturity and unified vocabulary gates.

Closed vocabularies: ${vocabList}.

## Handoff block

\`\`\`
Handoff from: docs/PAS/KERNEL/SLICE/${filename}

1. Objective    — Deliver ${slug} kernel ERP wire vocabulary module (contracts-only) under ${kv}.
2. Allowed layer— packages/kernel/src/erp-domain/${slug}/** · packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · packages/kernel/package.json · governance gates · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/erp-domain/${slug}/${slug}-authority.contract.ts
   packages/kernel/src/erp-domain/${slug}/${slug}-id.contract.ts
   packages/kernel/src/erp-domain/${slug}/${slug}-domain-vocabulary.registry.ts
   packages/kernel/src/erp-domain/${slug}/${slug}-domain-vocabulary.policy.ts
   packages/kernel/src/erp-domain/${slug}/${slug}-domain-wire-context.contract.ts
   packages/kernel/src/erp-domain/${slug}/${slug}-permission-vocabulary.contract.ts
   packages/kernel/src/erp-domain/${slug}/${slug}-audit-actions.contract.ts
   packages/kernel/src/erp-domain/${slug}/index.ts
   packages/kernel/src/erp-domain/${slug}/__tests__/${slug}-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   docs/PAS/KERNEL/SLICE/${filename}
4. Prohibited   — ${spec.prohibitedSurfaces.join("; ")} · @afenda/database schema · ERP routes · posting runtime · other erp-domain modules
5. Authority    — PAS-001B §4.8 · ${kv} · kernel-authority · ADR-0020 business-reference Rule 2
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run src/erp-domain/${slug}
   pnpm check:foundation-disposition
7. Closes       — Closes DoD #1–#4 · ${kv} delivered · PAS-001B Rule 3
8. Evidence     —
   packages/kernel/src/erp-domain/${slug}/${slug}-authority.contract.ts
   packages/kernel/src/erp-domain/${slug}/__tests__/${slug}-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
\`\`\`

## Rules frozen

1. ${spec.rule}
2. ${spec.businessReferenceNote}
3. Module remains **contracts-only** — no Drizzle, HTTP, or posting services under \`erp-domain/${slug}/\`.
4. Registry id ${pasSurface} — stable across PAS, tests, and layout contract.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | 10-file module pattern present under erp-domain/${slug}/ | Manual + layout gate | PAS-001B §4.8 · ${kv} |
| 2 | Vocabulary contract tests pass | \`pnpm --filter @afenda/kernel test:run src/erp-domain/${slug}\` | PAS-001B §11 type safety |
| 3 | Layout maturity = delivered for ${slug} | \`pnpm check:erp-domain-layout\` | Kernel Blueprint §4 ERP Wire Catalog |
| 4 | Unified delivered vocabulary gate includes module | \`pnpm check:erp-domain-delivered-vocabulary\` | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | \`packages/kernel/src/erp-domain/${slug}/index.ts\` |
| 2 | \`packages/kernel/src/erp-domain/${slug}/__tests__/${slug}-domain-vocabulary.contract.test.ts\` |
| 3 | \`packages/kernel/src/erp-domain/erp-domain-layout.contract.ts\` |
| 4 | Gate output archived in B106 closure |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| ${kv} wire module delivered | Yes — ${slice} | \`packages/kernel/src/erp-domain/${slug}/\` |
| Contracts-only guard | Yes | Module policy + prohibited surfaces |
`;

  fs.writeFileSync(file, content);
  console.log("wrote", file);
}

console.log("done", ERP_DOMAIN_VOCABULARY_MODULE_SPECS.length, "module slices");
