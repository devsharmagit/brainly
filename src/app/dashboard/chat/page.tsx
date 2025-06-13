import { getAllChat } from "@/app/action/chat";
import Link from "next/link";
import { MessageSquare, ChevronRight, Plus, Calendar, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

const Page = async () => {
  const result = await getAllChat()

  if (!result.success) {
    return null
  }


  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Conversations</h1>
            <p className="text-muted-foreground mt-1">Continue where you left off</p>
          </div>
          <Button className="mt-4 sm:mt-0" size="sm">
            <Link href="/dashboard/chat/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </Link>
          </Button>
        </div>

        <div className="space-y-1">
          {result.data.map(({ id, prompt, createAt, _count }) => {
            const formattedDate = formatDistanceToNow(new Date(createAt), { addSuffix: true })

            return (
              <Link href={`/dashboard/chat/${id}`} key={id} className="block group">
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {prompt}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {_count.messages}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                </div>
              </Link>
            )
          })}
        </div>

        {result.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-4">Start a new chat to begin</p>
            <Button size="sm">
              <Link href="/dashboard/chat/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Start New Chat
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Page