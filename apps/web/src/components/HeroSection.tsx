import { authOption } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import MessageForm from "./MessageForm";
import { Spotlight } from "./ui/spotlight";

const HeroSection = async () => {
  const session = await getServerSession(authOption);

  return (
    <>
          <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="#8ec5ff"
      />
    <div className="min-h-[70vh] flex flex-col justify-center relative z-20 w-full">
      <h1 className="relative z-10 text-lg md:text-5xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold mb-10">
        Hello, {session?.user.name}
      </h1>
      <MessageForm />
    </div>
    </>
  );
};

export default HeroSection;
