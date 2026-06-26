import type { ReactNode } from "react";
import type { AuthEntryRouteId } from "@/lib/auth/auth-route.registry";
import { AuthEntryPage } from "./auth-entry-page";
import { AuthForm } from "./auth-form.compound";
import { AuthStatusMessage } from "./auth-status-message";

function AuthStateNotice({
  hints,
  lead,
  tone,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
  readonly tone: "neutral" | "positive" | "negative";
}) {
  if (tone === "positive") {
    return <AuthForm.NoticePositive hints={hints} lead={lead} />;
  }

  if (tone === "negative") {
    return <AuthForm.NoticeCaution hints={hints} lead={lead} />;
  }

  return <AuthForm.NoticeNeutral hints={hints} lead={lead} />;
}

export function AuthStatePage({
  children,
  hints,
  lead,
  route,
  tone = "neutral",
}: {
  readonly children?: ReactNode;
  readonly hints?: readonly string[];
  readonly lead: string;
  readonly route: AuthEntryRouteId;
  readonly tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <AuthEntryPage route={route}>
      <AuthForm.Root>
        <AuthStatusMessage tone={tone}>
          <AuthStateNotice hints={hints} lead={lead} tone={tone} />
        </AuthStatusMessage>
        {children}
      </AuthForm.Root>
    </AuthEntryPage>
  );
}
