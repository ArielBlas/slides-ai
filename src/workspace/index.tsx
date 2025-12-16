import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

type Props = {};

const Workspace = (props: Props) => {
  const { user } = useUser();

  if (!user) {
    return (
      <div>
        Please sign in to access the workspace.
        <Link to="/">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      Workspace <Outlet />
    </div>
  );
};

export default Workspace;
