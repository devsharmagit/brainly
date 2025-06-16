"use client";

import { Button } from "@/components/ui/button";
import { Brain, Menu, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type React from "react"; // Added import for React
import { signIn } from "next-auth/react";

export default function Navbar() {
  const handleSignClick = () => {
    signIn("google");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-2">
        <Brain className="w-8 h-8 text-blue-500" />
        <span className="text-white font-semibold text-2xl">Brainly</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <div
          onClick={handleSignClick}
          className="text-gray-300 hover:cursor-pointer hover:text-white transition-colors relative group flex gap-2"
        >
          Dashboard
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
        </div>
        <NavLink href="https://github.com/devsharmagit/brainly/">
          {" "}
          GitHub
        </NavLink>
        <NavLink href="https://x.com/CodeDevsharma">Contact</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Button
          onClick={handleSignClick}
          variant="ghost"
          className="text-white hover:text-blue-400"
        >
          Sign In
        </Button>
        <Button
          onClick={handleSignClick}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Rocket className="mr-2 h-5 w-5" /> Get Started
        </Button>
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="text-gray-300 hover:text-white transition-colors relative group flex gap-2"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
    </Link>
  );
}
