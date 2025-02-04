import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookmarkPlus, Link2, Notebook, StickyNote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LinkForm from "./LinkForm";
import NoteForm from "./NoteForm";

export function AddMemoryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"} className="flex items-center font-medium">
          <BookmarkPlus className="!h-5 !w-5" />
          Add a Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Memory</DialogTitle>
          <DialogDescription>
            Add a memory to not forget about it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
              <LinkForm />
            </TabsContent>
            <TabsContent value="note">
              <NoteForm />
            </TabsContent>
          </Tabs>
        </div>
       
      </DialogContent>
    </Dialog>
  );
}
