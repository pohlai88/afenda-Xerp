export type LabCacheKind =
  | "lab-health-revalidate"
  | "operator-request-dynamic"
  | "static-lab-index";

export interface LabCachePolicyRule {
  allowsCrossRequestCache: boolean;
  allowsUseCacheDirective: boolean;
  dedupeStrategy: "none" | "react-cache";
  description: string;
  httpCache: "force-dynamic" | "no-store" | "revalidate-30";
}

export const labCachePolicyRules = {
  "lab-health-revalidate": {
    allowsCrossRequestCache: true,
    allowsUseCacheDirective: false,
    dedupeStrategy: "none",
    description:
      "Lab health Route Handler may revalidate every 30 seconds; no tenant or operator data.",
    httpCache: "revalidate-30",
  },
  "operator-request-dynamic": {
    allowsCrossRequestCache: false,
    allowsUseCacheDirective: false,
    dedupeStrategy: "react-cache",
    description:
      "Operator routes stay request-dynamic under (lab)/layout; loaders dedupe per request only via React.cache().",
    httpCache: "force-dynamic",
  },
  "static-lab-index": {
    allowsCrossRequestCache: false,
    allowsUseCacheDirective: false,
    dedupeStrategy: "none",
    description:
      "Root route-lab index remains a static doctrine surface without shared loader cache.",
    httpCache: "no-store",
  },
} as const satisfies Record<LabCacheKind, LabCachePolicyRule>;

export const LAB_OPERATOR_LAYOUT_DYNAMIC = "force-dynamic" as const;

export const LAB_FORBIDDEN_CACHE_DIRECTIVES = ["use cache"] as const;
