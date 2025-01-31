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
import { BookmarkPlus, Link2, StickyNote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="py-2">
              <TabsTrigger value="account">
                <div className=" py-2 flex gap-2 items-center">
                  <Link2 />
                  Account
                </div>
              </TabsTrigger>
              <TabsTrigger value="password">
                <div className=" py-2 flex gap-2 items-center">
                  <StickyNote />
                  Password
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
