"use client";

import { useEffect, useState } from "react";
import { blockSlotDomMarkerProps } from "../../../../../contracts/block-slot-dom-marker.contract.js";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const SpendManagement = () => {
  const [enabled, setEnabled] = useState(true);
  const [animatedProgress, setAnimatedProgress] = useState(79);
  const [instantProgress, setInstantProgress] = useState(79);

  const usedAmount = 317;
  const limitAmount = 400;
  const targetProgress = enabled ? 79 : 0;

  // Update instant progress immediately for label
  useEffect(() => {
    setInstantProgress(targetProgress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Smooth animation only for the progress bar visual
  useEffect(() => {
    const duration = 600; // Animation duration in ms
    const steps = 30; // Number of animation steps
    const stepDuration = duration / steps;

    const startValue = animatedProgress;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep >= steps) {
        setAnimatedProgress(targetProgress);
        clearInterval(interval);
      } else {
        // Easing function for smooth animation
        const progress = currentStep / steps;
        const easeOut = 1 - (1 - progress) ** 3;
        const newValue = startValue + (targetProgress - startValue) * easeOut;

        setAnimatedProgress(newValue);
      }
    }, stepDuration);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetProgress]);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Spend Management</h3>
        <p className="text-muted-foreground text-sm">
          Manage your spend and subscription options.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 lg:col-span-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="relative">
              <CircularProgress
                className="stroke-border"
                size={52}
                strokeWidth={5}
                value={animatedProgress}
              />
              {/* Custom instant label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-medium text-xs">
                  {Math.round(instantProgress)}%
                </span>
              </div>
            </div>
            <div>
              <p className="font-medium text-sm">
                ${enabled ? usedAmount : 0} / {enabled ? limitAmount : 0}
              </p>
              <p>
                {enabled
                  ? "Spend management enabled"
                  : "Spend management disabled"}
              </p>
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={(v) => setEnabled(!!v)} />
        </div>
        <div
          aria-hidden={!enabled}
          className={cn(
            "transition-all duration-300 ease-in-out",
            enabled ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <form>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-start gap-1">
                <Label htmlFor="set-amount">Set amount ($)</Label>
                <Input id="set-amount" placeholder="350" type="tel" />
              </div>
              <div className="flex flex-col items-start gap-1 sm:col-span-2">
                <Label htmlFor="email">Provide email for notifications</Label>
                <Input
                  id="email"
                  placeholder="organization@example.com"
                  type="email"
                />
              </div>
            </div>
          </form>
          <div className="mt-6 flex justify-end">
            <Button {...blockSlotDomMarkerProps("profile.save")} className="max-sm:w-full" type="submit">
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendManagement;
