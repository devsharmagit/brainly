"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { SendHorizontal, AlertCircle, Loader2 } from "lucide-react";
import { getAIChat } from "@/app/action/memory";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const MessageForm = () => {

  const loadingTexts = useMemo(() => [
    "Generating Embeddings...", "Fetching Memory...", "Thinking...", "Preparing Response...",
  ], []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [currentLoadingIndex, setCurrentLoadingIndex] = useState<number>(0);

  
    useEffect(()=>{
      let interval : NodeJS.Timeout | null = null;
      if(isLoading){
        console.log("Loading started")
       interval =   setInterval(() => {
          setCurrentLoadingIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) >= 4 ? prevIndex : (prevIndex + 1);
            return nextIndex;
          });
        }, 2000);
      }
  
      return()=>{
        if(interval) clearInterval(interval);
        setCurrentLoadingIndex(0);    }
    }, [isLoading]);

  const router = useRouter();

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
      if (result.data?.id) router.push("/dashboard/chat/" + result.data.id);
      if (!result.data?.response) {
        throw new Error("No response received from AI");
      }
      form.reset();
    } catch (error: unknown) {
      setIsError(
        (error instanceof Error && error.message) ||
          "An error occurred while fetching the response"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="border-0 bg-[#1c1e22] rounded-xl overflow-hidden flex gap-4 px-2 py-3">
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
              className="bg-blue-600 border-gray-600 text-white font-semibold hover:bg-blue-700"
            >
             {isLoading ? <> <Loader2  className=' animate-spin'/> <span> {loadingTexts[currentLoadingIndex]}</span></>     : <> <SendHorizontal /> <span> Send </span></>}
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
    </>
  );
};

export default MessageForm;
