import OutlineSection from "@/components/custom/OutlineSection";
import {
  firebaseDb,
  GeminiAiLiveModel,
} from "../../../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../outline";
import SliderFrame from "@/components/custom/SliderFrame";

type Props = {};

const SLIDER_PROMPT = `
  Generate HTML (Tailwind CSS + Flowbite UI + Lucide Icons)
  code for a 16:9 Modern Dark style.
  {DESIGN_STYLE}, responsive design 16:9 layout,
  and Flowbite component structure. Use different
  layout depends on content and style.
  use color from tailwindcss like primary accent,
  gradient and background and any other
  if needed and use this color {COLORS_CODE}.
  MetaData for Slider: {METADATA}
  Generate Image if needed and use Image as
  'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'.
  Replace {imagePrompt} with relavant image prompt
  and altImageName with random image name for that image.
  16:8 ratio. PPT Slider. Just give me body content only.
  `;

const Editor = (props: Props) => {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project>();
  const [loading, setLoading] = useState<boolean>(false);
  const [sliders, setSliders] = useState<any[]>([]);
  const [isSlidesGenerated, setIsSlidesGenerated] = useState<any>();

  const GetProjectDetail = async () => {
    setLoading(true);
    const docRef = doc(firebaseDb, "projects", projectId ?? "");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;
    setProjectDetail(docSnap.data() as Project);
    setLoading(false);
  };

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      await GetProjectDetail();
    })();
  }, [projectId]);

  const GenerateSlides = async () => {
    if (!projectDetail?.outline || projectDetail.outline.length === 0) return;

    console.log("Starting slide generation...");

    for (
      let index = 0;
      index < projectDetail.outline.length && index < 3;
      index++
    ) {
      const metaData = projectDetail.outline[index];
      const prompt = SLIDER_PROMPT.replace(
        "{DESIGN_STYLE}",
        projectDetail.designStyle?.designGuide || ""
      )
        .replace(
          "{COLORS_CODE}",
          JSON.stringify(projectDetail.designStyle?.colors)
        )
        .replace("{METADATA}", JSON.stringify(metaData));
      console.log("Generating slide", index + 1);
      await GeminiSlideCall(prompt, index);
      console.log("Finished slide", index + 1);
    }

    console.log("All slides generated.");

    setIsSlidesGenerated(Date.now());
  };

  const GeminiSlideCall = async (prompt: string, index: number) => {
    try {
      const session = await GeminiAiLiveModel.connect();
      await session.send(prompt);

      let text = "";

      for await (const message of session.receive()) {
        if (message.type === "serverContent") {
          const parts = message.modelTurn?.parts;
          if (parts && parts.length > 0) {
            text += parts.map((p) => p.text).join("");

            const finalText = text
              .replace(/```html/g, "")
              .replace(/```/g, "")
              .trim();

            setSliders((prev) => {
              const updated = prev ? [...prev] : [];
              updated[index] = { code: finalText };
              return updated;
            });
          }

          if (message.turnComplete) {
            console.log("Slide", index + 1, "complete");
            break;
          }
        }
      }
      session.close();
    } catch (error) {
      console.error("Error generating slide:", error);
    }
  };

  const SaveAllSlides = async () => {
    await setDoc(
      doc(firebaseDb, "projects", projectId ?? ""),
      {
        slides: sliders,
      },
      {
        merge: true,
      }
    );
  };

  useEffect(() => {
    if (projectDetail && projectDetail.slides?.length === 0) {
      GenerateSlides();
    } else {
      setSliders(projectDetail?.slides || []);
    }
  }, [projectDetail]);

  useEffect(() => {
    if (isSlidesGenerated) {
      SaveAllSlides();
    }
  }, [isSlidesGenerated]);

  const updateSliderCode = (updateSlideCode: string, index: number) => {
    setSliders((prev) => {
      const updated = prev ? [...prev] : [];
      updated[index] = { ...updated[index], code: updateSlideCode };
      return updated;
    });
    setIsSlidesGenerated(Date.now());
  };

  return (
    <div className="grid grid-cols-5 p-10">
      <div className="col-span-2 h-screen overflow-auto">
        {/* Outline */}
        <OutlineSection
          outline={projectDetail?.outline ?? []}
          handleUpdateOutline={() => console.log("")}
          loading={loading}
        />
      </div>
      <div className="col-span-3">
        {/* Sliders */}
        {sliders?.map((slide, index) => (
          <SliderFrame
            key={index}
            slide={slide}
            colors={projectDetail?.designStyle?.colors}
            setUpdateSlider={(updateSlideCode: string) =>
              updateSliderCode(updateSlideCode, index)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Editor;
