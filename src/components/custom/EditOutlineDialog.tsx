import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Outline } from "@/workspace/project/outline";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

type Props = {
  children: React.ReactNode;
  outlineData: Outline;
};

const EditOutlineDialog = ({ children, outlineData }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Slider Outline</DialogTitle>
          <DialogDescription>
            <div>
              <label>Slide Title</label>
              <Input
                placeholder="Slider title"
                value={outlineData.slidePoint}
              />
              <div className="mt-3">
                <label className="mt-4">Outline</label>
                <Textarea placeholder="Outline" value={outlineData.outline} />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"outline"}>Close</Button>
          <Button>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOutlineDialog;
