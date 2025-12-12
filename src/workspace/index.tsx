import React from "react";
import { Outlet } from "react-router-dom";

type Props = {};

const Workspace = (props: Props) => {
  return (
    <div>
      Workspace <Outlet />
    </div>
  );
};

export default Workspace;
