import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {};

const PromptBox = (props: Props) => {
  return (
    <div className="w-full flex items-center justify-center mt-28">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="font-bold text-3xl">
          Describe your topic, we'll design the slides!
        </h2>
        <p className="text-xl text-gray-500">
          Your design will be saved as new project
        </p>

        <InputGroup>
          <InputGroupTextarea
            placeholder="Enter what kind of slider do you want to create?"
            className="min-h-36"
          />
          <InputGroupAddon align={"block-end"}>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select No of Slider" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>No. of Slider</SelectLabel>
                  <SelectItem value="4 to 6">4-6 Sliders</SelectItem>
                  <SelectItem value="6 to 8">6-8 Sliders</SelectItem>
                  <SelectItem value="8 to 12">8-12 Sliders</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <InputGroupButton>
              <ArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
};

export default PromptBox;
