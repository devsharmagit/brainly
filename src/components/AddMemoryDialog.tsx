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

export function AddMemoryDialog() {
  const [open, setOpen] = useState<boolean>(false);

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="realtive hover:top-[-10px] top-0 transition-all w-full relative inline-flex h-36 overflow-hidden rounded-3xl p-[4px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#d7ffcb_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex gap-2 h-full w-full cursor-pointer items-center justify-center rounded-3xl bg-slate-950 px-3 py-1  font-medium text-gray-200 backdrop-blur-3xl text-lg">
            <PlusCircle />
            <p>
            Add a Memory
            </p>

          </span>
        </button>
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
              <TabsTrigger value="link">
                <div className=" flex gap-1 items-center">
                  <Link2 className="text-green-500 w-5 h-5" />
                  <p className="text-base ">Link</p>
                </div>
              </TabsTrigger>
              <TabsTrigger value="note">
                <div className="  flex gap-1 items-center">
                  <Notebook className="text-blue-500 w-5 h-5" />
                  <p className="text-base ">Note</p>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="link">
              <LinkForm handleDialogClose={handleDialogClose} />
            </TabsContent>
            <TabsContent value="note">
              <NoteForm handleDialogClose={handleDialogClose} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
