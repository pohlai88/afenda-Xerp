#!/usr/bin/env node
/**
 * One-shot normalizer: remove retired TIP/FDR delivery terminology from active docs and code comments.
 * ADR bodies and drift audit trail are skipped (historical evidence).
 */
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const SKIP = new Set([
  "node_modules",
  ".git",
  "dist",
  ".next",
  "coverage",
  ".turbo",
]);
const EXT = new Set([
  ".md",
  ".mdx",
  ".mdc",
  ".ts",
  ".tsx",
  ".mts",
  ".mjs",
  ".js",
  ".json",
]);

const REPLACEMENTS = [
  [/tip-004-policy\.md/gi, "governed-ui-consumption.mdc"],
  [/docs\/governance\//gi, ".cursor/rules/governed-ui-consumption.mdc"],
  [
    /docs\/architecture\/afenda-runtime-truth-matrix\.md/gi,
    "docs/PAS/pas-status-index.md",
  ],
  [
    /docs\/architecture\/pre-accounting-foundation-roadmap\.md/gi,
    "docs/architecture/_afenda-erp-master-plan.llms.md",
  ],
  [
    /docs\/architecture\/phase-9-accounting-readiness-sign-off\.md/gi,
    "docs/adr/ADR-0010-no-accounting-before-foundation-gate.md",
  ],
  [
    /docs\/architecture\/afenda-documentation-drift-audit\.md/gi,
    "docs/PAS/pas-status-index.md",
  ],
  [
    /docs\/architecture\/foundation-delivery-authority\.md/gi,
    "docs/PAS/README.md",
  ],
  [
    /docs\/architecture\/foundation-disposition\.md/gi,
    "packages/architecture-authority/src/data/foundation-disposition.registry.ts",
  ],
  [
    /docs\/architecture\/glossary\.md/gi,
    "docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md",
  ],
  [
    /docs\/architecture\/multi-tenancy\.md/gi,
    "docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md",
  ],
  [
    /docs\/architecture\/package-registry\.md/gi,
    "packages/architecture-authority/src/data/package-registry.data.ts",
  ],
  [
    /docs\/architecture\/dependency-registry\.md/gi,
    "packages/architecture-authority/src/data/dependency-registry.data.ts",
  ],
  [
    /docs\/architecture\/layer-registry\.md/gi,
    "packages/architecture-authority/src/data/layer-registry.data.ts",
  ],
  [
    /docs\/architecture\/ownership-registry\.md/gi,
    "packages/architecture-authority/src/data/ownership-registry.data.ts",
  ],
  [
    /docs\/architecture\/architecture-authority-baseline\.md/gi,
    "packages/architecture-authority/src/meta-contracts/architecture-authority-version.ts",
  ],
  [
    /docs\/architecture\/dependency-snapshot\.json/gi,
    "packages/architecture-authority/dependency-snapshot.json",
  ],
  [
    /docs\/architecture\/architecture-report\.json/gi,
    "packages/architecture-authority/architecture-report.json",
  ],
  [
    /docs\/architecture\/css-authority\.md/gi,
    "docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md",
  ],
  [
    /docs\/architecture\/app-ui-component-adaptation-guide\.md/gi,
    ".cursor/skills/afenda-shadcn-components/SKILL.md",
  ],
  [
    /docs\/architecture\/afenda-rest-api-governance\.md/gi,
    ".cursor/skills/platform-api-contract/SKILL.md",
  ],
  [
    /docs\/architecture\/afenda-platform-north-star\.md/gi,
    "docs/NORTHSTAR/kernel-north-star.md",
  ],
  [
    /docs\/architecture\/afenda-architecture-blueprint\.md/gi,
    "docs/BLUEPRINT/kernel-blueprint.md",
  ],
  [/docs\/architecture\/README\.md/gi, "docs/PAS/README.md"],
  [/docs\/architecture\/identity\//gi, "docs/PAS/KERNEL/identity/"],
  [
    /\.\.\/architecture\/foundation-delivery-authority\.md/gi,
    "../PAS/README.md",
  ],
  [
    /\.\.\/architecture\/foundation-disposition\.md/gi,
    "../../packages/architecture-authority/src/data/foundation-disposition.registry.ts",
  ],
  [
    /\.\.\/architecture\/package-registry\.md/gi,
    "../../packages/architecture-authority/src/data/package-registry.data.ts",
  ],
  [
    /\.\.\/architecture\/package-lifecycle\.md/gi,
    "../../packages/architecture-authority/src/data/lifecycle-registry.data.ts",
  ],
  [
    /\.\.\/architecture\/layer-registry\.md/gi,
    "../../packages/architecture-authority/src/data/layer-registry.data.ts",
  ],
  [
    /\.\.\/architecture\/dependency-registry\.md/gi,
    "../../packages/architecture-authority/src/data/dependency-registry.data.ts",
  ],
  [
    /\.\.\/architecture\/ownership-registry\.md/gi,
    "../../packages/architecture-authority/src/data/ownership-registry.data.ts",
  ],
  [
    /\.\.\/architecture\/glossary\.md/gi,
    "../PAS/ENTERPRISE-KNOWLEDGE/glossary.md",
  ],
  [
    /\.\.\/architecture\/multi-tenancy\.md/gi,
    "../PAS/KERNEL/multi-tenancy-delivery-evidence.md",
  ],
  [
    /\.\.\/architecture\/afenda-runtime-truth-matrix\.md/gi,
    "../PAS/pas-status-index.md",
  ],
  [
    /\.\.\/architecture\/afenda-documentation-drift-audit\.md/gi,
    "../PAS/pas-status-index.md",
  ],
  [
    /\.\.\/architecture\/app-ui-component-adaptation-guide\.md/gi,
    "../../.cursor/skills/afenda-shadcn-components/SKILL.md",
  ],
  [/\.\.\/architecture\/README\.md/gi, "../PAS/README.md"],
  [/\.\.\/architecture\/identity\//gi, "../PAS/KERNEL/identity/"],
  [
    /\.\.\/architecture\/afenda-architecture-blueprint\.md/gi,
    "../BLUEPRINT/kernel-blueprint.md",
  ],
  [/\.\.\/architecture\//gi, "../PAS/"],
  [
    /TIP-004B primitive governance violation/g,
    "Governed UI primitive policy violation",
  ],
  [
    /TIP-004B export coverage violation/g,
    "Governed UI export coverage violation",
  ],
  [
    /TIP-004B primitive slot key violation/g,
    "Governed UI primitive slot key violation",
  ],
  [/TIP-004B authority/g, "Governed UI authority"],
  [/TIP-004B runtime/g, "Governed UI runtime"],
  [
    /TIP-004 className policy violation/g,
    "Governed UI className policy violation",
  ],
  [
    /TIP-004 slot\/state policy violation/g,
    "Governed UI slot/state policy violation",
  ],
  [/TIP-004 slot policy violation/g, "Governed UI slot policy violation"],
  [/TIP-004 state policy violation/g, "Governed UI state policy violation"],
  [/TIP-004 motion policy violation/g, "Governed UI motion policy violation"],
  [/\(TIP-004\)/g, "(Governed UI)"],
  [/ — TIP-004/g, " — Governed UI"],
  [/ TIP-004 /g, " Governed UI "],
  [/TIP-004 consumer/gi, "Governed UI consumer"],
  [/without TIP-004/gi, "without Governed UI"],
  [/incl\. TIP-004/gi, "incl. Governed UI"],
  [/after TIP-004 clean/gi, "after governed UI clean"],
  [/TIP-004 safe/gi, "governed-UI safe"],
  [/TIP-004 variant contract/g, "Governed UI variant contract"],
  [/TIP-004 component contract/g, "Governed UI component contract"],
  [/TIP-004 token contract/g, "Governed UI token contract"],
  [/TIP-004 recipe contract/g, "Governed UI recipe contract"],
  [/TIP-004 slot contract/g, "Governed UI slot contract"],
  [/TIP-004 state contract/g, "Governed UI state contract"],
  [/TIP-004 motion contract/g, "Governed UI motion contract"],
  [/TIP-004 accessibility contract/g, "Governed UI accessibility contract"],
  [
    /TIP-004 class-name policy contract/g,
    "Governed UI class-name policy contract",
  ],
  [/TIP-004 export contract/g, "Governed UI export contract"],
  [/TIP-004 example contract/g, "Governed UI example contract"],
  [/owner: "TIP-004/g, 'owner: "Governed UI'],
  [/adr: "TIP-004"/g, 'adr: "Governed UI policy"'],
  [/relatedTips/g, "relatedStandards"],
  [/"TIP-003", "TIP-004"/g, '"PAS-005", "Governed UI"'],
  [
    /Implement UI only after TIP-004 contracts exist/g,
    "Implement UI only after design-system contracts exist",
  ],
  [/TIP-004 can safely implement/g, "Governed UI can safely implement"],
  [/Better Auth foundation \(TIP-004\)/g, "Better Auth foundation"],
  [/tip-status-index\.md/g, "pas-status-index.md"],
  [/fdr-status-index\.md/g, "pas-status-index.md"],
  [/see fdr-[a-z0-9-]+/gi, "see pas-status-index (PKG registry)"],
  [/fdr-orchestrator/g, "afenda-orchestrator"],
  [/fdr-slice-implementer/g, "afenda-governed-implementer"],
  [/fdr-slice-author/g, "pas-slice-planner"],
  [/\bfdr-author\b/g, "pas-slice-planner"],
  [/\/write-fdr-slice\b/g, "/pas-slice-planner"],
  [/\/write-fdr\b/g, "/pas-slice-planner"],
  [/\/afenda-fdr-batch\b/g, "/afenda-batch"],
  [/\bFDR delivery\b/gi, "PAS slice"],
  [/\bFDR peer review\b/gi, "PAS peer review"],
  [/\bFDR doc\b/gi, "PAS slice doc"],
  [/\bFDR-ID\b/g, "Slice-ID"],
  [/\bFDR slots\b/g, "PAS slots"],
  [/\bFDR catalog\b/gi, "PAS index"],
  [/\bFDR Research\b/g, "PAS Research"],
  [/\bFDR amber\b/gi, "PAS amber"],
  [/\bFDR not reconciled\b/gi, "PAS slice not reconciled"],
  [/\bFDR closeout\b/gi, "PAS closeout"],
  [/\bFDR DoD\b/g, "PAS DoD"],
  [/\bDomain FDRs\b/g, "Domain PAS slices"],
  [/\bAccounting FDR\b/g, "Accounting PAS slice"],
  [/\bidentity FDR\b/gi, "identity PAS slice"],
  [/\bP2 FDR\b/g, "P2 PAS slice"],
  [/ARCH > FDR > /g, "ADR > PAS > "],
  [/\bwrite-fdr-slice\b/g, "pas-slice-planner"],
  [/\bwrite-fdr\b/g, "pas-slice-planner"],
  [/\bafenda-fdr-batch\b/g, "afenda-batch"],
  [/\bTIP-UI-0([0-9])\b/g, "UI phase $1"],
  [/\bTIP-0([0-9]{2})[A-Z]?\b/g, "Foundation phase $1"],
  [/\bTIP-00([0-9])[A-D]?\b/g, "Documentation phase $1"],
  [/\bTIP-003\/004\b/g, "PAS-005 / Governed UI"],
  [/\bTIP-003A\b/g, "Seed bootstrap"],
  [/\bTIP-005\b/g, "UI composition"],
  [/\bTIP-006\b/g, "PAS-005A AppShell"],
  [/\bTIP-007\b/g, "PAS-001 platform"],
  [/\bTIP-008[AB]?\b/g, "PAS-001 hierarchy"],
  [/\bTIP-010[AB]?\b/g, "Auth/RBAC"],
  [/\bTIP-011\b/g, "Execution/outbox"],
  [/\bTIP-012\b/g, "Operating spine"],
  [/\bTIP-013\+?\b/g, "Accounting Core"],
  [/\bTIP-014\+?\b/g, "Accounting contracts"],
  [/\bTIP-015\+?\b/g, "Accounting runtime"],
  [/\bTIP-030\b/g, "Project management"],
  [/\bTIP-032\b/g, "Docs app"],
  [/\bTIP-001[A-D]?\b/g, "PAS-002 architecture"],
  [/\bTIP-002\b/g, "AI governance"],
  [/\bTIP-004\b/g, "Governed UI"],
  [/\bTIP-004A\b/g, "Governed UI author notes"],
  [/\bDelivery TIP\b/gi, "PAS slice"],
  [/\bdelivery TIP\b/gi, "PAS slice"],
  [/\bFoundation TIP\b/gi, "Foundation PAS"],
  [/\bimplementation TIP\b/gi, "PAS slice"],
  [/\bNext implementation TIP\b/g, "Next PAS slice"],
  [/\btip-status-index\b/g, "pas-status-index"],
  [/\bfdr-status-index\b/g, "pas-status-index"],
  [/fdr-(\d{3})-([a-z0-9-]+)/gi, "PKG-$1 $2 (pas-status-index)"],
  [/module TIPs/g, "domain modules"],
  [/domain FDR work/g, "domain PAS slice work"],
  [/domain FDR/g, "domain PAS slice"],
  [/ARCH\/FDR/g, "PAS"],
  [/FDR status index/gi, "PAS status index"],
  [/target TIP/g, "target PAS slice"],
  [/ADR \/ TIP \/ skill/g, "ADR / PAS / skill"],
  [/TIP specs/g, "PAS specs"],
  [/FDR\/TIP\/PAS/g, "PAS"],
  [/ADR\/PAS\/FDR\/TIP/g, "ADR/PAS"],
  [/FDR, TIP, PAS/g, "PAS"],
  [/FDR, TIP/g, "PAS"],
  [/FDR\/TIP/g, "PAS"],
  [/TIP handoffs/g, "PAS slice handoffs"],
  [/TIP status changes/g, "PAS status changes"],
  [/TIP slices/g, "PAS slices"],
  [/TIP foundation/g, "PAS foundation"],
  [/TIP scope/g, "PAS scope"],
  [/TIP statuses/g, "PAS statuses"],
  [/implementation TIPs/g, "PAS slices"],
  [/Phase 1 TIP/g, "Phase 1 PAS"],
  [/UI TIPs/g, "UI PAS slices"],
  [/\| TIP \|/g, "| PAS |"],
  [/Mark UI TIPs/g, "Mark UI PAS slices"],
  [/TIP foundation roadmap/g, "PAS foundation roadmap"],
  [/tracks FDR\/TIP\/PAS/g, "tracks PAS"],
  [/FDR\/TIP narrative/g, "PAS narrative"],
  [/outside PAS\/ADR\/FDR\/TIP/g, "outside PAS/ADR"],
  [/ADR\/PAS\/FDR\/TIP authority/g, "ADR/PAS authority"],
  [/FDR vocabulary/g, "PAS vocabulary"],
  [/no TIPE, no new TIP authority/g, "PAS authority only"],
  [/TIP delivery docs remain/g, "Legacy delivery docs remain"],
  [/FDR delivery docs/g, "Legacy delivery docs"],
  [/fdr-NNN-\*\.md/g, "bNN-*.md slice handoffs"],
  [/write-tip/g, "pas-slice-planner"],
  [/write-tip-slice/g, "pas-slice-planner"],
  [/TIP-001[A-F]/g, "PAS-002"],
  [/TIP-001C/g, "PAS-002"],
  [/TIP-001D/g, "PAS-002"],
  [/TIP-001F/g, "PAS-002"],
  [/TIP-001A/g, "PAS-002"],
  [/TIP-014 \(contracts-only\)/g, "Accounting contracts"],
  [/FDR→PAS/g, "legacy→PAS"],
  [/FDR Delivery Authority/g, "Legacy Delivery Authority"],
  [/No FDR\/TIP/g, "No legacy delivery"],
  [/RETIRED.*FDR/g, "RETIRED legacy"],
  [/RETIRED.*TIP/g, "RETIRED legacy"],
  [/\bFDR-governed\b/gi, "PAS-governed"],
  [/\bFDR-gate\b/gi, "PAS gate"],
  [/\bFDR peer\b/gi, "PAS peer"],
  [/\bFDR slice\b/gi, "PAS slice"],
  [/\bFDR handoff\b/gi, "PAS handoff"],
  [/\bFDR batch\b/gi, "PAS batch"],
  [/\bFDR workflow\b/gi, "PAS workflow"],
  [/\bFDR index\b/gi, "PAS index"],
  [/\bFDR entry\b/gi, "PAS entry"],
  [/\bFDR rows\b/gi, "PAS rows"],
  [/\bFDR sections\b/gi, "PAS sections"],
  [/\bFDR scoring\b/gi, "PAS scoring"],
  [/\bFDR minimum\b/gi, "PAS minimum"],
  [/\bFDR metadata\b/gi, "PAS metadata"],
  [/\bFDR must\b/gi, "PAS slice must"],
  [/\bAn FDR\b/g, "A PAS slice"],
  [/\bthe FDR\b/gi, "the PAS slice"],
  [/\bFDR satisfies\b/gi, "PAS slice satisfies"],
  [/\bFDR cannot\b/gi, "PAS slice cannot"],
  [/\bFDR may\b/gi, "PAS slice may"],
  [/\bFDR has\b/gi, "PAS slice has"],
  [/\bFDR and\b/gi, "PAS and"],
  [/\bFDR or\b/gi, "PAS or"],
  [/\bFDR\b/g, "PAS"],
  [/\btip-ui-0(\d)\b/gi, "ui-phase-$1"],
  [/\bTIP-UI-0(\d)\b/g, "UI phase $1"],
  [/ \(TIP-004A\)/g, " (Governed UI)"],
];

function shouldSkipFile(relPath) {
  if (relPath.includes("docs/adr/") && relPath.includes("ADR-")) return true;
  if (relPath.includes("afenda-documentation-drift-audit")) return true;
  if (relPath.includes("normalize-legacy-delivery-terminology.mjs"))
    return true;
  if (relPath.includes("legacy-delivery-terminology-registry.mts")) return true;
  if (relPath.includes("check-legacy-delivery-terminology.mts")) return true;
  if (relPath.includes("rename-tip-governance-constants.mjs")) return true;
  return false;
}

function applyReplacements(content) {
  let c = content;
  for (const [re, sub] of REPLACEMENTS) {
    c = c.replace(re, sub);
  }
  return c;
}

function walk(dir, changed) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const absolute = join(dir, name);
    const rel = absolute.slice(repoRoot.length + 1).replace(/\\/g, "/");
    const st = statSync(absolute);
    if (st.isDirectory()) {
      walk(absolute, changed);
      continue;
    }
    if (!EXT.has(name.slice(name.lastIndexOf(".")))) continue;
    if (shouldSkipFile(rel)) continue;
    const orig = readFileSync(absolute, "utf8");
    const next = applyReplacements(orig);
    if (next !== orig) {
      writeFileSync(absolute, next);
      changed.add(rel);
    }
  }
}

const changed = new Set();
for (const target of [
  "docs",
  ".cursor",
  "packages",
  "apps",
  "scripts",
  "AGENTS.md",
  "README.md",
]) {
  const absolute = join(repoRoot, target);
  if (!existsSync(absolute)) continue;
  if (statSync(absolute).isFile()) {
    const rel = target.replace(/\\/g, "/");
    if (shouldSkipFile(rel)) continue;
    const orig = readFileSync(absolute, "utf8");
    const next = applyReplacements(orig);
    if (next !== orig) {
      writeFileSync(absolute, next);
      changed.add(rel);
    }
  } else {
    walk(absolute, changed);
  }
}

console.log(
  `normalize-legacy-delivery-terminology: ${changed.size} file(s) updated`
);
