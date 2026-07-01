"use client";

/**
 * PAS-006D — maps MCP block ids to live React block components (metadata-workspace preview).
 */

import type { ComponentType } from "react";

import LoginPage04Block from "../components-auth-shell/login-page-04/login-page-04.js";
import AccountSettings01Block from "../components-layouts/account-settings-01/account-settings-01.js";
import HeroSection01Block from "../components-layouts/hero-section-01/hero-section-01.js";
import { FLAT_BLOCK_STORY_REGISTRY } from "../storybook/block-flat-story.registry.js";
import {
  MCP_SEED_BLOCK_IDS,
  type McpSeedBlockId,
} from "./mcp-seed-block-manifest.js";
import { SURFACE_TEMPLATE_REGISTRY } from "./surface-template.registry.js";

export type StudioBlockComponent = ComponentType<Record<string, never>>;

function buildFlatBlockPreviewRegistry(): Record<
  McpSeedBlockId,
  StudioBlockComponent
> {
  const entries = {} as Record<McpSeedBlockId, StudioBlockComponent>;

  for (const { slug, sample } of FLAT_BLOCK_STORY_REGISTRY) {
    entries[slug as McpSeedBlockId] = sample as StudioBlockComponent;
  }

  return entries;
}

export const STUDIO_BLOCK_COMPONENT_REGISTRY = {
  ...buildFlatBlockPreviewRegistry(),
  "account-settings-01": AccountSettings01Block,
  "hero-section-01": HeroSection01Block,
  "login-page-04": LoginPage04Block,
} as const satisfies Record<McpSeedBlockId, StudioBlockComponent>;

export type StudioBlockComponentId =
  keyof typeof STUDIO_BLOCK_COMPONENT_REGISTRY;

export function isStudioBlockComponentId(
  blockId: string
): blockId is StudioBlockComponentId {
  return blockId in STUDIO_BLOCK_COMPONENT_REGISTRY;
}

export function resolveStudioBlockComponent(
  blockId: string
): StudioBlockComponent | undefined {
  if (!isStudioBlockComponentId(blockId)) {
    return;
  }

  return STUDIO_BLOCK_COMPONENT_REGISTRY[blockId];
}

/** Surface-template block ids that must resolve for template-bound metadata preview. */
export function listSurfaceTemplateBlockComponentIds(): readonly string[] {
  const blockIds = new Set<string>();

  for (const template of SURFACE_TEMPLATE_REGISTRY) {
    for (const binding of template.blockBindings) {
      blockIds.add(binding.blockId);
    }
  }

  return [...blockIds];
}

export function assertSurfaceTemplateBlockComponentsRegistered(): readonly string[] {
  const missing: string[] = [];

  for (const blockId of listSurfaceTemplateBlockComponentIds()) {
    if (!isStudioBlockComponentId(blockId)) {
      missing.push(blockId);
    }
  }

  return missing;
}

/** MCP seed block ids registered for metadata-workspace live preview. */
export function listStudioBlockPreviewIds(): readonly McpSeedBlockId[] {
  return MCP_SEED_BLOCK_IDS;
}

export function assertStudioBlockPreviewComponentsRegistered(): readonly string[] {
  const missing: string[] = [];

  for (const blockId of listStudioBlockPreviewIds()) {
    if (!isStudioBlockComponentId(blockId)) {
      missing.push(blockId);
    }
  }

  return missing;
}
