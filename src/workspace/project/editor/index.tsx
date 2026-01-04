import OutlineSection from "@/components/custom/OutlineSection";
import {
  firebaseDb,
  GeminiAiLiveModel,
} from "../../../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../outline";

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
    const prompt = SLIDER_PROMPT.replace(
      "{DESIGN_STYLE}",
      projectDetail?.designStyle?.designGuide ?? ""
    )
      .replace(
        "{COLORS_CODE}",
        JSON.stringify(projectDetail?.designStyle?.colors)
      )
      .replace("{METADATA}", JSON.stringify(projectDetail?.outline[0]));

    const session = await GeminiAiLiveModel.connect();

    session.send(prompt);

    let text = "";
    const messages = session.receive();
    for await (const message of messages) {
      switch (message.type) {
        case "serverContent":
          if (message.turnComplete) {
            console.log(text);
          } else {
            const parts = message.modelTurn?.parts;
            if (parts) {
              text += parts.map((part) => part.text).join("");
              console.log(text);
              const finalText = text.replace("```html", "").replace("```", "");
              setSliders((prev) => {
                if (!prev) return [];
                const updated = [...prev];
                if (0 < updated.length) {
                  updated[0] = { code: finalText };
                } else {
                  updated[0] = { code: finalText };
                }
                return updated;
              });
            }
          }
          break;
        case "toolCall":
          // Ignore
          break;
        case "toolCallCancellation":
          // Ignore
          break;
      }
    }
  };

  useEffect(() => {
    if (projectDetail && projectDetail.slides?.length === 0) {
      GenerateSlides();
    }
  }, [projectDetail]);

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
      <div className="col-span-3">{/* Sliders */}</div>
    </div>
  );
};

export default Editor;
