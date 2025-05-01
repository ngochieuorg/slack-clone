'use client';

import SubChannelView from '@/components/sub-view/sub-channel-view';
import SubThreadView from '@/components/sub-view/sub-thread-view';
import { useGetLater } from '@/features/later/api/use-get-later';
import { useLaterId } from '@/hooks/use-later-id';

const LaterIdPage = () => {
  const laterId = useLaterId();

  const { data: later } = useGetLater({ id: laterId });

  if (later?.channelId && later.messageId) {
    if (later.parentMessageId) {
      return (
        <SubThreadView
          channelId={later.channelId}
          parentMessageId={later.parentMessageId}
          messageId={later.messageId}
        />
      );
    }
    return (
      <SubChannelView
        channelId={later.channelId}
        parentMessageId={later.parentMessageId}
        messageId={later.messageId}
      />
    );
  }

  return <></>;
};

export default LaterIdPage;
