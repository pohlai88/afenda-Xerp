import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ErpEmptyState } from "@/components/erp-empty-state";
import {
  isErpEmptyStateWithAction,
  SYSTEM_ADMIN_USERS_EMPTY_STATE,
} from "@/lib/erp/erp-empty-state.contract";

describe("ErpEmptyState", () => {
  it("renders static empty state with governed Card chrome and icon", () => {
    const { container } = render(
      <ErpEmptyState {...SYSTEM_ADMIN_USERS_EMPTY_STATE} />
    );

    expect(
      screen.getByText(SYSTEM_ADMIN_USERS_EMPTY_STATE.title)
    ).toBeInTheDocument();
    expect(
      screen.getByText(SYSTEM_ADMIN_USERS_EMPTY_STATE.description)
    ).toBeInTheDocument();
    expect(container.querySelector(".erp-empty-state__inner")).not.toBeNull();
    expect(container.querySelector(".erp-empty-state__icon")).not.toBeNull();
    expect(isErpEmptyStateWithAction(SYSTEM_ADMIN_USERS_EMPTY_STATE)).toBe(
      false
    );
  });

  it("renders optional action link for with-action variant", () => {
    render(
      <ErpEmptyState
        action={{ href: "/system-admin/users", label: "Open users" }}
        description="Invite flows arrive later."
        iconKey="users"
        title="No users yet"
        variant="with-action"
      />
    );

    expect(screen.getByRole("link", { name: "Open users" })).toHaveAttribute(
      "href",
      "/system-admin/users"
    );
  });
});
