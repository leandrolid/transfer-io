"use client";

import { ReactNode } from "react";

import { Theme, ThemeProps } from "@radix-ui/themes";
import { getCookie } from "cookies-next";

export function Providers({ children }: { children: ReactNode }) {
  const appearance = getCookie("appearance") ?? "dark";
  return (
    <Theme
      appearance={appearance as ThemeProps["appearance"]}
      accentColor="indigo"
      panelBackground="translucent"
    >
      {children}
    </Theme>
  );
}
