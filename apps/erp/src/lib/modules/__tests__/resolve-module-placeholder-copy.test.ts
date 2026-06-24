import { describe, expect, it } from "vitest";

import {
  MODULE_PLACEHOLDER_ACCOUNTING_DOMAIN_BODY,
  MODULE_PLACEHOLDER_SHELL_DESCRIPTION,
  MODULE_PLACEHOLDER_STANDARD_DOMAIN_BODY,
} from "@/lib/modules/module-placeholder.copy.contract";
import { resolveModulePlaceholderCopy } from "@/lib/modules/resolve-module-placeholder-copy";

describe("resolveModulePlaceholderCopy", () => {
  it("returns standard placeholder copy for non-accounting modules", () => {
    expect(
      resolveModulePlaceholderCopy({
        moduleId: "manufacturing",
        label: "Manufacturing",
      })
    ).toEqual({
      variant: "standard",
      shellDescription: MODULE_PLACEHOLDER_SHELL_DESCRIPTION,
      domainBody: MODULE_PLACEHOLDER_STANDARD_DOMAIN_BODY,
      emptyStateTitle: "Manufacturing",
    });
  });

  it("returns accounting shell-only copy for the accounting module", () => {
    const copy = resolveModulePlaceholderCopy({
      moduleId: "accounting",
      label: "Accounting",
    });

    expect(copy.variant).toBe("accounting");
    expect(copy.domainBody).toBe(MODULE_PLACEHOLDER_ACCOUNTING_DOMAIN_BODY);
    expect(copy.domainBody).toMatch(
      /Domain[\s\S]*capabilities will appear here/i
    );
    expect(copy.domainBody).toMatch(/no transaction or financial-record UI/i);
    expect(copy.emptyStateTitle).toBe("Accounting");
  });
});
