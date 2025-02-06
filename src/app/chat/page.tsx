"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { getAIChat } from '../action/memory';

const Page = () => {
  const [prompt, setPrompt] = useState<string>("") 

  const [response, setResponse ] = useState<string>("")

  const handleClick = async()=>{
const result = await getAIChat({prompt})
setResponse(result.data || "nothing")
  }
    return (
    <div>
     <Input onChange={(e)=>setPrompt(e.target.value)} value={prompt} />
    <Button onClick={handleClick}> search </Button>
    <div>
      <p>
        {response}
      </p>
    </div>
    </div>
  )
}

export default Page
