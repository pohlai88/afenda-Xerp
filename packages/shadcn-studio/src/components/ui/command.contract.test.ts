import { describe, expect, expectTypeOf, it } from "vitest";
import {
  COMMAND_PRIMITIVE_ID,
  COMMAND_SLOTS,
  commandPrimitiveMetadata,
  commandRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./command.contract.js";
import type { CommandProps, CommandSlot } from "./command.js";

describe("command primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports COMMAND_PRIMITIVE_ID for metadata registries", () => {
    expect(COMMAND_PRIMITIVE_ID).toBe("shadcn-studio.ui.command");
  });

  it("exports COMMAND_SLOTS", () => {
    expect(COMMAND_SLOTS).toEqual({
      root: "command",
      inputWrapper: "command-input-wrapper",
      input: "command-input",
      list: "command-list",
      empty: "command-empty",
      group: "command-group",
      separator: "command-separator",
      item: "command-item",
      shortcut: "command-shortcut",
    });
  });

  it("exports governed class constants", () => {
    expect(commandRootClassName).toContain("bg-popover");
  });

  it("commandPrimitiveMetadata is JSON-serializable", () => {
    const payload = commandPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("CommandSlot is a governed slot literal union", () => {
    expectTypeOf<CommandSlot>().toEqualTypeOf<
      | "command"
      | "command-input-wrapper"
      | "command-input"
      | "command-list"
      | "command-empty"
      | "command-group"
      | "command-separator"
      | "command-item"
      | "command-shortcut"
    >();
  });

  it("CommandProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof CommandProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
