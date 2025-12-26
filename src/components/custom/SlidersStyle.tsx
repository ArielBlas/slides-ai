import React, { useState } from "react";
import ProfessionalSlider from "../../assets/professional.jpg";

type Props = {};

const Design_Styles = [
  {
    styleName: "Professional",
    colors: {
      primary: "#1F2937",
      secondary: "#3B82F6",
      accent: "#10B981",
      background: "#F3F4F6",
      gradient: "linear-gradient(90deg, #1F2937 0%, #3B82F6 100%)",
    },
    designGuide:
      "Create a professional and clean design using muted colors and simple layouts.",
    icon: "briefcase",
    bannerImage: ProfessionalSlider,
  },
];

const SlidersStyle = (props: Props) => {
  const [selectedStyle, setSelectedStyle] = useState<string>();
  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl">Select Slider Style</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-3">
        {Design_Styles.map((design, index) => (
          <div
            key={index}
            className={`cursor-pointer ${
              design.styleName === selectedStyle
                ? "p-1 border-2 rounded-2xl"
                : ""
            }`}
            onClick={() => setSelectedStyle(design.styleName)}
          >
            <img
              src={design.bannerImage}
              alt={design.styleName}
              width={300}
              height={300}
              className="w-full h-[120px] rounded-2xl object-cover hover:scale-105 transition-all  "
            />
            <h2 className="font-medium text-center mt-1">{design.styleName}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidersStyle;
