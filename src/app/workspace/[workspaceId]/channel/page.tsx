'use client';

import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

const ChannelPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data: channels } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);

  useEffect(() => {
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    }
  }, [channelId, router, workspaceId]);
};

export default ChannelPage;
