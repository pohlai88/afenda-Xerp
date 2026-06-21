import type { ReactNode } from "react";
import { ImageIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@afenda/ui";

type ActivityDialogProps = {
  readonly trigger: ReactNode;
  readonly defaultOpen?: boolean;
};

const ActivityDialog = ({
  defaultOpen = false,
  trigger,
}: ActivityDialogProps) => {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Activity</SheetTitle>
          <SheetDescription hidden />
        </SheetHeader>

        <div className="overflow-y-auto">
          <div className="flex gap-4 px-4 py-3">
            <Avatar>
              <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div className="flex w-full flex-col items-start gap-2.5">
              <div className="text-muted-foreground flex flex-col items-start text-sm">
                <p>
                  <span className="text-foreground font-semibold">
                    Joe Lincoln
                  </span>{" "}
                  mentioned you in last trends topic
                </p>
                <p>18 mins ago</p>
              </div>
              <div className="bg-muted flex flex-col gap-4 rounded-md border px-4 py-2.5">
                <p className="text-sm font-medium">
                  @ShadcnStudio For an expert opinion, check out what Mike has
                  to say on this topic!
                </p>
                <InputGroup>
                  <InputGroupInput placeholder="Reply" />
                  <InputGroupAddon align="inline-end">
                    <ImageIcon className="text-muted-foreground size-4" />
                    <span className="sr-only">Attach image</span>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4 px-4 py-3">
            <Avatar>
              <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div className="flex w-full flex-col items-start gap-2.5">
              <div className="text-muted-foreground flex flex-col items-start text-sm">
                <p>
                  <span className="text-foreground font-semibold">
                    Jane Perez
                  </span>{" "}
                  invites you to review a file
                </p>
                <p>39 mins ago</p>
              </div>
              <div className="bg-muted flex items-center gap-1 rounded-md px-1.5 py-1">
                <img
                  alt="invoices.pdf"
                  className="h-5"
                  src="https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/image-14.png"
                />
                <span className="text-sm font-medium">invoices.pdf</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4 px-4 py-3">
            <Avatar>
              <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png" />
              <AvatarFallback>TH</AvatarFallback>
            </Avatar>
            <div className="flex w-full flex-col items-start gap-2.5">
              <div className="text-muted-foreground flex flex-col items-start text-sm">
                <p>
                  <span className="text-foreground font-semibold">
                    Tyler Hero
                  </span>{" "}
                  wants to view your design project
                </p>
                <p>1 hour ago</p>
              </div>
              <div className="bg-muted flex w-full items-center gap-4 rounded-md border px-4 py-2.5">
                <img
                  alt="Launcher-Uikit.fig"
                  className="size-8 rounded-sm"
                  src="https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/image-13.png"
                />
                <span className="text-sm font-medium">Launcher-Uikit.fig</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4 px-4 py-3">
            <Avatar>
              <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png" />
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <div className="text-muted-foreground flex flex-col items-start text-sm">
              <p>
                <span className="text-foreground font-semibold">Denial</span>{" "}
                invites you to review the new design
              </p>
              <p>3 hours ago</p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4 px-4 py-3">
            <Avatar>
              <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png" />
              <AvatarFallback>LA</AvatarFallback>
            </Avatar>
            <div className="flex w-full flex-col items-start gap-2.5">
              <div className="text-muted-foreground flex flex-col items-start text-sm">
                <p>
                  <span className="text-foreground font-semibold">
                    Leslie Alexander
                  </span>{" "}
                  new tags to Web Redesign
                </p>
                <p>8 hours ago</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge emphasis="soft" tone="neutral">
                  Client-Request
                </Badge>
                <Badge emphasis="soft" tone="neutral">
                  Figma
                </Badge>
                <Badge emphasis="soft" tone="neutral">
                  Redesign
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4 px-4 py-3">
            <Avatar>
              <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <div className="text-muted-foreground flex flex-col items-start text-sm">
              <p>
                <span className="text-foreground font-semibold">Miya</span>{" "}
                invites you to review a file
              </p>
              <p>10 hours ago</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActivityDialog;
