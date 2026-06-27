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
