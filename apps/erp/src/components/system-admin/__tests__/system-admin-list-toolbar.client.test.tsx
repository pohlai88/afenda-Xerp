// @vitest-environment jsdom

import { render, screen } from "@afenda/testing/react";
import { setupUser } from "@afenda/testing/react";
import { describe, expect, it } from "vitest";

import { SystemAdminListToolbar } from "../system-admin-list-toolbar.client";

describe("SystemAdminListToolbar", () => {
  it("opens v2 search dialog from the toolbar trigger", async () => {
    const user = setupUser();

    render(
      <SystemAdminListToolbar
        createLabel="Invite user"
        searchLabel="Search users"
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Search users" })
    );

    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByPlaceholderText("Search users…")).toBeVisible();
  });
});
