import { describe, expect, expectTypeOf, it } from "vitest";
import {
  AVATAR_PRIMITIVE_ID,
  AVATAR_SLOTS,
  avatarBadgeClassName,
  avatarFallbackClassName,
  avatarGroupClassName,
  avatarGroupCountClassName,
  avatarImageClassName,
  avatarPrimitiveMetadata,
  avatarRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./avatar.contract.js";
import type {
  AvatarBadgeProps,
  AvatarGroupCountProps,
  AvatarGroupProps,
  AvatarProps,
  AvatarSize,
  AvatarSlot,
} from "./avatar.js";

describe("avatar primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports AVATAR_PRIMITIVE_ID for metadata registries", () => {
    expect(AVATAR_PRIMITIVE_ID).toBe("shadcn-studio.ui.avatar");
  });

  it("exports AVATAR_SLOTS", () => {
    expect(AVATAR_SLOTS).toEqual({
      root: "avatar",
      image: "avatar-image",
      fallback: "avatar-fallback",
      badge: "avatar-badge",
      group: "avatar-group",
      groupCount: "avatar-group-count",
    });
  });

  it("exports governed class constants", () => {
    expect(avatarRootClassName).toContain("data-[size=profile]:size-20");
    expect(avatarImageClassName).toContain("object-cover");
    expect(avatarFallbackClassName).toContain("bg-muted");
    expect(avatarBadgeClassName).toContain("ring-background");
    expect(avatarGroupClassName).toContain("group/avatar-group");
    expect(avatarGroupCountClassName).toContain("group-has-data");
  });

  it("avatarPrimitiveMetadata is JSON-serializable", () => {
    const payload = avatarPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("AvatarSlot is a governed slot literal union", () => {
    expectTypeOf<AvatarSlot>().toEqualTypeOf<
      | "avatar"
      | "avatar-image"
      | "avatar-fallback"
      | "avatar-badge"
      | "avatar-group"
      | "avatar-group-count"
    >();
  });

  it("AvatarProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof AvatarProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("AvatarProps.size is AvatarSize union", () => {
    expectTypeOf<AvatarProps["size"]>().toEqualTypeOf<AvatarSize | undefined>();
    expectTypeOf<AvatarSize>().toEqualTypeOf<
      "default" | "lg" | "profile" | "sm"
    >();
  });

  it("composition slot props omit governed data-slot key", () => {
    type BadgeHasGovernedSlot = "data-slot" extends keyof AvatarBadgeProps
      ? true
      : false;
    type GroupHasGovernedSlot = "data-slot" extends keyof AvatarGroupProps
      ? true
      : false;
    type GroupCountHasGovernedSlot =
      "data-slot" extends keyof AvatarGroupCountProps ? true : false;

    expectTypeOf<BadgeHasGovernedSlot>().toEqualTypeOf<false>();
    expectTypeOf<GroupHasGovernedSlot>().toEqualTypeOf<false>();
    expectTypeOf<GroupCountHasGovernedSlot>().toEqualTypeOf<false>();
  });
});
