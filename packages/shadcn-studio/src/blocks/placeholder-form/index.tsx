/**
 * MCP provenance: B40 manual seed equivalent — placeholder block inventory.
 * Source: shadcn-studio /cui block slot (minimal seed; MCP unavailable in agent environment).
 */
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export interface PlaceholderFormBlockProps {
  fieldLabel?: string;
  selectPlaceholder?: string;
}

export function PlaceholderFormBlock({
  fieldLabel = "Workspace name",
  selectPlaceholder = "Select preset",
}: PlaceholderFormBlockProps) {
  return (
    <div
      className="flex max-w-sm flex-col gap-4 rounded-xl border border-dashed p-6"
      data-slot="placeholder-form-block"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="placeholder-form-input">{fieldLabel}</Label>
        <Input id="placeholder-form-input" placeholder="Enter value" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="placeholder-form-select">Theme preset</Label>
        <Select>
          <SelectTrigger className="w-full" id="placeholder-form-select">
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="zinc">Zinc</SelectItem>
            <SelectItem value="rose">Rose</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default PlaceholderFormBlock;
