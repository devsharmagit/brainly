import React from "react";
import { getAllMemories } from "../action/memory";
import HeroSection from "@/components/HeroSection";
import AllMemoryContainer from "@/components/AllMemoryContainer";
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import ScrollToTopView from "@/components/ScrollTop";
import GridBackgroundContainer from "@/components/ui/gridbackground-container";

const Page = async () => {
  
  const memories = await getAllMemories();

  if (!memories.data) return null;

  return (
    <GridBackgroundContainer>
    <div className="py-3 px-4 w-full max-w-7xl m-auto relative z-20 ">
    <HeroSection />
      <Button variant={"outline"} className="flex">
      <Link  href={"/chat"} className="flex items-center gap-2 text-muted-foreground"> <History /> Chat History </Link>
      </Button>
      <Separator className="mt-5" />
      <ScrollToTopView />
    <AllMemoryContainer memories={memories.data} />
    </div>
    </GridBackgroundContainer>
  );
};
export default Page;
