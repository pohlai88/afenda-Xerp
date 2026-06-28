import {
  RENDERER_COMPATIBILITY_RULES,
  type RendererCapability,
  type SectionType,
} from "@afenda/ui-composition";

export function isRendererCapabilityCompatible(
  capability: RendererCapability,
  sectionType: SectionType
): boolean {
  return RENDERER_COMPATIBILITY_RULES.some(
    (rule) => rule.capability === capability && rule.sectionType === sectionType
  );
}
