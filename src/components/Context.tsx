import {  Memory } from "@prisma/client";
import React from "react";
import NoteMemory from "./memory/NoteMemory";
import TwitterMemory from "./memory/TwitterMemory";
import YoutubeMemory from "./memory/YoutubeMemory";
import LinkMemory from "./memory/LinkMemory";

interface ContextProps {
  memories: {
    chatId : number;
    memoryId: number;
    memory: Memory;
  }[];
}

const Context: React.FC<ContextProps> = ({ memories }) => {


  return (
    <>
      {memories.map((memory) => {
        switch (memory.memory.category) {
          case "NOTE":
            return <NoteMemory key={memory.memory.id} memory={memory.memory} />;
          case "TWTLINK":
            return <TwitterMemory key={memory.memory.id} memory={memory.memory} />;
          case "YTLINK":
            return <YoutubeMemory key={memory.memory.id} memory={memory.memory} />;
          case "LINK":
            return <LinkMemory key={memory.memory.id} memory={memory.memory} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default Context;
