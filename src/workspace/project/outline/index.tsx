import React, { useContext, useEffect, useState } from "react";
import { firebaseDb, GeminiAiModel } from "../../../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import SlidersStyle, {
  type DesignStyle,
} from "@/components/custom/SlidersStyle";
import OutlineSection from "@/components/custom/OutlineSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { UserDetailContext } from "../../../../context/UserDetailContext";
import CreditLimitedDialog from "@/components/custom/CreditLimitedDialog";
import { useAuth } from "@clerk/clerk-react";

type Props = {};

export type Project = {
  userInputPrompt: string;
  projectId: string;
  createdAt: string;
  noOfSliders: string;
  outline: Outline[];
  slides: any[];
  designStyle: DesignStyle;
};

export type Outline = {
  slidesNo: string;
  slidePoint: string;
  outline: string;
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
  const [UpdateDbLoading, setUpdateDbLoading] = useState<boolean>(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [outline, setOutline] = useState<Outline[]>();
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const navigate = useNavigate();
  const { has } = useAuth();
  const hasUnlimitedAccess = has && has({ plan: "unlimited" });

  const GenerateSlidersOutline = async (projectData: Project) => {
    setLoading(true);
    const prompt = OUTLINE_PROMPT.replace(
      "{userInput}",
      projectData.userInputPrompt ?? "",
    ).replace("{noOfSliders}", projectData.noOfSliders ?? "");

    const result = await GeminiAiModel.generateContent(prompt);

    const response = result.response;
    const text = response.text();
    const rawJson = text.replace("```json", "").replace("```", "").trim();
    const JSONData = JSON.parse(rawJson);
    setOutline(JSONData);
    setLoading(false);
  };

  const GetProjectDetail = async () => {
    const docRef = doc(firebaseDb, "projects", projectId ?? "");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;
    setProjectDetail(docSnap.data() as Project);
    if (!docSnap.data()?.outline)
      GenerateSlidersOutline(docSnap.data() as Project);
  };

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      await GetProjectDetail();
    })();
  }, [projectId]);

  const handleUpdateOutline = (index: string | undefined, value: Outline) => {
    setOutline((prevOutline) =>
      prevOutline?.map((item) =>
        item.slidesNo === index ? { ...item, ...value } : item,
      ),
    );
  };

  const onGenerateSlider = async () => {
    if (userDetail?.credits <= 0 && !hasUnlimitedAccess) {
      setOpenAlert(true);
      return;
    }
    setUpdateDbLoading(true);
    // update db
    await setDoc(
      doc(firebaseDb, "projects", projectId ?? ""),
      {
        designStyle: selectedStyle,
        outline: outline,
      },
      { merge: true },
    );
    if (!hasUnlimitedAccess)
      await setDoc(
        doc(firebaseDb, "users", userDetail?.email ?? ""),
        {
          credits: userDetail?.credits - 1,
        },
        {
          merge: true,
        },
      );
    if (!hasUnlimitedAccess)
      setUserDetail({
        ...userDetail,
        credits: (userDetail?.credits ?? 0) - 1,
      });
    setUpdateDbLoading(false);
    navigate(`/workspace/project/${projectId}/editor`);
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="max-w-3xl w-full">
        <h2 className="font-bold text-2xl">Settings and Slider Outline</h2>
        <SlidersStyle
          selectedStyle={(value: DesignStyle) => setSelectedStyle(value)}
        />
        <OutlineSection
          loading={loading}
          outline={outline ?? []}
          handleUpdateOutline={(index: string | undefined, value: Outline) =>
            handleUpdateOutline(index, value)
          }
        />
      </div>

      <Button
        size="lg"
        className="fixed bottom-6 transform left-1/2 -translate-x-1/2"
        onClick={onGenerateSlider}
        disabled={UpdateDbLoading || loading}
      >
        {UpdateDbLoading && <Loader2Icon className="animate-spin" />}
        Generate Sliders <ArrowRight />
      </Button>

      <CreditLimitedDialog openAlert={openAlert} setOpenAlert={setOpenAlert} />
    </div>
  );
};

export default Outline;
