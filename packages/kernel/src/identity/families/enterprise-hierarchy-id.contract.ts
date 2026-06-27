/**
 * Enterprise structure hierarchy IDs (PAS-001 category: enterprise-structure).
 */

import { normalizeBrandedIdForWire } from "../wire/identity-wire.contract.js";
import {
  defineEnterpriseFamily,
  type EnterpriseBrand,
} from "./define-enterprise-family.js";

const ownershipInterest = defineEnterpriseFamily("ownershipInterest");

export type OwnershipInterestId = EnterpriseBrand<"ownershipInterest">;

export const parseOwnershipInterestId = ownershipInterest.parse;
export const parseOptionalOwnershipInterestId = ownershipInterest.parseOptional;
export const createOwnershipInterestId = ownershipInterest.create;
export const toOwnershipInterestId = ownershipInterest.to;

export function normalizeOwnershipInterestIdForWire(
  value: string | OwnershipInterestId
): string {
  return normalizeBrandedIdForWire(value, toOwnershipInterestId);
}
