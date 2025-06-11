"use client";
import React from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteMemory } from "@/app/action/memory";
import { useToast } from "@/hooks/use-toast";

const DeleteMemory = ({ id }: { id: number }) => {
  const { toast } = useToast();

  const handleClick = async (id: number) => {
    try {
      const response = await deleteMemory({ id });
      if (response.success) {
        toast({
          variant: "success",
          description: response.message,
        });
        return;
      } else {
        toast({
          variant: "destructive",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-red-500/30 !h-7 !w-7 flex items-center justify-center text-white px-0 py-0 rounded-full bottom-2 right-2 absolute z-10 hover:bg-red-500 ">
            <Trash2 className="!h-4 !w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete your memory and all its
              associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500/50 text-white hover:bg-red-500/70"
              onClick={() => handleClick(id)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteMemory;
