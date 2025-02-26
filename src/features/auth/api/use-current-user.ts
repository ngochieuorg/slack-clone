import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface UseGetUserProps {
  workspaceId: Id<'workspaces'>;
}

export type GetUserReturnType = typeof api.users.current._returnType;

export const useCurrentUser = ({ workspaceId }: UseGetUserProps) => {
  const data = useQuery(api.users.current, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
