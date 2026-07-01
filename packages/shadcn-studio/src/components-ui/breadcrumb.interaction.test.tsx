import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { BREADCRUMB_SLOTS } from "./breadcrumb.contract";

describe("breadcrumb interaction", () => {
  it("renders nav with governed slots", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(
      screen.getByRole("navigation", { name: "breadcrumb" })
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${BREADCRUMB_SLOTS.root}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${BREADCRUMB_SLOTS.list}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${BREADCRUMB_SLOTS.item}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${BREADCRUMB_SLOTS.link}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${BREADCRUMB_SLOTS.page}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${BREADCRUMB_SLOTS.separator}"]`)
    ).toBeInTheDocument();
  });

  it("activates breadcrumb link on click", async () => {
    const user = setupUser();
    const onLinkClick = vi.fn((event: { preventDefault: () => void }) => {
      event.preventDefault();
    });

    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home" onClick={onLinkClick}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(onLinkClick).toHaveBeenCalled();
  });
});
