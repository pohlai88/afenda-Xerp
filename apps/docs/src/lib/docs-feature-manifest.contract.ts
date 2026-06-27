import { z } from "zod";
import {
  CATALOG_IDS,
  type CatalogId,
  type TaskArticleAudience,
} from "@/lib/docs-product-catalog.contract";

/** Promote coverage warnings to CI errors when score meets or exceeds this threshold. */
export const DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD = 0.8 as const;

export const docsFeatureApiOperationSchema = z.object({
  id: z.string().min(1),
  method: z.enum(["get", "post", "put", "delete", "patch"]),
  path: z.string().min(1),
  permission: z.string().optional(),
  docSlug: z.string().min(1),
});

export type DocsFeatureApiOperation = z.infer<
  typeof docsFeatureApiOperationSchema
>;

export const DOCS_FEATURE_MANIFEST_KINDS = [
  "module",
  "auth-lane",
  "admin-section",
  "platform-api",
] as const;

export type DocsFeatureManifestKind =
  (typeof DOCS_FEATURE_MANIFEST_KINDS)[number];

export const docsFeatureManifestSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(DOCS_FEATURE_MANIFEST_KINDS),
  title: z.string().min(1),
  audience: z.enum([
    "end-user",
    "tenant-admin",
    "tenant-devops",
    "integrator",
  ]),
  summary: z.string().min(1),
  productRoutes: z.array(z.string().min(1)),
  permissionKeys: z.array(z.string()),
  entitlements: z.array(z.string()),
  catalogSources: z.array(z.enum(CATALOG_IDS)),
  openapiTag: z.string().min(1).optional(),
  apiOperations: z.array(docsFeatureApiOperationSchema).optional(),
  suppressCasual: z.boolean().optional(),
});

export type DocsFeatureManifest = z.infer<typeof docsFeatureManifestSchema>;

export interface DocsFeatureCoverageScore {
  readonly score: number;
  readonly totalChecks: number;
  readonly failedChecks: number;
}

export interface DocsFeatureEvidenceGraph {
  readonly generated: true;
  readonly version: 2;
  readonly exportedAt: string;
  readonly manifests: readonly DocsFeatureManifest[];
  readonly coverageWarnings: readonly string[];
  readonly coverageErrors: readonly string[];
  readonly coverageScore: number;
  readonly coverageThreshold: number;
  readonly openApiBindingWarnings: readonly string[];
}

export type FeatureCopyOverlayEntry = Readonly<{
  readonly summary?: string;
  readonly title?: string;
  readonly whenToUse?: string;
  readonly adminCallout?: string;
}>;

export type FeatureCopyOverlay = Readonly<
  Record<string, FeatureCopyOverlayEntry>
>;

export const featureManifestOverrideEntrySchema = z.object({
  extraProductRoutes: z.array(z.string().min(1)).optional(),
  suppressCasual: z.boolean().optional(),
  audience: z
    .enum(["end-user", "tenant-admin", "tenant-devops", "integrator"])
    .optional(),
  summary: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
});

export type FeatureManifestOverrideEntry = z.infer<
  typeof featureManifestOverrideEntrySchema
>;

export type FeatureManifestOverrides = Readonly<
  Record<string, FeatureManifestOverrideEntry>
>;

export interface DocsFeatureManifestInput {
  readonly modules: Readonly<{
    readonly modules: readonly {
      readonly moduleId: string;
      readonly label: string;
      readonly routePath: string;
      readonly permissionKey: string;
      readonly requiredEntitlements: readonly string[];
      readonly optionalCapabilities: readonly string[];
    }[];
  }>;
  readonly authRoutes: Readonly<{
    readonly lanes: readonly string[];
    readonly routes: readonly { readonly path: string; readonly lane: string }[];
  }>;
  readonly systemAdmin: Readonly<{
    readonly sections: readonly {
      readonly sectionId: string;
      readonly label: string;
      readonly href: string;
      readonly readPermissionKey: string;
    }[];
  }>;
  readonly overlay?: FeatureCopyOverlay;
}

export type DocsFeatureAudience = Extract<
  TaskArticleAudience,
  "end-user" | "tenant-admin" | "tenant-devops" | "integrator"
>;

export function isCatalogId(value: string): value is CatalogId {
  return (CATALOG_IDS as readonly string[]).includes(value);
}
