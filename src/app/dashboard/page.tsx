import React from "react";
import { getAllMemories } from "../action/memory";
import HeroSection from "@/components/HeroSection";
import AllMemoryContainer from "@/components/AllMemoryContainer";
import { Separator } from "@/components/ui/separator"

const Page = async () => {
  
  const memories = await getAllMemories();

  if (!memories.data) return null;

  return (
    <div className="py-3 px-4 w-full max-w-7xl m-auto  ">
      <HeroSection />
      <Separator />
    <AllMemoryContainer memories={memories.data} />
    </div>
  );
};
export default Page;
