"use client"

import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default  function Home() {
  
  const [session, setSession] = useState<null | Session>(null)
  
  useEffect(()=>{
const fetchSession = async()=>{
  const session = await getSession()
  setSession(session)
}
fetchSession()
  }, [])
  return (
 <div>
   {JSON.stringify(session)}
  hi there
 </div>
  );
}
