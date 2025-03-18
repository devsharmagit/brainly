"use client";
import { Memory } from "@prisma/client";
import React, { useState } from "react";
import NoteMemory from "./memory/NoteMemory";
import YoutubeMemory from "./memory/YoutubeMemory";
import LinkMemory from "./memory/LinkMemory";
import FETwitterMemory from "./memory/FETwitterMemory";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ContextProps {
  memories: {
    chatId: number;
    memoryId: number;
    memory: Memory;
  }[];
}

const Context: React.FC<ContextProps> = ({ memories }) => {
  const [isContextOpen, setIsContextOpen] = useState(false);

  return (
    <div className="max-w-80 py-4">
      <p className="text-muted-foreground text-xs"> Here is the context of your chat. </p>
      <div
        onClick={() => {
          setIsContextOpen(!isContextOpen);
        }}
        className="flex gap-4 items-center cursor-pointer hover:bg-white/10 px-2 py-2 rounded-xl transition-all mb-4"
      >
        <h1 className="font-medium  text-gray-200 text-lg">Context</h1>
        {isContextOpen ? <ChevronUp /> : <ChevronDown />}
      </div>
      <div 
        className={`max-w-80 flex flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out ${
          isContextOpen 
            ? "max-h-screen opacity-100" 
            : "max-h-0 opacity-0"
        }`}
      >
        {memories.map((memory) => {
          switch (memory.memory.category) {
            case "NOTE":
              return (
                <NoteMemory key={memory.memory.id} memory={memory.memory} />
              );
            case "TWTLINK":
              return (
                <FETwitterMemory
                  key={memory.memory.id}
                  memory={memory.memory}
                />
              );
            case "YTLINK":
              return (
                <YoutubeMemory key={memory.memory.id} memory={memory.memory} />
              );
            case "LINK":
              return (
                <LinkMemory key={memory.memory.id} memory={memory.memory} />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default Context;