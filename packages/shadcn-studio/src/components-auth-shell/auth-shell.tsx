import {
  type AuthShellFormLane,
  resolveAuthShell,
} from "./resolve-auth-shell.js";

export interface AuthShellProps {
  readonly lane?: AuthShellFormLane;
}

export function AuthShell({ lane }: AuthShellProps) {
  const ResolvedBlock = resolveAuthShell(lane);
  return <ResolvedBlock />;
}
