import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Avatar governance", () => {
  it("keeps governed data attributes authoritative on Avatar root", () => {
    render(
      <Avatar
        data-component="Override"
        data-recipe="override"
        data-size="lg"
        data-slot="override"
        data-state="fake"
        size="sm"
      >
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByText("AB").parentElement;

    expect(avatar).not.toBeNull();
    expectGovernedDataAuthority(avatar as HTMLElement, {
      "data-component": "Avatar",
      "data-recipe": "form-control",
      "data-size": "sm",
      "data-slot": "avatar",
      "data-state": "ready",
    });
    expectGovernedPrimitive(avatar as HTMLElement, {
      component: "Avatar",
      slot: "avatar",
      recipe: "form-control",
      state: "ready",
    });
  });

  it("applies governed state and size to Avatar root", () => {
    render(
      <Avatar data-testid="avatar-root" size="lg" state="loading">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByTestId("avatar-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
    expect(screen.getByTestId("avatar-root")).toHaveAttribute(
      "data-size",
      "lg"
    );
  });

  it("renders AvatarFallback with governed slot", () => {
    render(
      <Avatar>
        <AvatarImage alt="Jane Doe" src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    // Radix Avatar omits AvatarImage from the DOM in jsdom until an image load event fires.
    expect(screen.getByText("JD")).toHaveAttribute(
      "data-slot",
      "avatar-fallback"
    );
  });

  it("keeps governed data attributes authoritative on AvatarBadge", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge
          data-component="Override"
          data-slot="override"
          data-tone="danger"
          tone="success"
        />
      </Avatar>
    );

    const badge = screen
      .getByText("JD")
      .parentElement?.querySelector("[data-slot='avatar-badge']");

    expect(badge).not.toBeNull();
    expectGovernedDataAuthority(badge as HTMLElement, {
      "data-component": "Avatar",
      "data-recipe": "form-control",
      "data-slot": "avatar-badge",
      "data-state": "ready",
      "data-tone": "success",
    });
  });

  it("forwards refs to Avatar, AvatarFallback, and AvatarBadge", () => {
    const avatarRef = createRef<HTMLSpanElement>();
    const fallbackRef = createRef<HTMLSpanElement>();
    const badgeRef = createRef<HTMLSpanElement>();

    render(
      <Avatar ref={avatarRef}>
        <AvatarFallback ref={fallbackRef}>AB</AvatarFallback>
        <AvatarBadge ref={badgeRef} tone="success" />
      </Avatar>
    );

    expect(avatarRef.current).toBe(screen.getByText("AB").parentElement);
    expect(fallbackRef.current).toBe(screen.getByText("AB"));
    expect(badgeRef.current).toHaveAttribute("data-slot", "avatar-badge");
  });

  it("renders AvatarGroup and AvatarGroupCount with governed slots", () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    );

    expect(screen.getByText("+3")).toHaveAttribute(
      "data-slot",
      "avatar-group-count"
    );
    expect(
      screen.getByText("A").closest("[data-slot='avatar-group']")
    ).not.toBeNull();
  });

  it("preserves fallback accessibility labels", () => {
    render(
      <Avatar>
        <AvatarFallback aria-label="Jane Doe">JD</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByLabelText("Jane Doe")).toHaveTextContent("JD");
  });
});
