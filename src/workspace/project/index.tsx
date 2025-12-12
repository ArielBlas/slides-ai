import React from "react";
import { useParams } from "react-router-dom";

type Props = {};

const Project = (props: Props) => {
  const { projectId } = useParams();
  return <div>Project</div>;
};

export default Project;
