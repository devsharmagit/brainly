import { Memory } from "@prisma/client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Notebook } from "lucide-react";
import NoteMemory from "./memory/NoteMemory";
import TwitterMemory from "./memory/TwitterMemory";
import YoutubeMemory from "./memory/YoutubeMemory";
import LinkMemory from "./memory/LinkMemory";

interface AllMemoryProps {
  memories: Memory[];
}

const AllMemory = ({ memories }: AllMemoryProps) => {
  return (
    < >
      {memories.map((memory) => {

if(memory.category === "NOTE") {
  return <NoteMemory key={memory.id} memory={memory}  />
}
if(memory.category === "TWTLINK"){
  return <TwitterMemory key={memory.id} memory={memory} />
}
if(memory.category === "YTLINK"){
  return <YoutubeMemory  key={memory.id} memory={memory} />
}

if(memory.category === "LINK"){
  return <LinkMemory key={memory.id} memory={memory} />
}

        return (
          <Card className="min-w-80 min-h-24" key={memory.id}>
            <CardContent className="p-4 flex flex-col gap-y-2">
              {memory.category === "YTLINK" ? (
                <Notebook className="h-4 w-4 text-blue-500" />
              ) : (
                <Globe className="h-4 w-4 text-green-500" />
              )}

              {memory.link && <p className="truncate"> {memory.link} </p>}
              {memory.content && <p className="truncate"> {memory.content} </p>}
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default AllMemory;
