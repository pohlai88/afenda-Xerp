import type {
  MetadataBindingSlotHydrationTargetWire,
  MetadataBindingSlotHydrationWire,
} from "./metadata-binding-slot-hydration.contract";
import {
  METADATA_BINDING_HELP_SLOT_SUFFIX,
  METADATA_BINDING_SLOT_DOM_ATTRIBUTE,
} from "./metadata-binding-slot-hydration.contract";
import type { MetadataRuntimeContext } from "./metadata-runtime.contract";
import type { MetadataBindingContractWire } from "./metadata-studio.contract";
import type { MetadataUiBindingProjectionWire } from "./metadata-ui-binding.projection";
import {
  resolveMetadataKnowledgeHelpTextFromAtomRef,
  resolveMetadataKnowledgeLabelFromAtomRef,
  resolveMetadataKnowledgeLabelFromFieldKey,
  resolveMetadataPresentationLabelFromAtomRef,
} from "./resolve-metadata-knowledge-label.server";

export type {
  MetadataBindingSlotHydrationTargetWire,
  MetadataBindingSlotHydrationWire,
} from "./metadata-binding-slot-hydration.contract";

export {
  AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE,
  METADATA_BINDING_HELP_SLOT_SUFFIX,
  METADATA_BINDING_SLOT_DOM_ATTRIBUTE,
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
  runtime: MetadataRuntimeContext,
  labelAtomRef?: string
): string {
  const runtimeValue = resolveRuntimeBackedPreviewValue(fieldKey, runtime);

  if (runtimeValue !== undefined && runtimeValue.length > 0) {
    return runtimeValue;
  }

  const knowledgeLabelFromRef =
    resolveMetadataKnowledgeLabelFromAtomRef(labelAtomRef);

  if (knowledgeLabelFromRef !== undefined) {
    return knowledgeLabelFromRef;
  }

  const presentationLabelFromRef =
    resolveMetadataPresentationLabelFromAtomRef(labelAtomRef);

  if (presentationLabelFromRef !== undefined) {
    return presentationLabelFromRef;
  }

  const knowledgeLabelFromFieldKey =
    resolveMetadataKnowledgeLabelFromFieldKey(fieldKey);

  if (knowledgeLabelFromFieldKey !== undefined) {
    return knowledgeLabelFromFieldKey;
  }

  return `[preview:${fieldKey}]`;
}

function buildFieldHelpTextTarget(
  field: MetadataBindingContractWire["fields"][number]
): MetadataBindingSlotHydrationTargetWire | undefined {
  const helpText = resolveMetadataKnowledgeHelpTextFromAtomRef(
    field.helpTextAtomRef
  );

  if (helpText === undefined) {
    return;
  }

  return {
    domAttribute: METADATA_BINDING_SLOT_DOM_ATTRIBUTE,
    slotId: `${field.slotId}${METADATA_BINDING_HELP_SLOT_SUFFIX}`,
    fieldKey: `${field.fieldKey}.helpText`,
    presentationKind: "help-text",
    value: helpText,
  };
}

/** Maps binding projection + runtime into wire-safe slot hydration targets (R1c-2). */
export function hydrateMetadataBindingSlots(
  input: HydrateMetadataBindingSlotsInput
): MetadataBindingSlotHydrationWire {
  const { binding, projection, runtime } = input;

  const fieldTargets: MetadataBindingSlotHydrationTargetWire[] = [];

  for (const field of binding.fields) {
    fieldTargets.push({
      domAttribute: METADATA_BINDING_SLOT_DOM_ATTRIBUTE,
      slotId: field.slotId,
      fieldKey: field.fieldKey,
      presentationKind: field.presentationKind,
      value: resolveSlotPreviewValue(
        field.fieldKey,
        runtime,
        field.labelAtomRef
      ),
    });

    const helpTarget = buildFieldHelpTextTarget(field);

    if (helpTarget !== undefined) {
      fieldTargets.push(helpTarget);
    }
  }

  const tableColumnTargets: MetadataBindingSlotHydrationTargetWire[] =
    binding.tableColumns?.map((column) => ({
      domAttribute: METADATA_BINDING_SLOT_DOM_ATTRIBUTE,
      slotId: column.slotId,
      fieldKey: column.columnKey,
      value: resolveSlotPreviewValue(
        column.columnKey,
        runtime,
        column.labelAtomRef
      ),
    })) ?? [];

  const stateTemplateTargets: MetadataBindingSlotHydrationTargetWire[] =
    binding.stateTemplates?.map((template) => ({
      domAttribute: METADATA_BINDING_SLOT_DOM_ATTRIBUTE,
      slotId: template.slotId,
      presentationKind: "state-message",
      value:
        resolveMetadataKnowledgeLabelFromAtomRef(template.messageAtomRef) ??
        resolveMetadataPresentationLabelFromAtomRef(template.messageAtomRef) ??
        `[state:${template.stateKind}]`,
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
