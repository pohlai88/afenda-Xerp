/**
 * PAS-006D P06-008-R1 — generate metadata bindings from block data contracts.
 */

import type { BlockDataFieldKind } from "../meta-contracts/block-data.contract.js";
import type {
  MetadataBindingContractWire,
  MetadataBindingFieldPresentationKind,
} from "../meta-contracts/metadata-binding.contract.js";
import type { SurfaceTemplateClass } from "../meta-contracts/surface-template.contract.js";
import {
  BLOCK_DATA_CONTRACT_REGISTRY,
  getBlockSlotsForBlockId,
} from "./block-slot.registry.js";
import { resolveMetadataBindingModuleAssignment } from "./metadata-binding-module-assignment.js";
import { isMetadataBindingWaivedBlockId } from "./metadata-binding-waiver.registry.js";

function mapFieldKindToPresentationKind(
  kind: BlockDataFieldKind
): MetadataBindingFieldPresentationKind {
  switch (kind) {
    case "boolean":
      return "checkbox";
    case "password":
    case "email":
      return "text";
    case "text":
    case "number":
    case "date":
    case "select":
    case "readonly":
      return kind;
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

function resolveSurfaceTemplateClass(blockId: string): SurfaceTemplateClass {
  if (blockId.startsWith("account-settings-")) {
    return "settings";
  }

  if (
    blockId.startsWith("error-access-denied-page-") ||
    blockId.startsWith("error-authentication-page-") ||
    blockId.startsWith("forgot-password-") ||
    blockId.startsWith("invite-") ||
    blockId.startsWith("login-page-") ||
    blockId.startsWith("mfa-") ||
    blockId.startsWith("error-oauth-page-") ||
    blockId.startsWith("otp-page-") ||
    blockId.startsWith("passkey-") ||
    blockId.startsWith("register-page-") ||
    blockId.startsWith("reset-password-") ||
    blockId.startsWith("security-review-page-") ||
    blockId.startsWith("error-session-expired-page-") ||
    blockId.startsWith("sso-") ||
    blockId.startsWith("verify-email-")
  ) {
    return "form";
  }

  if (blockId.startsWith("datatable-")) {
    return "table";
  }

  if (
    blockId.startsWith("statistics-") ||
    blockId.startsWith("widget-") ||
    blockId.startsWith("chart-") ||
    blockId.startsWith("hero-")
  ) {
    return "dashboard";
  }

  if (blockId.startsWith("dashboard-dialog-")) {
    return "form";
  }

  return "dashboard";
}

function buildBindingFromDataContract(
  blockId: string
): MetadataBindingContractWire | undefined {
  const dataContract = BLOCK_DATA_CONTRACT_REGISTRY.find(
    (entry) => entry.blockId === blockId
  );

  if (dataContract === undefined) {
    return;
  }

  const fields = dataContract.fields
    .filter(
      (field): field is typeof field & { labelAtomRef: string } =>
        typeof field.labelAtomRef === "string" && field.labelAtomRef.length > 0
    )
    .map((field) => ({
      fieldKey: field.fieldKey,
      slotId: field.slotId,
      presentationKind: mapFieldKindToPresentationKind(field.kind),
      labelAtomRef: field.labelAtomRef,
      ...(field.requiredDisplay === undefined
        ? {}
        : { requiredDisplay: field.requiredDisplay }),
    }));

  if (fields.length === 0) {
    return;
  }

  const moduleAssignment = resolveMetadataBindingModuleAssignment(blockId);

  return {
    blockId,
    metadataBindingId: `metadata-binding.${blockId}`,
    fields,
    surfaceTemplateClass: resolveSurfaceTemplateClass(blockId),
    ...moduleAssignment,
  } satisfies MetadataBindingContractWire;
}

/** Builds metadata bindings from BLOCK_DATA_CONTRACT_REGISTRY; skips waived blockIds. */
export function buildMetadataBindingFromDataContracts(): readonly MetadataBindingContractWire[] {
  const bindings: MetadataBindingContractWire[] = [];

  for (const contract of BLOCK_DATA_CONTRACT_REGISTRY) {
    if (isMetadataBindingWaivedBlockId(contract.blockId)) {
      continue;
    }

    const binding = buildBindingFromDataContract(contract.blockId);

    if (binding === undefined) {
      continue;
    }

    const slotIds = new Set(
      getBlockSlotsForBlockId(contract.blockId).map((slot) => slot.slotId)
    );

    const invalidSlot = binding.fields.find(
      (field) => !slotIds.has(field.slotId)
    );

    if (invalidSlot !== undefined) {
      throw new Error(
        `metadata binding field slotId ${invalidSlot.slotId} is not declared for block ${contract.blockId}`
      );
    }

    bindings.push(binding);
  }

  return bindings;
}
