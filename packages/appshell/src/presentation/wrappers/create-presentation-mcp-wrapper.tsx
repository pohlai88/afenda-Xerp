"use client";

import type { ComponentType } from "react";

import type { PresentationMcpWrapperStatus } from "./presentation-mcp-wrapper.types";

export interface CreatePresentationMcpWrapperOptions<P extends object> {
  readonly BridgeComponent?: ComponentType<P>;
  /** Required when status is governed-compose or afenda-only; optional for delegating-only. */
  readonly GovernedComponent?: ComponentType<P>;
  readonly shellClassName?: string;
  readonly status: PresentationMcpWrapperStatus;
}

function joinClassNames(...values: readonly (string | undefined)[]): string {
  return values
    .filter((value) => value !== undefined && value.length > 0)
    .join(" ");
}

/**
 * Strangler factory — returns bridge delegate when Governed UI safe, otherwise governed compose.
 */
export function createPresentationMcpWrapper<P extends object>(
  options: CreatePresentationMcpWrapperOptions<P>
): ComponentType<P> {
  const { BridgeComponent, GovernedComponent, shellClassName, status } =
    options;

  if (status === "delegating" && BridgeComponent !== undefined) {
    const ResolvedBridgeComponent = BridgeComponent;

    function DelegatingPresentationWrapper(props: P) {
      if (shellClassName === undefined) {
        return <ResolvedBridgeComponent {...props} />;
      }

      return (
        <div className={joinClassNames(shellClassName)}>
          <ResolvedBridgeComponent {...props} />
        </div>
      );
    }

    return DelegatingPresentationWrapper;
  }

  if (GovernedComponent === undefined) {
    throw new Error(
      "createPresentationMcpWrapper: GovernedComponent is required when status is not delegating with a bridge twin"
    );
  }

  return GovernedComponent;
}
