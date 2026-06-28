"use client";

import type { ApplicationShellContextSwitchTarget } from "@afenda/appshell";
import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useRouter } from "next/navigation";

export type AuthWorkspaceSelectPanelGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

import { useState } from "react";

import { useSwitchOperatingContext } from "@/lib/workspace/use-switch-operating-context";

export type AuthWorkspaceSelectPanelProps = {
  readonly linkClassName: string;
  readonly targets: readonly ApplicationShellContextSwitchTarget[];
};

export function AuthWorkspaceSelectPanel({
  linkClassName,
  targets,
}: AuthWorkspaceSelectPanelProps) {
  const router = useRouter();
  const { isPending, switchContext } = useSwitchOperatingContext();
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(target: ApplicationShellContextSwitchTarget) {
    setError(null);

    const result = await switchContext({
      companySlug: target.companySlug,
      ...(target.organizationSlug === undefined
        ? {}
        : { organizationSlug: target.organizationSlug }),
    });

    if (!result.ok) {
      setError(
        result.userMessage ??
          "Could not enter the selected workspace. Try again or contact support."
      );
      return;
    }

    router.replace("/");
    router.refresh();
  }

  if (targets.length === 0) {
    return (
      <p className={linkClassName}>
        <a className={linkClassName} href="/">
          Continue to workspace
        </a>
      </p>
    );
  }

  return (
    <div>
      <ul className="erp-auth-workspace-select__list">
        {targets.map((target) => (
          <li
            key={`${target.companySlug}:${target.organizationSlug ?? "root"}`}
          >
            <Button
              disabled={isPending}
              emphasis="solid"
              intent="primary"
              onClick={() => {
                void handleSelect(target);
              }}
              size="lg"
              type="button"
            >
              {target.label}
            </Button>
          </li>
        ))}
      </ul>
      {error === null ? null : (
        <p className="erp-auth-form__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
