import type { PermissionKey } from "@afenda/database";
import type {
  OperatingContext,
  PermissionAction,
  PermissionGrantScopeType,
  PermissionModelDescriptor,
  PermissionModelScope,
} from "@afenda/kernel";
import {
  getPermissionAction,
  PERMISSION_ACTIONS,
  type PermissionModelWireDescriptor,
  parseUnknownPermissionModelDescriptor,
  serializePermissionModelDescriptor,
} from "@afenda/kernel";
import {
  extractPermissionAction,
  extractPermissionDomain,
} from "@afenda/permissions";
import {
  isMetadataRuntimePermissionAction,
  isMetadataRuntimePermissionModelScope,
  type MetadataRuntimePermissionModelDescriptor,
} from "@afenda/ui-composition";

const GRANT_SCOPE_TO_MODEL_SCOPE = {
  platform: "global",
  tenant: "tenant",
  entity_group: "entity_group",
  company: "legal_entity",
  organization: "organization_unit",
  team: "team",
  project: "project",
  consolidation_view: "global",
  cross_company: "global",
} as const satisfies Record<PermissionGrantScopeType, PermissionModelScope>;

function toMetadataRuntimePermissionModelDescriptor(
  wire: PermissionModelWireDescriptor
): MetadataRuntimePermissionModelDescriptor {
  const validated = parseUnknownPermissionModelDescriptor(wire);

  if (!isMetadataRuntimePermissionAction(validated.action)) {
    throw new Error("Invalid permission action for metadata runtime.");
  }

  if (!isMetadataRuntimePermissionModelScope(validated.scope)) {
    throw new Error("Invalid permission model scope for metadata runtime.");
  }

  return {
    module: validated.module,
    action: validated.action,
    scope: validated.scope,
  };
}

export function resolveModelScopeFromGrantScope(
  grantScopeType: PermissionGrantScopeType
): PermissionModelScope {
  return GRANT_SCOPE_TO_MODEL_SCOPE[grantScopeType];
}

function normalizeRegisteredActionToKernelAction(
  registeredAction: string
): PermissionAction | null {
  const direct = getPermissionAction(registeredAction);

  if (direct !== null) {
    return direct;
  }

  for (const kernelAction of PERMISSION_ACTIONS) {
    if (
      registeredAction === kernelAction ||
      registeredAction.endsWith(`_${kernelAction}`)
    ) {
      return kernelAction;
    }
  }

  return null;
}

/** Parses governed `{domain}.{action}` permission keys from `@afenda/permissions`. */
export function parseRegisteredPermissionKeyToWireDescriptor(
  permissionKey: string,
  scope: PermissionModelScope
): PermissionModelWireDescriptor | null {
  try {
    const typedKey = permissionKey as PermissionKey;
    const module = extractPermissionDomain(typedKey);
    const registeredAction = extractPermissionAction(typedKey);
    const action = normalizeRegisteredActionToKernelAction(registeredAction);

    if (action === null) {
      return null;
    }

    return { module, action, scope };
  } catch {
    return null;
  }
}

function parseLegacyPermissionKeyToWireDescriptor(
  key: string,
  scope: PermissionModelScope
): PermissionModelWireDescriptor | null {
  const segments = key.split(".");

  if (segments.length < 2) {
    return null;
  }

  for (let index = segments.length - 1; index >= 1; index -= 1) {
    const actionSegment = segments[index];

    if (actionSegment === undefined) {
      continue;
    }

    const action = getPermissionAction(actionSegment);

    if (action === null) {
      continue;
    }

    const module = segments.slice(0, index).join(".");

    if (module.length === 0) {
      continue;
    }

    return { module, action, scope };
  }

  return null;
}

function parsePermissionKeyToWireDescriptor(
  key: string,
  scope: PermissionModelScope
): PermissionModelWireDescriptor | null {
  return (
    parseRegisteredPermissionKeyToWireDescriptor(key, scope) ??
    parseLegacyPermissionKeyToWireDescriptor(key, scope)
  );
}

/**
 * Maps live granted permission keys from `@afenda/permissions` role evaluation
 * into metadata runtime permission model descriptors.
 */
export function resolveMetadataPermissionModelDescriptorsFromGrantedKeys(input: {
  readonly grantScopeType: PermissionGrantScopeType;
  readonly permissionKeys: readonly string[];
}): readonly MetadataRuntimePermissionModelDescriptor[] {
  if (input.permissionKeys.length === 0) {
    return [];
  }

  const modelScope = resolveModelScopeFromGrantScope(input.grantScopeType);
  const descriptors: MetadataRuntimePermissionModelDescriptor[] = [];

  for (const key of input.permissionKeys) {
    const wire = parsePermissionKeyToWireDescriptor(key, modelScope);

    if (wire === null) {
      continue;
    }

    descriptors.push(toMetadataRuntimePermissionModelDescriptor(wire));
  }

  return descriptors;
}

/**
 * Maps verified operating context and permission keys into metadata runtime
 * permission model vocabulary. Explicit overrides win over key derivation.
 */
export function resolveMetadataPermissionModelDescriptorsFromOperatingContext(input: {
  readonly operatingContext: OperatingContext;
  readonly overrides?: readonly PermissionModelDescriptor[];
  readonly permissionKeys?: readonly string[];
}): readonly MetadataRuntimePermissionModelDescriptor[] {
  if (input.overrides !== undefined && input.overrides.length > 0) {
    return input.overrides.map((descriptor) =>
      toMetadataRuntimePermissionModelDescriptor(
        serializePermissionModelDescriptor(descriptor)
      )
    );
  }

  return resolveMetadataPermissionModelDescriptorsFromGrantedKeys({
    grantScopeType: input.operatingContext.permissionScope.grantScopeType,
    permissionKeys: input.permissionKeys ?? [],
  });
}
