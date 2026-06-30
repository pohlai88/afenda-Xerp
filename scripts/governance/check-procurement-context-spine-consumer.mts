#!/usr/bin/env tsx
/**
 * ERP-PROC-OP-005 — procurement context spine consumer drift gate.
 * Asserts features contract matches foundation bundle + ERP consumer proof on disk.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PROCUREMENT_FOUNDATION_BUNDLE } from "../../packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts";
import {
  PROCUREMENT_CONTEXT_SPINE_CONSUMER_CONTRACT,
  PROCUREMENT_CONTEXT_SPINE_FORBIDDEN_INGRESS,
  PROCUREMENT_CONTEXT_SPINE_REQUIRED_RESOLVERS,
} from "../../packages/features/erp-modules/src/procurement/procurement.context-spine-consumer.contract.ts";
import {
  type ErpModuleFoundationViolation,
  getRepoRoot,
  pathExists,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:procurement-context-spine-consumer";
const READINESS_PAGE_PATH =
  "apps/erp/src/app/(protected)/modules/procurement/readiness/page.tsx";
const READINESS_LOADER_PATH =
  "apps/erp/src/lib/procurement/load-procurement-foundation-readiness-page.server.ts";
const RUNTIME_PACKAGE_PATH = "packages/procurement";

function sorted(values: readonly string[]): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

export function checkProcurementContextSpineConsumer(): ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const bundleConsumer = PROCUREMENT_FOUNDATION_BUNDLE.contextSpineConsumer;
  const contract = PROCUREMENT_CONTEXT_SPINE_CONSUMER_CONTRACT;

  if (!bundleConsumer) {
    violations.push({
      rule: "bundle-consumer-missing",
      file: GATE,
      message: "PROCUREMENT_FOUNDATION_BUNDLE.contextSpineConsumer is missing",
    });
    return violations;
  }

  if (contract.module !== bundleConsumer.module) {
    violations.push({
      rule: "module-drift",
      file: GATE,
      message: `module "${contract.module}" !== bundle "${bundleConsumer.module}"`,
    });
  }

  if (contract.kvId !== bundleConsumer.kvId) {
    violations.push({
      rule: "kv-drift",
      file: GATE,
      message: `kvId "${contract.kvId}" !== bundle "${bundleConsumer.kvId}"`,
    });
  }

  const contractResolvers = sorted(contract.requiredResolvers);
  const bundleResolvers = sorted(bundleConsumer.requiredResolvers);

  if (contractResolvers.join("|") !== bundleResolvers.join("|")) {
    violations.push({
      rule: "required-resolvers-drift",
      file: GATE,
      message:
        "PROCUREMENT_CONTEXT_SPINE_CONSUMER_CONTRACT.requiredResolvers !== bundle contextSpineConsumer",
    });
  }

  const contractForbidden = sorted(contract.forbiddenIngress);
  const bundleForbidden = sorted(bundleConsumer.forbiddenIngress);

  if (contractForbidden.join("|") !== bundleForbidden.join("|")) {
    violations.push({
      rule: "forbidden-ingress-drift",
      file: GATE,
      message:
        "PROCUREMENT_CONTEXT_SPINE_CONSUMER_CONTRACT.forbiddenIngress !== bundle contextSpineConsumer",
    });
  }

  if (contract.consumerProofStatus !== "attested") {
    violations.push({
      rule: "consumer-proof-attested",
      file: GATE,
      message: `consumerProofStatus must be "attested"`,
    });
  }

  if (!pathExists(READINESS_PAGE_PATH)) {
    violations.push({
      rule: "readiness-page-missing",
      file: GATE,
      message: `${READINESS_PAGE_PATH} missing — ERP-PROC-OP-005 consumer proof route required`,
    });
  }

  if (!pathExists(READINESS_LOADER_PATH)) {
    violations.push({
      rule: "readiness-loader-missing",
      file: GATE,
      message: `${READINESS_LOADER_PATH} missing`,
    });
  }

  const repoRoot = getRepoRoot();

  if (pathExists(READINESS_LOADER_PATH)) {
    const loaderSource = readFileSync(
      join(repoRoot, READINESS_LOADER_PATH),
      "utf8"
    );

    if (!loaderSource.includes("loadProtectedRequestOperatingContext")) {
      violations.push({
        rule: "loader-spine-delegate",
        file: GATE,
        message: `${READINESS_LOADER_PATH} must call loadProtectedRequestOperatingContext`,
      });
    }

    for (const forbidden of PROCUREMENT_CONTEXT_SPINE_FORBIDDEN_INGRESS) {
      const forbiddenBasename = forbidden.split("/").at(-1) ?? forbidden;
      if (loaderSource.includes(forbiddenBasename.replace(".server.ts", ""))) {
        violations.push({
          rule: "loader-forbidden-ingress",
          file: GATE,
          message: `${READINESS_LOADER_PATH} must not import forbidden ingress ${forbidden}`,
        });
      }
    }
  }

  for (const route of contract.protectedConsumerRoutes) {
    const metadataSurface =
      PROCUREMENT_FOUNDATION_BUNDLE.metadataBinding.surfaces.find(
        (surface) => surface.surfaceId === route.surfaceId
      );

    if (!metadataSurface) {
      violations.push({
        rule: "metadata-surface-missing",
        file: GATE,
        message: `metadataBinding surface "${route.surfaceId}" missing from bundle`,
      });
      continue;
    }

    if (metadataSurface.route !== route.routePattern) {
      violations.push({
        rule: "metadata-route-drift",
        file: GATE,
        message: `metadata route "${metadataSurface.route}" !== "${route.routePattern}"`,
      });
    }
  }

  if (PROCUREMENT_CONTEXT_SPINE_REQUIRED_RESOLVERS.length < 2) {
    violations.push({
      rule: "resolver-count",
      file: GATE,
      message:
        "expected at least two required resolvers (canonical + protected request entry)",
    });
  }

  if (pathExists(RUNTIME_PACKAGE_PATH)) {
    violations.push({
      rule: "no-premature-runtime-package",
      file: GATE,
      message: `${RUNTIME_PACKAGE_PATH} exists — filesystem blocked until authorized slice`,
    });
  }

  if (violations.length === 0) {
    console.log(
      `  context spine consumer OK: ${contract.protectedConsumerRoutes.length} routes attested · ${PROCUREMENT_CONTEXT_SPINE_REQUIRED_RESOLVERS.length} resolvers · forbidden ingress blocked`
    );
  }

  return violations;
}

function run(): readonly ErpModuleFoundationViolation[] {
  return checkProcurementContextSpineConsumer();
}

reportViolations(GATE, run());
