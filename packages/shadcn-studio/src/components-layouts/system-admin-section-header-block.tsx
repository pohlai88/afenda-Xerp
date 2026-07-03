export interface SystemAdminSectionHeaderBlockProps {
  readonly description: string;
  readonly title: string;
}

export function SystemAdminSectionHeaderBlock({
  description,
  title,
}: SystemAdminSectionHeaderBlockProps) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="font-semibold text-2xl">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </header>
  );
}
