import { ImageIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
};

const ActivityDialog = ({ defaultOpen = false, trigger }: Props) => (
  <Sheet defaultOpen={defaultOpen}>
    <SheetTrigger asChild>{trigger}</SheetTrigger>
    <SheetContent className="gap-0 sm:max-w-md [&>button>svg]:size-5 [&>button]:top-2.75">
      <SheetHeader className="border-b py-2.25">
        <SheetTitle className="text-lg leading-6">Activity</SheetTitle>
        <SheetDescription hidden />
      </SheetHeader>

      <div className="overflow-y-auto">
        <div className="flex gap-4 px-4 py-3">
          <Avatar>
            <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="flex w-full flex-col items-start gap-2.5">
            <div className="flex flex-col items-start text-muted-foreground text-sm">
              <p>
                <span className="font-semibold text-foreground">
                  Joe Lincoln
                </span>{" "}
                mentioned you in last trends topic
              </p>
              <p>18 mins ago</p>
            </div>
            <div className="flex flex-col gap-4 rounded-md border bg-muted px-4 py-2.5">
              <p className="font-medium text-sm">
                @ShadcnStudio For an expert opinion, check out what Mike has to
                say on this topic!
              </p>
              <InputGroup className="bg-card">
                <InputGroupInput placeholder="Reply" />
                <InputGroupAddon align="inline-end">
                  <ImageIcon className="size-4 text-muted-foreground" />
                  <span className="sr-only">Email</span>
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
            <div className="flex flex-col items-start text-muted-foreground text-sm">
              <p>
                <span className="font-semibold text-foreground">
                  Jane Perez
                </span>{" "}
                invites you to review a file
              </p>
              <p>39 mins ago</p>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-muted px-1.5 py-1">
              <img
                alt="invoices.pdf"
                className="h-5"
                src="https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/image-14.png"
              />
              <span className="font-medium text-sm">invoices.pdf</span>
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
            <div className="flex flex-col items-start text-muted-foreground text-sm">
              <p>
                <span className="font-semibold text-foreground">
                  Tyler Hero
                </span>{" "}
                wants to view your design project
              </p>
              <p>1 hour ago</p>
            </div>
            <div className="flex w-full items-center gap-4 rounded-md border bg-muted px-4 py-2.5">
              <img
                alt="Launcher-Uikit.fig"
                className="size-8 rounded-sm"
                src="https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/image-13.png"
              />
              <span className="font-medium text-sm">Launcher-Uikit.fig</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-4 px-4 py-3">
          <Avatar>
            <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png" />
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-muted-foreground text-sm">
            <p>
              <span className="font-semibold text-foreground">Denial</span>{" "}
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
            <div className="flex flex-col items-start text-muted-foreground text-sm">
              <p>
                <span className="font-semibold text-foreground">
                  Leslie Alexander
                </span>{" "}
                new tags to Web Redesign
              </p>
              <p>8 hours ago</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-sm bg-primary/10 font-normal text-primary">
                Client-Request
              </Badge>
              <Badge className="rounded-sm bg-sky-600/10 font-normal text-sky-600 dark:bg-sky-400/10 dark:text-sky-400">
                Figma
              </Badge>
              <Badge className="rounded-sm bg-amber-600/10 font-normal text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
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
          <div className="flex flex-col items-start text-muted-foreground text-sm">
            <p>
              <span className="font-semibold text-foreground">Miya</span>{" "}
              invites you to review a file
            </p>
            <p>10 hours ago</p>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

export default ActivityDialog;
