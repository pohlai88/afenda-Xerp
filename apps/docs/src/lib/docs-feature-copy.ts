import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  DocsFeatureManifest,
  FeatureCopyOverlay,
  FeatureCopyOverlayEntry,
} from "@/lib/docs-feature-manifest.contract";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";

export function resolveFeatureCopyOverlayFileName(locale: DocsLocale): string {
  return locale === docsDefaultLocale
    ? "feature-copy.overlay.json"
    : `feature-copy.overlay.${locale}.json`;
}

export function resolveFeatureCopyOverlayPath(
  dataDir: string,
  locale: DocsLocale
): string {
  return join(dataDir, resolveFeatureCopyOverlayFileName(locale));
}

function filterOverlayPayload(
  payload: Record<string, unknown>
): FeatureCopyOverlay {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !key.startsWith("_"))
  ) as FeatureCopyOverlay;
}

export function readFeatureCopyOverlayFile(
  dataDir: string,
  locale: DocsLocale
): FeatureCopyOverlay | undefined {
  const path = resolveFeatureCopyOverlayPath(dataDir, locale);
  if (!existsSync(path)) {
    return undefined;
  }

  const payload = JSON.parse(readFileSync(path, "utf8")) as Record<
    string,
    unknown
  >;
  const overlay = filterOverlayPayload(payload);
  return Object.keys(overlay).length > 0 ? overlay : undefined;
}

export function listFeatureCopyOverlayLocales(): readonly DocsLocale[] {
  return docsLocales;
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
  readonly dataDir: string;
  readonly contentRelativePath: string;
}): boolean {
  if (input.locale === docsDefaultLocale) {
    return true;
  }

  const enOverlay = readFeatureCopyOverlayFile(input.dataDir, docsDefaultLocale);
  const localeOverlay = readFeatureCopyOverlayFile(input.dataDir, input.locale);
  const merged = mergeFeatureCopyOverlays(enOverlay, localeOverlay);
  const manifestId = resolveCasualManifestIdFromContentPath(
    input.contentRelativePath
  );

  if (!manifestId) {
    return false;
  }

  if (manifestId === "auth-lanes-page") {
    return Object.keys(merged).some(
      (id) => id.startsWith("auth-lane-") && Boolean(merged[id]?.summary)
    );
  }

  return Boolean(merged[manifestId]?.summary);
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
