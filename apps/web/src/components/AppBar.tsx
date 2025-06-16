"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Brain } from "lucide-react";
import { ProfileDropDown } from "./profileDropDown";


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
            <Brain className="text-blue-500" /> Brainly
          </h1>
        </Link>
        {status == "authenticated" ? <ProfileDropDown /> : <Button onClick={handleSignClick}> Sign in </Button>}
      </div>
      <Separator />
    </>
  );
};
