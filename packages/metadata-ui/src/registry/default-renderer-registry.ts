import { createMetadataRendererRegistry } from "./metadata-renderer-registry.js";
import { actionRenderer } from "../renderers/action-renderer.js";
import { auditRenderer } from "../renderers/audit-renderer.js";
import { chartRenderer } from "../renderers/chart-renderer.js";
import { detailRenderer } from "../renderers/detail-renderer.js";
import { formRenderer } from "../renderers/form-renderer.js";
import { listRenderer } from "../renderers/list-renderer.js";
import { statRenderer } from "../renderers/stat-renderer.js";

export const defaultMetadataRenderers = [
  listRenderer,
  statRenderer,
  chartRenderer,
  formRenderer,
  detailRenderer,
  auditRenderer,
  actionRenderer,
] as const;

export function createDefaultMetadataRendererRegistry() {
  return createMetadataRendererRegistry(defaultMetadataRenderers);
}

export const defaultMetadataRendererRegistry =
  createDefaultMetadataRendererRegistry();
