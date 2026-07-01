"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

import { AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE } from "../meta-contracts/block-slot-dom-marker.contract.js";

export interface MetadataSlotHydrationLabTargetWire {
  readonly slotId: string;
  readonly value: string;
}

export interface MetadataSlotHydrationLabWire {
  readonly blockId: string;
  readonly slotTargets: readonly MetadataSlotHydrationLabTargetWire[];
}

function applyLabSlotHydrationTargets(
  root: HTMLElement,
  slotTargets: readonly MetadataSlotHydrationLabTargetWire[]
): void {
  for (const target of slotTargets) {
    const selector = `[${AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE}="${CSS.escape(target.slotId)}"]`;
    const element = root.querySelector(selector);

    if (element === null) {
      continue;
    }

    const nestedInput = element.querySelector("input, textarea");

    if (
      nestedInput instanceof HTMLInputElement ||
      nestedInput instanceof HTMLTextAreaElement
    ) {
      nestedInput.value = target.value;
      continue;
    }

    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      element.value = target.value;
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

export interface MetadataSlotHydrationLabProps {
  readonly children: ReactNode;
  readonly slotHydration: MetadataSlotHydrationLabWire;
}

/** Applies lab fixture values to `data-afenda-slot` markers after mount (Storybook only). */
export function MetadataSlotHydrationLab({
  children,
  slotHydration,
}: MetadataSlotHydrationLabProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (root === null) {
      return;
    }

    applyLabSlotHydrationTargets(root, slotHydration.slotTargets);
  }, [slotHydration]);

  return (
    <div data-metadata-slot-hydration-lab={slotHydration.blockId} ref={rootRef}>
      {children}
    </div>
  );
}
