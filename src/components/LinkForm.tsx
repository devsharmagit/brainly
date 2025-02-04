import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { linkSchema, LinkSchemaType } from '@/lib/formSchema'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
 

const LinkForm = () => {

    const form = useForm<LinkSchemaType>({
        resolver: zodResolver(linkSchema),
        defaultValues: {
          link: "",
        },
      })
     

      function onSubmit(values: LinkSchemaType) {
        
        console.log(values)
      }


  return (
    <div>
      <p>
        Add Youtube video , tweet or website url. 
      </p>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

    </div>
  )
}

export default LinkForm
