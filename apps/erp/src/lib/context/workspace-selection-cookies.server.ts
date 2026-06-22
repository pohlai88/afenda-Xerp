import { cookies } from "next/headers";

import {
  AFENDA_WORKSPACE_COMPANY_SLUG_COOKIE,
  AFENDA_WORKSPACE_ORGANIZATION_SLUG_COOKIE,
} from "./context.constants";

export interface WorkspaceSelectionCookieInput {
  readonly companySlug: string | null;
  readonly organizationSlug: string | null;
}

const WORKSPACE_SELECTION_COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
};

export async function readWorkspaceSelectionCookies(): Promise<WorkspaceSelectionCookieInput> {
  const cookieStore = await cookies();

  const companySlug =
    cookieStore.get(AFENDA_WORKSPACE_COMPANY_SLUG_COOKIE)?.value?.trim() ??
    null;
  const organizationSlug =
    cookieStore
      .get(AFENDA_WORKSPACE_ORGANIZATION_SLUG_COOKIE)
      ?.value?.trim() ?? null;

  return {
    companySlug: companySlug && companySlug.length > 0 ? companySlug : null,
    organizationSlug:
      organizationSlug && organizationSlug.length > 0 ? organizationSlug : null,
  };
}

export async function persistWorkspaceSelectionCookies(
  input: WorkspaceSelectionCookieInput
): Promise<void> {
  const cookieStore = await cookies();

  if (input.companySlug) {
    cookieStore.set(
      AFENDA_WORKSPACE_COMPANY_SLUG_COOKIE,
      input.companySlug,
      WORKSPACE_SELECTION_COOKIE_OPTIONS
    );
  } else {
    cookieStore.delete(AFENDA_WORKSPACE_COMPANY_SLUG_COOKIE);
  }

  if (input.organizationSlug) {
    cookieStore.set(
      AFENDA_WORKSPACE_ORGANIZATION_SLUG_COOKIE,
      input.organizationSlug,
      WORKSPACE_SELECTION_COOKIE_OPTIONS
    );
  } else {
    cookieStore.delete(AFENDA_WORKSPACE_ORGANIZATION_SLUG_COOKIE);
  }
}

export async function clearWorkspaceSelectionCookies(): Promise<void> {
  await persistWorkspaceSelectionCookies({
    companySlug: null,
    organizationSlug: null,
  });
}
