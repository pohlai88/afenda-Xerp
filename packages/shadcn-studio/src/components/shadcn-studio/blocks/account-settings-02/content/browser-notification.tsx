import { CircleQuestionMarkIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BrowserNotification = () => {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Browser Notifications</h3>
        <p className="text-muted-foreground text-sm">
          Manage your browser notification settings and preferences.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 lg:col-span-2">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Checkbox id="assigned-to-you" />
            <Label className="font-medium text-sm" htmlFor="assigned-to-you">
              Assigned to You
            </Label>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox id="unassigned" />
            <Label className="font-medium text-sm" htmlFor="unassigned">
              Unassigned
            </Label>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox id="assigned-to-teams" />
            <Label className="font-medium text-sm" htmlFor="assigned-to-teams">
              Assigned to any of your teams
            </Label>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="flex items-center gap-1 font-medium text-sm">
            Play sound when your tab blinks
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleQuestionMarkIcon className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Play sound on alert</p>
              </TooltipContent>
            </Tooltip>
          </p>
          <Switch />
        </div>
      </div>
    </div>
  );
};

export default BrowserNotification;
