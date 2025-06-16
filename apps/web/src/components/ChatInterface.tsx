"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Chat, Message } from "@repo/db/client";
import AIResponse from "./AIResponse";
import UserMessage from "./UserMessage";
import { Skeleton } from "@/components/ui/skeleton";
import SendMessageForm from "./SendMessageForm";

export default function ChatInterface({
  chat,
  messages,
}: {
  chat: Chat;
  messages: Message[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<Message[]>(messages);

  return (
    <div className="py-3 px-4 w-full max-w-7xl h-[90vh] flex ">
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 flex flex-col-reverse justify-end">
            {/* skeleton when its loading */}
            {isLoading && (
              <div className="flex flex-col gap-2 mt-4 max-w-[75%]">
                <Skeleton className="w-[100%] h-[40px] rounded-lg" />
                <Skeleton className="w-[100%] h-[40px] rounded-lg" />
                <Skeleton className="w-[75%] h-[40px] rounded-lg" />
                <Skeleton className="w-[75%] h-[40px] rounded-lg" />
                <Skeleton className="w-[50%] h-[40px] rounded-lg" />
              </div>
            )}

            {/* Mapping over all the after conversations */}
            {messageState.map((message, index) =>
              message.isSentbyAI ? (
                <AIResponse key={index} response={message.message} />
              ) : (
                <UserMessage key={index} message={message.message} />
              )
            )}

            {/* AI first response */}
            <AIResponse response={chat.response} />

            {/* User Prompt first message */}
            <UserMessage message={chat.prompt} />
          </div>
        </ScrollArea>

        {isError && (
          <Alert variant="destructive" className="mt-5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{isError}</AlertDescription>
          </Alert>
        )}
        <div className="p-4 border-t">
          <div className="border-0 bg-[#1c1e22] rounded-xl overflow-hidden flex gap-4 px-2 py-3">
            {/* TODO separate send message form */}
            <SendMessageForm
              isLoading={isLoading}
              chatId={chat.id}
              setIsError={setIsError}
              setIsLoading={setIsLoading}
              setMessageState={setMessageState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
