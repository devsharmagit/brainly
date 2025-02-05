import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { linkSchema, LinkSchemaType } from "@/lib/formSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createMemoryLink } from "@/app/action/memory";
import { useToast } from "@/hooks/use-toast";

const LinkForm = ({handleDialogClose} : {handleDialogClose: ()=>void}) => {
  
  const { toast } = useToast()

  const form = useForm<LinkSchemaType>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      link: "",
    },
  });

  const handleFormClose = ()=>{
    form.reset()
    form.clearErrors()
    handleDialogClose()
  }

  const onSubmit = async ({ link }: LinkSchemaType) => {
    if (!link) return;
    const result = await createMemoryLink({ link });
    if(result.success){
      toast({description: result.message, variant: "success"})
      handleFormClose()
      return
    }
    if(!result.success){
      toast({description: result.message, variant: "destructive"})
      handleFormClose()
      return
    }
  };

  return (
    <div>
      <div className="mb-2 mt-4">
        <p className="text-sm">Add Youtube video , tweet or website url.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="https://anywebsite.com/" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="!mt-4">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LinkForm;
