import { getAllChat } from "@/app/action/chat";
import Link from "next/link";
import { MessageSquare, ChevronRight, Calendar, Layers, MessageCircle, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const result = await getAllChat()

  if (!result.success) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Your Conversations
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Continue where you left off or start a new chat</p>
          </div>
          <Button className="mt-4 sm:mt-0" size="lg">
            <Link href="/dashboard/chat/new" className="flex items-center gap-2 ">
            <Plus className="h-5 w-5 mr-2" />
            New Chat
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.map(({ id, prompt, createAt, _count }) => {
            const formattedDate = formatDistanceToNow(new Date(createAt), { addSuffix: true })

            return (
              <Link href={`/chat/${id}`} key={id} className="block group">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-lg hover:scale-[1.02] bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="mb-2 font-mono text-xs">
                        {String(id).slice(0, 8)}...
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formattedDate}
                      </div>
                    </div>
                    <CardTitle className="flex items-center gap-2 text-lg mt-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span className="truncate">Conversation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                      {prompt}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-2 flex-col items-start">
                    <div className="w-full flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center bg-muted/50 px-2 py-1 rounded-full">
                          <Layers className="h-3 w-3 mr-1" />
                          {_count.context} contexts
                        </span>
                        <span className="flex items-center bg-muted/50 px-2 py-1 rounded-full">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {_count.messages} messages
                        </span>
                      </div>
                    </div>
                    <div className="w-full flex justify-end">
                      <span className="flex items-center gap-1 text-primary text-sm font-medium group-hover:underline">
                        Continue <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            )
          })}
        </div>

        {result.data.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center bg-card/50 backdrop-blur-sm">
            <div className="rounded-full bg-primary/10 p-4 mb-6">
              <MessageSquare className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground text-lg mb-6">Start a new chat to begin your journey</p>
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Start New Chat
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Page

