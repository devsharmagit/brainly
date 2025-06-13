import React, { useEffect, useMemo, useState } from "react";
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
import { createMemoryNote } from "@/app/action/memory";
import { Loader } from "lucide-react";

const NoteForm = ({handleDialogClose} : {handleDialogClose: ()=>void}) => {
   const loadingTexts =  useMemo(()=> ["Processing...", "Generating embeddings...", "Saving to DB...", "Saving..."], []);
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentLoadingIndex, setCurrentLoadingIndex] = useState(0)

  const form = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: "",
    },
  });

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

  const handleFormClose = ()=>{
    form.reset()
    form.clearErrors()
    setIsLoading(false)
    handleDialogClose()
  }

  const onSubmit = async ({ content }: NoteSchemaType) => {
    if (!content) return;
    setIsLoading(true)
    const result = await createMemoryNote({ content });
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
        <p className="text-sm text-muted-foreground"> Add any text or note.</p>
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
            {isLoading ? <>   <Loader className="animate-spin mr-2 h-6 w-6"  /> {loadingTexts[currentLoadingIndex]} </> : "Save Memory"}
            
          </Button>
          <p className="text-muted-foreground !mt-2 text-xs">
            Save note to your memory!
          </p>
        </form>
      </Form>
    </div>
  );
};

export default NoteForm;
