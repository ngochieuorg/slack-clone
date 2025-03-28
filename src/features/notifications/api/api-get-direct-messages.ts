import { useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

interface UseGetDirectMessageProps {
  workspaceId: Id<'workspaces'>;
  isUnRead?: boolean;
}

export type DirectMessageReturnType =
  typeof api.notifications.directMessages._returnType;

export const useGetDirectMessages = ({
  workspaceId,
  isUnRead,
}: UseGetDirectMessageProps) => {
  const data = useQuery(api.notifications.directMessages, {
    workspaceId,
    isUnRead,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};
