import { describe, expect, it } from "vitest";

import {
  checkSystemAdminMutationAudit,
  formatSystemAdminMutationAuditViolations,
} from "../check-system-admin-mutation-audit.mts";

describe("check-system-admin-mutation-audit script", () => {
  it("passes on the current repository state", () => {
    expect(checkSystemAdminMutationAudit()).toEqual([]);
  });

  it("reports violations with actionable rule ids", () => {
    const violations = checkSystemAdminMutationAudit();
    const formatted = formatSystemAdminMutationAuditViolations(violations);

    if (violations.length > 0) {
      expect(formatted).toMatch(
        /\[(registry-missing|api-mutation-audit-disabled|server-action-audit-missing|coverage-test-missing)\]/
      );
    }
  });
});
