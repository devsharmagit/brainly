"use client";
import { Card } from "@/components/ui/card";
import { extractYoutubeId } from "@/lib/utils";
import { Memory } from "@repo/db/client";
import React from "react";
import YouTube from "react-youtube";
import DeleteMemory from "../DeleteMemory";


const YoutubeMemory = ({ memory, isForDisplay }: { memory: Memory, isForDisplay : boolean | undefined }) => {
  if (!memory.link) return null;

  const youtubeId = extractYoutubeId(memory.link);

  if (!youtubeId) {
    return null;
  }

  return (
    <Card className="min-w-80 min-h-24 overflow-hidden relative" key={memory.id}>
      {!isForDisplay && <DeleteMemory id={memory.id} /> } 
      <YouTube videoId={youtubeId} opts={{ width: "100%", hight: "100%" }} />
    </Card>
  );
};

export default YoutubeMemory;
