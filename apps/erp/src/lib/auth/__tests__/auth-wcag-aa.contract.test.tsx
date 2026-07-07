// @vitest-environment jsdom

import { render, screen } from "@afenda/testing/react";
import { describe, expect, it } from "vitest";

import { AuthBlockFormPreview } from "@/components/auth/auth-block-form-preview.client";
import { getAuthBlockSlotsForBlockId } from "@/lib/auth/auth-block-slot.registry";
import { AUTH_ROUTE_CATALOG } from "@/lib/auth/auth-route-catalog";
import {
  AUTH_ADJACENT_AUTH_BLOCK_IDS,
  AUTH_ADJACENT_SURFACE_PATHS,
  AUTH_ADJACENT_WCAG_REQUIRED_SLOTS,
} from "@/lib/auth/auth-wcag-adjacent.registry";

describe("auth-adjacent WCAG AA contract (PAS-006C P06-007)", () => {
  it("includes catalog paths that declare WCAG slots in auth-adjacent surfaces", () => {
    for (const entry of AUTH_ROUTE_CATALOG.filter(
      (route) => route.wcagRequiredSlots.length > 0
    )) {
      expect(AUTH_ADJACENT_SURFACE_PATHS).toContain(entry.path);
    }
  });

  it("renders login-page-04 form slots and accessible controls for runtime bridge", () => {
    render(<AuthBlockFormPreview blockId="login-page-04" />);

    expect(document.getElementById("login-form-v1")).toBeInTheDocument();
    expect(
      document.querySelector('[data-afenda-slot="login.email"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-afenda-slot="login.password"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-afenda-slot="login.submit"]')
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("maps login block slots required for WCAG form labels", () => {
    for (const blockId of AUTH_ADJACENT_AUTH_BLOCK_IDS) {
      const slots = getAuthBlockSlotsForBlockId(blockId);
      expect(slots.length).toBeGreaterThan(0);

      for (const requiredSlotId of AUTH_ADJACENT_WCAG_REQUIRED_SLOTS[blockId] ??
        []) {
        expect(slots.some((slot) => slot.slotId === requiredSlotId)).toBe(true);
      }
    }
  });
});
