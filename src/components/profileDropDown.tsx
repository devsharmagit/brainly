"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { GithubIcon, TwitterIcon, LogOut } from "lucide-react";

export function ProfileDropDown() {
  const { data } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {/* eslint-disable @next/next/no-img-element */
          <img
            src={data?.user?.image}
            alt="Profile"
            className="h-6 w-6 rounded-full"
          />}
          <span className="hidden md:inline-block"> {data?.user.name} </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-4">
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={data?.user?.image}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
            />
            <div className="space-y-1">
              <p className="font-semibold text-sm">{data?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{data?.user?.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator className="my-2 mb-2" />
          
          <div className="space-y-2 mb-4">
            <Link 
              href="https://x.com/CodeDevsharma" 
              target="_blank"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <TwitterIcon className="h-4 w-4" />
              <span>Twitter</span>
            </Link>
            <Link 
              href="https://github.com/devsharmagit" 
              target="_blank"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Github</span>
            </Link>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-2" />
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
