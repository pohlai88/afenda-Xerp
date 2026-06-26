import { redirect } from "next/navigation";

import { resolveOtpEntryRedirect } from "@/lib/auth/auth-redirect.policy";

export default function OtpPage() {
  redirect(resolveOtpEntryRedirect());
}
