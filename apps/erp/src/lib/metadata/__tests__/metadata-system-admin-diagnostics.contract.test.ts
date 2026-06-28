import { describe, expect, it } from "vitest";

import {
  METADATA_SYSTEM_ADMIN_DIAGNOSTICS_SURFACE_ID,
  resolveSystemAdminDiagnosticsMetadataActions,
} from "../metadata-system-admin-diagnostics.contract.js";

describe("resolveSystemAdminDiagnosticsMetadataActions", () => {
  it("enables refresh when section access is allowed", () => {
    const actions = resolveSystemAdminDiagnosticsMetadataActions({
      sectionAccessAllowed: true,
    });

    expect(actions).toHaveLength(1);
    expect(actions[0]?.key).toBe("refresh-readiness-gate");
    expect(actions[0]?.visibility).toBe("visible");
  });

  it("disables refresh when section access is denied", () => {
    const actions = resolveSystemAdminDiagnosticsMetadataActions({
      sectionAccessAllowed: false,
    });

    expect(actions[0]?.visibility).toBe("disabled");
  });

  it("uses the diagnostics metadata surface id in handler source contracts", () => {
    expect(METADATA_SYSTEM_ADMIN_DIAGNOSTICS_SURFACE_ID).toBe(
      "erp.system-admin.diagnostics.preview"
    );
  });
});
