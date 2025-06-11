import { getAllChat } from "../action/chat"
import Link from "next/link"
import { MessageSquare, ChevronRight, Calendar,  Layers, MessageCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

const Page = async () => {
  const result = await getAllChat()

  if (!result.success) {
    return null
  }

  return (
    <main className="py-8 px-4 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Conversations</h1>
        <p className="text-muted-foreground mt-2">Continue where you left off or start a new chat</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.map(({ id, prompt, createAt, _count }) => {
          // Format the date to a relative time (e.g., "2 days ago")
          const formattedDate = formatDistanceToNow(new Date(createAt), { addSuffix: true })

          return (
            <Link href={`/chat/${id}`} key={id} className="block group">
              <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">
                      ID: {id}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formattedDate}
                    </div>
                  </div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {/* <span className="truncate">{prompt}</span> */}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription className="line-clamp-2">{prompt}</CardDescription>
                </CardContent>
                <CardFooter className="pt-2 flex-col items-start">
                  <div className="w-full flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <Layers className="h-3 w-3 mr-1" />
                        {_count.context}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {_count.messages}
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex justify-end">
                    <span className="flex items-center gap-1 text-primary text-sm group-hover:underline">
                      Continue <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>

      {result.data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No conversations yet</h3>
          <p className="text-muted-foreground mt-2">Start a new chat to begin a conversation</p>
        </div>
      )}
    </main>
  )
}

export default Page

