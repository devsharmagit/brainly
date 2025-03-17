"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { getAIChat } from "@/app/action/memory";
import { useForm } from "react-hook-form";
import { messageSchema, MessageSchemaType } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Alert, AlertDescription } from "./ui/alert";

interface Message {
  role: "agent" | "user";
  content: string;
  timestamp: string;
}

export default function ChatInterface() {
  const [isLoading, setIsLoading] = useState(false)
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
      const result = await getAIChat({ prompt: data.message });
      console.log(result);
      if (!result.data?.response) {
        throw new Error("No response received from AI");
      }
      // setResponse(result.data.response);
      // TODO context on memory.ts
      // setContext(result.data.context);

      form.reset();
    } catch (error) {
      setIsError(
        error.message || "An error occurred while fetching the response"
      );
    } finally {
      setIsLoading(false);
    }
  };

  

  const [messages] = useState<Message[]>([
    {
      role: "agent",
      content: "Hello, I am a generative AI agent. How may I assist you today?",
      timestamp: "4:08:28 PM",
    },
    {
      role: "user",
      content: "Hi, I'd like to check my bill.",
      timestamp: "4:08:37 PM",
    },
    {
      role: "agent",
      content:
        "Please hold for a second.\n\nOk, I can help you with that I can help you with that I can help you with that I can help you with that I can help you with that I can help you with that I can help you with that\n\nI'm pulling up your current bill information\n\nYour current bill is $150, and it is due on August 31, 2024.\n\nIf you need more details, feel free to ask!",
      timestamp: "4:08:37 PM",
    },
  ]);

  return (
    <div className="py-3 px-4 w-full max-w-7xl m-auto h-[90vh] flex ">
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-2 max-w-[75%]",
                  message.role === "user" && "ml-auto justify-end"
                )}
              >
                {/* add gemini photo here */}
                {message.role === "agent" && (
                    <div className="relative w-8 h-8 mr-2">
                                  <Image
                                    src="/gemini.png"
                                    alt="Gemini AI"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {message.role === "agent" ? "Gemini's Response" : "You"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
