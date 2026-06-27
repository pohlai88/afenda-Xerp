import type {
  DocsFeatureManifest,
  FeatureCopyOverlay,
  FeatureCopyOverlayEntry,
} from "@/lib/docs-feature-manifest.contract";
import { resolveDocsFeatureCopy } from "@/lib/i18n/resolve-docs-locale-messages";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";

export function listFeatureCopyLocales(): readonly DocsLocale[] {
  return docsLocales;
}

export function resolveFeatureCopyForLocale(
  locale: DocsLocale
): FeatureCopyOverlay {
  return resolveDocsFeatureCopy(locale);
}

export function resolveCasualManifestIdFromContentPath(
  contentRelativePath: string
): string | null {
  const normalized = contentRelativePath.replace(/\\/g, "/");
  const moduleMatch = normalized.match(/use-erp\/modules\/([^/]+)\.mdx$/);
  if (moduleMatch?.[1] && moduleMatch[1] !== "index") {
    return moduleMatch[1];
  }

  if (normalized.endsWith("use-erp/auth-lanes.mdx")) {
    return "auth-lanes-page";
  }

  return null;
}

export function hasLocaleOverlaySummaryForCasualPage(input: {
  readonly locale: DocsLocale;
  readonly contentRelativePath: string;
}): boolean {
  if (input.locale === docsDefaultLocale) {
    return true;
  }

  const featureCopy = resolveFeatureCopyForLocale(input.locale);
  const manifestId = resolveCasualManifestIdFromContentPath(
    input.contentRelativePath
  );

  if (!manifestId) {
    return false;
  }

  if (manifestId === "auth-lanes-page") {
    return Object.keys(featureCopy).some(
      (id) => id.startsWith("auth-lane-") && Boolean(featureCopy[id]?.summary)
    );
  }

  return Boolean(featureCopy[manifestId]?.summary);
}

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
