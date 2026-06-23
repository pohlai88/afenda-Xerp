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
  readonly message: string;
  readonly title: string;
}

export interface MetadataStateSlots {
  /**
   * Optional recovery or navigation action supplied by the consuming shell.
   */
  readonly action?: ReactNode;

  /**
   * Optional supporting detail or evidence supplied by the consuming shell.
   */
  readonly detail?: ReactNode;
  /**
   * Optional icon or marker supplied by the consuming shell.
   */
  readonly icon?: ReactNode;
}

export interface MetadataStateProps extends MetadataStateCopy {
  readonly slots?: MetadataStateSlots;
  readonly state: MetadataRuntimeState;
}

export type MetadataSpecificStateProps = Omit<MetadataStateProps, "state">;
