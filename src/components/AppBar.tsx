"use client";
import React from "react";
// import { ThemeToggler } from "@/components/ThemeToggler";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { GithubIcon, TwitterIcon } from "./icons";
import { Brain } from "lucide-react";

export const Appbar = () => {
  const { status } = useSession();

  const handleSignClick = () => {
    if (status === "authenticated") {
      signOut();
    } else {
      signIn("google");
    }
  };

  return (
    <>
      <div className="py-3 px-4 w-full max-w-7xl m-auto flex justify-between items-center">
        <Link href={"/"}>
          <h1 className="dark:text-white font-semibold text-2xl flex gap-2 items-center ">
            <Brain /> Brainly
          </h1>
        </Link>
        <div className="flex gap-3 items-center">
          <Button
            onClick={handleSignClick}
            variant={"ghost"}
            className="border-opacity-20 border border-white"
          >
            {status === "authenticated" ? "Sign Out" : "Sign In"}
          </Button>
          {/* <ThemeToggler /> */}
          <Link href={"https://x.com/CodeDevsharma"} target="_blank">
            <TwitterIcon />
          </Link>
          <Link href={"https://github.com/devsharmagit"} target="_blank">
            <GithubIcon />
          </Link>
        </div>
      </div>
      <Separator />
    </>
  );
};
