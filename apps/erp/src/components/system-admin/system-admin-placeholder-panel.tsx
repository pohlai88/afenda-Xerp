import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";

export interface SystemAdminPlaceholderPanelProps {
  readonly body: string;
  readonly description: string;
  readonly title: string;
}

export function SystemAdminPlaceholderPanel({
  body,
  description,
  title,
}: SystemAdminPlaceholderPanelProps) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{body}</p>
      </CardContent>
    </Card>
  );
}
