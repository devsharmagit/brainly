import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { noteSchema, NoteSchemaType } from "@/lib/formSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";

const NoteForm = ({handleDialogClose} : {handleDialogClose: ()=>void}) => {
  
  const { toast } = useToast()

  const form = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleFormClose = ()=>{
    form.reset()
    form.clearErrors()
    handleDialogClose()
  }

  const onSubmit = async ({ content }: NoteSchemaType) => {
    // if (!content) return;
    // const result = await createMemory({ content, category: "NOTE" });
    // if(result.success){
    //   toast({description: result.message, variant: "success"})
    //   handleFormClose()
    //   return
    // }
    // if(!result.success){
    //   toast({description: result.message, variant: "destructive"})
    //   handleFormClose()
    //   return
    // }
  };

  return (
    <div>
      <div className="mb-2 mt-4">
        <p className="text-sm"> Add any text or note.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea className="min-h-24" placeholder="Type your note here ..." {...field} />
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

export default NoteForm;
