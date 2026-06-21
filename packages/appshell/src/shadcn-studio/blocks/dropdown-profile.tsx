import type { ReactNode } from "react";
import {
  CirclePlusIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  SquarePenIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@afenda/ui";

type ProfileDropdownProps = {
  readonly trigger: ReactNode;
  readonly defaultOpen?: boolean;
  readonly align?: "start" | "center" | "end";
  readonly displayName?: string;
  readonly email?: string;
  readonly avatarSrc?: string;
  readonly avatarFallback?: string;
};

const ProfileDropdown = ({
  trigger,
  defaultOpen,
  align = "end",
  displayName = "John Doe",
  email = "john.doe@example.com",
  avatarSrc = "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
  avatarFallback = "JD",
}: ProfileDropdownProps) => {
  return (
    <DropdownMenu {...(defaultOpen === undefined ? {} : { defaultOpen })}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuLabel>
          <div className="flex items-center gap-4 px-4 py-2.5">
          <div className="relative">
            <Avatar size="lg">
              <AvatarImage alt={displayName} src={avatarSrc} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-foreground text-lg font-semibold">
              {displayName}
            </span>
            <span className="text-muted-foreground text-base">{email}</span>
          </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon className="text-foreground size-5" />
            <span>My account</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon className="text-foreground size-5" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon className="text-foreground size-5" />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UsersIcon className="text-foreground size-5" />
            <span>Manage team</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SquarePenIcon className="text-foreground size-5" />
            <span>Customization</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CirclePlusIcon className="text-foreground size-5" />
            <span>Add team account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive">
          <LogOutIcon className="size-5" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
