/** Shared ERP domain vocabulary registry shapes (PAS-001B internal). */

export type ErpDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface ErpDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export interface ErpDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export interface ErpDomainVocabularyRegistryShape {
  readonly auditVocabulary: {
    readonly id: string;
    readonly kind: "audit-vocabulary";
    readonly pasSection: "4.8";
    readonly contractFile: string;
    readonly constantExport: string;
    readonly typeExport: string;
    readonly narrowerExport: string;
    readonly valueCount: number;
  };
  readonly authorityMetadata: {
    readonly id: string;
    readonly kind: "authority-metadata";
    readonly pasSection: "4.8";
    readonly contractFile: string;
    readonly lifecycleExport: string;
    readonly lifecyclePhasesExport: string;
    readonly currentLifecycle: string;
    readonly phaseCount: number;
  };
  readonly brandedIds: readonly ErpDomainBrandedIdEntry[];
  readonly closedVocabularies: readonly ErpDomainClosedVocabularyEntry[];
  readonly id: string;
  readonly permissionVocabulary: {
    readonly id: string;
    readonly kind: "permission-vocabulary";
    readonly pasSection: "4.8";
    readonly contractFile: string;
    readonly domainsExport: string;
    readonly keysExport: string;
    readonly domainCount: number;
    readonly keyCount: number;
  };
  readonly wireContext: {
    readonly id: string;
    readonly kind: "wire-context";
    readonly pasSection: "4.8";
    readonly contractFile: string;
    readonly typeExport: string;
    readonly assertExport: string;
  };
}
