import { describe, expect, it } from "vitest";

import { assertWirePermissionModelDescriptor } from "../permission-model.assert.js";
import type { PermissionModelDescriptor } from "../permission-model.contract.js";
import {
  parseUnknownPermissionModelDescriptor,
  serializePermissionModelDescriptor,
} from "../permission-model.parser.js";

describe("permission model wire triad", () => {
  const validDescriptor: PermissionModelDescriptor = {
    module: "inventory",
    action: "read",
    scope: "tenant",
  };

  it("parses unknown wire payloads via strict assert", () => {
    expect(parseUnknownPermissionModelDescriptor(validDescriptor)).toEqual(
      validDescriptor
    );
  });

  it("rejects wire payloads with unexpected keys", () => {
    expect(() =>
      assertWirePermissionModelDescriptor({
        ...validDescriptor,
        extra: true,
      })
    ).toThrow(/unexpected keys/i);
  });

  it("round-trips descriptors through serialize", () => {
    expect(serializePermissionModelDescriptor(validDescriptor)).toEqual(
      validDescriptor
    );

    const parsed = parseUnknownPermissionModelDescriptor(
      JSON.parse(JSON.stringify(validDescriptor))
    );
    expect(parsed).toEqual(validDescriptor);
  });
});
