'use client';

import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal';
import CreateChannelModal from '@/features/channels/components/create-channel-modal';
import { useEffect, useState } from 'react';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const Modals = () => {
  const workspaceId = useWorkspaceId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return true;

  return (
    <>
      <CreateWorkspaceModal />
      {workspaceId && <CreateChannelModal />}
    </>
  );
};

export default Modals;
