import React from "react";
import { AddMemory } from "./AddMemory";
import AllMemory from "./AllMemory";
import { Memory } from "@repo/db/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Notebook, Twitter, Youtube } from "lucide-react";

const AllMemoryContainer = ({ memories }: { memories: Memory[] }) => {
  return (
    <>
      <div className="mt-20 max-w-7xl mx-auto px-4">
        <Tabs defaultValue="All">
          <TabsList className="bg-transparent gap-x-2 mb-5">
            <TabsTrigger
              value="All"
              className=" data-[state=active]:bg-gray-700 text-base "
            >
              All
            </TabsTrigger>
            <TabsTrigger
              className=" text-base  data-[state=active]:bg-green-700 flex gap-2"
              value="Links"
            >
              <Link2 />
              Links
            </TabsTrigger>
            <TabsTrigger
              className=" text-base  data-[state=active]:bg-blue-700 flex gap-2"
              value="Notes"
            >
              <Notebook />
              Notes
            </TabsTrigger>
            <TabsTrigger
              className=" text-base  data-[state=active]:bg-red-700 flex gap-2"
              value="Youtube"
            >
              <Youtube />
              Youtube
            </TabsTrigger>
            <TabsTrigger
              className=" text-base  data-[state=active]:bg-[#1e2731] flex gap-2"
              value="Twitter"
            >
              <Twitter />
              Twitter
            </TabsTrigger>
          </TabsList>
          <TabsContent value="All">
            <div className="columns-1 sm:columns-2 md:columns-3  gap-10 space-y-10 mt-5">
              <AddMemory />
              <AllMemory memories={memories} />
            </div>
          </TabsContent>
          <TabsContent value="Links">
            <div className="columns-1 sm:columns-2 md:columns-3  gap-10 space-y-10 mt-5">
              <AddMemory />
              <AllMemory memories={memories} filter="LINK" />
            </div>
          </TabsContent>
          <TabsContent value="Notes">
            <div className="columns-1 sm:columns-2 md:columns-3  gap-10 space-y-10 mt-5">
              <AddMemory />
              <AllMemory memories={memories} filter="NOTE" />
            </div>
          </TabsContent>
          <TabsContent value="Youtube">
            <div className="columns-1 sm:columns-2 md:columns-3  gap-10 space-y-10 mt-5">
              <AddMemory />
              <AllMemory memories={memories} filter="YTLINK" />
            </div>
          </TabsContent>

          <TabsContent value="Twitter">
            <div className="columns-1 sm:columns-2 md:columns-3  gap-10 space-y-10 mt-5">
              <AddMemory />
              <AllMemory memories={memories} filter="TWTLINK" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AllMemoryContainer;
