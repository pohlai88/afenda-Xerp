import type { DocsFeatureManifest } from "@/lib/docs-feature-manifest.contract";
import type { FeatureCopyOverlay } from "@/lib/docs-feature-manifest.contract";
import { resolveFeatureCopyField } from "@/lib/docs-feature-copy";
import { listAuthLaneManifests, listModuleManifests } from "@/lib/docs-feature-manifest";

function jsxString(value: string): string {
  return JSON.stringify(value);
}

function yamlStringList(values: readonly string[]): string {
  if (values.length === 0) {
    return "[]";
  }
  return `\n${values.map((value) => `  - ${value}`).join("\n")}`;
}

function renderModuleCasualBody(
  manifest: DocsFeatureManifest,
  overlay?: FeatureCopyOverlay
): string {
  const entitlementLines =
    manifest.entitlements.length > 0
      ? manifest.entitlements.map((item) => `- \`${item}\``).join("\n")
      : "- No extra entitlements required for baseline access.";

  const whenToUse = resolveFeatureCopyField(
    overlay,
    manifest.id,
    "whenToUse",
    `Open **${manifest.title}** when your daily work happens in this ERP area — for example reviewing dashboards, records, or transactions your role allows.`
  );

  const calloutTitle = resolveFeatureCopyField(
    overlay,
    manifest.id,
    "adminCallout",
    "Tenant administrator"
  );

  return `import { Callout } from "fumadocs-ui/components/callout";

## Overview

${manifest.summary}

## When to use

${whenToUse}

## Product routes

${manifest.productRoutes.map((route) => `- \`${route}\` — module landing in the ERP shell`).join("\n")}

## Access requirements

**Permission:** \`${manifest.permissionKeys[0] ?? "—"}\`

${entitlementLines}

## Need admin help?

<Callout type="info" title=${JSON.stringify(calloutTitle)}>

If this module is missing from your navigation, ask an admin to confirm entitlements and the permission above. Integrators can review the [developer evidence](/docs/integrate/generated/evidence/${manifest.id}) page.

</Callout>`;
}

export function renderCasualModulePageMdx(
  manifest: DocsFeatureManifest,
  overlay?: FeatureCopyOverlay
): string {
  return `---
title: ${jsxString(manifest.title)}
description: ${jsxString(manifest.summary)}
audience: ${manifest.audience}
relatedManifestId: ${manifest.id}
relatedRoutes:${yamlStringList(manifest.productRoutes)}
catalogBindings:${yamlStringList(manifest.catalogSources)}
---

${renderModuleCasualBody(manifest, overlay)}
`;
}

export function renderCasualModulesIndexMdx(
  manifests: readonly DocsFeatureManifest[]
): string {
  const modules = listModuleManifests([...manifests]);
  const cards = modules
    .map(
      (module) =>
        `  <Card title=${jsxString(module.title)} href=${jsxString(`./${module.id}`)} description=${jsxString(module.summary)} />`
    )
    .join("\n");

  return `---
title: "ERP modules"
description: "Casual guides for governed Afenda ERP modules — synced from the product catalog."
audience: end-user
catalogBindings:
  - modules
---

## Overview

Browse governed ERP modules your tenant may expose after sign-in. Each page explains what the module is for, which route to open, and what to ask an administrator if access is blocked.

<Cards>
${cards}
</Cards>
`;
}

export function renderCasualAuthLanesMdx(
  manifests: readonly DocsFeatureManifest[],
  overlay?: FeatureCopyOverlay
): string {
  const lanes = listAuthLaneManifests([...manifests]);
  const laneSections = lanes
    .map((lane) => {
      const routes = lane.productRoutes
        .map((route) => `- \`${route}\``)
        .join("\n");
      const summary = resolveFeatureCopyField(
        overlay,
        lane.id,
        "summary",
        lane.summary
      );
      return `### ${lane.title}

${summary}

${routes}`;
    })
    .join("\n\n");

  return `---
title: "Authentication routes by lane"
description: "Sign-in, MFA, invites, and workspace selection URLs grouped for end users."
audience: end-user
catalogBindings:
  - auth-routes
relatedRoutes:
  - /sign-in
  - /mfa
  - /workspace/select
---

import { Callout } from "fumadocs-ui/components/callout";

## Overview

Afenda ERP groups authentication URLs into **lanes** — access, security, verify, recover, invite, and workspace. Use this map when you need the exact path for sign-in help or when pairing with the [Sign in guide](/docs/use-erp/sign-in).

<Callout type="info" title="Tenant URL">

Always use your organization's tenant host. Paths below are suffixes such as \`/sign-in\` on that host.

</Callout>

## Lanes

${laneSections}
`;
}

export function renderCasualAdminSectionsMdx(
  manifests: readonly DocsFeatureManifest[],
  overlay?: FeatureCopyOverlay
): string {
  const sections = manifests.filter(
    (manifest) => manifest.kind === "admin-section"
  );
  const adminCallout = resolveFeatureCopyField(
    overlay,
    "admin-sections",
    "adminCallout",
    "Tenant administrator"
  );
  const rows = sections
    .map((section) => {
      const route = section.productRoutes[0] ?? "—";
      const permission = section.permissionKeys[0] ?? "—";
      const summary = resolveFeatureCopyField(
        overlay,
        section.id,
        "summary",
        section.summary
      );
      return `| ${section.title} | \`${route}\` | \`${permission}\` | ${summary} |`;
    })
    .join("\n");

  return `---
title: "System Admin areas"
description: "Tenant administration sections with routes and read permissions — synced from the product catalog."
audience: tenant-admin
catalogBindings:
  - system-admin
---

import { Callout } from "fumadocs-ui/components/callout";

## Overview

System Admin is where tenant administrators manage users, memberships, roles, permissions, and audit visibility. This page lists governed admin areas and the read permission each surface expects.

## When to use

Use this map when onboarding a new tenant admin or verifying why a navigation item is hidden. Pair with [Users and memberships](/docs/configure-tenant/users-and-memberships) and [Roles and permissions](/docs/configure-tenant/roles-and-permissions).

## Admin areas

| Area | Route | Read permission | Summary |
| --- | --- | --- | --- |
${rows}

<Callout type="info" title=${JSON.stringify(adminCallout)}>

For the full permission matrix, see [Permissions reference](/docs/configure-tenant/generated/permissions).

</Callout>
`;
}

const USE_ERP_INDEX_CARDS_START =
  "{/* feature-evidence:cards:start — generated by sync:product-docs */}";
const USE_ERP_INDEX_CARDS_END =
  "{/* feature-evidence:cards:end */}";

export function renderUseErpIndexCardsBlock(
  manifests: readonly DocsFeatureManifest[]
): string {
  const modules = listModuleManifests([...manifests]);
  const moduleCards = modules
    .map(
      (module) =>
        `  <Card title=${jsxString(module.title)} href=${jsxString(`./modules/${module.id}`)} description=${jsxString(module.summary)} />`
    )
    .join("\n");

  return `${USE_ERP_INDEX_CARDS_START}
<Cards>
  <Card
    title="Sign in to Afenda ERP"
    href="./sign-in"
    description="Tenant URL, credentials, MFA, workspace selection, and the synced auth route catalog."
  />
  <Card
    title="Authentication routes by lane"
    href="./auth-lanes"
    description="Sign-in, MFA, invites, and workspace URLs grouped for everyday troubleshooting."
  />
  <Card
    title="ERP modules"
    href="./modules"
    description="Casual module guides synced from the product catalog."
  />
${moduleCards}
</Cards>
${USE_ERP_INDEX_CARDS_END}`;
}

export function patchUseErpIndexMdx(
  existingSource: string,
  manifests: readonly DocsFeatureManifest[]
): string {
  const cardsBlock = renderUseErpIndexCardsBlock(manifests);
  const startIndex = existingSource.indexOf(USE_ERP_INDEX_CARDS_START);
  const endIndex = existingSource.indexOf(USE_ERP_INDEX_CARDS_END);

  if (startIndex >= 0 && endIndex > startIndex) {
    const endMarkerLength = USE_ERP_INDEX_CARDS_END.length;
    return `${existingSource.slice(0, startIndex)}${cardsBlock}${existingSource.slice(endIndex + endMarkerLength)}`;
  }

  return existingSource.replace(
    "<Cards>",
    `${cardsBlock}\n\n<!-- legacy cards replaced above -->\n<Cards>`
  );
}

export {
  USE_ERP_INDEX_CARDS_END,
  USE_ERP_INDEX_CARDS_START,
};
