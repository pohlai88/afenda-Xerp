import { redirect } from "next/navigation";

import { resolveAuthV2OtpEntryRedirect } from "@/lib/auth-v2/auth-v2-redirect.policy";

export default function AuthV2OtpPage() {
  redirect(resolveAuthV2OtpEntryRedirect());
}
