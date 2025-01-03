"use client";

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { useEffect, useState } from "react";

const Modals = () => {
  const [moundted, setMounnted] = useState(false);

  useEffect(() => {
    setMounnted(true);
  }, []);

  if (!moundted) return true;

  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};

export default Modals;
