"use client";
import React, { useState } from "react";
import { MessageSchemaType, messageSchema } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SendHorizontal,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getAIChat } from "@/app/action/memory";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import { Memory } from "@prisma/client";
import Context from "./Context";

interface MemoryWithChat {
  chatId: number;
  memoryId: number;
  memory: Memory;
}

const MessageForm = () => {
  const [response, setResponse] = useState<string>("");

  const [context, setContext] = useState<MemoryWithChat[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  const [isContextOpen, setIsContextOpen] = useState<boolean>(false);

  const form = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleContextClick = () => {
    setIsContextOpen((pre) => !pre);
  };

  const onSubmit = async (data: MessageSchemaType) => {
    try {
      setIsLoading(true);
      setIsError(null);
      const result = await getAIChat({ prompt: data.message });
      console.log(result);
      if (!result.data?.response) {
        throw new Error("No response received from AI");
      }
      setResponse(result.data.response);
      // TODO context on memory.ts
      setContext(result.data.context);

      form.reset();
    } catch (error) {
      setIsError(
        error.message || "An error occurred while fetching the response"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

      {isError && (
        <Alert variant="destructive" className="mt-5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{isError}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <>
          <Separator className="mt-5" />
          <div className="mt-5 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-9/12" />
            <Skeleton className="h-4 w-8/12" />
          </div>
        </>
      ) : response && !isError ? (
        <>
          <Separator className="mt-5" />
          <div className="flex items-center mt-5 mb-5">
            <div className="relative w-8 h-8 mr-2">
              <Image
                src="/gemini.png"
                alt="Gemini AI"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-medium text-gray-200 text-lg">
              Gemini Response
            </span>
          </div>
          <div className="border-0 bg-gray-500/20 rounded-xl overflow-hidden px-4 py-3 text-gray-200 list-disc flex flex-col gap-y-2">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc pl-4" />
                ),
              }}
            >
              {response}
            </ReactMarkdown>
          </div>
          <div className="border-0 bg-gray-500/20 rounded-xl overflow-hidden px-4 py-3 mt-5">
            <div
              onClick={handleContextClick}
              className="flex gap-4 items-center cursor-pointer hover:bg-white/10 px-2 py-2 rounded-xl transition-all"
            >
              <h1 className="font-medium  text-gray-200 text-lg">Context</h1>
              {isContextOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
            {isContextOpen && (
              <div className="columns-1 sm:columns-2 md:columns-3  gap-10 space-y-10 mt-5">
                <Context memories={context} />
              </div>
            )}
          </div>
        </>
      ) : null}
    </>
  );
};

export default MessageForm;
