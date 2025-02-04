import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookmarkPlus, Link2, Notebook } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LinkForm from "./LinkForm";
import NoteForm from "./NoteForm";
import { useState } from "react";

export function AddMemoryDialog() {

  const [open, setOpen] = useState<boolean>(false)

  const handleDialogClose = ()=>{
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"} className="flex items-center font-medium">
          <BookmarkPlus className="!h-5 !w-5" />
         Add a memory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add a Memory</DialogTitle>
          <DialogDescription className="text-sm !mt-0">
            Add a memory to not forget about it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid mt-2">
          <Tabs defaultValue="account" className=" bg-transparent">
            <TabsList className="gap-1">
              <TabsTrigger value="link" >
                <div className=" flex gap-1 items-center">
                  <Link2 className="text-green-500 w-5 h-5"  />
                  <p className="text-base ">
                  Link
                  </p>
                </div>
              </TabsTrigger>
              <TabsTrigger value="note" >
                <div className="  flex gap-1 items-center">
                  <Notebook className="text-blue-500 w-5 h-5" />
                  <p className="text-base ">
                  Note
                  </p>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="link">
              <LinkForm handleDialogClose={handleDialogClose} />
            </TabsContent>
            <TabsContent value="note">
              <NoteForm  handleDialogClose={handleDialogClose} />
            </TabsContent>
          </Tabs>
        </div>
       
      </DialogContent>
    </Dialog>
  );
}
