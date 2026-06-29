import type { MetadataBindingContractWire } from "@afenda/shadcn-studio";
import { AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE } from "@afenda/shadcn-studio";
import type {
  MetadataBindingSlotHydrationTargetWire,
  MetadataBindingSlotHydrationWire,
} from "./metadata-binding-slot-hydration.contract";
import type { MetadataRuntimeContext } from "./metadata-runtime.contract";
import type { MetadataUiBindingProjectionWire } from "./metadata-ui-binding.projection";

export type {
  MetadataBindingSlotHydrationTargetWire,
  MetadataBindingSlotHydrationWire,
} from "./metadata-binding-slot-hydration.contract";

export interface HydrateMetadataBindingSlotsInput {
  readonly binding: MetadataBindingContractWire;
  readonly projection: MetadataUiBindingProjectionWire;
  readonly runtime: MetadataRuntimeContext;
}

function resolveRuntimeBackedPreviewValue(
  fieldKey: string,
  runtime: MetadataRuntimeContext
): string | undefined {
  switch (fieldKey) {
    case "tenantId":
    case "tenant":
      return runtime.tenantId;
    case "actorId":
    case "actor":
      return runtime.actorId;
    case "correlationId":
      return runtime.correlationId;
    case "tenantSaasLifecyclePhase":
    case "saasLifecyclePhase":
      return runtime.tenantSaasLifecyclePhase;
    default:
      return;
  }
}

function resolveSlotPreviewValue(
  fieldKey: string,
  runtime: MetadataRuntimeContext
): string {
  const runtimeValue = resolveRuntimeBackedPreviewValue(fieldKey, runtime);

  if (runtimeValue !== undefined && runtimeValue.length > 0) {
    return runtimeValue;
  }

  return `[preview:${fieldKey}]`;
}

/** Maps binding projection + runtime into wire-safe slot hydration targets (R1c-2). */
export function hydrateMetadataBindingSlots(
  input: HydrateMetadataBindingSlotsInput
): MetadataBindingSlotHydrationWire {
  const { binding, projection, runtime } = input;

  const fieldTargets: MetadataBindingSlotHydrationTargetWire[] =
    binding.fields.map((field) => ({
      domAttribute: AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE,
      slotId: field.slotId,
      fieldKey: field.fieldKey,
      presentationKind: field.presentationKind,
      value: resolveSlotPreviewValue(field.fieldKey, runtime),
    }));

  const tableColumnTargets: MetadataBindingSlotHydrationTargetWire[] =
    binding.tableColumns?.map((column) => ({
      domAttribute: AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE,
      slotId: column.slotId,
      fieldKey: column.columnKey,
      value: resolveSlotPreviewValue(column.columnKey, runtime),
    })) ?? [];

  const stateTemplateTargets: MetadataBindingSlotHydrationTargetWire[] =
    binding.stateTemplates?.map((template) => ({
      domAttribute: AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE,
      slotId: template.slotId,
      value: `[state:${template.stateKind}]`,
    })) ?? [];

  return {
    metadataBindingId: binding.metadataBindingId,
    blockId: binding.blockId,
    projection,
    slotTargets: [
      ...fieldTargets,
      ...tableColumnTargets,
      ...stateTemplateTargets,
    ],
  };
}
