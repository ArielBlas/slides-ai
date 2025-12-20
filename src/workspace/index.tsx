import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { firebaseDb } from "../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserDetailContext } from "../../context/UserDetailContext";
import Header from "@/components/custom/Header";
import PromptBox from "@/components/custom/PromptBox";

type Props = {};

const Workspace = (props: Props) => {
  const { user } = useUser();
  const { userDetail, setUserDetail } = React.useContext(UserDetailContext);
  const location = useLocation();

  const CreateNewUser = async () => {
    if (user) {
      // if user already exist in DB
      const docRef = doc(
        firebaseDb,
        "users",
        user?.primaryEmailAddress?.emailAddress ?? ""
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUserDetail(docSnap.data());
      } else {
        const data = {
          fullName: user.fullName,
          email: user?.primaryEmailAddress?.emailAddress ?? "",
          createdAt: new Date(),
          credits: 2,
        };
        // Insert new user
        await setDoc(
          doc(
            firebaseDb,
            "users",
            user?.primaryEmailAddress?.emailAddress ?? ""
          ),
          data
        );
        setUserDetail(data);
      }
    }
  };

  useEffect(() => {
    if (user) CreateNewUser();
  }, [user]);

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
      <Header />
      {location.pathname === "/workspace" && <PromptBox />}
      <Outlet />
    </div>
  );
};

export default Workspace;
