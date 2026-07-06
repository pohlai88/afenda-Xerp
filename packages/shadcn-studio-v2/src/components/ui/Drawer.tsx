// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

// biome-ignore lint/performance/noBarrelFile: Drawer is a semantic alias surface over Sheet primitives.
export {
  Sheet as Drawer,
  SheetClose as DrawerClose,
  SheetContent as DrawerContent,
  SheetDescription as DrawerDescription,
  SheetFooter as DrawerFooter,
  SheetHeader as DrawerHeader,
  SheetOverlay as DrawerOverlay,
  SheetPortal as DrawerPortal,
  type SheetProps as DrawerProps,
  SheetTitle as DrawerTitle,
  SheetTrigger as DrawerTrigger,
  type SheetTriggerProps as DrawerTriggerProps,
} from "./Sheet";
