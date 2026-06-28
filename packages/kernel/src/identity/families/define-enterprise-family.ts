import { type Brand, unbrand } from "../brand/index.js";
import type { CanonicalIdBodyGenerator } from "../canonical/canonical-id-body-generator.contract.js";
import { CANONICAL_ID_SEPARATOR } from "../canonical/canonical-id-format.contract.js";
import { createCanonicalId } from "../canonical/canonical-id-generator.contract.js";
import { parseCanonicalId } from "../canonical/canonical-id-parser.contract.js";
import {
  type EnterpriseIdFamily,
  ID_FAMILIES,
} from "../registry/id-family.registry.js";

type EnterpriseTypeNameByFamily = {
  [K in EnterpriseIdFamily]: (typeof ID_FAMILIES)[K]["typeName"];
};

export type EnterpriseBrand<TFamily extends EnterpriseIdFamily> = Brand<
  string,
  EnterpriseTypeNameByFamily[TFamily]
>;

export function defineEnterpriseFamily<TFamily extends EnterpriseIdFamily>(
  family: TFamily
) {
  type Id = EnterpriseBrand<TFamily>;

  function parse(value: string): Id {
    return parseCanonicalId(value, family) as unknown as Id;
  }

  function create(generator: CanonicalIdBodyGenerator): Id {
    const canonicalId = createCanonicalId(family, generator);
    return parse(unbrand(canonicalId));
  }

  function parseOptional(value: string | Id | null | undefined): Id | null {
    if (value == null) {
      return null;
    }
    if (typeof value !== "string") {
      return value;
    }
    return parse(value);
  }

  function to(value: Id): string {
    return unbrand(value);
  }

  return { parse, parseOptional, create, to };
}

/** Test-only helper — returns a validated family-branded ID for fixtures. */
export function createTestEnterpriseId<TFamily extends EnterpriseIdFamily>(
  family: TFamily,
  body = "01ARZ3NDEKTSV4RRFFQ69G5FAV"
): EnterpriseBrand<TFamily> {
  const prefix = ID_FAMILIES[family].prefix;
  return defineEnterpriseFamily(family).parse(
    `${prefix}${CANONICAL_ID_SEPARATOR}${body}`
  );
}
