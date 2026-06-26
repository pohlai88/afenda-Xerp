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
  const hintProps = hints === undefined ? {} : { hints };

  if (tone === "positive") {
    return <AuthForm.NoticePositive {...hintProps} lead={lead} />;
  }

  if (tone === "negative") {
    return <AuthForm.NoticeCaution {...hintProps} lead={lead} />;
  }

  return <AuthForm.NoticeNeutral {...hintProps} lead={lead} />;
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
          <AuthStateNotice
            {...(hints === undefined ? {} : { hints })}
            lead={lead}
            tone={tone}
          />
        </AuthStatusMessage>
        {children}
      </AuthForm.Root>
    </AuthEntryPage>
  );
}
