"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { getAIChat } from "../action/memory";
import { marked } from "marked";
import { useSearchParams } from "next/navigation";


const Page = () => {
  const result = useSearchParams()

  console.log(result.get("prompt"))
  const [prompt, setPrompt] = useState<string>("");

  const ref1 = useRef<null | HTMLDivElement>(null);

  const handleClick = async () => {
    const result = await getAIChat({ prompt });
    console.log(result)

    const htmlString = await marked(result.data?.response || "",);
    if (ref1.current) ref1.current.innerHTML = htmlString;
  };
  return (
    <div>
      {JSON.stringify(result)}
      <Input onChange={(e) => setPrompt(e.target.value)} value={prompt} />
      <Button onClick={handleClick}> search </Button>
      <div ref={ref1}></div>
    </div>
  );
};

export default Page;
