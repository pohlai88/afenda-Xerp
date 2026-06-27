import { isGeneratedDocsMdx } from "@/lib/docs-writing-conventions";

export interface DocsContentPolicyResult {
  readonly violations: readonly string[];
}

interface DocsContentPolicyRule {
  readonly id: string;
  readonly matches: (source: string, filePath: string) => boolean;
  readonly requiredHeadings: readonly string[];
}

const GENERATED_MARKER = "DO NOT EDIT";

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

function extractLevel2Headings(source: string): Set<string> {
  const headings = new Set<string>();
  for (const line of source.split("\n")) {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (match?.[1]) {
      headings.add(match[1].trim());
    }
  }
  return headings;
}

const GENERATED_POLICIES: readonly DocsContentPolicyRule[] = [
  {
    id: "developer-evidence",
    matches: (source, filePath) =>
      source.includes("docsType: generated-evidence") &&
      !normalizePath(filePath).endsWith("/integrate/generated/evidence/index.mdx"),
    requiredHeadings: [
      "Overview",
      "Source contract",
      "Runtime surfaces",
      "Traceability",
    ],
  },
  {
    id: "casual-module",
    matches: (source, filePath) => {
      const normalized = normalizePath(filePath);
      return (
        source.includes(GENERATED_MARKER) &&
        normalized.includes("/use-erp/modules/") &&
        !normalized.endsWith("/modules/index.mdx") &&
        source.includes("audience: end-user")
      );
    },
    requiredHeadings: [
      "Overview",
      "When to use",
      "Product routes",
      "Access requirements",
      "Need admin help?",
    ],
  },
  {
    id: "casual-auth-lanes",
    matches: (_source, filePath) =>
      normalizePath(filePath).endsWith("/use-erp/auth-lanes.mdx"),
    requiredHeadings: ["Overview", "Lanes"],
  },
  {
    id: "casual-admin-sections",
    matches: (_source, filePath) =>
      normalizePath(filePath).endsWith(
        "/configure-tenant/generated/admin-sections.mdx"
      ),
    requiredHeadings: ["Overview", "When to use", "Admin areas"],
  },
] as const;

export function validateGeneratedMdxPolicy(
  source: string,
  filePath: string
): DocsContentPolicyResult {
  if (!isGeneratedDocsMdx(source)) {
    return { violations: [] };
  }

  const headings = extractLevel2Headings(source);
  const violations: string[] = [];

  for (const policy of GENERATED_POLICIES) {
    if (!policy.matches(source, filePath)) {
      continue;
    }

    for (const required of policy.requiredHeadings) {
      if (!headings.has(required)) {
        violations.push(
          `${filePath}: missing required heading "## ${required}" (${policy.id}).`
        );
      }
    }
  }

  return { violations: violations.sort() };
}
