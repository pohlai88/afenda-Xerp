export interface SystemAdminSectionHeaderProps {
  readonly description: string;
  readonly title: string;
}

export function SystemAdminSectionHeader({
  description,
  title,
}: SystemAdminSectionHeaderProps) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="font-semibold text-2xl">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </header>
  );
}
