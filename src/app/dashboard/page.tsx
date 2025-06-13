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

export const dynamic = 'force-dynamic';

const Page = async () => {
  
  const memories = await getAllMemories();

  if (!memories.data) return null;

  return (
    <div className="py-3 w-full max-full m-auto relative z-20 ">
      <GridBackgroundContainer>
        <div className="w-full flex flex-col px-4 max-w-7xl mx-auto items-center justify-center min-h-[70vh] relative z-20">
    <HeroSection />
      <Button variant={"outline"} className="flex">
      <Link  href={"/dashboard/chat"} className="flex items-center gap-2 text-muted-foreground"> <History /> Chat History </Link>
      </Button>
        </div>
    </GridBackgroundContainer>
      <Separator className="mt-5" />
      <ScrollToTopView />
    <AllMemoryContainer memories={memories.data} />
    </div>
  );
};
export default Page;
