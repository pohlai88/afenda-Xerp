import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  ERP_API_IMPORT_AUTHORITY_MESSAGE,
  scanErpApiImportAuthority,
} from "../check-erp-api-import-authority.mts";

describe("check-erp-api-import-authority", () => {
  it("passes when ERP sources use contracts authority only", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "erp-api-import-authority-"));
    const apiRoot = join(tempRoot, "src/server/api/runtime");
    mkdirSync(apiRoot, { recursive: true });
    writeFileSync(
      join(apiRoot, "create-api-handler.ts"),
      'import type { ApiRouteContract } from "../meta-contracts/api-contract";\n',
      "utf8"
    );

    expect(scanErpApiImportAuthority(tempRoot)).toEqual([]);
  });

  it("flags forbidden meta-contracts imports with line numbers", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "erp-api-import-authority-"));
    const apiRoot = join(tempRoot, "src/server/api/runtime");
    mkdirSync(apiRoot, { recursive: true });
    writeFileSync(
      join(apiRoot, "broken.ts"),
      'import type { ApiRouteContract } from "../meta-contracts/api-contract";\n',
      "utf8"
    );

    const violations = scanErpApiImportAuthority(tempRoot);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      file: "src/server/api/runtime/broken.ts",
      line: 1,
      message: ERP_API_IMPORT_AUTHORITY_MESSAGE,
      rule: "forbidden-meta-contracts-import",
    });
  });
});
