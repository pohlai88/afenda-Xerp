/**
 * Metadata state contracts.
 *
 * Authority:
 * - Defines state placeholder props for metadata-ui composition.
 * - Consumes MetadataRuntimeState from @afenda/metadata — does not redefine state vocabulary.
 */

import type { MetadataRuntimeState } from "@afenda/metadata";
import type { ReactNode } from "react";

export interface MetadataStateCopy {
  readonly title: string;
  readonly message: string;
}

export interface MetadataStateSlots {
  /**
   * Optional icon or marker supplied by the consuming shell.
   */
  readonly icon?: ReactNode;

  /**
   * Optional recovery or navigation action supplied by the consuming shell.
   */
  readonly action?: ReactNode;

  /**
   * Optional supporting detail or evidence supplied by the consuming shell.
   */
  readonly detail?: ReactNode;
}

export interface MetadataStateProps extends MetadataStateCopy {
  readonly state: MetadataRuntimeState;
  readonly slots?: MetadataStateSlots;
}

export type MetadataSpecificStateProps = Omit<MetadataStateProps, "state">;
