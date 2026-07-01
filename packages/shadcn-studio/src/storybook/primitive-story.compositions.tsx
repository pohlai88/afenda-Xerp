"use client";

import { Button } from "@/components/ui/button.js";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.js";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar.js";
import { Toaster } from "@/components/ui/sonner.js";

export function DialogDefaultSample() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>
            Minimal dialog composition for Storybook lab verification.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function SheetDefaultSample() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>
            Minimal sheet composition for Storybook lab verification.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export function SidebarDefaultSample() {
  return (
    <SidebarProvider>
      <Sidebar className="relative h-64 w-full max-w-xs border">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Lab</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Overview</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

export function CommandDefaultSample() {
  return (
    <Command className="w-full max-w-sm rounded-lg border shadow-xs">
      <CommandInput placeholder="Search commands…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Dashboard</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function DropdownMenuDefaultSample() {
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger render={<Button type="button">Open menu</Button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SelectDefaultSample() {
  return (
    <Select defaultValue="ops">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Workspace" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ops">Operations</SelectItem>
        <SelectItem value="finance">Finance</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function SonnerDefaultSample() {
  return <Toaster />;
}

/** Slugs with hand-authored compositions in this file. */
export const PRIMITIVE_COMPOSITION_SLUGS = [
  "dialog",
  "sheet",
  "sidebar",
  "command",
  "dropdown-menu",
  "select",
  "sonner",
] as const;
