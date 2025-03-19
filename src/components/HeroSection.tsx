import { authOption } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import MessageForm from "./MessageForm";

const HeroSection = async () => {
  const session = await getServerSession(authOption);

  return (
    <div className="min-h-[70vh] flex flex-col justify-center">
      <h1 className="relative z-10 text-lg md:text-5xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold mb-10">
        Hello, {session?.user.name}
      </h1>
      <MessageForm />
      <div></div>
    </div>
  );
};

export default HeroSection;
