#!/usr/bin/env tsx
/**
 * Sync PAS-001B layout maturity + package exports when full catalog is delivered.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ERP_DOMAIN_MODULES } from "../../packages/kernel/src/erp-domain/erp-domain-layout.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const UNIFIED_GATE = "pnpm check:erp-domain-delivered-vocabulary" as const;

const layoutPath = join(
  repoRoot,
  "packages/kernel/src/erp-domain/erp-domain-layout.contract.ts"
);

let layout = readFileSync(layoutPath, "utf8");

layout = layout.replace(
  /export const ERP_DOMAIN_MODULE_MATURITY = \{[\s\S]*?\} as const satisfies Record<ErpDomainModule, ErpDomainModuleMaturity>;/,
  `export const ERP_DOMAIN_MODULE_MATURITY = {
${ERP_DOMAIN_MODULES.map((slug) => `  ${slug.includes("-") ? `"${slug}"` : slug}: "delivered",`).join("\n")}
} as const satisfies Record<ErpDomainModule, ErpDomainModuleMaturity>;`
);

layout = layout.replace(/vocabularyGate: "[^"]+",/g, `vocabularyGate: "${UNIFIED_GATE}",`);
layout = layout.replace(/vocabularyGate: null,/g, `vocabularyGate: "${UNIFIED_GATE}",`);

layout = layout.replace(
  /export const ERP_DOMAIN_MODULE_INDEX_PATHS = \{[\s\S]*?\} as const satisfies Partial<Record<ErpDomainModule, string>>;/,
  `export const ERP_DOMAIN_MODULE_INDEX_PATHS = {
${ERP_DOMAIN_MODULES.map(
  (slug) =>
    `  ${slug.includes("-") ? `"${slug}"` : slug}: "packages/kernel/src/erp-domain/${slug}/index.ts",`
).join("\n")}
} as const satisfies Partial<Record<ErpDomainModule, string>>;`
);

writeFileSync(layoutPath, layout, "utf8");

const kernelPkgPath = join(repoRoot, "packages/kernel/package.json");
const kernelPkg = JSON.parse(readFileSync(kernelPkgPath, "utf8")) as {
  exports: Record<string, unknown>;
};

const exportBase = "./erp-domain/";
for (const key of Object.keys(kernelPkg.exports)) {
  if (key.startsWith(exportBase)) {
    delete kernelPkg.exports[key];
  }
}

for (const slug of ERP_DOMAIN_MODULES) {
  kernelPkg.exports[`./erp-domain/${slug}`] = {
    types: `./dist/erp-domain/${slug}/index.d.ts`,
    import: `./dist/erp-domain/${slug}/index.js`,
    default: `./dist/erp-domain/${slug}/index.js`,
  };
}

const orderedExports: Record<string, unknown> = {};
const preferredOrder = [
  ".",
  "./context",
  ...ERP_DOMAIN_MODULES.map((slug) => `./erp-domain/${slug}`),
  "./propagation",
  "./events",
  "./policy",
  "./permission",
  "./governance",
];

for (const key of preferredOrder) {
  if (kernelPkg.exports[key]) {
    orderedExports[key] = kernelPkg.exports[key];
  }
}

kernelPkg.exports = orderedExports;
writeFileSync(kernelPkgPath, `${JSON.stringify(kernelPkg, null, 2)}\n`, "utf8");

console.log(
  `Synced ${ERP_DOMAIN_MODULES.length} delivered modules — layout maturity, gates, index paths, package exports.`
);
