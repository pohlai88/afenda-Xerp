import { redirect } from "next/navigation";

import { AUTH_V2_PATHS } from "@/lib/auth-v2/auth-v2-path.registry";
import { resolveAuthV2InviteAcceptRedirect } from "@/lib/auth-v2/auth-v2-redirect.policy";

export default async function AuthV2InviteAcceptPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const invitationToken = readParam(params["invitationToken"]);
  const email = readParam(params["email"]);

  if (invitationToken === undefined) {
    redirect(AUTH_V2_PATHS.invite.expired);
  }

  redirect(resolveAuthV2InviteAcceptRedirect(invitationToken, email));
}

function readParam(value: string | string[] | undefined): string | undefined {
  if (value === undefined) {
    return;
  }

  return Array.isArray(value) ? value[0] : value;
}
