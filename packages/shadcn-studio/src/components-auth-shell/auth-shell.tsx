import {
  resolveAuthShell,
  type AuthShellFormLane,
} from "./resolve-auth-shell.js";

export interface AuthShellProps {
  readonly lane?: AuthShellFormLane;
}

export function AuthShell({ lane = "access" }: AuthShellProps) {
  const ResolvedBlock = resolveAuthShell(lane);
  return <ResolvedBlock />;
}
