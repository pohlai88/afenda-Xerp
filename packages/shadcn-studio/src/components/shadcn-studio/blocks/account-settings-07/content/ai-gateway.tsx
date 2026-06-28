"use client";

import { ChevronDownIcon, HandCoinsIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const presets = [20, 50, 100, 500];

const AiGateway = ({ defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [selected, setSelected] = useState<number>(500);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState<string>("");

  const format = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const displayAmount = () => {
    if (customMode) {
      const parsed = Number.parseFloat(customValue || "0");

      return Number.isNaN(parsed) ? format(0) : format(parsed);
    }

    return format(selected);
  };

  const onSelectPreset = (amt: number) => {
    setSelected(amt);
    setCustomMode(false);
    setCustomValue("");
  };

  const onSelectCustom = () => {
    setCustomMode(true);
    setCustomValue("");
  };

  const onContinue = () => {
    const amount = customMode
      ? Number.parseFloat(customValue || "0")
      : selected;

    console.log("Continue to payment with amount:", amount);
    setOpen(false);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">AI Gateway Credit</h3>
        <p className="text-muted-foreground text-sm">
          Purchase credit for AI Gateway. These are separate from any credit
          included in your Pro plan.
        </p>
      </div>

      {/* Content */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-8 items-center justify-center rounded-full border border-primary bg-muted">
                  <HandCoinsIcon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground text-sm">
                    Current Balance
                  </p>
                  <p className="font-medium text-sm">$0.00</p>
                </div>
              </div>
              <Dialog onOpenChange={setOpen} open={open}>
                <DialogTrigger asChild>
                  <Button>
                    <span>Buy Credit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-155 [&>[data-slot=dialog-close]>svg]:size-5">
                  <DialogHeader>
                    <div className="space-y-1">
                      <DialogTitle className="m-0 text-lg">
                        Buy AI Gateway Credit
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        Purchase credit as a one time top-up to use for your
                        team&apos;s AI Gateway usage. Credit expires 1 year
                        after purchase and is only valid for use on AI Gateway.
                      </DialogDescription>
                    </div>
                  </DialogHeader>

                  <div className="mt-4 text-center">
                    <div className="font-extrabold text-5xl tracking-tight">
                      {displayAmount()}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {presets.map((p) => (
                      <Button
                        className="rounded-md px-4 py-2"
                        key={p}
                        onClick={() => onSelectPreset(p)}
                        size="sm"
                        variant={
                          customMode || selected !== p ? "ghost" : "default"
                        }
                      >
                        ${p}
                      </Button>
                    ))}

                    <Button
                      className="rounded-md px-4 py-2"
                      onClick={onSelectCustom}
                      size="sm"
                      variant={customMode ? "default" : "ghost"}
                    >
                      Custom
                    </Button>
                  </div>

                  {customMode && (
                    <div className="mt-4 grid grid-cols-1 gap-2">
                      <Label htmlFor="custom-amount">Custom amount (USD)</Label>
                      <Input
                        id="custom-amount"
                        max="999999"
                        min="0"
                        onChange={(e) => {
                          const val = e.target.value;

                          if (
                            val === "" ||
                            (Number.parseFloat(val) <= 999_999 &&
                              val.replace(".", "").replace("-", "").length <= 9)
                          ) {
                            setCustomValue(val);
                          }
                        }}
                        placeholder="Enter amount"
                        step="0.01"
                        type="number"
                        value={customValue}
                      />
                    </div>
                  )}

                  <DialogFooter className="mt-6 gap-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={onContinue}>Continue to Payment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Separator className="my-4" />
            <Collapsible className="asChild flex flex-col gap-2">
              <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4">
                <p className="font-semibold text-sm">Auto Reload</p>
                <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                <span className="sr-only">Toggle</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Auto pay</p>
                  <Switch
                    checked={autoPayEnabled}
                    onCheckedChange={setAutoPayEnabled}
                  />
                </div>
                <div
                  className={`mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 ${autoPayEnabled ? "" : "opacity-60"}`}
                >
                  <div className="w-full space-y-2">
                    <Label
                      className={autoPayEnabled ? "" : "cursor-not-allowed"}
                      htmlFor="amount"
                    >
                      When balance falls below
                    </Label>
                    <div className="relative">
                      <Input
                        className="peer pr-9"
                        disabled={!autoPayEnabled}
                        id="amount"
                        placeholder="10"
                        type="tel"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-muted-foreground peer-disabled:opacity-50">
                        <p className="text-sm">USD</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <Label
                      className={autoPayEnabled ? "" : "cursor-not-allowed"}
                      htmlFor="set-amount"
                    >
                      Recharge to target balance
                    </Label>
                    <div className="relative">
                      <Input
                        className="peer pr-9"
                        disabled={!autoPayEnabled}
                        id="set-amount"
                        placeholder="30"
                        type="tel"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-muted-foreground peer-disabled:opacity-50">
                        <p className="text-sm">USD</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full space-y-2 md:col-span-2">
                    <Label
                      className={autoPayEnabled ? "" : "cursor-not-allowed"}
                      htmlFor="set-amount"
                    >
                      Maximum monthly spend
                    </Label>
                    <div className="relative">
                      <Input
                        className="peer pr-9"
                        disabled={!autoPayEnabled}
                        id="set-amount"
                        placeholder="30"
                        type="tel"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-muted-foreground peer-disabled:opacity-50">
                        <p className="text-sm">USD</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <Button disabled={!autoPayEnabled} variant="outline">
                    Cancel
                  </Button>
                  <Button disabled={!autoPayEnabled} type="submit">
                    Save Changes
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AiGateway;
