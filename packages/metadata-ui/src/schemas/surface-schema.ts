import type { MetadataSurfaceContract } from "../contracts/metadata-surface.contract";
import { validateMetadataAction } from "./action-schema";
import {
  type MetadataSchemaValidationResult,
  validateMetadataSection,
} from "./section-schema";

export const validateMetadataSurface = (
  surface: MetadataSurfaceContract
): MetadataSchemaValidationResult => {
  const errors: string[] = [];

  if (surface.sections.length === 0) {
    errors.push("Metadata surfaces must declare at least one section.");
  }

  for (const section of surface.sections) {
    errors.push(...validateMetadataSection(section).errors);
  }

  for (const action of surface.actions) {
    errors.push(...validateMetadataAction(action).errors);
  }

  return {
    errors,
    valid: errors.length === 0,
  };
};
