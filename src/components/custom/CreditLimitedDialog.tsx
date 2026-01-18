import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Link } from "react-router-dom";

type Props = {
  openAlert: boolean;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreditLimitedDialog = ({ openAlert, setOpenAlert }: Props) => {
  return (
    <AlertDialog open={openAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Opps!</AlertDialogTitle>
          <AlertDialogDescription>
            You dont have any credits left. Join unlimited Project create plan
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpenAlert(false)}>
            Cancel
          </AlertDialogCancel>
          <Link to="/workspace/pricing">
            <AlertDialogAction>Pricing</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreditLimitedDialog;
