import type { StateContract } from "../contracts/state.contract";

export const statePolicy = {
  states: [
    {
      state: "loading",
      tone: "info",
      ariaLive: "polite",
      requiredCopyRole: "description",
    },
    {
      state: "empty",
      tone: "neutral",
      ariaLive: "off",
      requiredCopyRole: "description",
    },
    {
      state: "error",
      tone: "danger",
      ariaLive: "assertive",
      requiredCopyRole: "error",
    },
    {
      state: "forbidden",
      tone: "forbidden",
      ariaLive: "assertive",
      requiredCopyRole: "error",
    },
    {
      state: "invalid",
      tone: "invalid",
      ariaLive: "polite",
      requiredCopyRole: "error",
    },
    {
      state: "ready",
      tone: "success",
      ariaLive: "off",
      requiredCopyRole: "label",
    },
  ],
} as const satisfies StateContract;
