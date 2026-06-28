#!/usr/bin/env tsx
/**
 * PAS-002A §4.4 / B41 — disposition completeness gate.
 *
 * Every active package-registry row must have a matching foundation-disposition
 * entry (by packageName) or a documented exception in exception-registry.
 */

import {
  exceptionContract,
  foundationDispositionRegistry,
  packageContract,
} from "../../packages/architecture-authority/src/index.ts";

const errors: string[] = [];

const dispositionPackageNames = new Set(
  foundationDispositionRegistry.entries.map((entry) => entry.packageName)
);

const exceptionPackageNames = new Set(
  exceptionContract.exceptions.map((entry) => entry.packageName)
);

for (const pkg of packageContract.packages) {
  if (pkg.lifecycle !== "active") {
    continue;
  }

  if (dispositionPackageNames.has(pkg.packageName)) {
    continue;
  }

  if (exceptionPackageNames.has(pkg.packageName)) {
    continue;
  }

  errors.push(
    `${pkg.packageName} (${pkg.registryId}) is active but has no foundation-disposition entry or documented exception`
  );
}

if (errors.length > 0) {
  console.error("architecture-disposition-completeness: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("architecture-disposition-completeness: PASS");
