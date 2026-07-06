"use client";

import { resolveStudioBlockComponent } from "@/lib/metadata/resolve-studio-block-component.client";
import { useLayoutEffect, useRef } from "react";

import type { MetadataBindingSlotHydrationWire } from "@/lib/metadata/metadata-binding-slot-hydration.contract";

export interface MetadataBindingSlotHydrationPreviewProps {
  readonly blockIdOverride?: string;
  readonly slotHydration: MetadataBindingSlotHydrationWire;
}

function applySlotHydrationTargets(
  root: HTMLElement,
  slotHydration: MetadataBindingSlotHydrationWire
): void {
  for (const target of slotHydration.slotTargets) {
    const selector = `[${target.domAttribute}="${CSS.escape(target.slotId)}"]`;
    const element = root.querySelector(selector);

    if (element === null) {
      continue;
    }

    if (element.children.length === 0) {
      element.textContent = target.value;
      continue;
    }

    const firstSpan = element.querySelector(":scope > span");

    if (firstSpan instanceof HTMLElement) {
      firstSpan.textContent = target.value;
      continue;
    }

    element.textContent = target.value;
  }
}

/** Renders a PAS-006 block and applies runtime slot hydration to `data-afenda-slot` targets. */
export function MetadataBindingSlotHydrationPreview({
  blockIdOverride,
  slotHydration,
}: MetadataBindingSlotHydrationPreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const blockId = blockIdOverride ?? slotHydration.blockId;
  const BlockComponent = resolveStudioBlockComponent(blockId);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (root === null) {
      return;
    }

    applySlotHydrationTargets(root, slotHydration);
  }, [slotHydration]);

  if (BlockComponent === undefined) {
    return (
      <p className="text-muted-foreground text-sm">
        Block `{slotHydration.blockId}` is not registered for live preview.
      </p>
    );
  }

  return (
    <div data-metadata-block-preview={blockId} ref={rootRef}>
      <BlockComponent />
    </div>
  );
}
