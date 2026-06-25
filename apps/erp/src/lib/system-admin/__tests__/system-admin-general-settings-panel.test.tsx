import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@afenda/appshell", () => ({
  AppShellAccountSettingsPanelSection: ({
    children,
    title,
  }: {
    children: ReactNode;
    title: string;
  }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

vi.mock("@/components/system-admin/system-admin-settings-form", () => ({
  SystemAdminSettingsForm: () => <form aria-label="Tenant settings form" />,
}));

import { SystemAdminGeneralSettingsPanel } from "@/components/system-admin/system-admin-general-settings-panel";

describe("SystemAdminGeneralSettingsPanel", () => {
  it("renders tenant form only — no full account-settings-01 block sections", () => {
    render(
      <SystemAdminGeneralSettingsPanel
        formValues={{
          sections: [],
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Tenant settings" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("form", { name: "Tenant settings form" })
    ).toBeInTheDocument();
    expect(screen.queryByText(/email & password/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/danger zone/i)).not.toBeInTheDocument();
  });
});
