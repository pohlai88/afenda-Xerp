/**
 * PAS-001A-API-BINDING S7 release gate bundle.
 *
 * Mirrors IS-004 closure gates from pas-001a-api-binding-s7-erp-release-gate.md
 * plus ERP API attestation test subset from api-governance.constants.ts.
 *
 * Registered as `pnpm quality:pas001a-api-binding-gates`.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

const governanceConstantsPath = join(
  workspaceRoot,
  "apps/erp/src/server/api/contracts/api-governance.constants.ts"
);

const EXPORT_CONST_PATH_PATTERN =
  /export const (\w+) =\s*\n?\s*"([^"]+)" as const;/g;

const ERP_API_BINDING_ATTESTATION_PATHS_PATTERN =
  /export const ERP_API_BINDING_ATTESTATION_TEST_PATHS = \[([\s\S]*?)\] as const;/;

const ERP_API_BINDING_IDENTIFIER_PATTERN = /([A-Z_]+)/g;

/** Keep in sync with ERP_API_BINDING_ATTESTATION_TEST_PATHS — meta-test enforces parity. */
function loadErpApiAttestationTestFiles() {
  const source = readFileSync(governanceConstantsPath, "utf8");
  const pathConstants = new Map();

  for (const match of source.matchAll(EXPORT_CONST_PATH_PATTERN)) {
    pathConstants.set(match[1], match[2]);
  }

  const arrayMatch = source.match(ERP_API_BINDING_ATTESTATION_PATHS_PATTERN);

  if (arrayMatch === null) {
    throw new Error(
      "Could not parse ERP_API_BINDING_ATTESTATION_TEST_PATHS from api-governance.constants.ts"
    );
  }

  const identifiers = [
    ...arrayMatch[1].matchAll(ERP_API_BINDING_IDENTIFIER_PATTERN),
  ].map((entry) => entry[1]);

  const paths = identifiers.map((identifier) => {
    const fullPath = pathConstants.get(identifier);
    if (fullPath === undefined || !fullPath.startsWith("apps/erp/")) {
      throw new Error(
        `Could not resolve ERP API attestation path constant: ${identifier}`
      );
    }
    return fullPath.replace("apps/erp/", "");
  });

  if (paths.length === 0) {
    throw new Error("ERP_API_BINDING_ATTESTATION_TEST_PATHS parsed empty");
  }

  return paths;
}

const gates = ["check:api-contracts", "check:foundation-disposition"];

const erpApiTestFiles = loadErpApiAttestationTestFiles();

console.log(
  `PAS-001A-API-BINDING S7 gates — ${gates.length} checks + ${erpApiTestFiles.length} ERP API attestation tests\n`
);

for (const gate of gates) {
  console.log(`▶ pnpm ${gate}`);
  const result = spawnSync("pnpm", [gate], {
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error(`\nPAS-001A API-BINDING gate failed: pnpm ${gate}`);
    process.exit(result.status ?? 1);
  }

  console.log(`✓ pnpm ${gate}\n`);
}

console.log(
  `▶ pnpm --filter @afenda/erp exec vitest run --config vitest.config.ts (${erpApiTestFiles.length} files)`
);
const testResult = spawnSync(
  "pnpm",
  [
    "--filter",
    "@afenda/erp",
    "exec",
    "vitest",
    "run",
    "--config",
    "vitest.config.ts",
    ...erpApiTestFiles,
  ],
  {
    shell: process.platform === "win32",
    stdio: "inherit",
  }
);

if (testResult.status !== 0) {
  console.error(
    `\nPAS-001A API-BINDING attestation tests failed (${erpApiTestFiles.length} files)`
  );
  process.exit(testResult.status ?? 1);
}

console.log(`✓ ERP API attestation tests (${erpApiTestFiles.length} files)\n`);
console.log(
  `PAS-001A-API-BINDING S7 gates — ${gates.length}/${gates.length} passed + attestation tests green`
);
