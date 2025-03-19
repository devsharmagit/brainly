"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Appbar } from "@/components/AppBar";
import { ThemeProvider } from "@/components/theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const location = new URL(window.location.href);

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        
        {location.pathname !== "/" && <Appbar />}

        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};
