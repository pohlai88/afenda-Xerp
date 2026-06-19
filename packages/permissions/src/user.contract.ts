export type PlatformUserStatus =
  | "active"
  | "invited"
  | "suspended"
  | "deactivated";

/** Normalized platform actor contract — not Better Auth login identity. */
export interface PlatformUserContract {
  readonly displayName: string;
  readonly email: string;
  readonly id: string;
  readonly status: PlatformUserStatus;
}

/** Only active platform users may receive authority grants or act in ERP flows. */
export function isPlatformUserActive(
  user: Pick<PlatformUserContract, "status">
): boolean {
  return user.status === "active";
}
