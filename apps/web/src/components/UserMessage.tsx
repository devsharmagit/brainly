import { cn } from '@/lib/utils'
import React from 'react'

const UserMessage = ({message}:{message:string}) => {
  return (
    <div
                  className={cn("flex gap-2 max-w-[75%]", "ml-auto justify-end")}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-sm font-medium text-right">You</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-base whitespace-pre-wrap">{message}</p>
                    </div>
                  </div>
                </div>
  )
}

export default UserMessage
