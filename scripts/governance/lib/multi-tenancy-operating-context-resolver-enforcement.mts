/**
 * Shared Step 7 operating context resolver enforcement (multi-tenancy.md §561–571).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { MULTI_TENANCY_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";
import {
  MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_DIMENSIONS,
  MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_FUNCTION_MARKERS,
  MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_PIPELINE_MARKERS,
  OPERATING_CONTEXT_RESOLVER_FORBIDDEN_PATTERNS,
  OPERATING_CONTEXT_RESOLVER_FUNCTIONS,
  OPERATING_CONTEXT_RESOLVER_PIPELINE,
  MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_SECTION,
} from "../multi-tenancy-operating-context-resolver-registry.mts";

export interface OperatingContextResolverEnforcementViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function extractSection(content: string, heading: string): string | null {
  const headingIndex = content.indexOf(heading);
  if (headingIndex === -1) {
    return null;
  }

  const afterHeading = content.slice(headingIndex + heading.length);
  const nextSectionMatch = afterHeading.match(/\n## /);
  const sectionEnd =
    nextSectionMatch?.index === undefined
      ? content.length
      : headingIndex + heading.length + nextSectionMatch.index;

  return content.slice(headingIndex, sectionEnd);
}

function collectMissingMarkers(
  content: string,
  markers: readonly string[],
  rule: string,
  file: string,
  label: string
): OperatingContextResolverEnforcementViolation[] {
  const violations: OperatingContextResolverEnforcementViolation[] = [];

  for (const marker of markers) {
    if (!content.includes(marker)) {
      violations.push({
        rule,
        file,
        message: `${label} missing row marker: ${marker}`,
      });
    }
  }

  return violations;
}

function collectResolverFunctionViolations(
  repoRoot: string
): OperatingContextResolverEnforcementViolation[] {
  const violations: OperatingContextResolverEnforcementViolation[] = [];
  const erpSrc = join(repoRoot, "apps/erp/src");

  for (const entry of OPERATING_CONTEXT_RESOLVER_FUNCTIONS) {
    const modulePath = join(erpSrc, entry.file);

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "resolver-module-missing",
        file: modulePath,
        message: `Operating context resolver module missing: ${entry.file}`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");
    if (!moduleSource.includes(entry.name)) {
      violations.push({
        rule: "resolver-function-missing",
        file: modulePath,
        message: `Operating context resolver function missing: ${entry.name}`,
      });
    }
  }

  const mainResolverPath = join(
    erpSrc,
    "lib/context/resolve-operating-context.server.ts"
  );
  if (existsSync(mainResolverPath)) {
    const mainSource = readFileSync(mainResolverPath, "utf8");

    if (!mainSource.includes("Promise<OperatingContextResult>")) {
      violations.push({
        rule: "typed-result-missing",
        file: mainResolverPath,
        message:
          "resolveOperatingContext must return Promise<OperatingContextResult>",
      });
    }

    for (const forbidden of OPERATING_CONTEXT_RESOLVER_FORBIDDEN_PATTERNS) {
      if (mainSource.includes(forbidden)) {
        violations.push({
          rule: "forbidden-session-tenant",
          file: mainResolverPath,
          message: `Operating context resolver must not read tenant from session: ${forbidden}`,
        });
      }
    }
  }

  for (const pipeline of OPERATING_CONTEXT_RESOLVER_PIPELINE) {
    const modulePath = join(erpSrc, "lib/context", pipeline.module);

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "pipeline-module-missing",
        file: modulePath,
        message: `Operating context pipeline module missing: ${pipeline.module}`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");
    if (!moduleSource.includes(pipeline.delegate)) {
      violations.push({
        rule: "pipeline-delegate-missing",
        file: modulePath,
        message: `${pipeline.module} must delegate via ${pipeline.delegate} (${pipeline.step})`,
      });
    }
  }

  const grantScopePath = join(
    erpSrc,
    "lib/context/resolve-grant-scope.server.ts"
  );
  if (existsSync(grantScopePath)) {
    const grantScopeSource = readFileSync(grantScopePath, "utf8");
    if (!grantScopeSource.includes("resolveScopedMembership")) {
      violations.push({
        rule: "membership-resolution-missing",
        file: grantScopePath,
        message:
          "resolve-grant-scope.server.ts must verify membership via resolveScopedMembership",
      });
    }
    if (!grantScopeSource.includes("resolvePermissionScopeContext")) {
      violations.push({
        rule: "grant-scope-delegation",
        file: grantScopePath,
        message:
          "resolve-grant-scope.server.ts must delegate to resolvePermissionScopeContext",
      });
    }
  }

  const legalEntityPath = join(
    erpSrc,
    "lib/context/resolve-legal-entity-context.server.ts"
  );
  if (existsSync(legalEntityPath)) {
    const legalEntitySource = readFileSync(legalEntityPath, "utf8");
    if (!legalEntitySource.includes("verifyEntityGroupBoundary")) {
      violations.push({
        rule: "entity-group-boundary-missing",
        file: legalEntityPath,
        message:
          "resolve-legal-entity-context.server.ts must verify entity group boundary",
      });
    }
  }

  const contextErrorsPath = join(erpSrc, "lib/context/context-errors.ts");
  if (existsSync(contextErrorsPath)) {
    const contextErrorsSource = readFileSync(contextErrorsPath, "utf8");
    if (!contextErrorsSource.includes("denyOperatingContext")) {
      violations.push({
        rule: "fail-closed-helper-missing",
        file: contextErrorsPath,
        message:
          "context-errors.ts must export denyOperatingContext for fail-closed denials",
      });
    }
  }

  const integrationTestPath = join(
    repoRoot,
    "apps/erp/src/lib/context/__tests__/operating-context-spine.integration.test.ts"
  );
  const legacyTestPath = join(
    repoRoot,
    "apps/erp/src/__tests__/operating-context.test.ts"
  );
  if (!existsSync(integrationTestPath) && !existsSync(legacyTestPath)) {
    violations.push({
      rule: "resolver-test-missing",
      file: integrationTestPath,
      message:
        "apps/erp/src/lib/context/__tests__/operating-context-spine.integration.test.ts is required",
    });
  }

  return violations;
}

function collectDeliverySectionViolations(
  repoRoot: string
): OperatingContextResolverEnforcementViolation[] {
  const violations: OperatingContextResolverEnforcementViolation[] = [];
  const deliveryPath = join(repoRoot, MULTI_TENANCY_DELIVERY_DOC);

  if (!existsSync(deliveryPath)) {
    return violations;
  }

  const deliveryContent = readFileSync(deliveryPath, "utf8");
  const section = extractSection(
    deliveryContent,
    `## ${MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_SECTION}`
  );

  if (section === null) {
    violations.push({
      rule: "delivery-section-missing",
      file: deliveryPath,
      message: `Delivery doc missing section: ## ${MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_SECTION}`,
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_DIMENSIONS) {
    if (!section.includes(dimension.tableMarker)) {
      violations.push({
        rule: "delivery-dimension-missing",
        file: deliveryPath,
        message: `Delivery doc missing ${dimension.tableMarker}`,
      });
    }
  }

  violations.push(
    ...collectMissingMarkers(
      section,
      MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_FUNCTION_MARKERS,
      "delivery-function-marker",
      deliveryPath,
      "Resolver functions table"
    )
  );

  violations.push(
    ...collectMissingMarkers(
      section,
      MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_PIPELINE_MARKERS,
      "delivery-pipeline-marker",
      deliveryPath,
      "Resolution pipeline table"
    )
  );

  return violations;
}

export function collectOperatingContextResolverViolations(
  repoRoot: string
): OperatingContextResolverEnforcementViolation[] {
  const violations: OperatingContextResolverEnforcementViolation[] = [];

  const registryPath = join(
    repoRoot,
    "apps/erp/src/lib/context/operating-context-resolver-registry.ts"
  );
  if (existsSync(registryPath)) {
    const registrySource = readFileSync(registryPath, "utf8");
    for (const entry of OPERATING_CONTEXT_RESOLVER_FUNCTIONS) {
      if (!registrySource.includes(entry.name)) {
        violations.push({
          rule: "erp-registry-function-missing",
          file: registryPath,
          message: `ERP registry missing function export marker: ${entry.name}`,
        });
      }
    }
    for (const step of OPERATING_CONTEXT_RESOLVER_PIPELINE) {
      if (!registrySource.includes(step.step)) {
        violations.push({
          rule: "erp-registry-pipeline-missing",
          file: registryPath,
          message: `ERP registry missing pipeline step: ${step.step}`,
        });
      }
    }
  } else {
    violations.push({
      rule: "erp-registry-missing",
      file: registryPath,
      message: "operating-context-resolver-registry.ts is required in apps/erp",
    });
  }

  violations.push(...collectResolverFunctionViolations(repoRoot));
  violations.push(...collectDeliverySectionViolations(repoRoot));

  return violations;
}
