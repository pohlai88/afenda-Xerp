import {
  MEMBERSHIP_SCOPE_TYPES,
  PERSISTED_MEMBERSHIP_SCOPE_TYPES,
} from "@afenda/database";
import { PERMISSIONS_IMPLEMENTED_MEMBERSHIP_SCOPES } from "@afenda/permissions";
import { describe, expect, it } from "vitest";

describe("membership scope vocabulary parity (database ↔ permissions authority)", () => {
  it("keeps PERSISTED_MEMBERSHIP_SCOPE_TYPES aligned with MEMBERSHIP_SCOPE_TYPES", () => {
    expect([...PERSISTED_MEMBERSHIP_SCOPE_TYPES]).toEqual([
      ...MEMBERSHIP_SCOPE_TYPES,
    ]);
  });

  it("keeps PERMISSIONS_IMPLEMENTED_MEMBERSHIP_SCOPES aligned with persisted scopes", () => {
    expect([...PERMISSIONS_IMPLEMENTED_MEMBERSHIP_SCOPES]).toEqual([
      ...PERSISTED_MEMBERSHIP_SCOPE_TYPES,
    ]);
  });
});
