import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link2, Notebook,  PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LinkForm from "./LinkForm";
import NoteForm from "./NoteForm";
import { useState } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
 

export function AddMemoryDialog() {
  const [open, setOpen] = useState<boolean>(false);

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full">
        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900 flex items-center gap-2 text-center justify-center">
          
          <PlusCircle />
              <p>
              Add a Memory
              </p>
            
          </BackgroundGradient>
        </button>     
    
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]  sm:min-h-[370px] block space-y-6">
        <DialogHeader className="max-h-fit">
          <DialogTitle className="text-2xl">Add a Memory</DialogTitle>
          <DialogDescription className="text-sm !mt-0">
            Add a memory to not forget about it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid">
          <Tabs defaultValue="link" className=" bg-transparent">
          <TabsList className="bg-transparent gap-x-2">
            <TabsTrigger
              className=" text-base  data-[state=active]:bg-green-700 flex gap-2"
              value="Links"
            >
              <Link2 />
              Links
            </TabsTrigger>
            <TabsTrigger
              className=" text-base  data-[state=active]:bg-blue-700 flex gap-2"
              value="Notes"
            >
              <Notebook />
              Notes
            </TabsTrigger>
           
          </TabsList>
            <TabsContent value="Links">
              <LinkForm handleDialogClose={handleDialogClose} />
            </TabsContent>
            <TabsContent value="Notes">
              <NoteForm handleDialogClose={handleDialogClose} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
