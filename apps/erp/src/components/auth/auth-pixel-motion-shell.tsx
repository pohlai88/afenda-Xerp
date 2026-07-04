import type { AuthIngressCanonicalPath } from "@/lib/auth/auth-ingress-surface.registry";
import type { AuthLane } from "@/lib/auth/auth-path.registry";

import { AuthPixelCanvas } from "./auth-pixel-canvas.client";

interface AuthPixelMotionShellProps {
  readonly lane: AuthLane;
  readonly path: AuthIngressCanonicalPath;
  readonly title: string;
}

export function AuthPixelMotionShell({
  lane,
  path,
  title,
}: AuthPixelMotionShellProps) {
  return (
    <div
      aria-hidden="true"
      className="auth-pixel-shell"
      data-auth-pixel-lane={lane}
      data-auth-pixel-path={path}
    >
      <div className="auth-pixel-readout">
        <span>{lane} lane</span>
        <span>{title}</span>
      </div>
      <div className="auth-pixel-visual">
        <div className="auth-pixel-visual-inner">
          <AuthPixelCanvas />
        </div>
      </div>
    </div>
  );
}
