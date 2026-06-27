import type {
  DocsFeatureManifest,
  FeatureCopyOverlay,
  FeatureCopyOverlayEntry,
} from "@/lib/docs-feature-manifest.contract";

export function mergeFeatureCopyOverlays(
  base: FeatureCopyOverlay | undefined,
  locale: FeatureCopyOverlay | undefined
): FeatureCopyOverlay {
  if (!base && !locale) {
    return {};
  }

  const ids = new Set([
    ...Object.keys(base ?? {}),
    ...Object.keys(locale ?? {}),
  ]);

  const merged: Record<string, FeatureCopyOverlayEntry> = {};
  for (const id of ids) {
    merged[id] = {
      ...(base?.[id] ?? {}),
      ...(locale?.[id] ?? {}),
    };
  }

  return merged;
}

export function resolveFeatureCopyField(
  overlay: FeatureCopyOverlay | undefined,
  manifestId: string,
  field: keyof FeatureCopyOverlayEntry,
  fallback: string
): string {
  const value = overlay?.[manifestId]?.[field];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function applyFeatureCopyToManifest(
  manifest: DocsFeatureManifest,
  overlay: FeatureCopyOverlay | undefined
): DocsFeatureManifest {
  const entry = overlay?.[manifest.id];
  if (!entry) {
    return manifest;
  }

  return {
    ...manifest,
    title: entry.title ?? manifest.title,
    summary: entry.summary ?? manifest.summary,
  };
}
