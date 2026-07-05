"use client";

import type { VariantProps } from "class-variance-authority";
import { PanelLeftCloseIcon, PanelRightCloseIcon } from "lucide-react";
import type { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

type Props = {
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
};

const MenuTrigger = ({ className, variant = "ghost" }: Props) => {
  const { open, isMobile, openMobile, toggleSidebar } = useSidebar();

  const isOpen = isMobile ? openMobile : open;

  return (
    <Button
      aria-label="Toggle Sidebar"
      className={className}
      onClick={toggleSidebar}
      size="icon"
      title="Toggle Sidebar"
      variant={variant}
    >
      {isOpen ? <PanelLeftCloseIcon /> : <PanelRightCloseIcon />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default MenuTrigger;
