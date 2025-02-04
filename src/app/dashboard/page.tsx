import React from "react";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { getAllMemories } from "../action/memory";
import { AddMemory } from "@/components/AddMemory";
import AllMemory from "@/components/AllMemory";

const Page = async () => {
  const session = await getServerSession(authOption);
  const memories = await getAllMemories();

  if(!memories.data) return null

  return (
    <div className="py-3 px-4 w-full max-w-7xl m-auto  ">
      <h1 className="text-3xl font-bold">
        Good Morning , {session?.user.name}
      </h1>

      <div>{memories.data?.length}</div>
    <div className="grid grid-cols-3 gap-4 mt-5">
      <AddMemory />
    <AllMemory  memories={memories.data}/>
    </div>

    </div>
  );
};
export default Page;
