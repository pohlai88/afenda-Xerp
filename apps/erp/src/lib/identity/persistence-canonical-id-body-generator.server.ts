import { generateUlidBody } from "@afenda/database";
import type { CanonicalIdBodyGenerator } from "@afenda/kernel";

/**
 * Production write-path ULID body generator — delegates to `@afenda/database`.
 * Kernel minting stays interface-only; ERP is the composition root.
 */
export const persistenceCanonicalIdBodyGenerator: CanonicalIdBodyGenerator = {
  generateUlidBody(): string {
    return generateUlidBody();
  },
};
