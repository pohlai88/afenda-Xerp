export const SAMPLE_AVATAR_CODE = `import { Avatar, AvatarFallback, AvatarImage } from "@afenda/ui"

export default function AvatarComponent() {
  return (
    <Avatar>
      <AvatarImage src="/avatar.png" alt="Hallie Richards" />
      <AvatarFallback>HR</AvatarFallback>
    </Avatar>
  )
}`;

export const SAMPLE_BUTTON_CODE = `import { ArrowRightIcon } from "lucide-react"
import { Button } from "@afenda/ui"

export default function ButtonIconHoverDemo() {
  return (
    <Button intent="primary" emphasis="solid">
      Get In Touch
      <ArrowRightIcon />
    </Button>
  )
}`;

export const SAMPLE_DOCS_COPY_WORKFLOW = `// apps/docs — copy from Storybook, swap tokens:
// --docs-preview-* → --docs-editorial-*

export function DocsGuideCardGrid({ items }: DocsGuideCardGridProps) {
  return (
    <section className="afenda-docs-guide-grid">
      {items.map((item) => (
        <a key={item.href} href={item.href}>
          <Card radius="lg" shadow="raised">
            <CardTitle>{item.title}</CardTitle>
          </Card>
        </a>
      ))}
    </section>
  )
}`;

export const CODE_BLOCK_TAB_FILES = [
  {
    filename: "avatar.tsx",
    code: SAMPLE_AVATAR_CODE,
    language: "tsx" as const,
    showLineNumbers: true,
  },
  {
    filename: "button.tsx",
    code: SAMPLE_BUTTON_CODE,
    language: "tsx" as const,
    showLineNumbers: true,
  },
] as const;

export const CODE_BLOCK_HIGHLIGHT_DEMO = {
  filename: "workflow.tsx",
  code: SAMPLE_DOCS_COPY_WORKFLOW,
  language: "tsx" as const,
  highlightLines: [1, 2, 3, 4],
  showLineNumbers: true,
} as const;
