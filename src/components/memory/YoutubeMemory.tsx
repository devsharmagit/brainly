"use client";
import { Card } from "@/components/ui/card";
import { extractYoutubeId } from "@/lib/utils";
import { Memory } from "@prisma/client";
import React from "react";
import YouTube from "react-youtube";
import DeleteMemory from "../DeleteMemory";


const YoutubeMemory = ({ memory }: { memory: Memory }) => {
  if (!memory.link) return null;

  console.log(memory.link);

  const youtubeId = extractYoutubeId(memory.link);

  console.log({ youtubeId });
  if (!youtubeId) {
    return null;
  }

  //    const handlePlay = ()=>{
  //     if(memory.link)  window.open(memory.link, '_blank');
  //    }

  return (
    <Card className="min-w-80 min-h-24 overflow-hidden relative" key={memory.id}>
      <DeleteMemory id={memory.id} />
      <YouTube videoId={youtubeId} opts={{ width: "100%", hight: "100%" }} />
    </Card>
  );
};

export default YoutubeMemory;
