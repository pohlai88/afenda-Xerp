import {
  assertPermissionModelDescriptor,
  assertWirePermissionModelDescriptor,
} from "./permission-model.assert.js";
import type {
  PermissionModelDescriptor,
  PermissionModelWireDescriptor,
} from "./permission-model.contract.js";

function parseValidatedPermissionModelDescriptor(
  value: PermissionModelWireDescriptor
): PermissionModelDescriptor {
  return {
    module: value.module,
    action: value.action,
    scope: value.scope,
  };
}

/** JSON/API ingress — assert unknown wire, then narrow to typed permission model descriptor. */
export function parseUnknownPermissionModelDescriptor(
  value: unknown
): PermissionModelDescriptor {
  assertWirePermissionModelDescriptor(value);
  return parseValidatedPermissionModelDescriptor(value);
}

export function normalizePermissionModelDescriptorForWire(
  value: PermissionModelDescriptor
): PermissionModelWireDescriptor {
  const validated = assertPermissionModelDescriptor(value);

  return {
    module: validated.module,
    action: validated.action,
    scope: validated.scope,
  };
}

/** Wire egress alias — same contract as `normalizePermissionModelDescriptorForWire`. */
export function serializePermissionModelDescriptor(
  value: PermissionModelDescriptor
): PermissionModelWireDescriptor {
  return normalizePermissionModelDescriptorForWire(value);
}
