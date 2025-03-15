import { Memory } from "@prisma/client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";
import Link from 'next/link'
import { Button } from "../ui/button";
import DeleteMemory from "../DeleteMemory";

const LinkMemory = ({ memory }: { memory: Memory }) => {
  return (
    <Card className="min-w-80  p-0 overflow-hidden bg-gray-500/20 max-h-fit relative" key={memory.id}>
 <DeleteMemory id={memory.id} />
      <CardContent className="p-0 flex flex-col overflow-hidden gap-y-2 relative">
        <div className="absolute top-4 left-4 flex gap-1 items-center w-fit bg-gray-800 rounded px-2 py-1 ">
          <Globe className="h-4 w-4 text-green-500" />
          <p className="text-xs text-gray-400 "> Web </p>
        </div>
        {memory.imageUrl && (
          <img
            src={memory.imageUrl}
            className="w-full h-40 object-center object-cover overflow-hidden"
          />
        )}
        <div className="px-4 py-2 text-base leading-tight text-gray-200 whitespace-pre-line flex flex-col gap-3">
          <p>{memory.title}</p>
          {memory.description && (
            <p className="text-sm truncate">{memory.description}</p>
          )}
          {memory.link && (
            <Link href={memory.link} target="_blank" className="">
              <Button variant={"outline"}>
              Visit Website
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkMemory;
