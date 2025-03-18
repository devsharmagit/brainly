"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, SendHorizontal } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { messageSchema, MessageSchemaType } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "./ui/alert";
import { Chat, Message } from "@prisma/client";
import { messageSent } from "@/app/action/chat";
import AIResponse from "./AIResponse";
import UserMessage from "./UserMessage";

export default function ChatInterface({
  chat,
  messages,
}: {
  chat: Chat;
  messages: Message[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const form = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: MessageSchemaType) => {
    try {
      setIsLoading(true);
      setIsError(null);
      const result = await messageSent({
        chatId: chat.id,
        message: data.message,
      });
      if (!result.success) {
        throw new Error("Error fetching the response from AI.");
      }
      setMessageState((prev) => [...prev, result.data]);

      form.reset();
    } catch (error: unknown) {
      setIsError(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching the response"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [messageState, setMessageState] = useState<Message[]>(messages);

  return (
    <div className="py-3 px-4 w-full max-w-7xl h-[90vh] flex ">
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* User Prompt first message */}
            <UserMessage message={chat.prompt} />

            {/* AI first response */}
            <AIResponse response={chat.response} />

            {/* Mapping over all the after conversations */}
            {messageState.map((message) =>
              message.isSentbyAI ? (
                <AIResponse key={message.id} response={message.message} />
              ) : (
                <UserMessage key={message.id} message={message.message} />
              )
            )}
          </div>
        </ScrollArea>

        {isError && (
          <Alert variant="destructive" className="mt-5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{isError}</AlertDescription>
          </Alert>
        )}
        <div className="p-4 border-t">
          <div className="border-0 bg-gray-500/20 rounded-xl overflow-hidden flex gap-4 px-2 py-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-x-8 flex flex-row w-full"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Ask anything to AI."
                          {...field}
                          disabled={isLoading}
                          className="!text-lg text-gray-200 font-medium !ring-0 !outline-0 !border-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-800 border-gray-600 text-white font-semibold hover:bg-green-700"
                >
                  <SendHorizontal /> <span> Send </span>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
