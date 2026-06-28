import { describe, expect, it } from "vitest";

import {
  collectPrimitiveContractSourceViolations,
  isPrimitiveContractSourcePath,
  PRIMITIVE_CONTRACT_SOURCE_FILES,
} from "../identity/kernel-primitives.governance.mts";

describe("primitive-contract-source (PAS-001 §4.1.5)", () => {
  it("tracks the seven primitive type contract sources", () => {
    expect(PRIMITIVE_CONTRACT_SOURCE_FILES).toHaveLength(7);
    expect(
      isPrimitiveContractSourcePath(
        "packages/kernel/src/identity/primitives/locale-code.contract.ts"
      )
    ).toBe(true);
    expect(
      isPrimitiveContractSourcePath(
        "packages/kernel/src/identity/primitives/primitive-brand.helpers.ts"
      )
    ).toBe(false);
  });

  it("flags parseCanonicalId in primitive contract sources", () => {
    const violations = collectPrimitiveContractSourceViolations([
      {
        path: "packages/kernel/src/identity/primitives/currency-code.contract.ts",
        source:
          "import { parseCanonicalId } from '../canonical/canonical-id-parser.contract.js';",
      },
    ]);

    expect(violations).toMatchObject([
      {
        rule: "primitive-contract-forbidden-import",
        file: "packages/kernel/src/identity/primitives/currency-code.contract.ts",
        message:
          "Primitive contracts must not reference parseCanonicalId — use rejectIfMisclassifiedId for misclassification guards",
      },
    ]);
  });

  it("flags ID_FAMILIES in primitive contract sources", () => {
    const violations = collectPrimitiveContractSourceViolations([
      {
        path: "packages/kernel/src/identity/primitives/uom-code.contract.ts",
        source:
          "import { ID_FAMILIES } from '../registry/id-family.registry.js';",
      },
    ]);

    expect(violations).toMatchObject([
      {
        rule: "primitive-contract-forbidden-import",
        file: "packages/kernel/src/identity/primitives/uom-code.contract.ts",
        message:
          "Primitive contracts must not import ID_FAMILIES — primitives live in PRIMITIVE_REFERENCES registry",
      },
    ]);
  });

  it("ignores helper and registry modules outside contract source paths", () => {
    const violations = collectPrimitiveContractSourceViolations([
      {
        path: "packages/kernel/src/identity/primitives/primitive-brand.helpers.ts",
        source:
          "import { ID_FAMILIES } from '../registry/id-family.registry.js';",
      },
      {
        path: "packages/kernel/src/identity/primitives/locale-code.contract.ts",
        source:
          'import { rejectIfMisclassifiedId } from "./primitive-brand.helpers.js";',
      },
    ]);

    expect(violations).toEqual([]);
  });
});
