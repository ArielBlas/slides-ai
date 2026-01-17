import React, { useContext } from "react";
import logo from "../../assets/logo.png";
import { Button } from "../ui/button";
import { SignInButton, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { Gem } from "lucide-react";
import { UserDetailContext } from "../../../context/UserDetailContext";
import { Link } from "react-router-dom";

type Props = {};

const Header = (props: Props) => {
  const { user } = useUser();
  const location = useLocation();
  const { userDetail } = useContext(UserDetailContext);
  const { has } = useAuth();
  const hasUnlimitedAccess = has && has({ plan: "unlimited" });

  const MenuOptions = [
    { name: "Workspace", path: "/workspace" },
    { name: "Pricing", path: "/workspace/pricing" },
  ];

  return (
    <div className="flex items-center justify-between px-10 shadow">
      <img src={logo} alt="Logo" width={130} height={130} />
      <ul className="flex gap-10">
        {MenuOptions.map((menu, index) => (
          <Link to={menu.path} key={index} className="">
            <h2>{menu.name}</h2>
          </Link>
        ))}
      </ul>
      {!user ? (
        <SignInButton mode="modal">
          <Button>Get Started</Button>
        </SignInButton>
      ) : (
        <div className="flex gap-5 items-center">
          <UserButton />
          {location.pathname.includes("/workspace") ? (
            !hasUnlimitedAccess && (
              <div className="flex gap-2 items-center p-2 px-3 bg-orange-100 rounded-full">
                <Gem /> {userDetail?.credits ?? 0}
              </div>
            )
          ) : (
            <Button>Go to Workspace</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
