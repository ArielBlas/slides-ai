import React, { useEffect, useState } from "react";
import { firebaseDb } from "../../../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

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

  return <div>Outline</div>;
};

export default Outline;
