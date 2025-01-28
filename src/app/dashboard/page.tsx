import { DialogDemo } from "@/components/AddMemory";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";

const Page = async () => {
  const session = await getServerSession();

  return (
    <div>
      <h1> Good Morning, {session?.user?.name} </h1>

      <DialogDemo />
    </div>
  );
};
export default Page;
