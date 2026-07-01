/**
 * PAS-006D — maps surface-template block ids to live React block components.
 */

import type { ComponentType } from "react";

import AccountSettings01Block from "../components-layouts/account-settings-01/account-settings-01.js";
import DatatableInvoiceBlock from "../components-layouts/datatable-invoice.js";
import HeroSection01Block from "../components-layouts/hero-section-01/hero-section-01.js";
import LoginPage04Block from "../components-auth-shell/login-page-04/login-page-04.js";
import StatisticsCard01Block from "../components-layouts/statistics-card-01.js";
import { SURFACE_TEMPLATE_REGISTRY } from "./surface-template.registry.js";

export type StudioBlockComponent = ComponentType<Record<string, never>>;

const STUDIO_BLOCK_PREVIEW_SAMPLE_INVOICE_ROWS = [
  {
    id: "inv_preview_01",
    status: "paid" as const,
    avatar: "",
    fallback: "AC",
    client: "Acme Corp",
    field: "Consulting",
    total: 1200,
    issuedDate: new Date("2026-01-15"),
    balance: 0,
  },
];

function DatatableInvoicePreview() {
  return (
    <DatatableInvoiceBlock data={STUDIO_BLOCK_PREVIEW_SAMPLE_INVOICE_ROWS} />
  );
}

function StatisticsCard01Preview() {
  return (
    <StatisticsCard01Block
      changePercentage="+8.2%"
      icon={<span aria-hidden="true">↑</span>}
      title="Weekly revenue"
      value="$42,500"
    />
  );
}

export const STUDIO_BLOCK_COMPONENT_REGISTRY = {
  "account-settings-01": AccountSettings01Block,
  "datatable-invoice": DatatableInvoicePreview,
  "hero-section-01": HeroSection01Block,
  "login-page-04": LoginPage04Block,
  "statistics-card-01": StatisticsCard01Preview,
} as const satisfies Record<string, StudioBlockComponent>;

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

/** Surface-template block ids that must resolve for metadata workspace live preview. */
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
