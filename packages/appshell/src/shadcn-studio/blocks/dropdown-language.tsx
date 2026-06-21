"use client";

import { useState, type ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@afenda/ui";

type LanguageDropdownProps = {
  readonly trigger: ReactNode;
  readonly defaultOpen?: boolean;
  readonly align?: "start" | "center" | "end";
};

const LanguageDropdown = ({
  defaultOpen,
  align,
  trigger,
}: LanguageDropdownProps) => {
  const [language, setLanguage] = useState("english");

  return (
    <DropdownMenu {...(defaultOpen === undefined ? {} : { defaultOpen })}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align ?? "end"}>
        <DropdownMenuRadioGroup onValueChange={setLanguage} value={language}>
          <DropdownMenuRadioItem value="english">English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="german">Deutsch</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="spanish">Española</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="portuguese">
            Português
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="korean">한국인</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
