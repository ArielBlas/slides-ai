import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FloatingActionTool from "./FloatingActionTool";
import { GeminiAiModel } from "../../../config/FirebaseConfig";

type Props = {
  slide: { code: string };
  colors: any;
  setUpdateSlider: any;
};

const HTML_DEFAULT = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Slider Frame</title>
        <script src="https://cdn.tailwindcss.com"></script>

        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {colorCodes},
                        backgroundImage: {
                            gradient: 'linear-gradient(90deg, #6366F1, 0%, #108981 100%)'
                        }
                    },
                },
            };
        </script>

        <!-- Flowbite CSS & JS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

        <!-- Font Awesome Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

        <!-- Chart.js for charts & graphs -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <!-- ADS (Animate On Scroll) for scroll animations -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
       
        <!-- GSAP (GreenSock) for advanced animations -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

        <!-- Lottie for JSON based animations -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

        <!-- Swiper.js for sliders/carousels -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

        <!-- Optional: Tooltip & Popover library (Tippy.js) -->
        <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
        <script src="https://unpkg.com/@popperjs/core@2"></script>
        <script src="https://unpkg.com/tippy.js@6"></script>
    </head>
    {code}
    </html>
`;

const SliderFrame = ({ slide, colors, setUpdateSlider }: Props) => {
  const FINAL_CODE = HTML_DEFAULT.replace(
    "{colorCodes}",
    JSON.stringify(colors)
  ).replace("{code}", slide?.code);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [cardPosition, setCardPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const selectedElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(FINAL_CODE);
    doc.close();

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
      hoverEl = target;
      hoverEl.style.outline = "2px dotted blue";
    };

    const handleMouseOut = () => {
      if (selectedEl) return;
      if (hoverEl) {
        hoverEl.style.outline = "";
        hoverEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      selectedEl = target;

      selectedElRef.current = target;

      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }

      selectedEl = target;
      selectedEl.style.outline = "2px solid blue";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();

      const rect = target.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();

      setCardPosition({
        x: iframeRect.left + rect.left + rect.width / 2,
        y: iframeRect.top + rect.bottom,
      });
    };

    const handleBlur = () => {
      if (selectedEl) {
        console.log("Final edited element: ", selectedEl.outerHTML);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl = null;
      }
    };

    doc.addEventListener("DOMContentLoaded", () => {
      doc.body?.addEventListener("mouseover", handleMouseOver);
      doc.body?.addEventListener("mouseout", handleMouseOut);
      doc.body?.addEventListener("click", handleClick);
      doc.body?.addEventListener("keydown", handleKeyDown);
    });

    return () => {
      doc.body?.removeEventListener("mouseover", handleMouseOver);
      doc.body?.removeEventListener("mouseout", handleMouseOut);
      doc.body?.removeEventListener("click", handleClick);
      doc.body?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleAiSectionChange = async (userAiPrompt: string) => {
    setLoading(true);
    const selectedEl = selectedElRef.current;
    const iframe = iframeRef.current;

    if (!selectedEl || !iframe) return;

    const oldHTML = selectedEl.outerHTML;

    const prompt = `
      Regenerate or rewrite the following HTML code based on this user instruction.
      If user asked to change the image/regenerate the image then make sure to use 
      Image Kit:
      'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
      Replace {imagePrompt} with relevant image prompt and altIMageName with a random image name.
      if user want to crop image, or remove background or scale image or optimize image then add image kit ai transformation
      by providing ?tr=fo-auto,<other transfromation> etc.
      "User Instruction is :${userAiPrompt}"
      HTML code:
      ${oldHTML}
    `;

    try {
      const result = await GeminiAiModel.generateContent(prompt);
      const newHTML = (await result.response.text()).trim();

      const tempDiv = iframe.contentDocument?.createElement("div");
      if (tempDiv) {
        tempDiv.innerHTML = newHTML;
        const newNode = tempDiv.firstElementChild;

        if (newNode && selectedEl.parentNode) {
          selectedEl.parentNode.replaceChild(newNode, selectedEl);
          selectedElRef.current = newNode as HTMLElement;
          console.log("Element updated with AI content.");

          const updatedSliderCode = iframe.contentDocument?.body?.innerHTML;
          setUpdateSlider(updatedSliderCode);
        }
      }
    } catch (error) {
      console.error("Error updating element with AI content:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <iframe
        ref={iframeRef}
        className="w-[900px] h-[600px] border-0"
        sandbox="aloow-scripts allow-same-origin allow-modals allow-forms allow-popups"
      />
      <FloatingActionTool
        position={cardPosition}
        onClose={() => setCardPosition(null)}
        loading={loading}
        handleAiChange={(value: string) => handleAiSectionChange(value)}
      />
    </div>
  );
};

export default SliderFrame;
