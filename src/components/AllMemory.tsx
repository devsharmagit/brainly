import { Memory } from "@prisma/client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Notebook } from "lucide-react";

interface AllMemoryProps {
  memories: Memory[];
}

const AllMemory = ({ memories }: AllMemoryProps) => {
  return (
    < >
      {memories.map((memory) => {
        return (
          <Card className="min-w-80 min-h-24" key={memory.id}>
            <CardContent className="p-4 flex flex-col gap-y-2">
              {memory.category === "NOTE" ? (
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
