/**
 * Shared Step 8 API/action/AppShell integration enforcement (multi-tenancy.md §572–579).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { TIP_007_012_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";
import {
  CONTEXT_INTEGRATION_FUNCTIONS,
  CONTEXT_INTEGRATION_WIRING,
  MULTI_TENANCY_CONTEXT_INTEGRATION_DIMENSIONS,
  MULTI_TENANCY_CONTEXT_INTEGRATION_FUNCTION_MARKERS,
  MULTI_TENANCY_CONTEXT_INTEGRATION_WIRING_MARKERS,
  TIP_007_012_CONTEXT_INTEGRATION_SECTION,
} from "../multi-tenancy-context-integration-registry.mts";

export interface ContextIntegrationEnforcementViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

/** Patterns that must not appear in integration boundary modules. */
export const CONTEXT_INTEGRATION_FORBIDDEN_PATTERNS = [
  "session.user.tenantId",
  "session.user.companyId",
] as const;

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
): ContextIntegrationEnforcementViolation[] {
  const violations: ContextIntegrationEnforcementViolation[] = [];

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

function collectIntegrationModuleViolations(
  repoRoot: string
): ContextIntegrationEnforcementViolation[] {
  const violations: ContextIntegrationEnforcementViolation[] = [];
  const erpSrc = join(repoRoot, "apps/erp/src");

  for (const entry of CONTEXT_INTEGRATION_FUNCTIONS) {
    const modulePath = join(erpSrc, entry.file);

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "integration-module-missing",
        file: modulePath,
        message: `Context integration module missing: ${entry.file}`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");
    if (!moduleSource.includes(entry.name)) {
      violations.push({
        rule: "integration-function-missing",
        file: modulePath,
        message: `Context integration function missing: ${entry.name}`,
      });
    }
  }

  for (const wiring of CONTEXT_INTEGRATION_WIRING) {
    const modulePath = join(erpSrc, wiring.module);

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "wiring-module-missing",
        file: modulePath,
        message: `Context integration wiring module missing: ${wiring.module}`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");
    if (!moduleSource.includes(wiring.delegate)) {
      violations.push({
        rule: "wiring-delegate-missing",
        file: modulePath,
        message: `${wiring.module} must delegate via ${wiring.delegate} (${wiring.step})`,
      });
    }
  }

  const apiRequestContextPath = join(
    erpSrc,
    "server/api/runtime/api-request-context.ts"
  );
  if (existsSync(apiRequestContextPath)) {
    const apiRequestContextSource = readFileSync(apiRequestContextPath, "utf8");
    if (!apiRequestContextSource.includes("assertAuthorizedApiRoute")) {
      violations.push({
        rule: "api-permission-bridge-missing",
        file: apiRequestContextPath,
        message:
          "api-request-context.ts must bridge protected routes via assertAuthorizedApiRoute",
      });
    }
  }

  const authorizeApiRoutePath = join(erpSrc, "lib/api/authorize-api-route.ts");
  if (existsSync(authorizeApiRoutePath)) {
    const authorizeSource = readFileSync(authorizeApiRoutePath, "utf8");
    if (!authorizeSource.includes("resolveVerifiedApiRouteOperatingContext")) {
      violations.push({
        rule: "verified-context-missing",
        file: authorizeApiRoutePath,
        message:
          "authorize-api-route.ts must resolve verified operating context before permission checks",
      });
    }
    for (const forbidden of CONTEXT_INTEGRATION_FORBIDDEN_PATTERNS) {
      if (authorizeSource.includes(forbidden)) {
        violations.push({
          rule: "forbidden-session-context",
          file: authorizeApiRoutePath,
          message: `authorize-api-route.ts must not read workspace from session: ${forbidden}`,
        });
      }
    }
  }

  const actionContextPath = join(
    erpSrc,
    "lib/server-actions/resolve-action-operating-context.server.ts"
  );
  if (existsSync(actionContextPath)) {
    const actionContextSource = readFileSync(actionContextPath, "utf8");
    if (!actionContextSource.includes("resolveOperatingContextFromHeaders")) {
      violations.push({
        rule: "action-header-resolution-missing",
        file: actionContextPath,
        message:
          "resolve-action-operating-context.server.ts must delegate to resolveOperatingContextFromHeaders",
      });
    }
  }

  const contextSwitchPath = join(
    erpSrc,
    "lib/context/context-switch.action.ts"
  );
  if (existsSync(contextSwitchPath)) {
    const contextSwitchSource = readFileSync(contextSwitchPath, "utf8");
    if (!contextSwitchSource.includes("operatingContextSelectionHintsSchema")) {
      violations.push({
        rule: "context-switch-schema-missing",
        file: contextSwitchPath,
        message:
          "context-switch.action.ts must validate slug hints via operatingContextSelectionHintsSchema",
      });
    }
    if (!contextSwitchSource.includes("parseProtectedActionInput")) {
      violations.push({
        rule: "context-switch-parse-missing",
        file: contextSwitchPath,
        message:
          "context-switch.action.ts must parse input via parseProtectedActionInput before IO",
      });
    }
  }

  const integrationTestPath = join(
    repoRoot,
    "apps/erp/src/__tests__/operating-context-integration.test.ts"
  );
  if (!existsSync(integrationTestPath)) {
    violations.push({
      rule: "integration-test-missing",
      file: integrationTestPath,
      message:
        "apps/erp/src/__tests__/operating-context-integration.test.ts is required",
    });
  }

  return violations;
}

function collectDeliverySectionViolations(
  repoRoot: string
): ContextIntegrationEnforcementViolation[] {
  const violations: ContextIntegrationEnforcementViolation[] = [];
  const deliveryPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);

  if (!existsSync(deliveryPath)) {
    return violations;
  }

  const deliveryContent = readFileSync(deliveryPath, "utf8");
  const section = extractSection(
    deliveryContent,
    `## ${TIP_007_012_CONTEXT_INTEGRATION_SECTION}`
  );

  if (section === null) {
    violations.push({
      rule: "delivery-section-missing",
      file: deliveryPath,
      message: `Delivery doc missing section: ## ${TIP_007_012_CONTEXT_INTEGRATION_SECTION}`,
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_CONTEXT_INTEGRATION_DIMENSIONS) {
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
      MULTI_TENANCY_CONTEXT_INTEGRATION_FUNCTION_MARKERS,
      "delivery-function-marker",
      deliveryPath,
      "Integration functions table"
    )
  );

  violations.push(
    ...collectMissingMarkers(
      section,
      MULTI_TENANCY_CONTEXT_INTEGRATION_WIRING_MARKERS,
      "delivery-wiring-marker",
      deliveryPath,
      "Integration wiring table"
    )
  );

  return violations;
}

export function collectContextIntegrationViolations(
  repoRoot: string
): ContextIntegrationEnforcementViolation[] {
  const violations: ContextIntegrationEnforcementViolation[] = [];

  const registryPath = join(
    repoRoot,
    "apps/erp/src/lib/context/context-integration-registry.ts"
  );
  if (existsSync(registryPath)) {
    const registrySource = readFileSync(registryPath, "utf8");
    for (const entry of CONTEXT_INTEGRATION_FUNCTIONS) {
      if (!registrySource.includes(entry.name)) {
        violations.push({
          rule: "erp-registry-function-missing",
          file: registryPath,
          message: `ERP registry missing function export marker: ${entry.name}`,
        });
      }
    }
    for (const step of CONTEXT_INTEGRATION_WIRING) {
      if (!registrySource.includes(step.step)) {
        violations.push({
          rule: "erp-registry-wiring-missing",
          file: registryPath,
          message: `ERP registry missing wiring step: ${step.step}`,
        });
      }
    }
  } else {
    violations.push({
      rule: "erp-registry-missing",
      file: registryPath,
      message: "context-integration-registry.ts is required in apps/erp",
    });
  }

  violations.push(...collectIntegrationModuleViolations(repoRoot));
  violations.push(...collectDeliverySectionViolations(repoRoot));

  return violations;
}
