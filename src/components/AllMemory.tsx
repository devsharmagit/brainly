import { CATEGORY, Memory } from "@prisma/client";
import React, { useMemo } from "react";
import NoteMemory from "./memory/NoteMemory";
import TwitterMemory from "./memory/TwitterMemory";
import YoutubeMemory from "./memory/YoutubeMemory";
import LinkMemory from "./memory/LinkMemory";

interface AllMemoryProps {
  memories: Memory[];
  filter?: CATEGORY;
}

const AllMemory: React.FC<AllMemoryProps> = ({ memories, filter }) => {
  const filteredMemories = useMemo(() => {
    return filter
      ? memories.filter((memory) => memory.category === filter)
      : memories;
  }, [memories, filter]);

  return (
    <>
      {filteredMemories.map((memory) => {
        switch (memory.category) {
          case "NOTE":
            return <NoteMemory key={memory.id} memory={memory} />;
          case "TWTLINK":
            return <TwitterMemory key={memory.id} memory={memory} />;
          case "YTLINK":
            return <YoutubeMemory key={memory.id} memory={memory} />;
          case "LINK":
            return <LinkMemory key={memory.id} memory={memory} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default AllMemory;
