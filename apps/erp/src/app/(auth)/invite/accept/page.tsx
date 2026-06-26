import { redirect } from "next/navigation";

import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import { resolveInviteAcceptRedirect } from "@/lib/auth/auth-redirect.policy";

export default async function AuthInviteAcceptPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const invitationToken = readParam(params["invitationToken"]);
  const email = readParam(params["email"]);

  if (invitationToken === undefined) {
    redirect(AUTH_PATHS.invite.expired);
  }

  redirect(resolveInviteAcceptRedirect(invitationToken, email));
}

function readParam(value: string | string[] | undefined): string | undefined {
  if (value === undefined) {
    return;
  }

  return Array.isArray(value) ? value[0] : value;
}
