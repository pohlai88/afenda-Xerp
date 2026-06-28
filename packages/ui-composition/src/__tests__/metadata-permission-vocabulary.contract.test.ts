import { describe, expect, it } from "vitest";

import {
  formatMetadataRuntimePermissionModelDescriptor,
  formatMetadataRuntimePermissionModelDescriptors,
  isMetadataRuntimePermissionAction,
  isMetadataRuntimePermissionModelDescriptor,
  isMetadataRuntimePermissionModelScope,
  METADATA_RUNTIME_PERMISSION_ACTIONS,
  METADATA_RUNTIME_PERMISSION_MODEL_SCOPES,
  type MetadataRuntimePermissionModelDescriptor,
} from "../metadata-permission-vocabulary.contract.js";

describe("metadata permission vocabulary (PAS-001 §8 consumer projection)", () => {
  it("locks action and scope registry lengths to kernel parity", () => {
    expect(METADATA_RUNTIME_PERMISSION_ACTIONS).toHaveLength(10);
    expect(METADATA_RUNTIME_PERMISSION_MODEL_SCOPES).toHaveLength(9);
  });

  it("accepts registry literals via type guards", () => {
    for (const action of METADATA_RUNTIME_PERMISSION_ACTIONS) {
      expect(isMetadataRuntimePermissionAction(action)).toBe(true);
    }

    for (const scope of METADATA_RUNTIME_PERMISSION_MODEL_SCOPES) {
      expect(isMetadataRuntimePermissionModelScope(scope)).toBe(true);
    }
  });

  it("formats wire descriptors for diagnostics surfaces", () => {
    const descriptor: MetadataRuntimePermissionModelDescriptor = {
      module: "inventory",
      action: "read",
      scope: "tenant",
    };

    expect(formatMetadataRuntimePermissionModelDescriptor(descriptor)).toBe(
      "inventory.read@tenant"
    );
    expect(
      formatMetadataRuntimePermissionModelDescriptors([
        descriptor,
        {
          module: "accounting",
          action: "approve",
          scope: "legal_entity",
        },
      ])
    ).toBe("inventory.read@tenant, accounting.approve@legal_entity");
  });

  it("round-trips sample descriptors through JSON", () => {
    const samples: MetadataRuntimePermissionModelDescriptor[] = [
      { module: "inventory", action: "read", scope: "tenant" },
      { module: "hr", action: "assign", scope: "own_data" },
    ];

    for (const sample of samples) {
      const parsed: unknown = JSON.parse(JSON.stringify(sample));
      expect(isMetadataRuntimePermissionModelDescriptor(parsed)).toBe(true);
      expect(parsed).toEqual(sample);
    }
  });
});
