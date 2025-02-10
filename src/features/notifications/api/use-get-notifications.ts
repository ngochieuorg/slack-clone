import { useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

interface UseGetNotificationProps {
  workspaceId: Id<'workspaces'>;
  channelId?: Id<'channels'>;
  conversationId?: Id<'conversations'>;
  isUnRead?: boolean;
}

export type GetMessageReturnType =
  (typeof api.messages.get._returnType)['page'];

export const useGetNotifications = ({
  workspaceId,
  channelId,
  conversationId,
  isUnRead,
}: UseGetNotificationProps) => {
  const data = useQuery(api.notifications.get, {
    channelId,
    conversationId,
    workspaceId,
    isUnRead,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};
