import { Memory } from "@repo/db/client";
import React from "react";
import { Notebook } from "lucide-react";
import DeleteMemory from "../DeleteMemory";



const NoteMemory = ({ memory, isForDisplay }: { memory: Memory, isForDisplay : boolean | undefined }) => {
  return (
<div
  className="relative border scrollbarhidden rounded-xl bg-[#042f2e] w-full py-4 overflow-hidden max-h-fit"
  key={memory.id}
>
{!isForDisplay && <DeleteMemory id={memory.id} /> } 
  <div className="relative rounded-xl flex flex-col gap-y-2 px-4 max-h-52 overflow-y-scroll styled-scrollbar bg-gradient-to-b">
    <div className="flex gap-1 items-center w-fit bg-gray-800 rounded px-2 py-1">
      <Notebook className="h-4 w-4 text-blue-500" />
      <p className="text-xs text-gray-400 ">Note</p>
    </div>
    <p className="text-lg leading-tight text-gray-200 whitespace-pre-line">
      {memory.description}
    </p>
    {/* Fading Effect */}
  </div>
    <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#042f2e] to-transparent pointer-events-none"></div>
</div>

  );
};

export default NoteMemory;
