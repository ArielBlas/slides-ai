import React, { useState } from "react";
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
import { DialogClose } from "@radix-ui/react-dialog";

type Props = {
  children: React.ReactNode;
  outlineData: Outline;
  onUpdate: (slidesNo: string | undefined, updatedOutline: Outline) => void;
};

const EditOutlineDialog = ({ children, outlineData, onUpdate }: Props) => {
  const [localData, setLocalData] = useState<Outline>(outlineData);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (field: keyof Outline, value: string) => {
    setLocalData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    onUpdate(outlineData?.slidesNo, localData);
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Slider Outline</DialogTitle>
          <DialogDescription>
            <div>
              <label>Slide Title</label>
              <Input
                placeholder="Slider title"
                value={localData.slidePoint}
                onChange={(event) =>
                  handleChange("slidePoint", event.target.value)
                }
              />
              <div className="mt-3">
                <label className="mt-4">Outline</label>
                <Textarea
                  placeholder="Outline"
                  value={localData.outline}
                  onChange={(event) =>
                    handleChange("outline", event.target.value)
                  }
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOutlineDialog;
