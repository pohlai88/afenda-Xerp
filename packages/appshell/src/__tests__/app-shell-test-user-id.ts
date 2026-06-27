import {
  createTestEnterpriseId,
  parseUserId,
  type UserId,
} from "@afenda/kernel";

/** Stable canonical user id for AppShell contract and render tests. */
export function createAppShellTestUserId(
  body = "01ARZ3NDEKTSV4RRFFQ69G5FAV"
): UserId {
  return parseUserId(createTestEnterpriseId("user", body));
}
