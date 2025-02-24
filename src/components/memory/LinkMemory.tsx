import { Memory } from '@prisma/client'
import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Notebook } from "lucide-react";

const LinkMemory = ({memory}: {memory : Memory}) => {
  return (
    <Card className="min-w-80 min-h-24" key={memory.id}>
    <CardContent className="p-4 flex flex-col gap-y-2">
      
        <Globe className="h-4 w-4 text-green-500" />
      <img src={memory.imageUrl} className='w-full h-32 object-fill overflow-hidden' />
<p>
    {memory.title}
</p>
<a href={memory.link} target='_blank'> visit the web</a>
    
    </CardContent>
  </Card>
  )
}

export default LinkMemory
