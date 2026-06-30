import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "../avatar.js";

describe("avatar render", () => {
  it("renders fallback with governed root and fallback slots", () => {
    render(
      <Avatar data-size="sm">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("AB")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="avatar-fallback"]')
    ).toBeInTheDocument();
  });

  it("renders badge and group composition slots", () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
          <AvatarBadge aria-hidden />
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    );

    expect(screen.getByText("+3")).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="avatar-group"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="avatar-badge"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="avatar-group-count"]')
    ).toBeInTheDocument();
  });

  it("keeps governed data-slot when consumer passes override on badge", () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
        <AvatarBadge data-slot="wrong-badge">!</AvatarBadge>
      </Avatar>
    );

    expect(
      document.querySelector('[data-slot="avatar-badge"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="wrong-badge"]')
    ).not.toBeInTheDocument();
  });
});
