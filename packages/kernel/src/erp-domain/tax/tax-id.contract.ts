import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type TaxDeclarationId = Brand<string, "TaxDeclarationId">;

export function brandTaxDeclarationId(
  value: string | TaxDeclarationId
): TaxDeclarationId {
  return brandTrimRequired(value, "taxDeclarationId") as TaxDeclarationId;
}

export function toTaxDeclarationId(value: TaxDeclarationId): string {
  return unbrand(value);
}

export type TaxDeterminationContextId = Brand<
  string,
  "TaxDeterminationContextId"
>;

export function brandTaxDeterminationContextId(
  value: string | TaxDeterminationContextId
): TaxDeterminationContextId {
  return brandTrimRequired(
    value,
    "taxDeterminationContextId"
  ) as TaxDeterminationContextId;
}

export function toTaxDeterminationContextId(
  value: TaxDeterminationContextId
): string {
  return unbrand(value);
}

export type WithholdingRunId = Brand<string, "WithholdingRunId">;

export function brandWithholdingRunId(
  value: string | WithholdingRunId
): WithholdingRunId {
  return brandTrimRequired(value, "withholdingRunId") as WithholdingRunId;
}

export function toWithholdingRunId(value: WithholdingRunId): string {
  return unbrand(value);
}
