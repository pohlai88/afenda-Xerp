/**
 * shadcn/studio — code-block-05 (staging reference only)
 * Source: @ss-components/code-block-05 · new-york-v4
 *
 * Raw MCP output — DO NOT import from consumer packages.
 * Normalized implementation: packages/ui/src/components/_storybook/code-block/
 *
 * Patterns extracted:
 *   - Multi-file tabs with filename labels in header
 *   - Shiki syntax highlighting with line numbers
 *   - Copy button in header row
 *   - tabs-11 underline variant for file switcher
 */
import { StorybookCodeBlock } from "../../_storybook/code-block/code-block";

const AvatarCode = `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AvatarComponent() {
  return (
    <Avatar>
      <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png' alt='Hallie Richards' />
      <AvatarFallback className='text-xs'>HR</AvatarFallback>
    </Avatar>
  )
}`;

const ButtonCode = `import { ArrowRightIcon } from "lucide-react"
import { Button } from '@/components/ui/button'

export default function ButtonIconHoverDemo() {
  return (
    <Button className='group'>
      Get In Touch
      <ArrowRightIcon className='transition-transform duration-200 group-hover:translate-x-0.5' />
    </Button>
  )
}`;

const CodeBlockTabs = () => {
  return (
    <StorybookCodeBlock
      files={[
        {
          filename: "avatar.tsx",
          code: AvatarCode,
          language: "tsx",
          showLineNumbers: true,
        },
        {
          filename: "button.tsx",
          code: ButtonCode,
          language: "tsx",
          showLineNumbers: true,
        },
      ]}
    />
  );
};

export default CodeBlockTabs;
