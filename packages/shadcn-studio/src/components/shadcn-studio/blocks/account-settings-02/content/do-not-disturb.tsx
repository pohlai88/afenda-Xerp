"use client";

import { BellIcon, BellOffIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const DoNotDisturb = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Do Not Disturb</h3>
        <p className="text-muted-foreground text-sm">
          Adjust your Do Not Disturb settings and preferences.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 lg:col-span-2">
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-3">
                <Label className="px-1">Notifications</Label>
                <Button
                  aria-label="Toggle dark mode"
                  className={cn(
                    isDark
                      ? "border-sky-600 text-sky-600! hover:bg-sky-600/10 focus-visible:border-sky-600 focus-visible:ring-sky-600/20 dark:border-sky-400 dark:text-sky-400! dark:focus-visible:border-sky-400 dark:focus-visible:ring-sky-400/40 dark:hover:bg-sky-400/10"
                      : ""
                  )}
                  onClick={() => setIsDark(!isDark)}
                  variant="outline"
                >
                  {isDark ? <BellOffIcon /> : <BellIcon />}
                  {isDark ? "Disable Notifications" : "Enable Notifications"}
                </Button>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  <Label className="px-1" htmlFor="time-from">
                    From
                  </Label>
                  <Input
                    className="appearance-none bg-background max-sm:text-sm [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    defaultValue="01:30:00"
                    id="time-from"
                    step="1"
                    type="time"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label className="px-1" htmlFor="time-to">
                    To
                  </Label>
                  <Input
                    className="appearance-none bg-background max-sm:text-sm [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    defaultValue="02:30:00"
                    id="time-to"
                    step="1"
                    type="time"
                  />
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex w-full flex-col gap-3">
              <Label className="px-1">Do not disturb me on my days off</Label>
              <div className="col-span-2 md:col-span-3">
                <ToggleGroup
                  className="gap-2 [&>[data-slot=toggle-group-item]]:size-8 [&>[data-slot=toggle-group-item]]:rounded-full! [&>[data-slot=toggle-group-item]]:bg-muted [&>[data-state=on]]:bg-primary [&>[data-state=on]]:text-primary-foreground"
                  defaultValue={["saturday"]}
                  type="multiple"
                >
                  <ToggleGroupItem value="sunday">S</ToggleGroupItem>
                  <ToggleGroupItem value="monday">M</ToggleGroupItem>
                  <ToggleGroupItem value="tuesday">T</ToggleGroupItem>
                  <ToggleGroupItem value="wednesday">W</ToggleGroupItem>
                  <ToggleGroupItem value="thursday">T</ToggleGroupItem>
                  <ToggleGroupItem value="friday">F</ToggleGroupItem>
                  <ToggleGroupItem value="saturday">S</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoNotDisturb;
