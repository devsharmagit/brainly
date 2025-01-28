"use client";
import { createMemory } from "@/app/action/memory";
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
import { useState } from "react";

export function DialogDemo() {
  const [link, setLink] = useState("");

  const handleClick = async () => {
    try {
      const memory = await createMemory({ link: link, category: "LINK" });
      console.log(memory);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              onChange={(e) => setLink(e.target.value)}
              value={link}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4"></div>
        </div>
        <DialogFooter>
          <Button onClick={handleClick} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
