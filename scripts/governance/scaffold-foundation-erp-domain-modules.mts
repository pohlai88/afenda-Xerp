#!/usr/bin/env tsx
/**
 * PAS-001B — re-scaffold foundation ERP domain modules (accounting, inventory).
 * Standardizes on scaffold pattern while preserving ADR cross-refs and §4.1.6 quarantine.
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ERP_DOMAIN_FOUNDATION_MODULE_SPECS,
  type ErpDomainFoundationModuleSpec,
} from "./erp-domain-foundation-module-specs.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpDomainRoot = join(repoRoot, "packages/kernel/src/erp-domain");
const UNIFIED_GATE = "pnpm check:erp-domain-delivered-vocabulary" as const;

function slugToUpper(slug: string): string {
  return slug.replace(/-/g, "_").toUpperCase();
}

function slugToPascal(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function vocabConstNameFromFile(file: string): string {
  if (file.endsWith("-status")) {
    return `${file.slice(0, -"-status".length).replace(/-/g, "_").toUpperCase()}_STATUSES`;
  }
  if (file.endsWith("-type")) {
    return `${file.slice(0, -"-type".length).replace(/-/g, "_").toUpperCase()}_TYPES`;
  }
  if (file.endsWith("-method")) {
    return `${file.slice(0, -"-method".length).replace(/-/g, "_").toUpperCase()}_METHODS`;
  }
  if (file.endsWith("-state")) {
    return `${file.slice(0, -"-state".length).replace(/-/g, "_").toUpperCase()}_STATES`;
  }
  return `${file.replace(/-/g, "_").toUpperCase()}S`;
}

function writeFoundationModule(spec: ErpDomainFoundationModuleSpec): number {
  const { slug, slice } = spec;
  const moduleDir = join(erpDomainRoot, slug);
  if (existsSync(moduleDir)) {
    rmSync(moduleDir, { recursive: true, force: true });
  }
  mkdirSync(join(moduleDir, "__tests__"), { recursive: true });

  const upper = slugToUpper(slug);
  const pascal = slugToPascal(slug);
  const prefix = slug;
  let filesWritten = 0;
  const write = (relativePath: string, content: string) => {
    writeFileSync(join(moduleDir, relativePath), content, "utf8");
    filesWritten += 1;
  };

  write(
    `${prefix}-authority.contract.ts`,
    `/**
 * PAS-001B ${slice} · ${spec.authorityAdr} — ${pascal} domain authority (contracts-only).
 */

export const ${upper}_AUTHORITY_PAS = "PAS-001B" as const;

export const ${upper}_AUTHORITY_ADR = "${spec.authorityAdr}" as const;

export const ${upper}_REGISTRY_ID = "${spec.registryId}" as const;

export const ${upper}_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/${slug}" as const;

export const ${upper}_AUTHORITY_FINGERPRINT =
  "${spec.authorityFingerprint}" as const;

export const ${upper}_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type ${pascal}PackageLifecyclePhase =
  (typeof ${upper}_PACKAGE_LIFECYCLE_PHASES)[number];

export const ${upper}_PACKAGE_LIFECYCLE: ${pascal}PackageLifecyclePhase =
  "contracts-only";

export function is${pascal}PackageLifecyclePhase(
  value: string
): value is ${pascal}PackageLifecyclePhase {
  return (${upper}_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(value);
}
`
  );

  const idLines = spec.brandedIds
    .map((entry) => {
      const comment = entry.comment ? `\n/** ${entry.comment} */\n` : "\n";
      return `${comment}export type ${entry.typeName} = Brand<string, "${entry.typeName}">;

export function brand${entry.typeName}(
  value: string | ${entry.typeName}
): ${entry.typeName} {
  return brandTrimRequired(value, "${entry.typeName.charAt(0).toLowerCase()}${entry.typeName.slice(1)}") as ${entry.typeName};
}

export function to${entry.typeName}(value: ${entry.typeName}): string {
  return unbrand(value);
}`;
    })
    .join("\n\n");

  write(
    `${prefix}-id.contract.ts`,
    `import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";

function brandTrimRequired<T extends string>(
  value: string | Brand<string, T>,
  label: string
): Brand<string, T> {
  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(\`\${label} is required.\`);
  }

  return raw as Brand<string, T>;
}

${idLines}
`
  );

  for (const vocab of spec.vocabs) {
    const constName = vocabConstNameFromFile(vocab.file);
    write(
      `${vocab.file}.contract.ts`,
      `export const ${constName} = [
${vocab.values.map((v) => `  "${v}",`).join("\n")}
] as const;

export type ${vocab.type} = (typeof ${constName})[number];

export function is${vocab.type}(value: string): value is ${vocab.type} {
  return (${constName} as readonly string[]).includes(value);
}
`
    );
  }

  write(
    `${prefix}-audit-actions.contract.ts`,
    `export const ${upper}_AUDIT_ACTIONS = [
${spec.auditActions.map((a) => `  "${a}",`).join("\n")}
] as const;

export type ${pascal}AuditAction = (typeof ${upper}_AUDIT_ACTIONS)[number];

export function is${pascal}AuditAction(value: string): value is ${pascal}AuditAction {
  return (${upper}_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parse${pascal}AuditAction(value: string): ${pascal}AuditAction | null {
  return is${pascal}AuditAction(value) ? value : null;
}
`
  );

  if (spec.permissionMode === "accounting") {
    write(
      `${prefix}-permission-vocabulary.contract.ts`,
      `export const ${upper}_PERMISSION_DOMAINS = ["coa", "fiscalPeriod", "journal"] as const;

export type ${pascal}PermissionDomain = (typeof ${upper}_PERMISSION_DOMAINS)[number];

export const ${upper}_PERMISSION_ACTIONS = {
  coa: ["read", "manage"] as const,
  fiscalPeriod: ["read", "manage", "close"] as const,
  journal: ["read", "post", "approve", "reverse"] as const,
} as const satisfies Record<${pascal}PermissionDomain, readonly string[]>;

export type ${pascal}PermissionAction<
  TDomain extends ${pascal}PermissionDomain = ${pascal}PermissionDomain,
> = (typeof ${upper}_PERMISSION_ACTIONS)[TDomain][number];

export function to${pascal}PermissionKey(
  domain: ${pascal}PermissionDomain,
  action: ${pascal}PermissionAction
): string {
  const actionSegment =
    domain === "fiscalPeriod" ? \`fiscal_period_\${action}\` : \`\${domain}_\${action}\`;
  return \`accounting.\${actionSegment}\`;
}

export const ${upper}_PERMISSION_KEY_VOCABULARY = [
  to${pascal}PermissionKey("coa", "read"),
  to${pascal}PermissionKey("coa", "manage"),
  to${pascal}PermissionKey("fiscalPeriod", "read"),
  to${pascal}PermissionKey("fiscalPeriod", "manage"),
  to${pascal}PermissionKey("fiscalPeriod", "close"),
  to${pascal}PermissionKey("journal", "read"),
  to${pascal}PermissionKey("journal", "post"),
  to${pascal}PermissionKey("journal", "approve"),
  to${pascal}PermissionKey("journal", "reverse"),
] as const;

export type ${pascal}PermissionKey = (typeof ${upper}_PERMISSION_KEY_VOCABULARY)[number];
`
    );
  } else {
    const permDomains = Object.keys(spec.permissions);
    const permActionsBlock = permDomains
      .map(
        (domain) =>
          `  ${domain}: [${spec.permissions[domain]?.map((a) => `"${a}"`).join(", ")}] as const`
      )
      .join(",\n");
    const permKeys = permDomains.flatMap((domain) =>
      (spec.permissions[domain] ?? []).map(
        (action) => `  to${pascal}PermissionKey("${domain}", "${action}"),`
      )
    );
    write(
      `${prefix}-permission-vocabulary.contract.ts`,
      `export const ${upper}_PERMISSION_DOMAINS = [${permDomains.map((d) => `"${d}"`).join(", ")}] as const;

export type ${pascal}PermissionDomain = (typeof ${upper}_PERMISSION_DOMAINS)[number];

export const ${upper}_PERMISSION_ACTIONS = {
${permActionsBlock},
} as const satisfies Record<${pascal}PermissionDomain, readonly string[]>;

export type ${pascal}PermissionAction<
  TDomain extends ${pascal}PermissionDomain = ${pascal}PermissionDomain,
> = (typeof ${upper}_PERMISSION_ACTIONS)[TDomain][number];

export function to${pascal}PermissionKey(
  domain: ${pascal}PermissionDomain,
  action: ${pascal}PermissionAction
): string {
  return \`${slug}.\${domain}_\${action}\`;
}

export const ${upper}_PERMISSION_KEY_VOCABULARY = [
${permKeys.join("\n")}
] as const;

export type ${pascal}PermissionKey = (typeof ${upper}_PERMISSION_KEY_VOCABULARY)[number];
`
    );
  }

  if (spec.wireContextMode === "accounting") {
    write(
      `${prefix}-domain-wire-context.contract.ts`,
      `import type { LegalEntityCompanyType } from "../../context/legal-entity-context.contract.js";

export interface ${pascal}DomainWireContext {
  readonly baseCurrency: string;
  readonly companyId: string;
  readonly companyType: LegalEntityCompanyType;
  readonly countryCode: string;
  readonly entityGroupId: string | null;
  readonly fiscalCalendarId: string | null;
  readonly organizationUnitId: string | null;
  readonly reportingCurrency: string;
  readonly tenantId: string;
}

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? { [K in keyof T]: AssertJsonSerializable<T[K]> } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _${pascal}DomainWireSerializable = AssertJsonSerializable<${pascal}DomainWireContext>;

export type assert${pascal}DomainWireContextJsonSerializable =
  _${pascal}DomainWireSerializable extends true ? true : never;
`
    );
  } else {
    write(
      `${prefix}-domain-wire-context.contract.ts`,
      `import type { ValuationMethod } from "./valuation-method.contract.js";

export interface ${pascal}DomainWireContext {
  readonly companyId: string;
  readonly defaultValuationMethod: ValuationMethod;
  readonly defaultWarehouseId: string | null;
  readonly lotTrackingEnabled: boolean;
  readonly tenantId: string;
}

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? { [K in keyof T]: AssertJsonSerializable<T[K]> } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _${pascal}DomainWireSerializable = AssertJsonSerializable<${pascal}DomainWireContext>;

export type assert${pascal}DomainWireContextJsonSerializable =
  _${pascal}DomainWireSerializable extends true ? true : never;
`
    );
  }

  const policyNoteKey = spec.policyNoteField;
  write(
    `${prefix}-domain-vocabulary.policy.ts`,
    `export const ${upper}_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
${spec.prohibitedSurfaces.map((s) => `  "${s}",`).join("\n")}
] as const;

export type ${pascal}DomainProhibitedRuntimeSurface =
  (typeof ${upper}_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const ${upper}_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "${slice}" as const,
  lifecycle: "contracts-only" as const,
  rule: "${spec.rule}" as const,
  prohibitedRuntimeSurfaces: ${upper}_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  ${policyNoteKey}: "${spec.businessReferenceNote}" as const,
  enforcementGate: "${UNIFIED_GATE}" as const,
} as const;
`
  );

  const vocabImports = spec.vocabs
    .map(
      (v) =>
        `import { ${vocabConstNameFromFile(v.file)} } from "./${v.file}.contract.js";`
    )
    .join("\n");

  const closedEntries = spec.vocabs
    .map((v) => {
      const constName = vocabConstNameFromFile(v.file);
      return `  {
    id: "${v.file}",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "${v.file}.contract.ts",
    constantExport: "${constName}",
    typeExport: "${v.type}",
    narrowerExport: "is${v.type}",
    valueCount: ${constName}.length,
  }`;
    })
    .join(",\n");

  const brandedEntries = spec.brandedIds
    .map(
      (entry) => `  {
    typeName: "${entry.typeName}",
    brandFunction: "brand${entry.typeName}",
    toFunction: "to${entry.typeName}",
    forbiddenOnPlatformFloor: ${entry.forbiddenOnPlatformFloor === true ? "true" : "false"},
  }`
    )
    .join(",\n");

  const forbiddenExport = spec.brandedIds.some(
    (e) => e.forbiddenOnPlatformFloor === true
  )
    ? `
export const ${upper}_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS =
  ${upper}_DOMAIN_BRANDED_IDS.filter((entry) => entry.forbiddenOnPlatformFloor).map(
    (entry) => entry.typeName
  );
`
    : "";

  write(
    `${prefix}-domain-vocabulary.registry.ts`,
    `import {
  ${upper}_AUDIT_ACTIONS,
  type is${pascal}AuditAction,
} from "./${prefix}-audit-actions.contract.js";
import {
  ${upper}_PACKAGE_LIFECYCLE,
  ${upper}_PACKAGE_LIFECYCLE_PHASES,
} from "./${prefix}-authority.contract.js";
import {
  ${upper}_PERMISSION_DOMAINS,
  ${upper}_PERMISSION_KEY_VOCABULARY,
} from "./${prefix}-permission-vocabulary.contract.js";
${vocabImports}

export const ${upper}_DOMAIN_VOCABULARY_REGISTRY_ID =
  "${spec.vocabularyRegistryId}" as const;

export type ${pascal}DomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface ${pascal}DomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export interface ${pascal}DomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const ${upper}_DOMAIN_CLOSED_VOCABULARIES = [
${closedEntries},
] as const satisfies readonly ${pascal}DomainClosedVocabularyEntry[];

export const ${upper}_DOMAIN_BRANDED_IDS = [
${brandedEntries},
] as const satisfies readonly ${pascal}DomainBrandedIdEntry[];

export const ${upper}_DOMAIN_BRANDED_ID_TYPE_NAMES =
  ${upper}_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);
${forbiddenExport}
export const ${upper}_DOMAIN_WIRE_CONTEXT = {
  id: "${slug}-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "${prefix}-domain-wire-context.contract.ts",
  typeExport: "${pascal}DomainWireContext",
  assertExport: "assert${pascal}DomainWireContextJsonSerializable",
} as const;

export const ${upper}_DOMAIN_AUDIT_VOCABULARY = {
  id: "${slug}-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "${prefix}-audit-actions.contract.ts",
  constantExport: "${upper}_AUDIT_ACTIONS",
  typeExport: "${pascal}AuditAction",
  narrowerExport: "is${pascal}AuditAction",
  valueCount: ${upper}_AUDIT_ACTIONS.length,
} as const;

export const ${upper}_DOMAIN_PERMISSION_VOCABULARY = {
  id: "${slug}-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "${prefix}-permission-vocabulary.contract.ts",
  domainsExport: "${upper}_PERMISSION_DOMAINS",
  keysExport: "${upper}_PERMISSION_KEY_VOCABULARY",
  domainCount: ${upper}_PERMISSION_DOMAINS.length,
  keyCount: ${upper}_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const ${upper}_DOMAIN_AUTHORITY_METADATA = {
  id: "${slug}-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "${prefix}-authority.contract.ts",
  lifecycleExport: "${upper}_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "${upper}_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: ${upper}_PACKAGE_LIFECYCLE,
  phaseCount: ${upper}_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const ${upper}_DOMAIN_VOCABULARY_REGISTRY = {
  id: ${upper}_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: ${upper}_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: ${upper}_DOMAIN_BRANDED_IDS,
  wireContext: ${upper}_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: ${upper}_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: ${upper}_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: ${upper}_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof ${upper}_AUDIT_ACTIONS)[number] extends Parameters<
    typeof is${pascal}AuditAction
  >[0]
    ? true
    : never;

export type assert${pascal}DomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
`
  );

  const vocabExports = spec.vocabs
    .map(
      (v) => `export {
  ${vocabConstNameFromFile(v.file)},
  type ${v.type},
  is${v.type},
} from "./${v.file}.contract.js";`
    )
    .join("\n");

  const idExports = spec.brandedIds
    .map(
      (entry) =>
        `  brand${entry.typeName},\n  type ${entry.typeName},\n  to${entry.typeName},`
    )
    .join("\n");

  const registryExports = spec.brandedIds.some(
    (e) => e.forbiddenOnPlatformFloor
  )
    ? `${upper}_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS,\n  `
    : "";

  write(
    "index.ts",
    `/**
 * PAS-001B ${slice} — ${slug} ERP domain vocabulary (contracts-only).
 * Public surface: \`@afenda/kernel/erp-domain/${slug}\`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed ${slug}-domain export surface.

export {
  is${pascal}AuditAction,
  ${upper}_AUDIT_ACTIONS,
  type ${pascal}AuditAction,
  parse${pascal}AuditAction,
} from "./${prefix}-audit-actions.contract.js";
export {
  is${pascal}PackageLifecyclePhase,
  ${upper}_AUTHORITY_ADR,
  ${upper}_AUTHORITY_FINGERPRINT,
  ${upper}_AUTHORITY_PAS,
  ${upper}_CONTRACTS_OWNER,
  ${upper}_PACKAGE_LIFECYCLE,
  ${upper}_PACKAGE_LIFECYCLE_PHASES,
  ${upper}_REGISTRY_ID,
  type ${pascal}PackageLifecyclePhase,
} from "./${prefix}-authority.contract.js";
export {
  ${upper}_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  ${upper}_DOMAIN_VOCABULARY_POLICY,
  type ${pascal}DomainProhibitedRuntimeSurface,
} from "./${prefix}-domain-vocabulary.policy.js";
export {
  type assert${pascal}DomainVocabularyRegistryIntegrity,
  ${registryExports}${upper}_DOMAIN_AUDIT_VOCABULARY,
  ${upper}_DOMAIN_AUTHORITY_METADATA,
  ${upper}_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ${upper}_DOMAIN_BRANDED_IDS,
  ${upper}_DOMAIN_CLOSED_VOCABULARIES,
  ${upper}_DOMAIN_PERMISSION_VOCABULARY,
  ${upper}_DOMAIN_VOCABULARY_REGISTRY,
  ${upper}_DOMAIN_VOCABULARY_REGISTRY_ID,
  ${upper}_DOMAIN_WIRE_CONTEXT,
  type ${pascal}DomainBrandedIdEntry,
  type ${pascal}DomainClosedVocabularyEntry,
  type ${pascal}DomainVocabularyKind,
} from "./${prefix}-domain-vocabulary.registry.js";
export type {
  assert${pascal}DomainWireContextJsonSerializable,
  ${pascal}DomainWireContext,
} from "./${prefix}-domain-wire-context.contract.js";
export {
${idExports}
} from "./${prefix}-id.contract.js";
export {
  ${upper}_PERMISSION_ACTIONS,
  ${upper}_PERMISSION_DOMAINS,
  ${upper}_PERMISSION_KEY_VOCABULARY,
  type ${pascal}PermissionAction,
  type ${pascal}PermissionDomain,
  type ${pascal}PermissionKey,
  to${pascal}PermissionKey,
} from "./${prefix}-permission-vocabulary.contract.js";
${vocabExports}
`
  );

  const vocabImportsTest = spec.vocabs.map((v) => `is${v.type}`).join(",\n  ");
  const forbiddenTest =
    slug === "accounting"
      ? `
  it("aligns forbidden platform-floor branded IDs with identity registry", async () => {
    const { FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS } = await import(
      "../../../identity/registry/id-family.registry.js"
    );
    expect(${upper}_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS).toEqual([
      ...FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS,
    ]);
  });`
      : `
  it("excludes business-reference IDs from domain branded surface (Rule 2)", () => {
    expect(${upper}_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("ProductId");
    expect(${upper}_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("WarehouseId");
  });`;

  write(
    `__tests__/${prefix}-domain-vocabulary.contract.test.ts`,
    `import { describe, expect, it } from "vitest";

import {
  ${upper}_AUDIT_ACTIONS,
  ${upper}_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ${upper}_DOMAIN_CLOSED_VOCABULARIES,
  ${upper}_DOMAIN_VOCABULARY_POLICY,
  ${upper}_DOMAIN_VOCABULARY_REGISTRY,
  ${upper}_DOMAIN_VOCABULARY_REGISTRY_ID,
  type assert${pascal}DomainVocabularyRegistryIntegrity,
  is${pascal}AuditAction,
  ${vocabImportsTest},
} from "../index.js";

describe("PAS-001B ${slug} domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(${upper}_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("${spec.vocabularyRegistryId}");
    expect(${upper}_DOMAIN_VOCABULARY_REGISTRY.id).toBe("${spec.vocabularyRegistryId}");
  });

  it("lists closed vocabularies with expected count", () => {
    expect(${upper}_DOMAIN_CLOSED_VOCABULARIES.length).toBe(${spec.vocabs.length});
  });

  it("registers branded IDs", () => {
    expect(${upper}_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(${spec.brandedIds.length});
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assert${pascal}DomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(is${pascal}AuditAction(${upper}_AUDIT_ACTIONS[0] ?? "")).toBe(true);
${spec.vocabs.map((v) => `    expect(is${v.type}("${v.values[0]}")).toBe(true);`).join("\n")}
  });
${forbiddenTest}
});

describe("PAS-001B ${slug} domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(${upper}_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe("${UNIFIED_GATE}");
    expect(${upper}_DOMAIN_VOCABULARY_POLICY.pas001bSlice).toBe("${slice}");
  });
});
`
  );

  return filesWritten;
}

let total = 0;
for (const spec of ERP_DOMAIN_FOUNDATION_MODULE_SPECS) {
  total += writeFoundationModule(spec);
}

console.log(
  `Foundation ERP domain re-scaffold: ${total} files written for accounting + inventory.`
);
