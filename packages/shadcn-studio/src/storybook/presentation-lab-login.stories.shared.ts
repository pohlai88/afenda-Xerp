export const PRESENTATION_LAB_AUTH_LOGIN_TITLE =
  "Presentation Lab/Auth Login" as const;

/** Docs string only — CSF meta `title` must remain a string literal in each `*.stories.tsx` file. */
export const presentationLabAuthLoginComponentDocs = [
  "**Auth Login Lab** — governed editorial sign-in (A-lab). V1: Swiss Verification Gate · V2: Verdant Identity Vault · V3: Verdant Portal (ghost + vault) · V4: Swiss Operator Rail.",
  "",
  "| Registry pattern | Story | Layout |",
  "| --- | --- | --- |",
  "| `swiss-noir-verification-gate` | Swiss Noir Verification Gate | Side jewel |",
  "| `verdant-milk-identity-vault` | Verdant Milk Identity Vault | Ghost hero + jewel |",
  "| `verdant-centered-portal` | Verdant Centered Portal | Ghost hero + portal vault (laptop-fit) |",
  "| `swiss-noir-operator-rail` | Swiss Noir Operator Rail | Access rail + readout column |",
  "",
  "Contract slug ≠ registry ID — see `AUTH_PATTERN_TO_LOGIN_PATTERN` in login contract.",
  "CSS: static import per story file (`docs/swiss-noir.css` / `docs/verdant-noir.css`) — one theme per file for Vitest browser compatibility.",
  "Authority: `packages/shadcn-studio/docs/auth-ingress-ecosystem.md`.",
].join("\n");
