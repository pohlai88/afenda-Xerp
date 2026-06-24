import { describe, expect, it } from "vitest";

import {
  APPSHELL_COMMAND_CENTER_SEARCH_LABEL_KEYS,
  APPSHELL_HEADER_COMMAND_CENTER_SLOTS,
  APPSHELL_HEADER_GOVERNED_COMPONENT_NAMES,
  APPSHELL_SEARCH_DIALOG_GOVERNED_COMPONENT_NAMES,
  type AppShellSearchInteractionDescriptor,
  type AppShellSearchSuggestionDescriptor,
  type AppShellSearchUserDescriptor,
  isAppShellHeaderCommandCenterSlot,
} from "../command-center.contract.js";

/** Header regions wired in `app-shell-header.tsx` — contract must cover all slots. */
const APP_SHELL_HEADER_WIRED_SLOTS = [
  "search",
  "language",
  "activity",
  "notifications",
  "profile",
  "context-switcher",
] as const satisfies readonly (typeof APPSHELL_HEADER_COMMAND_CENTER_SLOTS)[number][];

describe("command-center.contract", () => {
  it("registers header command-center slots used by app-shell-header", () => {
    expect(APPSHELL_HEADER_COMMAND_CENTER_SLOTS).toEqual([
      "search",
      "notifications",
      "activity",
      "language",
      "profile",
      "context-switcher",
    ]);
    for (const slot of APP_SHELL_HEADER_WIRED_SLOTS) {
      expect(APPSHELL_HEADER_COMMAND_CENTER_SLOTS).toContain(slot);
      expect(isAppShellHeaderCommandCenterSlot(slot)).toBe(true);
    }
  });

  it("registers governed header and search dialog primitive names", () => {
    expect(APPSHELL_HEADER_GOVERNED_COMPONENT_NAMES).toEqual([
      "Avatar",
      "Button",
    ]);
    expect(APPSHELL_SEARCH_DIALOG_GOVERNED_COMPONENT_NAMES).toEqual([
      "Avatar",
      "Badge",
      "Dialog",
      "Kbd",
    ]);
  });

  it("freezes serializable search label keys", () => {
    expect(APPSHELL_COMMAND_CENTER_SEARCH_LABEL_KEYS).toContain("placeholder");
    expect(APPSHELL_COMMAND_CENTER_SEARCH_LABEL_KEYS).toContain("dialogTitle");
    expect(new Set(APPSHELL_COMMAND_CENTER_SEARCH_LABEL_KEYS).size).toBe(
      APPSHELL_COMMAND_CENTER_SEARCH_LABEL_KEYS.length
    );
  });

  it("accepts serializable search descriptor shapes", () => {
    const suggestion: AppShellSearchSuggestionDescriptor = {
      id: "nav-workspace",
      label: "Workspace",
      iconId: "dashboard",
    };
    const interaction: AppShellSearchInteractionDescriptor = {
      id: "thread-1",
      name: "Quarterly review",
      description: "Planning thread",
      logoSrc: "https://example.com/logo.png",
      participants: [
        { alt: "Alex", fallback: "A", src: "https://example.com/a.png" },
      ],
    };
    const user: AppShellSearchUserDescriptor = {
      id: "user-1",
      name: "Alex Operator",
      email: "alex@example.com",
      avatarSrc: "https://example.com/avatar.png",
      fallback: "AO",
      status: "Online",
      statusTone: "success",
    };

    expect(suggestion.iconId).toBe("dashboard");
    expect(interaction.participants).toHaveLength(1);
    expect(user.statusTone).toBe("success");
  });

  it("narrows command-center slots via type guard", () => {
    expect(isAppShellHeaderCommandCenterSlot("search")).toBe(true);
    expect(isAppShellHeaderCommandCenterSlot("palette")).toBe(false);
  });
});
