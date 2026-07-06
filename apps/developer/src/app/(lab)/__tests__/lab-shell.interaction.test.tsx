import {
  type AppShellNavGroupWire,
  StudioPresentationProviders as ErpPresentationProviders,
} from "@afenda/shadcn-studio-v2/clients";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { labDemoContext } from "@/lib/lab/lab-demo-context";
import { __setMockPathname } from "@/test/mocks/next-navigation";
import { LabShell } from "../_components/lab-shell.client";

const navGroups = [
  {
    id: "dashboards",
    items: [
      {
        href: "/dashboard/sales",
        id: "dashboard.sales",
        isActive: false,
        label: "Sales route",
      },
      {
        href: "/settings/appearance",
        id: "settings.appearance",
        isActive: false,
        label: "Appearance route",
      },
    ],
    label: "Dashboards",
  },
] as const satisfies readonly AppShellNavGroupWire[];

function renderLabShell(pathname: string) {
  __setMockPathname(pathname);

  return render(
    <ErpPresentationProviders>
      <LabShell navGroups={navGroups} operatingContext={labDemoContext}>
        <section>
          <h1>Route content</h1>
        </section>
      </LabShell>
    </ErpPresentationProviders>
  );
}

describe("LabShell interaction", () => {
  it("renders the route-lab doctrine and labeled primary navigation", () => {
    renderLabShell("/dashboard/sales");

    expect(
      screen.getByRole("heading", { level: 2, name: "Afenda Route Lab" })
    ).toBeVisible();
    expect(
      screen.getByText(
        /Promotion-ready composition only; runtime authority remains in ERP\./
      )
    ).toBeVisible();
    expect(
      screen.getByRole("navigation", { name: "Primary navigation" })
    ).toBeVisible();
    expect(
      screen.getByText("No auth · No BFF · No tenant runtime")
    ).toBeVisible();
  });

  it("marks the matching route as active for nested route segments", () => {
    renderLabShell("/dashboard/sales/orders");

    const salesLink = screen.getByRole("link", { name: "Sales route" });
    const appearanceLink = screen.getByRole("link", {
      name: "Appearance route",
    });

    expect(salesLink).toHaveAttribute("aria-current", "page");
    expect(appearanceLink).not.toHaveAttribute("aria-current");

    expect(document.querySelector("[data-slot='sidebar-nav']")).not.toBeNull();
  });
});
