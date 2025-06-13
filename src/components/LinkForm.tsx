import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { createMemoryLink } from "@/app/action/memory";
import { Youtube, Twitter, Globe, Loader } from "lucide-react";
import { checkLinkType } from "@/lib/utils";
import { CATEGORY } from "@prisma/client";
import { Input } from "./ui/input";

const LinkForm = ({ handleDialogClose }: { handleDialogClose: () => void }) => {
  const { toast } = useToast();
  const [linkType, setLinkType] = useState<CATEGORY | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LinkSchemaType>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      link: "",
    },
  });

  const content = form.watch("link");

  useEffect(() => {
    if (!content) {
      setLinkType(null);
      return;
    }
    try {
      const type = checkLinkType(content);
      setLinkType(type);
    } catch {
      setLinkType(null);
    }
  }, [content]);

  const handleFormClose = () => {
    form.reset();
    form.clearErrors();
    setIsLoading(false)
    handleDialogClose();
  };


  const onSubmit = async ({ link }: LinkSchemaType) => {
    if (!link) return;
    setIsLoading(true)
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

  const getButtonConfig = (linkType: CATEGORY | null) => {
    switch (linkType) {
      case CATEGORY.YTLINK:
        return {
          text: "Save Memory",
          icon: <Youtube className="mr-2 h-6 w-6" />,
          className: "bg-red-500/70 hover:bg-red-500 text-white",
          actionText:
            "Bookmark this YouTube video to revisit and enjoy it later!",
        };
      case CATEGORY.TWTLINK:
        return {
          text: "Save Memory",
          icon: <Twitter className="mr-2 h-6 w-6" />,
          className: "bg-[#1e2731] hover:bg-[#141a20] text-white",
          actionText:
            "Save this Tweet to keep the conversation alive for later!",
        };
      case CATEGORY.LINK:
        return {
          text: "Save Memory",
          icon: <Globe className="mr-2 h-6 w-6" />,
          className: "bg-green-700 hover:bg-green-800 text-white",
          actionText: "Bookmark this link to explore it whenever you want!",
        };
      default:
        return {
          text: "Save Memory",
          icon: null,
          className: "",
          actionText: "Save this for future reference!",
        };
    }
  };

  const buttonConfig = getButtonConfig(linkType);

  return (
    <div>
      <div className="mb-2 mt-4">
        <p className="text-sm text-muted-foreground ">
          Add or paste any website URL (YouTube, Twitter, etc.).
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className=""
                    placeholder="https://yourwebsite.com/"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={`!mt-4 flex items-center ${buttonConfig.className}`}
          >
            {isLoading ? 
            <>
            <Loader className="animate-spin mr-2 h-6 w-6"  /> Loading...
            </>
            :
            <>
            {buttonConfig.icon}
            {buttonConfig.text}
            </>
            }
          </Button>
          <p className="text-muted-foreground !mt-2 text-xs ">
            {buttonConfig.actionText}
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LinkForm;
