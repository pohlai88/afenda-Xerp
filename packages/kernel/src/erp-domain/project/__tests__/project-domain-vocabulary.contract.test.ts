import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertProjectDomainVocabularyRegistryIntegrity,
  isBillingMethod,
  isProjectAuditAction,
  isProjectStatus,
  isTaskStatus,
  isTimesheetStatus,
  PROJECT_AUDIT_ACTIONS,
  PROJECT_DOMAIN_AUDIT_VOCABULARY,
  PROJECT_DOMAIN_BRANDED_ID_TYPE_NAMES,
  PROJECT_DOMAIN_BRANDED_IDS,
  PROJECT_DOMAIN_CLOSED_VOCABULARIES,
  PROJECT_DOMAIN_PERMISSION_VOCABULARY,
  PROJECT_DOMAIN_VOCABULARY_POLICY,
  PROJECT_DOMAIN_VOCABULARY_REGISTRY,
  PROJECT_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B project domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: PROJECT_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: PROJECT_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "project-status",
        "task-status",
        "billing-method",
        "timesheet-status",
      ],
      brandedIdTypeNames: PROJECT_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: PROJECT_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: PROJECT_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(PROJECT_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-PROJECT");
  });

  it("lists closed vocabularies", () => {
    expect(PROJECT_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(PROJECT_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(PROJECT_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertProjectDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isProjectAuditAction(PROJECT_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isProjectStatus("planning")).toBe(true);
    expect(isTaskStatus("todo")).toBe(true);
    expect(isBillingMethod("fixed")).toBe(true);
    expect(isTimesheetStatus("draft")).toBe(true);
  });
});

describe("PAS-001B project domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(PROJECT_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
    expect(
      PROJECT_DOMAIN_VOCABULARY_POLICY.platformProjectIdDisambiguation
    ).toContain("domain-scoped ERP project entity");
    expect(
      PROJECT_DOMAIN_BRANDED_IDS.find((entry) => entry.typeName === "ProjectId")
        ?.forbiddenOnPlatformFloor
    ).toBe(true);
  });
});
