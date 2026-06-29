/**
 * PAS-API-REST-001-S2 — REST request/response schema binding (style layer).
 * Links Zod modules on route contracts to family schema authority (PAS-API-001 API-003).
 */

import type { ZodType } from "zod";

import type { ApiRouteContract } from "./api-contract";
import type { ApiOperationId } from "./core/api-operation-id.contract";
import { parseApiOperationId } from "./core/api-operation-id.contract";
import {
  type ApiOperationSchemaAuthority,
  extractOperationSchemaAuthority,
} from "./core/api-validation.contract";

/** REST schema modules live under contracts tree as `.api-contract.ts` or `.contract.ts`. */
const REST_SCHEMA_MODULE_REF_PATTERN =
  /^apps\/erp\/src\/server\/api\/contracts\/[\w./-]+(?:\.api-contract|\.contract)\.ts#[\w:-]+$/;

export interface RestSchemaBinding {
  readonly authority: ApiOperationSchemaAuthority;
  readonly bindingKind: "rest-zod-module";
  readonly operationId: ApiOperationId;
  readonly requestSchemaModuleRef: string;
  readonly responseSchemaModuleRef: string;
}

export function isValidRestSchemaModuleRef(value: string): boolean {
  return REST_SCHEMA_MODULE_REF_PATTERN.test(value);
}

export function extractRestSchemaBinding<TRequest, TResponse>(
  contract: Pick<
    ApiRouteContract<TRequest, TResponse>,
    | "id"
    | "requestSchema"
    | "requestSchemaRef"
    | "responseSchema"
    | "responseSchemaRef"
  >
): RestSchemaBinding {
  if (!isValidRestSchemaModuleRef(contract.requestSchemaRef)) {
    throw new Error(
      `Invalid REST request schema module ref: ${contract.requestSchemaRef}`
    );
  }

  if (!isValidRestSchemaModuleRef(contract.responseSchemaRef)) {
    throw new Error(
      `Invalid REST response schema module ref: ${contract.responseSchemaRef}`
    );
  }

  assertZodSchemaPresent(contract.requestSchema, "requestSchema");
  assertZodSchemaPresent(contract.responseSchema, "responseSchema");

  return {
    authority: extractOperationSchemaAuthority(contract),
    bindingKind: "rest-zod-module",
    operationId: parseApiOperationId(contract.id),
    requestSchemaModuleRef: contract.requestSchemaRef,
    responseSchemaModuleRef: contract.responseSchemaRef,
  };
}

function assertZodSchemaPresent(
  schema: ZodType<unknown>,
  fieldName: string
): void {
  if (schema === undefined || schema === null) {
    throw new Error(`Missing REST ${fieldName} Zod schema.`);
  }
}

export function buildRestSchemaBindingRegistry<
  TContract extends ApiRouteContract<unknown, unknown>,
>(contracts: readonly TContract[]): readonly RestSchemaBinding[] {
  return contracts.map((contract) => extractRestSchemaBinding(contract));
}

export function assertRegistryRestSchemaBindings<
  TContract extends ApiRouteContract<unknown, unknown>,
>(contracts: readonly TContract[]): readonly RestSchemaBinding[] {
  return buildRestSchemaBindingRegistry(contracts);
}
