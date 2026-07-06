import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertWorkflowDomainVocabularyRegistryIntegrity,
  isApprovalDecision,
  isEscalationReason,
  isTaskPriority,
  isWorkflowAuditAction,
  isWorkflowStatus,
  WORKFLOW_AUDIT_ACTIONS,
  WORKFLOW_DOMAIN_AUDIT_VOCABULARY,
  WORKFLOW_DOMAIN_BRANDED_ID_TYPE_NAMES,
  WORKFLOW_DOMAIN_CLOSED_VOCABULARIES,
  WORKFLOW_DOMAIN_PERMISSION_VOCABULARY,
  WORKFLOW_DOMAIN_VOCABULARY_POLICY,
  WORKFLOW_DOMAIN_VOCABULARY_REGISTRY,
  WORKFLOW_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B workflow domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: WORKFLOW_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: WORKFLOW_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "workflow-status",
        "approval-decision",
        "task-priority",
        "escalation-reason",
      ],
      brandedIdTypeNames: WORKFLOW_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: WORKFLOW_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: WORKFLOW_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(WORKFLOW_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-WORKFLOW"
    );
  });

  it("lists closed vocabularies", () => {
    expect(WORKFLOW_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(WORKFLOW_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(WORKFLOW_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertWorkflowDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isWorkflowAuditAction(WORKFLOW_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isWorkflowStatus("running")).toBe(true);
    expect(isApprovalDecision("pending")).toBe(true);
    expect(isTaskPriority("low")).toBe(true);
    expect(isEscalationReason("timeout")).toBe(true);
  });
});

describe("PAS-001B workflow domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(WORKFLOW_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
