import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SystemAdminSettingsForm } from "@/components/system-admin/system-admin-settings-form";
import { createModuleRouteOperatingContext } from "@/lib/modules/__tests__/module-route-test-fixtures";
import { resolveSystemAdminSettingsFormValues } from "@/lib/system-admin/resolve-system-admin-settings-form-values";
import { SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE } from "@/lib/system-admin/system-admin-settings.copy.contract";

const mockUpdateSystemAdminSettingsAction = vi.fn();

vi.mock("@/lib/system-admin/update-system-admin-settings.action", () => ({
  updateSystemAdminSettingsAction: (
    ...args: Parameters<typeof mockUpdateSystemAdminSettingsAction>
  ) => mockUpdateSystemAdminSettingsAction(...args),
}));

describe("SystemAdminSettingsForm", () => {
  it("renders governed read-only field sections sourced from form values", () => {
    const formValues = resolveSystemAdminSettingsFormValues(
      createModuleRouteOperatingContext()
    );

    render(<SystemAdminSettingsForm formValues={formValues} />);

    expect(screen.getByRole("heading", { name: "Tenant" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Legal entity" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Permission scope" })
    ).toBeInTheDocument();
    expect(
      document.getElementById("system-admin-settings-tenant.displayName")
    ).toHaveValue("Acme");
    expect(
      document.getElementById("system-admin-settings-tenant.slug")
    ).toHaveValue("acme");
    expect(
      screen.getByRole("button", { name: "Save settings" })
    ).toBeInTheDocument();
  });

  it("allows editing the tenant display name", () => {
    const formValues = resolveSystemAdminSettingsFormValues(
      createModuleRouteOperatingContext()
    );

    render(<SystemAdminSettingsForm formValues={formValues} />);

    const displayNameInput = document.getElementById(
      "system-admin-settings-tenant.displayName"
    );
    expect(displayNameInput).not.toHaveAttribute("readonly");
    expect(displayNameInput).toHaveAttribute("name", "companyName");
  });

  it("surfaces permission denial messages from the server action", async () => {
    mockUpdateSystemAdminSettingsAction.mockResolvedValueOnce({
      ok: false,
      code: "FORBIDDEN",
      userMessage: SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE,
    });

    const formValues = resolveSystemAdminSettingsFormValues(
      createModuleRouteOperatingContext()
    );
    const user = setupUser();

    render(<SystemAdminSettingsForm formValues={formValues} />);

    await user.click(screen.getByRole("button", { name: "Save settings" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE
    );
  });
});
