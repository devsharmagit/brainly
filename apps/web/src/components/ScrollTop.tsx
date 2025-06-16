"use client";

import { useRef } from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

export default function ScrollToTopView() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="text-center mt-5">
      <Button
      variant={"outline"}
        onClick={handleScroll}
        className="text-muted-foreground"
      >
        <ChevronDown />
       Scroll down to view your memories
      </Button>

      <div className="" ref={sectionRef}>
      </div>
    </div>
  );
}
