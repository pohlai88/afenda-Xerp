import type { ExceptionContract } from "../contracts/exception.contract.js";

export const exceptionContract: ExceptionContract = {
  exceptions: [
    {
      adr: "TIP-004",
      approvedBy: "Design Authority",
      expiresAt: "2027-06-20T00:00:00.000Z",
      packageName: "@afenda/ui",
      reason:
        "@afenda/ui consumes governed variant and token vocabulary from @afenda/design-system per component.contract.ts.",
      subject: "@afenda/ui → @afenda/design-system",
    },
  ],
};
