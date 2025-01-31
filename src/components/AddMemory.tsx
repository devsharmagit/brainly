"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddMemoryDialog } from "./AddMemoryDialog";

export const AddMemory = () => {
  return (
    <div>
      <AddMemoryDialog />
    </div>
  );
};
