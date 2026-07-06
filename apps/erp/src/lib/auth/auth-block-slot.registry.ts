/**
 * ERP-local auth block slot registry for WCAG contract tests (B-07-ext).
 * Maps auth-adjacent block ids to declared slot ids until v2 metadata slot bridge lands.
 */

import {
  AUTH_ADJACENT_AUTH_BLOCK_IDS,
  AUTH_ADJACENT_WCAG_REQUIRED_SLOTS,
  type AuthAdjacentAuthBlockId,
} from "@/lib/auth/auth-wcag-adjacent.registry";

export interface AuthBlockSlotEntry {
  readonly slotId: string;
  readonly role: "content";
  readonly label: string;
}

function buildSlotsForBlock(
  blockId: AuthAdjacentAuthBlockId
): readonly AuthBlockSlotEntry[] {
  const requiredSlots = AUTH_ADJACENT_WCAG_REQUIRED_SLOTS[blockId] ?? [];

  return [
    {
      slotId: `${blockId}.content`,
      role: "content",
      label: "Page root",
    },
    ...requiredSlots.map((slotId) => ({
      slotId,
      role: "content" as const,
      label: slotId,
    })),
  ];
}

const AUTH_BLOCK_SLOT_REGISTRY = Object.fromEntries(
  AUTH_ADJACENT_AUTH_BLOCK_IDS.map((blockId) => [
    blockId,
    buildSlotsForBlock(blockId),
  ])
) as Record<AuthAdjacentAuthBlockId, readonly AuthBlockSlotEntry[]>;

export function getAuthBlockSlotsForBlockId(
  blockId: string
): readonly AuthBlockSlotEntry[] {
  if (!isAuthAdjacentAuthBlockId(blockId)) {
    return [];
  }

  return AUTH_BLOCK_SLOT_REGISTRY[blockId];
}

function isAuthAdjacentAuthBlockId(
  blockId: string
): blockId is AuthAdjacentAuthBlockId {
  return (AUTH_ADJACENT_AUTH_BLOCK_IDS as readonly string[]).includes(blockId);
}
