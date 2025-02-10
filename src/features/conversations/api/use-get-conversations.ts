import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface UseGetConversationsProps {
  workspaceId: Id<'workspaces'>;
}

export const useGetConversations = ({
  workspaceId,
}: UseGetConversationsProps) => {
  const data = useQuery(api.conversation.get, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
