import { messageSchema, MessageSchemaType } from '@/lib/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Loader2, SendHorizontal } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Message } from '@repo/db/client';
import { messageSent } from '@/app/action/chat';

interface SendMessageFormProps {
    isLoading: boolean,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    setIsError: Dispatch<SetStateAction<string | null>>,
    setMessageState:  Dispatch<SetStateAction<Message[]>>,
    chatId : number
}

const SendMessageForm = ({isLoading,setMessageState, setIsError, setIsLoading, chatId}: SendMessageFormProps) => {

  const form = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: MessageSchemaType) => {
    try {
      setMessageState((prev) => [
        {
          chatId: chatId,
          id: 12,
          createAt: new Date(),
          isSentbyAI: false,
          message: data.message,
        },
        ...prev,
      ]);
      setIsLoading(true);
      setIsError(null);
      const result = await messageSent({
        chatId: chatId,
        message: data.message,
      });
      if (!result.success) {
        throw new Error("Error fetching the response from AI.");
      }
      setMessageState((prev) => [ result.data, ...prev,]);

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

  return (
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
        {isLoading ? <> <Loader2  className=' animate-spin'/> <span> Loading ...</span></>     : <> <SendHorizontal /> <span> Send </span></>} 
      </Button>
    </form>
  </Form>
  )
}

export default SendMessageForm
