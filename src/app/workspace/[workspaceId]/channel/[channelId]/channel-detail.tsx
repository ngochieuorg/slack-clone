'use client';

import { useGetChannel } from '@/features/channels/api/use-get-channel';
import { useChannelId } from '@/hooks/use-channel-id';
import { Loader, TriangleAlert } from 'lucide-react';
import Header from './header';
import ChatInput from './chat-input';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import MessageList from '@/components/message-list';
import { useEffect } from 'react';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { Id } from '../../../../../../convex/_generated/dataModel';

const ChannelDetailPage = ({
  channelId: channelIdFromQuery,
}: {
  channelId?: string;
}) => {
  console.log(channelIdFromQuery);
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelIdFromQuery ? (channelIdFromQuery as Id<'channels'>) : channelId,
  });
  const { data: workspace } = useGetWorkspace({
    id: workspaceId,
  });

  useEffect(() => {
    if (channel?.name) {
      document.title = `${channel?.name} (Channel) - ${workspace?.name || ''}`;
    } else {
      document.title = 'Loading ...';
    }
  }, [channel?.name, workspace?.name]);

  const { results, status, loadMore } = useGetMessages({
    channelId: channelIdFromQuery
      ? (channelIdFromQuery as Id<'channels'>)
      : channelId,
  });

  if (channelLoading || status === 'LoadingFirstPage') {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className=" size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header channel={channel} />
      <MessageList
        channel={channel}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelDetailPage;
