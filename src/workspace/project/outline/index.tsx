import React, { useEffect, useState } from "react";
import { firebaseDb, GeminiAiModel } from "../../../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import SlidersStyle from "@/components/custom/SlidersStyle";
import OutlineSection from "@/components/custom/OutlineSection";

type Props = {};

type Project = {
  userInputPrompt: string;
  projectId: string;
  createdAt: string;
  noOfSliders: string;
};

const OUTLINE_PROMPT = `
  Generate a PowerPoint slide outline for the topic {userInput}. Create {noOfSliders} slides in total. 
  Each slide should include a topic name and a 2-line descriptive outline that clearly explains what content the slide will cover.
  Include the following structure:
  The first slide should be a Welcome screen.
  The second slide should be an Agenda screen.
  The final slide should be a Thank You screen.
  Return the response only in JSON format, following this schema:
  [
    {
      "slideNo": "",
      "slidePoint": ""
      "outline": ""
    }
  ]
`;

const Outline = (props: Props) => {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project>();
  const [loading, setLoading] = useState<boolean>(false);

  const GenerateSlidersOutline = async (projectData: Project) => {
    setLoading(true);
    const prompt = OUTLINE_PROMPT.replace(
      "{userInput}",
      projectData.userInputPrompt ?? ""
    ).replace("{noOfSliders}", projectData.noOfSliders ?? "");

    const result = await GeminiAiModel.generateContent(prompt);

    const response = result.response;
    const text = response.text();
    setLoading(false);
  };

  const GetProjectDetail = async () => {
    const docRef = doc(firebaseDb, "projects", projectId ?? "");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;
    setProjectDetail(docSnap.data() as Project);
    GenerateSlidersOutline(docSnap.data() as Project);
  };

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      await GetProjectDetail();
    })();
  }, [projectId]);

  return (
    <div className="flex justify-center mt-20">
      <div className="max-w-3xl w-full">
        <h2 className="font-bold text-2xl">Settings and Slider Outline</h2>
        <SlidersStyle />
        <OutlineSection loading={loading} />
      </div>
    </div>
  );
};

export default Outline;
