import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";

function brandTrimRequired<T extends string>(
  value: string | Brand<string, T>,
  label: string
): Brand<string, T> {
  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, T>;
}

export type BusinessDocumentId = Brand<string, "BusinessDocumentId">;

export function brandBusinessDocumentId(
  value: string | BusinessDocumentId
): BusinessDocumentId {
  return brandTrimRequired(value, "businessDocumentId") as BusinessDocumentId;
}

export function toBusinessDocumentId(value: BusinessDocumentId): string {
  return unbrand(value);
}

export type DocumentRetentionCaseId = Brand<string, "DocumentRetentionCaseId">;

export function brandDocumentRetentionCaseId(
  value: string | DocumentRetentionCaseId
): DocumentRetentionCaseId {
  return brandTrimRequired(
    value,
    "documentRetentionCaseId"
  ) as DocumentRetentionCaseId;
}

export function toDocumentRetentionCaseId(
  value: DocumentRetentionCaseId
): string {
  return unbrand(value);
}

export type FiscalAttachmentId = Brand<string, "FiscalAttachmentId">;

export function brandFiscalAttachmentId(
  value: string | FiscalAttachmentId
): FiscalAttachmentId {
  return brandTrimRequired(value, "fiscalAttachmentId") as FiscalAttachmentId;
}

export function toFiscalAttachmentId(value: FiscalAttachmentId): string {
  return unbrand(value);
}
