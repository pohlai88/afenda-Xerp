"use client";

import { PanelLeftCloseIcon, PanelRightCloseIcon } from "lucide-react";

import { Button, useSidebar } from "@afenda/ui";
import type { StockButtonVisual } from "@afenda/ui/governance";

import { resolveStockButtonProps } from "../stock-props";

type MenuTriggerProps = {
  readonly variant?: StockButtonVisual;
};

const MenuTrigger = ({ variant = "ghost" }: MenuTriggerProps) => {
  const { open, isMobile, openMobile, toggleSidebar } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <Button
      {...resolveStockButtonProps({ variant, size: "icon-lg" })}
      onClick={toggleSidebar}
      type="button"
    >
      {isOpen ? <PanelLeftCloseIcon /> : <PanelRightCloseIcon />}
    </Button>
  );
};

export default MenuTrigger;
