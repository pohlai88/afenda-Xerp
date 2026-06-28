/**
 * MCP provenance: B40 manual seed equivalent — placeholder block inventory.
 * Source: shadcn-studio /cui block slot (minimal seed; MCP unavailable in agent environment).
 */
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export interface PlaceholderHeroBlockProps {
  actionLabel?: string;
  description?: string;
  title?: string;
}

export function PlaceholderHeroBlock({
  title = "Studio presentation seed",
  description = "B40 MCP inventory placeholder — replace via /cui when MCP is available.",
  actionLabel = "Explore presets",
}: PlaceholderHeroBlockProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button type="button">{actionLabel}</Button>
      </CardContent>
    </Card>
  );
}

export default PlaceholderHeroBlock;
