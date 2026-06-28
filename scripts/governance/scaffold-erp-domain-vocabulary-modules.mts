#!/usr/bin/env tsx
/**
 * PAS-001B — governed scaffold for ERP domain vocabulary modules (B81+).
 * Idempotent: skips modules whose index.ts already exists unless --force.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ERP_DOMAIN_VOCABULARY_MODULE_SPECS } from "./erp-domain-vocabulary-module-specs.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpDomainRoot = join(repoRoot, "packages/kernel/src/erp-domain");

function slugToUpper(slug: string): string {
  return slug.replace(/-/g, "_").toUpperCase();
}

function slugToPascal(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function idToBrandFunction(idType: string): string {
  return `brand${idType}`;
}

function idToToFunction(idType: string): string {
  return `to${idType}`;
}

function idToLabel(idType: string): string {
  return idType.charAt(0).toLowerCase() + idType.slice(1).replace(/Id$/, "Id");
}

function vocabConstNameFromFile(file: string): string {
  const base = slugToUpper(file);
  if (file.endsWith("-status")) {
    return `${slugToUpper(file.slice(0, -"-status".length))}_STATUSES`;
  }
  if (file.endsWith("-type")) {
    return `${slugToUpper(file.slice(0, -"-type".length))}_TYPES`;
  }
  if (file.endsWith("-method")) {
    return `${slugToUpper(file.slice(0, -"-method".length))}_METHODS`;
  }
  if (file.endsWith("-category")) {
    return `${slugToUpper(file.slice(0, -"-category".length))}_CATEGORIES`;
  }
  if (file.endsWith("-stage")) {
    return `${slugToUpper(file.slice(0, -"-stage".length))}_STAGES`;
  }
  if (file.endsWith("-priority")) {
    return `${slugToUpper(file.slice(0, -"-priority".length))}_PRIORITIES`;
  }
  if (file.endsWith("-level")) {
    return `${slugToUpper(file.slice(0, -"-level".length))}_LEVELS`;
  }
  if (file.endsWith("-scope")) {
    return `${slugToUpper(file.slice(0, -"-scope".length))}_SCOPES`;
  }
  if (file.endsWith("-code")) {
    return `${slugToUpper(file.slice(0, -"-code".length))}_CODES`;
  }
  if (file.endsWith("-mode")) {
    return `${slugToUpper(file.slice(0, -"-mode".length))}_MODES`;
  }
  if (file.endsWith("-step")) {
    return `${slugToUpper(file.slice(0, -"-step".length))}_STEPS`;
  }
  if (file.endsWith("-cycle")) {
    return `${slugToUpper(file.slice(0, -"-cycle".length))}_CYCLES`;
  }
  if (file.endsWith("-intent")) {
    return `${slugToUpper(file.slice(0, -"-intent".length))}_INTENTS`;
  }
  if (file.endsWith("-context")) {
    return `${slugToUpper(file.slice(0, -"-context".length))}_CONTEXTS`;
  }
  if (file.endsWith("-channel")) {
    return `${slugToUpper(file.slice(0, -"-channel".length))}_CHANNELS`;
  }
  if (file.endsWith("-tier")) {
    return `${slugToUpper(file.slice(0, -"-tier".length))}_TIERS`;
  }
  if (file.endsWith("-class")) {
    return `${slugToUpper(file.slice(0, -"-class".length))}_CLASSES`;
  }
  if (file.endsWith("-policy")) {
    return `${slugToUpper(file.slice(0, -"-policy".length))}_POLICIES`;
  }
  if (file.endsWith("-role")) {
    return `${slugToUpper(file.slice(0, -"-role".length))}_ROLES`;
  }
  if (file.endsWith("-decision")) {
    return `${slugToUpper(file.slice(0, -"-decision".length))}_DECISIONS`;
  }
  if (file.endsWith("-reason")) {
    return `${slugToUpper(file.slice(0, -"-reason".length))}_REASONS`;
  }
  if (file.endsWith("-visibility")) {
    return `${slugToUpper(file.slice(0, -"-visibility".length))}_VISIBILITIES`;
  }
  if (file.endsWith("-grain")) {
    return `${slugToUpper(file.slice(0, -"-grain".length))}_GRAINS`;
  }
  if (file.endsWith("-model")) {
    return `${slugToUpper(file.slice(0, -"-model".length))}_MODELS`;
  }
  if (file.endsWith("-direction")) {
    return `${slugToUpper(file.slice(0, -"-direction".length))}_DIRECTIONS`;
  }
  if (file.endsWith("-outcome")) {
    return `${slugToUpper(file.slice(0, -"-outcome".length))}_OUTCOMES`;
  }
  if (file.endsWith("-frequency")) {
    return `${slugToUpper(file.slice(0, -"-frequency".length))}_FREQUENCIES`;
  }

  return `${base}S`;
}

function vocabConstName(_typeName: string, file: string): string {
  return vocabConstNameFromFile(file);
}

function vocabIsName(typeName: string): string {
  return `is${typeName}`;
}

function writeModule(spec: (typeof ERP_DOMAIN_VOCABULARY_MODULE_SPECS)[number], force: boolean): number {
  const { slug, slice } = spec;
  const moduleDir = join(erpDomainRoot, slug);
  const indexPath = join(moduleDir, "index.ts");

  if (existsSync(indexPath) && !force) {
    return 0;
  }

  mkdirSync(join(moduleDir, "__tests__"), { recursive: true });

  const upper = slugToUpper(slug);
  const pascal = slugToPascal(slug);
  const prefix = slug;

  const authority = `/**
 * PAS-001B ${slice} — ${pascal} domain authority (kernel contracts-only lifecycle).
 */

export const ${upper}_AUTHORITY_PAS = "PAS-001B" as const;

export const ${upper}_REGISTRY_ID = "PKGR01B_${upper}_VOCABULARY" as const;

export const ${upper}_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/${slug}" as const;

export const ${upper}_AUTHORITY_FINGERPRINT =
  "${upper}-AUTHORITY-2026-06-28-v1" as const;

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
`;

  const idTypes = spec.brandedIds;
  const idBlock = idTypes
    .map((idType) => {
      const brandFn = idToBrandFunction(idType);
      const toFn = idToToFunction(idType);
      const label = idToLabel(idType);
      return `export type ${idType} = Brand<string, "${idType}">;

export function ${brandFn}(value: string | ${idType}): ${idType} {
  return brandTrimRequired(value, "${label}") as ${idType};
}

export function ${toFn}(value: ${idType}): string {
  return unbrand(value);
}`;
    })
    .join("\n\n");

  const idFile = `import type { Brand } from "../../identity/brand/index.js";
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

${idBlock}
`;

  let filesWritten = 0;

  const write = (relativePath: string, content: string) => {
    writeFileSync(join(moduleDir, relativePath), content, "utf8");
    filesWritten += 1;
  };

  write(`${prefix}-authority.contract.ts`, authority);
  write(`${prefix}-id.contract.ts`, idFile);

  for (const vocab of spec.vocabs) {
    const constName = vocabConstName(vocab.type, vocab.file);
    const isName = vocabIsName(vocab.type);
    const valuesJson = vocab.values.map((v) => `"${v}"`).join(", ");
    write(
      `${vocab.file}.contract.ts`,
      `export const ${constName} = [${valuesJson}] as const;

export type ${vocab.type} = (typeof ${constName})[number];

export function ${isName}(value: string): value is ${vocab.type} {
  return (${constName} as readonly string[]).includes(value);
}
`
    );
  }

  const auditActions = spec.auditActions.map((a) => `"${a}"`).join(", ");
  write(
    `${prefix}-audit-actions.contract.ts`,
    `export const ${upper}_AUDIT_ACTIONS = [${auditActions}] as const;

export type ${pascal}AuditAction = (typeof ${upper}_AUDIT_ACTIONS)[number];

export function is${pascal}AuditAction(value: string): value is ${pascal}AuditAction {
  return (${upper}_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parse${pascal}AuditAction(value: string): ${pascal}AuditAction | null {
  return is${pascal}AuditAction(value) ? value : null;
}
`
  );

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

  write(
    `${prefix}-domain-wire-context.contract.ts`,
    `import type { ${spec.wireDefaultType} } from "./${spec.vocabs.find((v) => v.type === spec.wireDefaultType)?.file ?? spec.vocabs[0]?.file}.contract.js";

export interface ${pascal}DomainWireContext {
  readonly companyId: string;
  readonly ${spec.wireDefaultField}: ${spec.wireDefaultType};
  readonly enabled: boolean;
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

  const prohibited = spec.prohibitedSurfaces.map((s) => `"${s}"`).join(", ");
  write(
    `${prefix}-domain-vocabulary.policy.ts`,
    `export const ${upper}_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [${prohibited}] as const;

export type ${pascal}DomainProhibitedRuntimeSurface =
  (typeof ${upper}_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const ${upper}_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "${slice}" as const,
  lifecycle: "contracts-only" as const,
  rule: "${spec.rule}" as const,
  prohibitedRuntimeSurfaces: ${upper}_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote: "${spec.businessReferenceNote}" as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
`
  );

  const vocabImports = spec.vocabs
    .map((v) => {
      const constName = vocabConstName(v.type, v.file);
      return `import { ${constName} } from "./${v.file}.contract.js";`;
    })
    .join("\n");

  const closedVocabEntries = spec.vocabs
    .map((v) => {
      const constName = vocabConstName(v.type, v.file);
      const isName = vocabIsName(v.type);
      return `  {
    id: "${v.file}",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "${v.file}.contract.ts",
    constantExport: "${constName}",
    typeExport: "${v.type}",
    narrowerExport: "${isName}",
    valueCount: ${constName}.length,
  }`;
    })
    .join(",\n");

  const brandedEntries = idTypes
    .map(
      (idType) => `  {
    typeName: "${idType}",
    brandFunction: "${idToBrandFunction(idType)}",
    toFunction: "${idToToFunction(idType)}",
    forbiddenOnPlatformFloor: false,
  }`
    )
    .join(",\n");

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
  "PAS-001B-4.8-${upper}" as const;

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

export const ${upper}_DOMAIN_CLOSED_VOCABULARIES = [
${closedVocabEntries},
] as const satisfies readonly ${pascal}DomainClosedVocabularyEntry[];

export interface ${pascal}DomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const ${upper}_DOMAIN_BRANDED_IDS = [
${brandedEntries},
] as const satisfies readonly ${pascal}DomainBrandedIdEntry[];

export const ${upper}_DOMAIN_BRANDED_ID_TYPE_NAMES =
  ${upper}_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

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
    .map((v) => {
      const constName = vocabConstName(v.type, v.file);
      const isName = vocabIsName(v.type);
      return `export {
  ${constName},
  type ${v.type},
  ${isName},
} from "./${v.file}.contract.js";`;
    })
    .join("\n");

  const idExports = idTypes
    .map((idType) => {
      return `  type ${idType},
  ${idToBrandFunction(idType)},
  ${idToToFunction(idType)},`;
    })
    .join("\n");

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
  ${upper}_DOMAIN_AUDIT_VOCABULARY,
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

  const vocabTestImports = spec.vocabs.map((v) => vocabIsName(v.type)).join(",\n  ");
  const vocabTestLines = spec.vocabs
    .map((v) => {
      const isName = vocabIsName(v.type);
      const sample = v.values[0];
      return `    expect(${isName}("${sample}")).toBe(true);`;
    })
    .join("\n");

  write(
    `__tests__/${prefix}-domain-vocabulary.contract.test.ts`,
    `import { describe, expect, it } from "vitest";

import {
  ${upper}_AUDIT_ACTIONS,
  ${upper}_DOMAIN_AUDIT_VOCABULARY,
  ${upper}_DOMAIN_AUTHORITY_METADATA,
  ${upper}_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ${upper}_DOMAIN_CLOSED_VOCABULARIES,
  ${upper}_DOMAIN_VOCABULARY_POLICY,
  ${upper}_DOMAIN_VOCABULARY_REGISTRY,
  ${upper}_DOMAIN_VOCABULARY_REGISTRY_ID,
  type assert${pascal}DomainVocabularyRegistryIntegrity,
  is${pascal}AuditAction,
  ${vocabTestImports},
} from "../index.js";

describe("PAS-001B ${slug} domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(${upper}_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-${upper}");
  });

  it("lists closed vocabularies", () => {
    expect(${upper}_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(${upper}_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(${upper}_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assert${pascal}DomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(is${pascal}AuditAction(${upper}_AUDIT_ACTIONS[0] ?? "")).toBe(true);
${vocabTestLines}
  });
});

describe("PAS-001B ${slug} domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(${upper}_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
`
  );

  return filesWritten;
}

const force = process.argv.includes("--force");
let total = 0;

for (const spec of ERP_DOMAIN_VOCABULARY_MODULE_SPECS) {
  total += writeModule(spec, force);
}

console.log(
  `ERP domain vocabulary scaffold: ${total} files written across ${ERP_DOMAIN_VOCABULARY_MODULE_SPECS.length} modules.`
);
