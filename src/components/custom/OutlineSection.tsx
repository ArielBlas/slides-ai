import React from "react";

type Props = {
  loading: boolean;
};

const OutlineSection = ({ loading }: Props) => {
  return (
    <div className="mt-7">
      <div className="font-bold text-xl">Sliders Outline</div>
    </div>
  );
};

export default OutlineSection;
