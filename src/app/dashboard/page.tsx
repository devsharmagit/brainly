import React from "react";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { getAllMemories } from "../action/memory";
import { AddMemory } from "@/components/AddMemory";

const Page = async () => {
  const session = await getServerSession(authOption);
  const memories = await getAllMemories();

  console.log(memories);

  return (
    <div className="py-3 px-4 w-full max-w-7xl m-auto  ">
      <h1 className="text-3xl font-bold">
        Good Morning , {session?.user.name}
      </h1>

      <div>total memories container</div>
      <div>{memories.data?.length}</div>
      {memories.data?.map((memory) => (
        <div key={memory.id}>{memory.link}</div>
      ))}

      <AddMemory />
    </div>
  );
};
export default Page;
