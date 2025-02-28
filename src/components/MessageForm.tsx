"use client"
import React from 'react';
import { MessageSchemaType, messageSchema } from '@/lib/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SendHorizontal } from 'lucide-react';



const MessageForm = () => {

    const form = useForm<MessageSchemaType>({
        resolver: zodResolver(messageSchema),
        defaultValues:{
            message: ""
        }
    })

    function onSubmit (data: MessageSchemaType){
console.log(data)
    }

  return (
    <>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-8 flex flex-row w-full">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input placeholder="Ask anything to AI." {...field} className='!text-lg text-gray-200 font-medium !ring-0 !outline-0 !border-0' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='bg-green-800 border-gray-600 text-white font-semibold hover:bg-green-700 '> 
            <SendHorizontal />     <span> Send </span>
        </Button>
      </form>
    </Form> 
    </>
  )
}

export default MessageForm
