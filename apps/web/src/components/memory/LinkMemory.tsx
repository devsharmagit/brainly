import { Memory } from "@repo/db/client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Globe } from "lucide-react";
import Link from 'next/link'
import { Button } from "../ui/button";
import DeleteMemory from "../DeleteMemory";
import Image from 'next/image';

const LinkMemory = ({ memory, isForDisplay }: { memory: Memory, isForDisplay : boolean | undefined }) => {
  return (
    <Card className="min-w-80  p-0 overflow-hidden bg-[#1c1e22] max-h-fit relative" key={memory.id}>
      {!isForDisplay && <DeleteMemory id={memory.id} /> } 
      <CardContent className="p-0 flex flex-col overflow-hidden gap-y-2 relative">
        <div className="absolute top-4 left-4 flex gap-1 items-center w-fit bg-gray-800 rounded px-2 py-1 ">
          <Globe className="h-4 w-4 text-blue-500" />
          <p className="text-xs text-gray-400 "> Web </p>
        </div>
        {memory.imageUrl ? (
          /* eslint-disable @next/next/no-img-element */
          <img
          alt={memory.title || "link memory img"}
            src={memory.imageUrl}
            className="w-full h-40 object-center object-cover overflow-hidden"
          />
        ) : 
        <Image src={"/brokenimage.png"} alt="not-found-img" width={100} height={100} className="w-full h-40 object-center object-contain overflow-hidden" />
        }
        <div className="px-4 py-2 text-base leading-tight text-gray-200 whitespace-pre-line flex flex-col gap-3">
          <p>{memory.title}</p>
          {memory.description && (
            <p className="text-sm truncate">{memory.description}</p>
          )}
          {memory.link && (
            <Link href={memory.link} target="_blank" className="">
              <Button variant={"outline"} className="bg-blue-500/20 hover:bg-blue-500/30 " size={"sm"}>
              Visit Website <ArrowRight />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkMemory;
