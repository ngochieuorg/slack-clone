import { usePaginatedQuery, useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

const BATCH_SIZE = 20;

interface UseGetMessagesProps {
  channelId?: Id<'channels'>;
  conversationId?: Id<'conversations'>;
  parentMessageId?: Id<'messages'>;
  initialNumItems?: number;
  fetchAll?: boolean;
}

export type GetMessageReturnType =
  (typeof api.messages.get._returnType)['page'];

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
  initialNumItems = BATCH_SIZE,
  fetchAll = false,
}: UseGetMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelId, conversationId, parentMessageId },
    { initialNumItems: initialNumItems }
  );

  const allMessage = useQuery(api.messages.getAll, {
    channelId,
    conversationId,
    parentMessageId,
  });

  console.log(allMessage);

  const totalItems = allMessage?.length || 0;

  if (fetchAll) {
    return {
      results: allMessage?.filter((mess) => !!mess) || [],
      status: 'LoadedAll',
      loadMore: () => {},
      totalItems,
    };
  }

  return { results, status, loadMore: () => loadMore(BATCH_SIZE), totalItems };
};
