import type { ExceptionContract } from "../contracts/exception.contract.js";

export const exceptionContract: ExceptionContract = {
  exceptions: [
    {
      id: "ARCH-EXC-UI-001",
      status: "active",
      owner: "Design Authority",
      evidence: [
        ".cursor/rules/governed-ui-consumption.mdc",
        "packages/design-system/src/contracts/design-system-authority.contract.ts",
      ],
      adr: "Governed UI policy",
      approvedBy: "Design Authority",
      expiresAt: "2027-06-20T00:00:00.000Z",
      packageName: "@afenda/ui",
      reason:
        "@afenda/ui consumes governed variant and token vocabulary from @afenda/design-system per component.contract.ts.",
      subject: "@afenda/ui → @afenda/design-system",
    },
  ],
};
