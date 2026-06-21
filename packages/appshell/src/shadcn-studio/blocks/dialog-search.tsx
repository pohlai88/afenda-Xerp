"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MonitorSmartphoneIcon,
  MoreVerticalIcon,
  SearchIcon,
  ShoppingCartIcon,
  Undo2Icon,
  UsersIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Badge,
  Combobox,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  Dialog,
  DialogContent,
  DialogTitle,
  InputGroupAddon,
} from "@afenda/ui";

type SearchDialogProps = {
  readonly trigger: ReactNode;
  readonly defaultOpen?: boolean;
  readonly className?: string;
};

const SearchDialog = ({
  defaultOpen = false,
  trigger,
  className,
}: SearchDialogProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const [search, setSearch] = useState("");
  const searchLower = search.toLowerCase();

  const suggestions = [
    {
      id: "marketing-ui",
      icon: <UsersIcon className="text-foreground size-4.5!" />,
      label: "Marketing UI Page",
    },
    {
      id: "ecommerce-ui",
      icon: <ShoppingCartIcon className="text-foreground size-4.5!" />,
      label: "e-commerce UI Page",
    },
    {
      id: "dashboard-ui",
      icon: <MonitorSmartphoneIcon className="text-foreground size-4.5!" />,
      label: "Dashboard UI Page",
    },
  ].filter((item) => item.label.toLowerCase().includes(searchLower));

  const interactions = [
    {
      id: "jira",
      name: "Jira",
      description: "Project management",
      logo: "https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/jira.png",
      avatars: [
        {
          src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
          alt: "Aaron Larson",
          fallback: "AL",
        },
        {
          src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
          alt: "Kathryn Cummings",
          fallback: "KC",
        },
        {
          src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
          alt: "Vincent Boone",
          fallback: "VB",
        },
      ],
    },
    {
      id: "inferno",
      name: "Inferno",
      description: "Real-time photo sharing app",
      logo: "https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/inferno.png",
      avatars: [
        {
          src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
          alt: "Walter Newton",
          fallback: "WN",
        },
        {
          src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
          alt: "Ruby Stewart",
          fallback: "RS",
        },
        {
          src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
          alt: "Bernard Clarke",
          fallback: "BC",
        },
        {
          src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
          alt: "Elva Baker",
          fallback: "EB",
        },
      ],
    },
  ].filter(
    (item) =>
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
  );

  const users = [
    {
      id: "barry-barnett",
      name: "Barry Barnett",
      email: "barry@hotmail.com",
      avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
      fallback: "BB",
      status: "In office",
      statusColor: "green" as const,
    },
    {
      id: "maria-donin",
      name: "Maria Donin",
      email: "maria@hotmail.com",
      avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
      fallback: "MD",
      status: "On leave",
      statusColor: "red" as const,
    },
  ].filter(
    (user) =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
  );

  return (
    <div className={className}>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Search</DialogTitle>
          <Combobox open>
            <ComboboxInput
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearch(event.target.value)
              }
              placeholder="Search here..."
              showTrigger={false}
              value={search}
            >
              <InputGroupAddon>
                <SearchIcon className="size-5" />
              </InputGroupAddon>
            </ComboboxInput>
            <ComboboxList>
              <ComboboxEmpty>No results found.</ComboboxEmpty>

              {suggestions.length > 0 ? (
                <>
                  <ComboboxGroup>
                    <ComboboxLabel>Suggestions</ComboboxLabel>
                    {suggestions.map((item) => (
                      <ComboboxItem
                        key={item.id}
                        onClick={() => setOpen(false)}
                        value={item.id}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </ComboboxItem>
                    ))}
                  </ComboboxGroup>
                  {interactions.length > 0 || users.length > 0 ? (
                    <ComboboxSeparator />
                  ) : null}
                </>
              ) : null}

              {interactions.length > 0 ? (
                <>
                  <ComboboxGroup>
                    <ComboboxLabel>Interactions</ComboboxLabel>
                    {interactions.map((item) => (
                      <ComboboxItem
                        key={item.id}
                        onClick={() => setOpen(false)}
                        value={item.id}
                      >
                        <Avatar>
                          <AvatarFallback>
                            <img
                              alt={item.name}
                              className="size-6"
                              src={item.logo}
                            />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex w-full flex-col items-start">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground! text-sm">
                            {item.description}
                          </span>
                        </div>
                        <AvatarGroup>
                          {item.avatars.map((avatar) => (
                            <Avatar key={avatar.alt}>
                              <AvatarImage alt={avatar.alt} src={avatar.src} />
                              <AvatarFallback>{avatar.fallback}</AvatarFallback>
                            </Avatar>
                          ))}
                          <AvatarGroupCount>+99</AvatarGroupCount>
                        </AvatarGroup>
                      </ComboboxItem>
                    ))}
                  </ComboboxGroup>
                  {users.length > 0 ? (
                    <ComboboxSeparator />
                  ) : null}
                </>
              ) : null}

              {users.length > 0 ? (
                <ComboboxGroup>
                  <ComboboxLabel>Users</ComboboxLabel>
                  {users.map((user) => (
                    <ComboboxItem
                      key={user.id}
                      onClick={() => setOpen(false)}
                      value={user.id}
                    >
                      <Avatar>
                        <AvatarImage alt={user.name} src={user.avatar} />
                        <AvatarFallback>{user.fallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex w-full flex-col items-start">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-muted-foreground! text-sm font-light">
                          {user.email}
                        </span>
                      </div>
                      <Badge emphasis="soft" tone="neutral">
                        {user.status}
                      </Badge>
                      <MoreVerticalIcon />
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              ) : null}
            </ComboboxList>
          </Combobox>

          <div className="bg-border h-px max-sm:hidden" />

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 p-4 max-sm:hidden">
            <div className="flex flex-1 items-center gap-2">
              <kbd className="rounded border px-1 text-sm">esc</kbd>
              <span>To close</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <Undo2Icon className="size-4" />
              </div>
              <span>To Select</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <ArrowUpIcon className="size-4" />
              </div>
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <ArrowDownIcon className="size-4" />
              </div>
              <span>To Navigate</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchDialog;
