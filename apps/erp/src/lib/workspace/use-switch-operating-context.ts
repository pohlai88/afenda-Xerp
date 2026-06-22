"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  switchOperatingContextAction,
  type SwitchOperatingContextData,
  type SwitchOperatingContextInput,
} from "@/lib/context/context-switch.action";
import type { ServerActionResult } from "@/lib/server-actions/server-action-result";

export function useSwitchOperatingContext(): {
  readonly isPending: boolean;
  readonly switchContext: (
    input: SwitchOperatingContextInput
  ) => Promise<ServerActionResult<SwitchOperatingContextData>>;
} {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function switchContext(input: SwitchOperatingContextInput) {
    const result = await switchOperatingContextAction(input);

    if (result.ok) {
      startTransition(() => {
        router.refresh();
      });
    }

    return result;
  }

  return { isPending, switchContext };
}
