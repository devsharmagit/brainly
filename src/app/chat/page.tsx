"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { getAIChat } from "../action/memory";
import { marked } from "marked";

const Page = () => {
  const [prompt, setPrompt] = useState<string>("");

  const ref1 = useRef<null | HTMLDivElement>(null);

  const handleClick = async () => {
    const result = await getAIChat({ prompt });

    const htmlString = await marked(result.data || "",);
    if (ref1.current) ref1.current.innerHTML = htmlString;
  };
  return (
    <div>
      <Input onChange={(e) => setPrompt(e.target.value)} value={prompt} />
      <Button onClick={handleClick}> search </Button>
      <div ref={ref1}></div>
    </div>
  );
};

export default Page;
