"use client";

import { MessageSquareTextIcon, SettingsIcon } from "lucide-react";
import { type ReactElement, useState } from "react";

import { blockSlotDomMarkerProps } from "../../../../contracts/block-slot-dom-marker.contract.js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";

type Props = {
  trigger: ReactElement;
  defaultOpen?: boolean;
  className?: string;
};

// Main VerifyDialog component
const VerifyDialog = ({ defaultOpen = false, trigger, className }: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const [authType, setAuthType] = useState<string>("authenticator-app");
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);

    if (authType !== "authenticator-app") {
      setAuthType("authenticator-app");
    }
  };

  const handleAuthDialogClose = () => {
    setShowAuthDialog(false);

    if (authType !== "authenticator-app") {
      setTimeout(() => {
        setAuthType("authenticator-app");
      }, 250);
    }
  };

  const handleContinue = () => {
    setOpen(false);
    setShowAuthDialog(true);
  };

  // SMS Dialog Component
  const SMSDialog = () => (
    <DialogContent className="flex flex-col gap-0 p-0 max-sm:max-h-[min(650px,80vh)] sm:max-w-145 [&>[data-slot=dialog-close]>svg]:size-5">
      <ScrollArea className="flex max-h-full flex-col overflow-hidden">
        <div className="flex flex-col gap-4 p-6">
          <DialogHeader className="items-center text-center">
            <DialogTitle className="leading-7">
              Enable One Time Password
            </DialogTitle>
            <DialogDescription>
              Verify Your mobile number for SMS
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              Enter your mobile phone number with country code and we will send
              you a verification code.
            </p>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                maxLength={10}
                placeholder="202 555 0111"
                type="tel"
              />
            </div>
          </div>

          <DialogFooter className="gap-4">
            <Button onClick={handleAuthDialogClose} size="lg">
              Send OTP
            </Button>
            <DialogClose
              render={
                <Button
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                  onClick={handleAuthDialogClose}
                  size="lg"
                />
              }
            >
              Cancel
            </DialogClose>
          </DialogFooter>
        </div>
      </ScrollArea>
    </DialogContent>
  );

  // Authenticator App Dialog Component
  const AppDialog = () => (
    <DialogContent className="flex flex-col gap-0 p-0 max-sm:max-h-[min(650px,80vh)] sm:max-w-185 [&>[data-slot=dialog-close]>svg]:size-5">
      <ScrollArea className="flex max-h-full flex-col overflow-hidden">
        <div className="flex flex-col gap-6 p-6">
          <DialogHeader className="items-center text-center">
            <DialogTitle className="leading-7">
              Add Authenticator App
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Authenticator Apps</h3>
              <p className="text-muted-foreground text-sm">
                Using an authenticator app like Google Authenticator, Microsoft
                Authenticator, Authy, or 1Password, scan the QR code. It will
                generate a 6-digit code for you to enter below.
              </p>
            </div>

            <img
              alt="QR Code"
              className="mx-auto w-37.5"
              src="https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/image-7.png"
            />

            <Alert className="border-none bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
              <AlertTitle>ASDLKNASDA9AHS678dGhASD78AB</AlertTitle>
              <AlertDescription className="text-amber-600/80 dark:text-amber-400/80">
                If you&apos;re having trouble using the QR code, select manual
                entry on your app
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="auth-code">Enter Authentication Code</Label>
              <Input
                className="text-base"
                id="auth-code"
                placeholder="123 456"
              />
            </div>
          </div>

          <DialogFooter className="gap-4">
            <DialogClose
              render={
                <Button
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                  onClick={handleAuthDialogClose}
                  size="lg"
                />
              }
            >
              Cancel
            </DialogClose>
            <Button onClick={handleAuthDialogClose} size="lg">
              Submit
            </Button>
          </DialogFooter>
        </div>
      </ScrollArea>
    </DialogContent>
  );

  // Main Return
  return (
    <div>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger onClick={() => setOpen(true)} render={trigger} />
        <DialogContent
          className={cn(
            "flex flex-col gap-0 p-0 max-sm:max-h-[min(650px,80vh)] sm:max-w-145 [&>[data-slot=dialog-close]>svg]:size-5",
            className
          )}
        >
          <ScrollArea className="flex max-h-full flex-col overflow-hidden">
            <div className="flex flex-col gap-4 p-6">
              <DialogHeader {...blockSlotDomMarkerProps("dialog.header")} className="items-center text-center">
                <DialogTitle className="leading-7">
                  Select Authentication Method
                </DialogTitle>
                <DialogDescription>
                  You also need to select a method by which the proxy
                  authenticates to the directory server.
                </DialogDescription>
              </DialogHeader>

              <div {...blockSlotDomMarkerProps("dialog.body")} className="flex flex-col gap-6">
                <RadioGroup
                  className="gap-6"
                  defaultValue="authenticator-app"
                  onValueChange={setAuthType}
                  value={authType}
                >
                  <div className="relative flex w-full gap-2 rounded-lg border border-input p-3 outline-none has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/10">
                    <RadioGroupItem
                      aria-label="authenticator-app-radio"
                      className="after:absolute after:inset-0"
                      id="authenticator-app"
                      value="authenticator-app"
                    />
                    <div className="grid grow gap-2">
                      <Label
                        className="gap-4 text-base"
                        htmlFor="authenticator-app"
                      >
                        <SettingsIcon className="size-5" />
                        Authenticator Apps
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Get code from an app like Google Authenticator and
                        Microsoft Authenticator.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex w-full gap-2 rounded-lg border border-input p-3 outline-none has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/10">
                    <RadioGroupItem
                      aria-label="sms-radio"
                      className="after:absolute after:inset-0"
                      id="sms"
                      value="sms"
                    />
                    <div className="grid grow gap-2">
                      <Label className="gap-4 text-base" htmlFor="sms">
                        <MessageSquareTextIcon className="size-5" />
                        SMS
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        We will send a code via SMS if you need to use your
                        backup login method.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <DialogFooter {...blockSlotDomMarkerProps("dialog.footer")} className="justify-center gap-4">
                <Button onClick={handleContinue} size="lg">
                  Continue
                </Button>
                <DialogClose
                  render={
                    <Button
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                      onClick={handleClose}
                      size="lg"
                    />
                  }
                >
                  Cancel
                </DialogClose>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setShowAuthDialog} open={showAuthDialog}>
        {authType === "sms" ? <SMSDialog /> : <AppDialog />}
      </Dialog>
    </div>
  );
};

export default VerifyDialog;
