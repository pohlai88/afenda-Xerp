import { describe, expect, it } from "vitest";

import {
  TENANT_HUMAN_REFERENCE_POLICY,
  TENANT_HUMAN_REFERENCE_PROHIBITED_PATTERNS,
} from "../tenant-human-reference.policy.js";

describe("tenant-human-reference.policy (PAS §4.1.13 / ADR-0023)", () => {
  it("declares kernel classification-only boundary", () => {
    expect(TENANT_HUMAN_REFERENCE_POLICY.kernelClassifiesOnly).toBe(true);
    expect(TENANT_HUMAN_REFERENCE_POLICY.kernelDoesNotGenerate).toBe(true);
    expect(TENANT_HUMAN_REFERENCE_POLICY.humanReferencesNotInIdFamilies).toBe(
      true
    );
  });

  it("documents document composite uniqueness columns", () => {
    expect(
      TENANT_HUMAN_REFERENCE_POLICY.documentCompositeUniqueColumns
    ).toEqual(["tenant_id", "document_type", "document_no"]);
  });

  it("lists prohibited generation and persistence patterns", () => {
    expect(TENANT_HUMAN_REFERENCE_PROHIBITED_PATTERNS).toContain(
      "createEmployeeNo"
    );
    expect(TENANT_HUMAN_REFERENCE_PROHIBITED_PATTERNS).toContain(
      "foreign key to human reference column"
    );
    expect(TENANT_HUMAN_REFERENCE_PROHIBITED_PATTERNS).toContain(
      "RLS on human reference column"
    );
  });

  it("maps ADR Slice F acceptance gate aliases", () => {
    expect(
      TENANT_HUMAN_REFERENCE_POLICY.enforcementGates.noHumanReferenceFk
    ).toBe("check:no-human-reference-fk");
    expect(
      TENANT_HUMAN_REFERENCE_POLICY.enforcementGates.noHumanReferenceRls
    ).toBe("check:no-human-reference-rls");
    expect(
      TENANT_HUMAN_REFERENCE_POLICY.enforcementGates.noKernelGeneration
    ).toBe("check:no-kernel-human-number-generation");
  });
});
