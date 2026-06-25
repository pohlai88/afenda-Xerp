/**
 * Phase 2 FDR scaffold — generates enterprise stub docs from fdr-catalog.data.mts
 * and refreshes document links in fdr-status-index.md.
 *
 * Usage: pnpm tsx scripts/governance/scaffold-fdr-docs.mts
 * Docs-only stubs — no packages/ or apps/ edits.
 */

import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  FDR_CATALOG_TOTAL,
  FDR_SCAFFOLD_DELIVERY_STATUS,
  type FdrCatalogEntry,
  type FdrCatalogStatus,
  fdrCatalogEntries,
} from "./fdr-catalog.data.mts";

const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const FDR_DIR = path.join(REPO_ROOT, "docs/delivery/FDR");
const INDEX_PATH = path.join(REPO_ROOT, "docs/delivery/fdr-status-index.md");

/** Phase 2 scaffolds are docs-only — never inherit TIP/runtime-matrix completion. */
function deliveryStatus(_entry: FdrCatalogEntry): FdrCatalogStatus {
  return FDR_SCAFFOLD_DELIVERY_STATUS;
}

function statusPrefix(status: FdrCatalogStatus): string {
  return `[${status}]`;
}

function encodeStatusPrefix(status: FdrCatalogStatus): string {
  return encodeURIComponent(statusPrefix(status));
}

function relDocPath(entry: FdrCatalogEntry): string {
  const status = deliveryStatus(entry);
  const prefix = statusPrefix(status);
  return `FDR/${prefix} ${entry.fdrId}.md`;
}

function indexLink(entry: FdrCatalogEntry): string {
  const status = deliveryStatus(entry);
  const encoded = encodeStatusPrefix(status);
  const filename = `${entry.fdrId}.md`;
  return `[FDR/${statusPrefix(status)} ${filename}](FDR/${encoded}%20${filename})`;
}

function listItems(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function legacyTipLinks(tips: readonly string[]): string {
  if (tips.length === 0) {
    return "- _(none — research-first or infrastructure)_";
  }
  return tips
    .map((tip) => {
      const name = path.basename(tip);
      return `- [\`${name}\`](../../${tip.replace(/\\/g, "/")})`;
    })
    .join("\n");
}

function evidenceTable(evidence: readonly string[]): string {
  if (evidence.length === 0) {
    return "| — | — | — |";
  }
  return evidence
    .map((artifact) => {
      const label = artifact.split("/").filter(Boolean).pop() ?? artifact;
      return `| ${label} | \`${artifact}\` | Unverified (Research Slice 1) |`;
    })
    .join("\n");
}

function gapsTable(
  gaps: readonly { id: string; description: string; blocks: string }[]
): string {
  if (gaps.length === 0) {
    return "| fdr-research-slice-1 | FDR delivery not started — complete Research Slice 1 | FDR status promotion |";
  }
  return gaps
    .map((gap) => `| \`${gap.id}\` | ${gap.description} | ${gap.blocks} |`)
    .join("\n");
}

function researchSection(entry: FdrCatalogEntry): string {
  return `## §Research

> Slice 1 = Research only — no \`packages/\` or \`apps/\` edits.  
> TIP archive / runtime matrix may show prior work — that is **not** FDR delivery status.

### Discovery questions

- What runtime evidence exists today for ${entry.packageName}?
- Which registry row (\`${entry.registryEntry}\`) is required before implementation?
- Which upstream FDRs or ADRs block this domain?

### Files to inspect

| Path | Why |
| --- | --- |
| \`${entry.runtimeOwner}/\` | Primary runtime owner |
| [\`afenda-runtime-truth-matrix.md\`](../../architecture/afenda-runtime-truth-matrix.md) | Current status + gaps |

### Skills to read

- \`enterprise-erp-standards\` — domain controls (§8)
- \`write-fdr\` — slice handoff format`;
}

function slicesSection(entry: FdrCatalogEntry): string {
  const docRel = relDocPath(entry);
  const docPath = `docs/delivery/${docRel}`;

  return `## Slices

### Slice 1 — Research (${entry.slug})

**Status:** Not started  
**Type:** Research

#### Handoff block

\`\`\`
Handoff from: ${docPath}

1. Objective    — Complete Research for ${entry.packageName}; document gaps in §Remaining gaps.
2. Allowed layer— docs/delivery/FDR + docs/architecture/
3. Files        — ${docPath} (Modified)
                  docs/delivery/fdr-status-index.md (Modified if status changes)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified if evidence changes)
4. Prohibited   — packages/ and apps/ source edits; registry edits; accounting runtime
5. Authority    — ADR-0014 + ADR-0016
6. Gates        — pnpm check:documentation-drift
\`\`\``;
}

function renderStub(entry: FdrCatalogEntry): string {
  const gatesList = entry.gates.map((g) => `- \`${g}\``).join("\n");
  const status = deliveryStatus(entry);

  return `# ${entry.fdrId} — ${entry.title}

| Field | Value |
| --- | --- |
| **Status** | ${status} |
| **Archive hint** | ${entry.archiveRuntimeHint} |
| **Registry entry** | ${entry.registryEntry} |
| **Package** | ${entry.packageName} (${entry.pkg}) |
| **Lane** | ${entry.lane} |
| **Clean Core level** | ${entry.cleanCore} ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Risk class** | ${entry.riskClass} |
| **BRD reference** | internal — Phase 2 documentation scaffold |
| **Runtime evidence** | See §Runtime evidence |
| **Status source** | [\`afenda-runtime-truth-matrix.md\`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [\`fdr-status-index.md\`](../fdr-status-index.md) |
| **Enterprise controls** | ${entry.sapControl} · ${entry.oracleControl} |

## Purpose

${entry.purpose}

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

## §Registry link

> Read-only snapshot — authority is [\`foundation-disposition.registry.ts\`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts).

| Field | Value |
| --- | --- |
| id | ${entry.registryEntry} |
| packageId | ${entry.pkg} |
| domain | \`${entry.domain}\` |
| lane | ${entry.lane} |
| runtimeOwner | \`${entry.runtimeOwner}\` |
| gates | ${entry.gates.join("; ")} |

## Scope

**In scope**

${listItems(entry.scopeIn)}

**Out of scope**

${listItems(entry.scopeOut)}

${researchSection(entry)}

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
${evidenceTable(entry.evidence)}

## §Remaining gaps

> Gap tracking lives here — registry \`knownGaps\` is deprecated.

| Gap ID | Description | Blocks |
| --- | --- | --- |
${gapsTable(entry.gaps)}

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| ${entry.packageName} | Public barrel | No | ${entry.cleanCore}→${entry.cleanCore} (scaffold lock) |

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| ${entry.sapControl} | ${entry.oracleControl} | \`${entry.primaryGate}\` | 1 |
| SOLMAN | FDD testable AC | \`pnpm check:documentation-drift\` | 2 |
| ATC | Quality standards | \`pnpm ci:biome\` | 3 |

## §BRD traceability

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Gherkin AC deferred to implementation slices | — | \`${entry.primaryGate}\` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Maintainability | Biome clean; strict typecheck | \`pnpm ci:biome\` |
| Security | RBAC + tenant isolation where applicable | registry gates |
| Documentation | Index + matrix aligned | \`pnpm check:documentation-drift\` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Domain mutations | SoD waived — Phase 9 gate | [\`phase-9-accounting-readiness-sign-off.md\`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Legacy TIP evidence (archive)

${legacyTipLinks(entry.legacyTips)}

## Depends on

- [\`fdr-status-index.md\`](../fdr-status-index.md) §FDR register row **${entry.fdrId}**
- [\`package-registry.md\`](../../architecture/package-registry.md) **${entry.pkg}**

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| \`docs/delivery/${relDocPath(entry)}\` | — | Modified (Phase 2 scaffold) |
| \`docs/delivery/fdr-status-index.md\` | — | Modified (link lock) |

## Acceptance gate

${gatesList}
- \`pnpm check:documentation-drift\`
- \`pnpm check:foundation-disposition\`

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Phase 2 scaffold on disk | file exists | [x] |
| 2 | Index link locked | fdr-status-index row | [x] |
| 3 | Enterprise sections present | write-fdr TEMPLATES §A | [x] |
| 4 | Runtime evidence linked | matrix paths cited | [ ] |
| 5 | Implementation slices | bounded handoffs | [ ] |
| 6 | Drift green | \`pnpm check:documentation-drift\` | [ ] |
| 7 | Registry aligned | \`pnpm check:foundation-disposition\` | [ ] |
| 8 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |

${slicesSection(entry)}

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Documentation scaffold | Revert FDR doc commit | Quarterly-release-safe |

## §Knowledge transfer

### Operational runbook

- Runtime matrix row: [\`afenda-runtime-truth-matrix.md\`](../../architecture/afenda-runtime-truth-matrix.md)
- Package registry: [\`package-registry.md\`](../../architecture/package-registry.md) **${entry.pkg}**

### Observability

- Audit: [\`@afenda/observability\`](../../../packages/observability/)
- Support: [\`docs/delivery/support/\`](../support/)

## Verdict

**${status}** — Phase 2 documentation scaffold only. Index row **${entry.fdrId}** (${entry.pkg}) is locked; FDR delivery begins at Research Slice 1. Prior TIP/runtime evidence is archive input — not FDR completion.
`;
}

const INDEX_STATUS_VALUES =
  "Not started|Partially Implemented|Complete \\(authority only\\)|Complete|Maintain Only|Blocked";

async function removeStaleDeliveryDocs(
  expectedFilenames: ReadonlySet<string>
): Promise<void> {
  const files = await readdir(FDR_DIR);
  for (const file of files) {
    if (file === "README.md") {
      continue;
    }
    if (!(file.endsWith(".md") && file.startsWith("["))) {
      continue;
    }
    if (!expectedFilenames.has(file)) {
      await unlink(path.join(FDR_DIR, file));
      console.log(`removed stale ${path.join("docs/delivery/FDR", file)}`);
    }
  }
}

async function updateIndexLinks(): Promise<void> {
  let index = await readFile(INDEX_PATH, "utf8");

  for (const entry of fdrCatalogEntries) {
    const link = indexLink(entry);
    const escapedId = entry.fdrId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const registerLine = new RegExp(
      `(\\| \\d+ \\| ${escapedId} \\|[^\\n]*\\| )(?:${INDEX_STATUS_VALUES})( \\| \\[FDR/)`,
      "m"
    );
    index = index.replace(registerLine, "$1Not started$2");

    const registerLink = new RegExp(
      `(\\| \\d+ \\| ${escapedId} \\|[^\\n]*\\| Not started \\| )[^|]+( \\|)`,
      "m"
    );
    index = index.replace(registerLink, `$1${link}$2`);

    const groupedLine = new RegExp(
      `(\\| ${escapedId} \\| [^|]+ \\| )(?:${INDEX_STATUS_VALUES})( \\|)`,
      "g"
    );
    index = index.replace(groupedLine, "$1Not started$2");
  }

  index = index.replace(
    /\| FDR delivery files on disk \| \*\*\d+\*\* \|[^|]+\|/,
    `| FDR delivery files on disk | **${String(FDR_CATALOG_TOTAL)}** | All FDR register rows — Phase 2 scaffold complete |`
  );

  index = index.replace(
    /\*\*Next:\*\* Phase 2 — author \*\*\d+\*\* remaining FDR stubs;.*/,
    "**Next:** Phase 3 — Research Slice 1 for fdr-002-auth-disposition; expand stubs with runtime evidence rows."
  );

  index = index.replace(
    /\*\*Next:\*\* Phase 3 — Research Slice 1 for fdr-002-auth-disposition; expand stubs with runtime evidence rows\./,
    "**Next:** Phase 3 — Research Slice 1 for fdr-002-auth-disposition; expand stubs with runtime evidence rows."
  );

  await writeFile(INDEX_PATH, index, "utf8");
}

async function main(): Promise<void> {
  if (fdrCatalogEntries.length !== FDR_CATALOG_TOTAL) {
    throw new Error(
      `Catalog count mismatch: expected ${FDR_CATALOG_TOTAL}, got ${fdrCatalogEntries.length}`
    );
  }

  await mkdir(FDR_DIR, { recursive: true });

  const expectedFilenames = new Set<string>();

  for (const entry of fdrCatalogEntries) {
    const status = deliveryStatus(entry);
    const filename = `${statusPrefix(status)} ${entry.fdrId}.md`;
    expectedFilenames.add(filename);
    const filePath = path.join(FDR_DIR, filename);
    await writeFile(filePath, renderStub(entry), "utf8");
    console.log(`wrote ${path.relative(REPO_ROOT, filePath)}`);
  }

  await removeStaleDeliveryDocs(expectedFilenames);

  await updateIndexLinks();
  console.log(`updated ${path.relative(REPO_ROOT, INDEX_PATH)}`);
  console.log(`Phase 2 scaffold complete: ${FDR_CATALOG_TOTAL} FDR docs`);
}

await main();
