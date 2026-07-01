import { describe, expect, it } from "vitest";

import {
  assertErrorPageCopyWire,
  ERROR_PAGE_COPY_REGISTRY,
  ERROR_PAGE_VARIANTS,
} from "./error-page-shell.contract.js";

describe("error-page-shell contract", () => {
  it("registers every variant with serializable copy", () => {
    for (const variant of ERROR_PAGE_VARIANTS) {
      const copy = ERROR_PAGE_COPY_REGISTRY[variant];
      assertErrorPageCopyWire(copy);
      expect(JSON.parse(JSON.stringify(copy))).toEqual(copy);
    }
  });
});
