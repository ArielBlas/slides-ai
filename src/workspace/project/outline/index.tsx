import React, { useEffect, useState } from "react";
import { firebaseDb } from "../../../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import SlidersStyle from "@/components/custom/SlidersStyle";

type Props = {};

type Project = {
  userInputPrompt: string;
  projectId: string;
  createdAt: string;
};

const Outline = (props: Props) => {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project>();

  const GetProjectDetail = async () => {
    const docRef = doc(firebaseDb, "projects", projectId ?? "");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;
    setProjectDetail(docSnap.data() as Project);
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
      </div>
    </div>
  );
};

export default Outline;
