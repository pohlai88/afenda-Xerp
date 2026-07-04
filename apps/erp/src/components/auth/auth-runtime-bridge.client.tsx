"use client";

import { signIn } from "@afenda/auth/client";
import { useEffect, useState } from "react";

import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import type { AuthSurfaceConfig } from "@/lib/auth/auth-surface-config.server";

interface AuthRuntimeBridgeProps {
  readonly config: AuthSurfaceConfig;
  readonly path: string;
}

const FORM_IDS = {
  forgotPassword: "forgot-password-form-v1",
  login: "login-form-v1",
  mfaOtp: "mfa-otp-form-v1",
  mfaRecovery: "mfa-recovery-form-v1",
  register: "register-form-v1",
  resetPassword: "reset-password-form-v1",
} as const;

const noopCleanup = () => {
  return;
};

function readFormString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function postAuthEndpoint(
  endpoint: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const response = await fetch(`/api/auth${endpoint}`, {
    body: JSON.stringify(body),
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    method: "POST",
  });

  const payload: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      isRecord(payload) &&
      "message" in payload &&
      typeof payload["message"] === "string"
        ? payload["message"]
        : "Authentication request failed.";
    throw new Error(message);
  }

  return isRecord(payload) ? payload : {};
}

function readRedirectUrl(
  payload: Record<string, unknown>,
  fallback: string
): string {
  const url = payload["url"];
  return typeof url === "string" && url.length > 0 ? url : fallback;
}

function attachSubmitHandler(
  formId: string,
  handler: (formData: FormData) => Promise<void>
): () => void {
  const form = document.getElementById(formId);

  if (!(form instanceof HTMLFormElement)) {
    return noopCleanup;
  }

  const targetForm = form;

  function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    void handler(new FormData(targetForm));
  }

  targetForm.addEventListener("submit", onSubmit);
  return () => {
    targetForm.removeEventListener("submit", onSubmit);
  };
}

function attachActionLinks(
  labelPattern: RegExp,
  handler: () => Promise<void>
): () => void {
  const anchors = [...document.querySelectorAll("a")].filter((anchor) =>
    labelPattern.test(anchor.textContent ?? "")
  );

  function onClick(event: Event) {
    event.preventDefault();
    void handler();
  }

  for (const anchor of anchors) {
    anchor.addEventListener("click", onClick);
  }

  return () => {
    for (const anchor of anchors) {
      anchor.removeEventListener("click", onClick);
    }
  };
}

export function AuthRuntimeBridge({ config, path }: AuthRuntimeBridgeProps) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const cleanupHandlers: Array<() => void> = [];
    const run = async (task: () => Promise<void>) => {
      setMessage(null);
      try {
        await task();
      } catch (error: unknown) {
        setMessage(
          error instanceof Error ? error.message : "Authentication failed."
        );
      }
    };

    cleanupHandlers.push(
      attachSubmitHandler(FORM_IDS.login, async (formData) => {
        await run(async () => {
          const payload = await postAuthEndpoint("/sign-in/email", {
            callbackURL: config.nextPath,
            email: readFormString(formData, "email"),
            password: readFormString(formData, "password"),
            rememberMe: formData.get("rememberMe") === "on",
          });
          window.location.assign(readRedirectUrl(payload, config.nextPath));
        });
      })
    );

    cleanupHandlers.push(
      attachSubmitHandler(FORM_IDS.register, async (formData) => {
        await run(async () => {
          const invitationToken =
            readFormString(formData, "invitationToken") ||
            readFormString(formData, "invitationCode");
          await postAuthEndpoint("/sign-up/email", {
            callbackURL: AUTH_PATHS.verifyEmail.sent,
            email: readFormString(formData, "email"),
            invitationToken,
            name: readFormString(formData, "name"),
            password: readFormString(formData, "password"),
          });
          window.location.assign(AUTH_PATHS.verifyEmail.sent);
        });
      })
    );

    cleanupHandlers.push(
      attachSubmitHandler(FORM_IDS.forgotPassword, async (formData) => {
        await run(async () => {
          await postAuthEndpoint("/request-password-reset", {
            email: readFormString(formData, "email"),
            redirectTo: `${window.location.origin}${AUTH_PATHS.resetPassword.root}`,
          });
          window.location.assign(AUTH_PATHS.forgotPassword.success);
        });
      })
    );

    cleanupHandlers.push(
      attachSubmitHandler(FORM_IDS.resetPassword, async (formData) => {
        await run(async () => {
          const params = new URLSearchParams(window.location.search);
          await postAuthEndpoint("/reset-password", {
            newPassword: readFormString(formData, "newPassword"),
            token: readFormString(formData, "token") || params.get("token"),
          });
          window.location.assign(AUTH_PATHS.resetPassword.success);
        });
      })
    );

    cleanupHandlers.push(
      attachSubmitHandler(FORM_IDS.mfaOtp, async (formData) => {
        await run(async () => {
          await postAuthEndpoint("/two-factor/verify-otp", {
            code: readFormString(formData, "code"),
          });
          window.location.assign(config.nextPath);
        });
      })
    );

    cleanupHandlers.push(
      attachSubmitHandler(FORM_IDS.mfaRecovery, async (formData) => {
        await run(async () => {
          await postAuthEndpoint("/two-factor/verify-backup-code", {
            code: readFormString(formData, "recoveryCode"),
          });
          window.location.assign(config.nextPath);
        });
      })
    );

    if (config.socialProviderIds.includes("google")) {
      cleanupHandlers.push(
        attachActionLinks(/google/i, async () => {
          await run(async () => {
            const payload = await postAuthEndpoint("/sign-in/social", {
              callbackURL: config.nextPath,
              errorCallbackURL: AUTH_PATHS.oauth.error,
              provider: "google",
            });
            window.location.assign(readRedirectUrl(payload, config.nextPath));
          });
        })
      );
    }

    if (config.socialProviderIds.includes("github")) {
      cleanupHandlers.push(
        attachActionLinks(/github/i, async () => {
          await run(async () => {
            const payload = await postAuthEndpoint("/sign-in/social", {
              callbackURL: config.nextPath,
              errorCallbackURL: AUTH_PATHS.oauth.error,
              provider: "github",
            });
            window.location.assign(readRedirectUrl(payload, config.nextPath));
          });
        })
      );
    }

    if (config.passkeyEnabled && path === AUTH_PATHS.passkey.root) {
      cleanupHandlers.push(
        attachActionLinks(/passkey/i, async () => {
          await run(async () => {
            const result = await signIn.passkey();
            if (result.error) {
              throw new Error(
                result.error.message ?? "Passkey authentication failed."
              );
            }
            window.location.assign(config.nextPath);
          });
        })
      );
    }

    if (config.ssoEnabled && path === AUTH_PATHS.sso.root) {
      cleanupHandlers.push(
        attachActionLinks(/sso/i, async () => {
          await run(async () => {
            await postAuthEndpoint("/sign-in/sso", {
              callbackURL: config.nextPath,
            });
          });
        })
      );
    }

    return () => {
      for (const cleanupHandler of cleanupHandlers) {
        cleanupHandler();
      }
    };
  }, [config, path]);

  if (message === null) {
    return null;
  }

  return (
    <div
      className="fixed right-4 bottom-4 z-50 max-w-sm rounded-md border border-destructive/40 bg-background p-3 text-destructive text-sm shadow-lg"
      role="alert"
    >
      {message}
    </div>
  );
}
