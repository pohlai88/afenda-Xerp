/**
 * shadcn/studio — toggle-13 (staging reference only)
 * Source: @ss-components/toggle-13 · new-york-v4
 *
 * Raw MCP output — DO NOT import from consumer packages.
 * Normalized implementation: packages/ui/src/components/_storybook/toggle/
 *
 * Patterns extracted:
 *   - MotionToggle particle burst on press
 *   - Heart icon fills destructive tone when toggled on
 *   - Icon + label children inside governed Toggle
 */
import { HeartIcon } from "lucide-react";
import { MotionToggle } from "../../_storybook/toggle/motion-toggle";

const ToggleAnimatedDemo = () => {
  return (
    <MotionToggle
      aria-label="Toggle bookmark"
      particleColor="var(--destructive)"
    >
      <HeartIcon />
      Shadcn Studio
    </MotionToggle>
  );
};

export default ToggleAnimatedDemo;
