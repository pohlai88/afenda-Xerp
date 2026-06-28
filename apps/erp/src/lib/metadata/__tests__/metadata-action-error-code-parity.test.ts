import { APP_ERROR_CODES } from "@afenda/kernel";
import { METADATA_ACTION_ERROR_CODES } from "@afenda/metadata-ui";
import { describe, expect, it } from "vitest";

describe("metadata action error code parity", () => {
  it("METADATA_ACTION_ERROR_CODES matches APP_ERROR_CODES", () => {
    expect([...METADATA_ACTION_ERROR_CODES].sort()).toEqual(
      [...APP_ERROR_CODES].sort()
    );
  });
});
