import {
  type EnterpriseIdFamily,
  ID_FAMILIES,
} from "../registry/id-family.registry.js";
import type { CanonicalId } from "./canonical-id.contract.js";
import type { CanonicalIdBodyGenerator } from "./canonical-id-body-generator.contract.js";
import { CANONICAL_ID_SEPARATOR } from "./canonical-id-format.contract.js";
import { parseCanonicalId } from "./canonical-id-parser.contract.js";
import { InvalidCanonicalIdError } from "./invalid-canonical-id.error.js";

/**
 * Mint a validated canonical enterprise ID using an injected body generator.
 *
 * Production callers must supply an approved `CanonicalIdBodyGenerator` from
 * the owning persistence/composition layer — kernel does not generate ULID bodies.
 */
export function createCanonicalId<TFamily extends EnterpriseIdFamily>(
  family: TFamily,
  generator: CanonicalIdBodyGenerator
): CanonicalId<TFamily> {
  const { typeName, prefix } = ID_FAMILIES[family];
  const body = generator.generateUlidBody();

  try {
    return parseCanonicalId(
      `${prefix}${CANONICAL_ID_SEPARATOR}${body}`,
      family
    );
  } catch (error) {
    if (error instanceof InvalidCanonicalIdError) {
      throw new InvalidCanonicalIdError(
        `${typeName} generator produced an invalid canonical ID body.`
      );
    }
    throw error;
  }
}
