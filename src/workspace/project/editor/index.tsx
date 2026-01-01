import OutlineSection from "@/components/custom/OutlineSection";
import { firebaseDb } from "../../../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../outline";

type Props = {};

const Editor = (props: Props) => {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project>();
  const [loading, setLoading] = useState<boolean>(false);

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
